import React from 'react';
import { Home, Flame, ShoppingBag, ChefHat, Clock, MessageCircle, Phone } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/initialData';
import { createWhatsAppUrl, formatFCFA } from '../utils/helpers';
import { useCart } from '../context/CartContext';

interface FloatingActionsProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ currentTab, onNavigate }) => {
  const { itemsCount, total, setIsCartOpen } = useCart();

  const defaultWhatsappMessage = "Bonjour Néné Services ! Je souhaite avoir des informations ou passer une commande spéciale.";
  const whatsappUrl = createWhatsAppUrl(RESTAURANT_INFO.whatsappRaw, defaultWhatsappMessage);

  const bottomNavItems = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'menu', label: 'Menu', icon: Flame },
    { id: 'panier', label: 'Panier', icon: ShoppingBag, badge: itemsCount },
    { id: 'traiteur', label: 'Traiteur', icon: ChefHat },
    { id: 'suivi', label: 'Suivi', icon: Clock },
  ];

  return (
    <>
      {/* Floating WhatsApp Quick Action Button (Right side, elevated above bottom nav on mobile/tablet) */}
      <aside aria-label="Assistance directe WhatsApp" className="fixed bottom-24 sm:bottom-24 lg:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 bg-[#25D366] text-white p-3 sm:pl-4 sm:pr-3.5 rounded-full shadow-xl shadow-emerald-600/30 hover:bg-[#20ba5a] hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/60"
          title="Écrivez-nous sur WhatsApp"
        >
          <span className="text-xs font-bold hidden md:inline group-hover:inline transition-all duration-200">
            WhatsApp Néné
          </span>
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-[#25D366]" />
        </a>
      </aside>

      {/* Modern Responsive Mobile & Tablet Bottom App Bar (visible on < lg: 1024px) */}
      <nav
        aria-label="Navigation principale mobile"
        className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
      >
        {/* Quick Cart Highlight Bar if items in cart and not on cart page */}
        {itemsCount > 0 && currentTab !== 'panier' && (
          <div className="bg-stone-900 text-white px-4 py-2 flex items-center justify-between text-xs font-bold border-b border-stone-800">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-black">
                {itemsCount}
              </span>
              <span className="text-stone-300">Total panier :</span>
              <span className="text-orange-400 font-extrabold">{formatFCFA(total)}</span>
            </div>
            <button
              onClick={() => onNavigate('panier')}
              className="text-xs font-extrabold bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg transition-colors active:scale-95"
            >
              Commander →
            </button>
          </div>
        )}

        {/* Bottom Tab Bar Buttons */}
        <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center justify-center h-full w-full py-1 transition-all duration-150 ${
                  isActive
                    ? 'text-orange-600 font-extrabold'
                    : 'text-stone-500 hover:text-stone-800 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-orange-600 text-white text-[9px] font-black flex items-center justify-center animate-scale-in shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-1 line-clamp-1">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-600" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
