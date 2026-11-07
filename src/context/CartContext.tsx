import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, DeliveryZone, OrderType } from '../types';
import { DELIVERY_ZONES } from '../data/initialData';

interface CartContextType {
  items: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  selectedZone: DeliveryZone | null;
  setSelectedZone: (zone: DeliveryZone | null) => void;
  deliveryAddress: string;
  setDeliveryAddress: (addr: string) => void;
  landmark: string;
  setLandmark: (landmark: string) => void;
  promoCode: string;
  discount: number;
  promoDescription: string;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'nene_services_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(DELIVERY_ZONES[0]);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [promoDescription, setPromoDescription] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      // Check if an identical item exists (same menu id, same size, same sauces, same extras)
      const existingIndex = prevItems.findIndex(i =>
        i.menuItem.id === newItem.menuItem.id &&
        i.selectedSize?.id === newItem.selectedSize?.id &&
        i.spiciness === newItem.spiciness &&
        JSON.stringify(i.selectedSauces.map(s => s.id).sort()) === JSON.stringify(newItem.selectedSauces.map(s => s.id).sort()) &&
        JSON.stringify(i.selectedExtras.map(e => e.id).sort()) === JSON.stringify(newItem.selectedExtras.map(e => e.id).sort())
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + newItem.quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: existing.unitPrice * newQty,
        };
        return updated;
      }

      return [...prevItems, newItem];
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: qty,
            totalPrice: item.unitPrice * qty,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setDiscount(0);
    setPromoDescription('');
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const deliveryFee = orderType === 'delivery' && selectedZone ? selectedZone.fee : 0;

  const total = Math.max(0, subtotal - discount + deliveryFee);

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromoCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/check-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setPromoCode(data.data.code);
        setDiscount(data.data.discount);
        setPromoDescription(data.data.description);
        return { success: true, message: `Code ${data.data.code} appliqué : -${data.data.discount.toLocaleString('fr-FR')} FCFA` };
      } else {
        return { success: false, message: data.error || 'Code invalide' };
      }
    } catch {
      // Local fallback in case offline
      if (code.trim().toUpperCase() === 'BIENVENUE500' && subtotal >= 3000) {
        setPromoCode('BIENVENUE500');
        setDiscount(500);
        setPromoDescription('500 FCFA de réduction de bienvenue');
        return { success: true, message: 'Code appliqué : -500 FCFA' };
      }
      return { success: false, message: 'Erreur lors de la validation du code promo' };
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscount(0);
    setPromoDescription('');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        orderType,
        setOrderType,
        selectedZone,
        setSelectedZone,
        deliveryAddress,
        setDeliveryAddress,
        landmark,
        setLandmark,
        promoCode,
        discount,
        promoDescription,
        applyPromoCode,
        removePromoCode,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        itemsCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
