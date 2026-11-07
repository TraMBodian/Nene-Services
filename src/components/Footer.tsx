import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/initialData';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    scrollToTop();
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-24 lg:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-heading font-extrabold text-xl">
                N
              </div>
              <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                Néné <span className="text-orange-500">Services</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              « {RESTAURANT_INFO.slogan} »
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              Fast-food gourmet et traiteur événementiel à Dakar. Burgers juteux, poulet braisé mariné, recettes traditionnelles sénégalaises et buffets d’exception.
            </p>

            {/* Mobile Money Accepted badges */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wider">
                Moyens de paiement acceptés :
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Wave Badge */}
                <div className="flex items-center gap-1.5 bg-[#1EA5FC]/10 border border-[#1EA5FC]/30 text-[#1EA5FC] px-2.5 py-1 rounded-lg text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#1EA5FC]" />
                  Wave
                </div>
                {/* Orange Money Badge */}
                <div className="flex items-center gap-1.5 bg-[#FF6600]/10 border border-[#FF6600]/30 text-[#FF7900] px-2.5 py-1 rounded-lg text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
                  Orange Money
                </div>
                {/* Espèces Badge */}
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Espèces à la livraison
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase text-xs">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo('accueil')} className="hover:text-orange-400 transition-colors">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('menu')} className="hover:text-orange-400 transition-colors">
                  Notre Menu Fast-food
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('traiteur')} className="hover:text-orange-400 transition-colors">
                  Formules & Devis Traiteur
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('suivi')} className="hover:text-orange-400 transition-colors">
                  Suivi de commande en temps réel
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('a-propos')} className="hover:text-orange-400 transition-colors">
                  Histoire & Valeurs de Néné
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-orange-400 transition-colors">
                  Contact & Zones de livraison
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Practical Info & Hours */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase text-xs">
              Horaires & Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{RESTAURANT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <a href={`tel:${RESTAURANT_INFO.phoneRaw}`} className="hover:text-white transition-colors font-medium">
                  {RESTAURANT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a href={`mailto:${RESTAURANT_INFO.email}`} className="hover:text-white transition-colors">
                  {RESTAURANT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-white">Lundi au Dimanche :</div>
                  <div className="text-stone-400">11h00 - 23h30 sans interruption</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Security & Catering hotline */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase text-xs">
              Garantie & Sécurité
            </h4>
            <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Paiements Mobiles Sécurisés</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Néné Services ne conserve jamais vos codes secrets ni identifiants bancaires. Les règlements Wave et Orange Money s’effectuent en toute sécurité via les passerelles officielles agréées BCEAO.
              </p>
            </div>

            <div className="mt-3">
              <button
                onClick={() => navigateTo('traiteur')}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>Demander un devis traiteur</span>
                <span className="text-orange-400">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Néné Services Sénégal. Tous droits réservés. Dakar, Sénégal.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('contact')} className="hover:text-stone-300 transition-colors">
              Conditions de livraison & Remboursement
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-stone-400 hover:text-white transition-colors"
            >
              <span>Haut de page</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
