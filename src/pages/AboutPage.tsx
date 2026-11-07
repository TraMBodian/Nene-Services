import React from 'react';
import { ChefHat, Heart, Award, ShieldCheck, Clock, Users, Sparkles, MapPin } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/initialData';

interface AboutPageProps {
  onNavigateToMenu: () => void;
  onNavigateToCatering: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToMenu, onNavigateToCatering }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-8 sm:p-14 lg:p-20 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80"
            alt="Cuisine de Néné Services"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400 bg-orange-500/20 px-3.5 py-1.5 rounded-full border border-orange-500/30">
            Notre Histoire & Notre Passion
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
            Néné Services : L’Amour du Goût Fait Maison à Dakar
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            « Chez Néné, chaque burger, chaque cuisse de poulet braisé et chaque marmite de Thiéboudienne est préparé avec le même dévouement que pour notre propre famille. »
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5 text-stone-700 text-sm leading-relaxed">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600">
            <ChefHat className="w-4 h-4" />
            <span>La vision de Madame Néné</span>
          </div>

          <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900 leading-tight">
            Réconcilier la rapidité du fast-food et l'exigence de la cuisine familiale
          </h2>

          <p>
            Fondée au cœur de Dakar par Madame Néné, passionnée de gastronomie sénégalaise et d'innovations culinaires, <strong>Néné Services</strong> est née d'un constat simple : les Dakarois pressés méritent de manger vite, mais surtout de manger <em>extrêmement bien</em>.
          </p>

          <p>
            Trop souvent, le fast-food rimait avec produits surgelés et sauces industrielles. Néné Services a pris le contre-pied absolu en combinant le meilleur des deux mondes : des pains briochés artisanaux pétris à Dakar, des viandes fraîches marinées pendant 24 heures aux aromates locaux, des sauces maison secrètes pilées au mortier, et des plats traditionnels sénégalais cuits au feu doux selon les règles de l'art.
          </p>

          <p>
            Parallèlement, notre service traiteur s'est imposé comme une référence de confiance pour les familles sénégalaises et les entreprises de la place, garantissant des réceptions somptueuses et une hospitalité (Téranga) mémorable.
          </p>

          <div className="pt-2 flex gap-4">
            <button
              onClick={onNavigateToMenu}
              className="py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
            >
              Commander nos plats
            </button>
            <button
              onClick={onNavigateToCatering}
              className="py-3 px-6 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs"
            >
              Découvrir le traiteur
            </button>
          </div>
        </div>

        {/* Visual mosaic of photos */}
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80"
            alt="Poulet braisé Néné"
            className="rounded-3xl h-56 w-full object-cover shadow-md"
          />
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
            alt="Burger gourmet Teranga"
            className="rounded-3xl h-56 w-full object-cover shadow-md mt-6"
          />
          <img
            src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
            alt="Thiéboudienne rouge sénégalais"
            className="rounded-3xl h-56 w-full object-cover shadow-md"
          />
          <img
            src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80"
            alt="Buffet traiteur événement Néné"
            className="rounded-3xl h-56 w-full object-cover shadow-md mt-6"
          />
        </div>
      </div>

      {/* 5 Core Pillars */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Nos Engagements
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Les 5 Piliers Fondamentaux de Néné Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              title: 'Marché Local Quotidien',
              desc: 'Approvisionnement chaque matin aux marchés Kermel et Castors en légumes frais des Niayes et viandes de première qualité.',
              icon: Award,
              color: 'text-amber-600 bg-amber-50',
            },
            {
              title: 'Hygiène & Sécurité',
              desc: 'Normes d’hygiène strictes en cuisine et emballages étanches scellés préservant la chaleur jusqu’à votre porte.',
              icon: ShieldCheck,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              title: 'Rapidité & Ponctualité',
              desc: 'Livraison express à Dakar en 20 à 40 minutes et respect scrupuleux des horaires convenus pour vos buffets.',
              icon: Clock,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              title: 'Sauces Signatures',
              desc: 'Notre sauce secrète Néné et nos piments verts & rouges sont préparés maison sans conservateurs artificiels.',
              icon: Sparkles,
              color: 'text-orange-600 bg-orange-50',
            },
            {
              title: 'La Vraie Téranga',
              desc: 'Un accueil dakarois chaleureux, une écoute bienveillante et la générosité des portions servies.',
              icon: Heart,
              color: 'text-red-600 bg-red-50',
            },
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${pillar.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-stone-900 text-sm">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
