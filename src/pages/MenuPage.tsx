import React, { useState, useMemo } from 'react';
import { Search, Flame, Sparkles, Filter, X, SlidersHorizontal, AlertCircle, ShoppingBag } from 'lucide-react';
import { MenuItem, DishCategory } from '../types';
import { formatFCFA } from '../utils/helpers';
import { useCart } from '../context/CartContext';

interface MenuPageProps {
  menuItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ menuItems, onSelectItem }) => {
  const { addItem, setIsCartOpen } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<DishCategory>('tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string>('all');

  const categories = [
    { id: 'tous', label: 'Tout le menu', icon: '🍽️' },
    { id: 'burgers', label: 'Burgers', icon: '🍔' },
    { id: 'poulet', label: 'Poulet Braisé & Crispy', icon: '🍗' },
    { id: 'sandwichs', label: 'Sandwichs & Pastels', icon: '🌯' },
    { id: 'plats_du_jour', label: 'Plats du Jour (Thiéb, Yassa)', icon: '🍲' },
    { id: 'accompagnements', label: 'Frites & Alloco', icon: '🍟' },
    { id: 'boissons', label: 'Jus Locaux (Bissap, Bouye)', icon: '🥤' },
    { id: 'desserts', label: 'Desserts & Thiakry', icon: '🍨' },
    { id: 'formules', label: 'Formules & Combos', icon: '⚡' },
    { id: 'enfants', label: 'Menus Enfants', icon: '🎈' },
  ];

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      if (selectedCategory !== 'tous' && item.category !== selectedCategory) {
        return false;
      }
      // Badge filter
      if (selectedBadgeFilter !== 'all' && item.badge !== selectedBadgeFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesCat;
      }
      return true;
    });
  }, [menuItems, selectedCategory, selectedBadgeFilter, searchQuery]);

  // Quick add default item to cart (if no mandatory size choices)
  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    if (item.sizes && item.sizes.length > 0) {
      // If customizable sizes, open the modal
      onSelectItem(item);
      return;
    }

    addItem({
      cartItemId: `${item.id}-${Date.now()}`,
      menuItem: item,
      selectedSauces: item.availableSauces ? [item.availableSauces[0]] : [],
      spiciness: item.allowsSpiciness ? 'doux' : undefined,
      selectedExtras: [],
      quantity: 1,
      unitPrice: item.price,
      totalPrice: item.price,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          Carte & Commandes
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
          Notre Menu Fast-Food & Plats Sénégalais
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm">
          Choisissez votre plat, personnalisez la sauce et le niveau de piment, et faites-vous livrer chaud en 20 à 40 minutes à Dakar.
        </p>
      </div>

      {/* Search Bar & Quick Filters */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un burger, un plat, alloco, thiéb..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Badge Quick Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <span className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider hidden sm:inline mr-1">
            Filtres :
          </span>
          {[
            { id: 'all', label: 'Tous' },
            { id: 'populaire', label: '★ Populaires' },
            { id: 'nouveau', label: 'Nouveautés' },
            { id: 'weekend', label: 'Spécial Week-end' },
            { id: 'promo', label: 'Formules Promos' },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBadgeFilter(b.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                selectedBadgeFilter === b.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Navigation (Horizontal scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as DishCategory)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md shadow-orange-500/25 scale-102'
                  : 'bg-white text-stone-700 border border-stone-200/90 hover:border-orange-300 hover:bg-orange-50/40'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dish Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto text-2xl">
            🍽️
          </div>
          <h3 className="font-heading font-bold text-lg text-stone-900">
            Aucun plat trouvé
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Essayez de modifier votre recherche ou de sélectionner une autre catégorie.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('tous');
              setSelectedBadgeFilter('all');
            }}
            className="text-xs font-bold text-orange-600 hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((dish) => (
            <div
              key={dish.id}
              onClick={() => onSelectItem(dish)}
              className={`group bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer relative ${
                !dish.isAvailable ? 'opacity-60 grayscale-50' : ''
              }`}
            >
              {/* Image & Badges */}
              <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Badge tags */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                  {dish.badge === 'populaire' && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                      ★ Populaire
                    </span>
                  )}
                  {dish.badge === 'nouveau' && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                      Nouveau
                    </span>
                  )}
                  {dish.badge === 'weekend' && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                      Spécial Week-end
                    </span>
                  )}
                  {dish.badge === 'promo' && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-stone-900 px-2.5 py-0.5 rounded-full shadow-xs font-bold">
                      Formule Promo
                    </span>
                  )}
                  {!dish.isAvailable && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                      Momentanément épuisé
                    </span>
                  )}
                </div>

                {/* Price tag */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-stone-900/80 backdrop-blur-xs text-white text-xs font-black shadow-xs">
                  {formatFCFA(dish.price)}
                </div>
              </div>

              {/* Dish description */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                      {dish.category.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      ⏱ {dish.preparationTimeMinutes} min
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-base text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {dish.name}
                  </h3>

                  <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                {/* Allergens indicator */}
                {dish.allergens && dish.allergens.length > 0 && (
                  <div className="text-[10px] text-stone-400 truncate">
                    Allergènes : {dish.allergens.join(', ')}
                  </div>
                )}

                {/* Bottom CTA */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">
                    {dish.sizes && dish.sizes.length > 0 ? 'Options au choix' : 'Portion unique'}
                  </span>

                  <button
                    type="button"
                    disabled={!dish.isAvailable}
                    onClick={(e) => handleQuickAdd(e, dish)}
                    className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xs shadow-xs hover:from-orange-600 hover:to-red-700 active:scale-95 transition-all disabled:opacity-40"
                  >
                    {dish.sizes && dish.sizes.length > 0 ? 'Personnaliser' : 'Ajouter +'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
