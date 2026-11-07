import React from 'react';
import { Flame, Clock, Award, ShieldCheck, HeartHandshake, ArrowRight, Phone, MessageCircle, Star, Sparkles, ChefHat, Truck } from 'lucide-react';
import { MenuItem } from '../types';
import { RESTAURANT_INFO } from '../data/initialData';
import { formatFCFA, createWhatsAppUrl } from '../utils/helpers';

interface HomePageProps {
  popularItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onNavigateToMenu: () => void;
  onNavigateToCatering: () => void;
  onNavigateToTracking: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  popularItems,
  onSelectItem,
  onNavigateToMenu,
  onNavigateToCatering,
  onNavigateToTracking,
}) => {
  const whatsappUrl = createWhatsAppUrl(
    RESTAURANT_INFO.whatsappRaw,
    "Bonjour Néné Services ! J'aimerais en savoir plus sur vos plats et prestations."
  );

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-900 text-white rounded-3xl mx-3 sm:mx-6 lg:mx-8 mt-3 shadow-2xl">
        {/* Background Image with warm overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1800&q=80"
            alt="Néné Services Dakar Restaurant"
            className="w-full h-full object-cover opacity-25 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />
          <div className="absolute inset-0 bg-radial from-orange-600/10 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-24 lg:py-28 flex flex-col items-start space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold tracking-wide uppercase backdrop-blur-xs">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Fast-Food & Traiteur d'Excellence à Dakar</span>
          </div>

          {/* Headline & Slogan */}
          <div className="space-y-3 max-w-3xl">
            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white">
              Néné Services
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-red-500 mt-1">
                Le goût du fait maison, rapide et savoureux.
              </span>
            </h1>
            <p className="text-stone-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Des burgers gourmets généreux, du poulet braisé mariné aux épices du terroir, nos plats traditionnels du jour (Thiéboudienne, Yassa, Mafé) et un service traiteur clé en main pour vos mariages, baptêmes et séminaires.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto">
            <button
              onClick={onNavigateToMenu}
              className="flex-1 sm:flex-none py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-extrabold text-base shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2.5 active:scale-95 transition-all"
            >
              <Flame className="w-5 h-5 text-amber-200" />
              <span>Commander maintenant</span>
            </button>

            <button
              onClick={onNavigateToCatering}
              className="flex-1 sm:flex-none py-4 px-7 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base backdrop-blur-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <ChefHat className="w-5 h-5 text-orange-400" />
              <span>Demander un devis traiteur</span>
            </button>
          </div>

          {/* Fast Features pills */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full max-w-3xl text-stone-300">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Truck className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Livraison 20-40 min</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Wave & Orange Money</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>100% Ingrédients Frais</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Clock className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Ouvert 7j/7 jusqu'à 23h30</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE PILLARS PRESENTATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Nos Savoir-Faire
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Ce que Néné Services prépare pour vous
          </h2>
          <p className="text-stone-500 text-sm">
            Une cuisine authentique, généreuse et soignée, adaptée à vos envies du quotidien comme à vos grands événements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Fast-Food Gourmet */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-stone-900">
              Fast-Food Gourmet
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Burgers savoureux cuits minute, poulet croustillant et braisé, chawarmas garnis, pastels dakaroises dorées et frites fraîches maison.
            </p>
            <button
              onClick={onNavigateToMenu}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
            >
              <span>Découvrir les burgers & snacks</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Plats du Jour Sénégalais */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-stone-900">
              Plats du Jour Traditionnels
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Chaque midi, dégustez nos plats authentiques sénégalais mijotés avec passion : Thiéboudienne rouge royale au Thiof frais, Yassa poulet citronné et Mafé onctueux.
            </p>
            <button
              onClick={onNavigateToMenu}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group"
            >
              <span>Voir les plats du jour</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3: Traiteur Événements */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-stone-900">
              Traiteur Événementiel
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Organisation complète de buffets, cocktails et déjeuners pour mariages, baptêmes (Ngente), anniversaires, pauses-café et séminaires d’entreprise de 20 à 500+ invités.
            </p>
            <button
              onClick={onNavigateToCatering}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
            >
              <span>Calculer un devis traiteur</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. POPULAR DISHES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Les Incontournables
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900 mt-2">
              Les Plats les Plus Commandés
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm">
              Préparés à la minute par notre brigade avec des produits frais du terroir.
            </p>
          </div>

          <button
            onClick={onNavigateToMenu}
            className="self-start sm:self-auto py-2.5 px-5 rounded-xl border border-stone-300 hover:border-orange-500 text-stone-800 hover:text-orange-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Voir toute la carte ({popularItems.length}+ plats)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularItems.slice(0, 4).map((dish) => (
            <div
              key={dish.id}
              onClick={() => onSelectItem(dish)}
              className="group bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer"
            >
              {/* Dish Image */}
              <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  {dish.badge === 'populaire' && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                      ★ Populaire
                    </span>
                  )}
                  {dish.badge === 'nouveau' && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                      Nouveau
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-xs text-white text-xs font-extrabold">
                  {formatFCFA(dish.price)}
                </div>
              </div>

              {/* Dish Info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-heading font-black text-base text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {dish.name}
                  </h3>
                  <p className="text-stone-500 text-xs line-clamp-2 mt-1 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    ⏱ {dish.preparationTimeMinutes} min
                  </span>
                  <button
                    type="button"
                    className="py-1.5 px-3 rounded-xl bg-orange-50 group-hover:bg-orange-600 text-orange-600 group-hover:text-white font-bold text-xs transition-colors"
                  >
                    Commander +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CATERING PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-xs">
              Service Traiteur Événements
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl leading-tight">
              Un Mariage, un Baptême ou un Séminaire à célébrer à Dakar ?
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Confiez votre repas de fête à Néné Services ! Buffets généreux, service avec maîtres d’hôtel, chafing dishes et douceurs locales. Formules de 20 à plus de 200 personnes avec devis gratuit sous 24h.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onNavigateToCatering}
                className="py-3 px-6 rounded-xl bg-white text-orange-700 hover:bg-stone-100 font-extrabold text-sm shadow-md active:scale-95 transition-all"
              >
                Découvrir nos formules traiteur
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-sm border border-white/20 backdrop-blur-xs flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Cheffe Néné</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Témoignages
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Ce que nos clients à Dakar disent de nous
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            Découvrez les retours de nos clients fidèles sur la qualité de nos plats et la ponctualité de nos livraisons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Fatou Binetou Diop',
              role: 'Cliente Almadies',
              comment: '« Le Burger Teranga Double est tout simplement une tuerie ! La viande est tendre, les oignons caramélisés font toute la différence. Livraison super rapide et livreur très poli. »',
              stars: 5,
              badge: 'Commande Wave',
            },
            {
              name: 'Cheikh Tidiane Ndiaye',
              role: 'Baptême à Sacré-Cœur (Traiteur 50 pers)',
              comment: '« Nous avons fait appel à Néné Services pour le baptême de notre fils. Le buffet était sublime, les pastels croustillantes et le Thiéboudienne a fait l’unanimité. Merci pour votre professionnalisme ! »',
              stars: 5,
              badge: 'Service Traiteur',
            },
            {
              name: 'Mariama Ba',
              role: 'Bureau Dakar Plateau',
              comment: '« On commande tous les vendredis midi pour l’équipe au bureau. Le Thiéboudienne rouge et le jus de Bouye sont exceptionnels. Le paiement Wave en 1 clic est un vrai plaisir. »',
              stars: 5,
              badge: 'Commande Entreprise',
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                    {t.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  {t.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <div className="font-heading font-bold text-stone-900 text-sm">{t.name}</div>
                <div className="text-stone-400 text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LOCATION & CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-stone-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Une envie de burger ou de bon plat sénégalais ?
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              Commandez en quelques clics ou passez nous voir sur l’Avenue Cheikh Anta Diop à Dakar. Notre équipe vous accueille avec le sourire et la véritable Téranga dakaroise !
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={onNavigateToMenu}
              className="py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 active:scale-95 transition-all"
            >
              Commander en ligne
            </button>
            <a
              href={`tel:${RESTAURANT_INFO.phoneRaw}`}
              className="py-3.5 px-6 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-sm border border-stone-700 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-orange-400" />
              <span>Appeler {RESTAURANT_INFO.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
