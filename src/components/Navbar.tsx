import React, { useState } from 'react';
import { ShoppingBag, Phone, Clock, Menu as MenuIcon, X, Flame, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/initialData';
import { getStoreStatus, formatFCFA } from '../utils/helpers';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { itemsCount, total, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const storeStatus = getStoreStatus();

  const navLinks = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'menu', label: 'Menu & Commander' },
    { id: 'traiteur', label: 'Service Traiteur', badge: 'Sur-mesure' },
    { id: 'suivi', label: 'Suivi de commande' },
    { id: 'a-propos', label: 'À propos' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner (Hours & Phone info) */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <span className={`inline-block w-2 h-2 rounded-full ${storeStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className={storeStatus.isOpen ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                {storeStatus.statusText}
              </span>
              <span className="text-stone-400 hidden sm:inline">• {storeStatus.nextOpenText}</span>
            </span>
            <span className="text-stone-500 hidden md:inline">|</span>
            <span className="hidden md:flex items-center gap-1 text-stone-300">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              Livraison express Dakar & banlieue
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${RESTAURANT_INFO.phoneRaw}`}
              className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-semibold text-white">{RESTAURANT_INFO.phone}</span>
            </a>
            <button
              onClick={() => handleNav('admin')}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${
                currentTab === 'admin'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'text-stone-400 hover:text-white bg-stone-800'
              }`}
              title="Accès gérant / administration"
            >
              Espace Gérant
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('accueil')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="font-heading font-extrabold text-2xl tracking-tighter">N</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-2xl text-stone-900 tracking-tight">
                  Néné <span className="text-orange-600">Services</span>
                </span>
              </div>
              <p className="text-[11px] font-medium text-stone-500 tracking-wide uppercase">
                Fast-Food & Traiteur Dakar
              </p>
            </div>
          </button>

          {/* Desktop & Tablet Nav Links */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`relative px-2.5 lg:px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-orange-600 bg-orange-50 shadow-xs'
                      : 'text-stone-700 hover:text-orange-600 hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="hidden xl:inline ml-1.5 text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-orange-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Cart & Order CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 transition-colors cursor-pointer group"
              aria-label="Voir le panier"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-stone-800 group-hover:text-orange-600 transition-colors" />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-600 text-white rounded-full text-[11px] font-bold flex items-center justify-center animate-scale-in">
                    {itemsCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[10px] text-stone-500 font-medium uppercase leading-tight">Mon Panier</div>
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  {itemsCount > 0 ? formatFCFA(total) : '0 FCFA'}
                </div>
              </div>
            </button>

            {/* Quick Order Button */}
            <button
              onClick={() => handleNav('menu')}
              className="hidden sm:flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xs lg:text-sm shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-red-700 active:scale-95 transition-all"
            >
              <Flame className="w-4 h-4" />
              <span>Commander</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-stone-100 text-stone-700 hover:text-stone-900"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-fade-in">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
                  currentTab === link.id
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-stone-800 hover:bg-stone-50'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-xs uppercase font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={() => handleNav('admin')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
                currentTab === 'admin' ? 'text-orange-600 bg-orange-50' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>Espace Gérant & Commandes</span>
              <span className="text-xs bg-stone-200 px-2 py-0.5 rounded font-mono">Admin</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col gap-2">
            <a
              href={`tel:${RESTAURANT_INFO.phoneRaw}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-stone-900 text-white font-bold text-sm"
            >
              <Phone className="w-4 h-4 text-orange-400" />
              Appeler le restaurant ({RESTAURANT_INFO.phone})
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
