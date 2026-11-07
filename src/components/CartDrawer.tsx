import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatFCFA } from '../utils/helpers';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onNavigateToMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout, onNavigateToMenu }) => {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, subtotal, itemsCount, clearCart } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-stone-900 text-lg">
                  Mon Panier
                </h3>
                <p className="text-xs text-stone-500">
                  {itemsCount} article{itemsCount > 1 ? 's' : ''} sélectionné{itemsCount > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-500 hover:text-red-600 p-1.5 transition-colors"
                  title="Vider le panier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-bold text-stone-800 text-base mb-1">
                  Votre panier est vide
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Découvrez nos savoureux burgers, nos morceaux de poulet braisé et nos jus de fruits du Sénégal.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToMenu();
                  }}
                  className="py-2.5 px-5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors"
                >
                  Découvrir le menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3 bg-stone-50/80 rounded-2xl border border-stone-200/80 flex gap-3 text-stone-800 relative group"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-sm text-stone-900 truncate">
                        {item.menuItem.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-stone-400 hover:text-red-500 p-0.5 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Selected Options summary */}
                    <div className="text-[11px] text-stone-500 space-y-0.5 mt-0.5">
                      {item.selectedSize && (
                        <div>Taille : <span className="font-medium text-stone-700">{item.selectedSize.name}</span></div>
                      )}
                      {item.spiciness && (
                        <div>Piment : <span className="font-medium text-stone-700 capitalize">{item.spiciness.replace('_', ' ')}</span></div>
                      )}
                      {item.selectedSauces.length > 0 && (
                        <div className="truncate">
                          Sauces : {item.selectedSauces.map(s => s.name).join(', ')}
                        </div>
                      )}
                      {item.selectedExtras.length > 0 && (
                        <div>
                          Extras : {item.selectedExtras.map(e => e.name).join(', ')}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <div className="italic text-stone-400 truncate">
                          « {item.specialInstructions} »
                        </div>
                      )}
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-200/60">
                      <div className="font-extrabold text-xs text-orange-600">
                        {formatFCFA(item.totalPrice)}
                      </div>

                      <div className="flex items-center bg-white border border-stone-200 rounded-lg p-0.5 shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Subtotal & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Sous-total :</span>
                <span className="font-extrabold text-stone-900 text-base">{formatFCFA(subtotal)}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Les frais de livraison éventuels et réductions seront calculés à l'étape suivante.
              </p>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span>Finaliser ma commande</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
