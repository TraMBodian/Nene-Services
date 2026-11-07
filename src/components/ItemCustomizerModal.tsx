import React, { useState } from 'react';
import { X, Plus, Minus, Check, Flame, AlertCircle } from 'lucide-react';
import { MenuItem, SizeOption, SauceOption, ExtraOption, SpicinessLevel, CartItem } from '../types';
import { formatFCFA } from '../utils/helpers';
import { useCart } from '../context/CartContext';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({ item, onClose }) => {
  const { addItem, setIsCartOpen } = useCart();

  if (!item) return null;

  // State
  const [selectedSize, setSelectedSize] = useState<SizeOption | undefined>(
    item.sizes && item.sizes.length > 0 ? item.sizes[0] : undefined
  );
  const [selectedSauces, setSelectedSauces] = useState<SauceOption[]>(
    item.availableSauces && item.availableSauces.length > 0 ? [item.availableSauces[0]] : []
  );
  const [spiciness, setSpiciness] = useState<SpicinessLevel>(
    item.allowsSpiciness ? 'doux' : 'sans_piment'
  );
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Calculate unit price
  const basePrice = item.price + (selectedSize ? selectedSize.priceModifier : 0);
  const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const saucesPrice = selectedSauces.reduce((sum, sauce) => sum + sauce.price, 0);
  const unitPrice = basePrice + extrasPrice + saucesPrice;
  const totalPrice = unitPrice * quantity;

  const toggleSauce = (sauce: SauceOption) => {
    if (selectedSauces.some(s => s.id === sauce.id)) {
      setSelectedSauces(selectedSauces.filter(s => s.id !== sauce.id));
    } else {
      if (selectedSauces.length < 3) {
        setSelectedSauces([...selectedSauces, sauce]);
      }
    }
  };

  const toggleExtra = (extra: ExtraOption) => {
    if (selectedExtras.some(e => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter(e => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItem: item,
      selectedSize,
      selectedSauces,
      spiciness: item.allowsSpiciness ? spiciness : undefined,
      selectedExtras,
      specialInstructions: specialInstructions.trim() ? specialInstructions.trim() : undefined,
      quantity,
      unitPrice,
      totalPrice,
    };

    addItem(cartItem);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[88vh] flex flex-col border border-stone-200">
        {/* Header Image with Close Button */}
        <div className="relative h-44 sm:h-60 w-full bg-stone-100 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider bg-orange-600 px-2.5 py-0.5 rounded-full">
                {item.category.replace('_', ' ')}
              </span>
              <span className="text-xs text-stone-300">
                Préparation ~{item.preparationTimeMinutes} min
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl leading-tight">
              {item.name}
            </h3>
          </div>
        </div>

        {/* Scrollable Customization Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          <p className="text-sm text-stone-600 leading-relaxed">
            {item.description}
          </p>

          {item.allergens && item.allergens.length > 0 && (
            <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Allergènes : <strong>{item.allergens.join(', ')}</strong></span>
            </div>
          )}

          {/* 1. Size / Portion Option */}
          {item.sizes && item.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                1. Choisissez la taille / portion <span className="text-orange-600">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {item.sizes.map((size) => {
                  const isSelected = selectedSize?.id === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/50 text-orange-950 ring-1 ring-orange-500'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-stone-300'}`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span>{size.name}</span>
                      </div>
                      <span className="font-bold text-stone-700">
                        {size.priceModifier === 0
                          ? 'Inclus'
                          : size.priceModifier > 0
                          ? `+${formatFCFA(size.priceModifier)}`
                          : formatFCFA(size.priceModifier)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Spiciness Level */}
          {item.allowsSpiciness && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Niveau de piment (Kani)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'sans_piment', label: 'Sans piment', icon: '🍃' },
                  { id: 'doux', label: 'Doux', icon: '🌶️' },
                  { id: 'pimente', label: 'Pimenté', icon: '🌶️🌶️' },
                  { id: 'tres_pimente', label: 'Kani Feu', icon: '🔥' },
                ].map((level) => {
                  const isSelected = spiciness === level.id;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setSpiciness(level.id as SpicinessLevel)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-red-500 bg-red-50 text-red-950 ring-1 ring-red-500 font-bold'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="text-base mb-1">{level.icon}</div>
                      <div className="text-xs">{level.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Sauces selection */}
          {item.availableSauces && item.availableSauces.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Sauces au choix (jusqu’à 3 gratuites)
                </label>
                <span className="text-[11px] text-stone-400">
                  {selectedSauces.length}/3 sélectionnée(s)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.availableSauces.map((sauce) => {
                  const isSelected = selectedSauces.some(s => s.id === sauce.id);
                  return (
                    <button
                      key={sauce.id}
                      type="button"
                      onClick={() => toggleSauce(sauce)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/60 text-stone-900 font-semibold'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-stone-300'}`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="line-clamp-1">{sauce.name}</span>
                      </div>
                      <span className="text-stone-500 text-[11px]">Gratuit</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Extras / Suppléments */}
          {item.availableExtras && item.availableExtras.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Suppléments gourmands
              </label>
              <div className="grid grid-cols-1 gap-2">
                {item.availableExtras.map((extra) => {
                  const isSelected = selectedExtras.some(e => e.id === extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-sm transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 text-stone-950 font-bold'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-stone-300'}`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs">{extra.name}</span>
                      </div>
                      <span className="text-xs font-bold text-orange-600">
                        +{formatFCFA(extra.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Special Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Instructions spéciales (facultatif)
            </label>
            <input
              type="text"
              placeholder="Ex: sans oignon, bien grillé, sauce à part..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add to Cart button */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-white border border-stone-200 rounded-xl p-1 shadow-xs shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-9 text-center font-bold text-sm text-stone-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-sm sm:text-base flex items-center justify-between shadow-lg shadow-orange-500/20 active:scale-98 transition-all"
          >
            <span>Ajouter au panier</span>
            <span className="font-extrabold">{formatFCFA(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
