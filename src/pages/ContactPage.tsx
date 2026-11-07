import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, ShieldCheck, HelpCircle, Navigation } from 'lucide-react';
import { RESTAURANT_INFO, DELIVERY_ZONES } from '../data/initialData';
import { getStoreStatus, createWhatsAppUrl, formatFCFA } from '../utils/helpers';

export const ContactPage: React.FC = () => {
  const storeStatus = getStoreStatus();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Renseignement général');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  const whatsappUrl = createWhatsAppUrl(
    RESTAURANT_INFO.whatsappRaw,
    `Bonjour Néné Services ! J'aimerais entrer en contact avec vous.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          Contact & Accès
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-stone-900">
          Contactez Néné Services Dakar
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm">
          Nous sommes à votre disposition 7j/7 pour vos commandes de repas, devis traiteur et suggestions.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Phone */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-stone-900 text-base">Par Téléphone</h4>
            <p className="text-xs text-stone-500 mt-0.5">Commandes rapides & livreurs</p>
          </div>
          <a
            href={`tel:${RESTAURANT_INFO.phoneRaw}`}
            className="block text-sm font-extrabold text-orange-600 hover:underline"
          >
            {RESTAURANT_INFO.phone}
          </a>
        </div>

        {/* Card 2: WhatsApp */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
            <MessageCircle className="w-5 h-5 fill-[#25D366] text-white" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-stone-900 text-base">WhatsApp Direct</h4>
            <p className="text-xs text-stone-500 mt-0.5">Discutez en direct avec la Cheffe</p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-extrabold text-[#25D366] hover:underline"
          >
            Ouvrir la conversation →
          </a>
        </div>

        {/* Card 3: Hours */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${storeStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-xs font-bold text-stone-900">{storeStatus.statusText}</span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">11h00 - 23h30 (7j/7)</p>
          </div>
          <div className="text-xs text-stone-600 font-medium">
            Service continu midi et soir
          </div>
        </div>

        {/* Card 4: Address */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-stone-900 text-base">Notre Adresse</h4>
            <p className="text-xs text-stone-500 mt-0.5">{RESTAURANT_INFO.city}, {RESTAURANT_INFO.country}</p>
          </div>
          <div className="text-xs text-stone-700 font-medium">
            {RESTAURANT_INFO.address}
          </div>
        </div>
      </div>

      {/* Main Form & Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-heading font-bold text-stone-900 text-xl">
              Envoyez-nous un Message
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Une demande particulière, une recommandation ou un partenariat d'entreprise ? Remplissez ce formulaire.
            </p>
          </div>

          {isSent ? (
            <div className="py-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-heading font-bold text-stone-900 text-lg">
                Message envoyé avec succès !
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Merci {name}. L'équipe de Néné Services vous répondra dans les meilleurs délais sur votre téléphone ({phone}).
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="text-xs font-bold text-orange-600 underline pt-2"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Nom complet <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Téléphone sénégalais <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+221 77 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email (facultatif)
                </label>
                <input
                  type="email"
                  placeholder="votre.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Objet de la demande
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50"
                >
                  <option value="Renseignement général">Renseignement général</option>
                  <option value="Devis traiteur">Devis traiteur personnalisé</option>
                  <option value="Commande entreprise B2B">Commande entreprise / Cantine B2B</option>
                  <option value="Réclamation ou suggestion">Réclamation ou suggestion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Votre Message <span className="text-orange-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Comment pouvons-nous vous régaler ?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le message</span>
              </button>
            </form>
          )}
        </div>

        {/* Map & Neighborhoods Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Styled Dakar Map representation */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Navigation className="w-4 h-4 text-orange-400" />
                <span>Localisation : Dakar, Sénégal</span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">14.6928° N, 17.4467° W</span>
            </div>

            {/* Stylized visual map */}
            <div className="relative h-64 bg-stone-100 flex items-center justify-center overflow-hidden">
              <iframe
                title="Localisation Néné Services Dakar"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.183490797435!2d-17.4725458!3d14.6934444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec172541a7dc261%3A0xbc28a1be529fcb47!2sUniversit%C3%A9%20Cheikh%20Anta%20Diop!5e0!3m2!1sfr!2ssn!4v1700000000000!5m2!1sfr!2ssn"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs space-y-1">
              <div className="font-bold text-stone-900">Néné Services Fast-Food</div>
              <div className="text-stone-500">{RESTAURANT_INFO.address}</div>
              <div className="text-[11px] text-orange-600 font-semibold pt-1">
                Point de repère : En face de l'entrée principale de l'UCAD, Avenue Cheikh Anta Diop.
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="p-5 rounded-3xl bg-stone-900 text-white space-y-3">
            <h4 className="font-heading font-bold text-sm text-white">
              Suivez Néné Services sur les Réseaux
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded-xl text-stone-200 transition-colors"
              >
                📸 Instagram (@neneservices.sn)
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded-xl text-stone-200 transition-colors"
              >
                🎵 TikTok
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded-xl text-stone-200 transition-colors"
              >
                📘 Facebook
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Policies & FAQ Section */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Transparence & Qualité
          </span>
          <h3 className="font-heading font-black text-2xl text-stone-900">
            Politique de Livraison, Retards, Annulation & Remboursement
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-stone-600">
          <div className="space-y-2 p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <h4 className="font-heading font-bold text-stone-900 text-sm">
              1. Politique de Livraison
            </h4>
            <p className="leading-relaxed text-xs">
              Nos livreurs à moto sont équipés de caissons thermiques scellés. Les frais varient de 1 000 à 3 500 FCFA selon la zone géographique de Dakar. La commande est livrée au pas de votre porte ou à l'accueil de votre entreprise.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <h4 className="font-heading font-bold text-stone-900 text-sm">
              2. Gestion des Retards & Trafic
            </h4>
            <p className="leading-relaxed text-xs">
              En cas d'embouteillages exceptionnels sur la VDN, l'autoroute ou le centre-ville de Dakar, notre équipe vous avertit proactivement par appel téléphonique ou WhatsApp avec l'heure réactualisée.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <h4 className="font-heading font-bold text-stone-900 text-sm">
              3. Annulation & Remboursement
            </h4>
            <p className="leading-relaxed text-xs">
              Une commande peut être annulée sans frais tant qu'elle n'est pas passée en préparation cuisine. Pour les paiements Wave et Orange Money, le remboursement s'effectue directement sur votre compte mobile dans un délai de 24h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
