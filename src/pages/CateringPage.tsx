import React, { useState } from 'react';
import { ChefHat, Calendar, Users, MapPin, Sparkles, Check, MessageCircle, Send, Clock, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { CateringPackage, CateringQuote, CateringServiceType } from '../types';
import { RESTAURANT_INFO } from '../data/initialData';
import { formatFCFA, createWhatsAppUrl } from '../utils/helpers';

interface CateringPageProps {
  packages: CateringPackage[];
}

export const CateringPage: React.FC<CateringPageProps> = ({ packages }) => {
  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [eventType, setEventType] = useState<'mariage' | 'bapteme' | 'anniversaire' | 'seminaire_entreprise' | 'reception_privee' | 'autre'>('bapteme');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('Dakar (Almadies, Plateau, etc.)');
  const [guestCount, setGuestCount] = useState<number>(50);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pack_teranga');
  const [serviceType, setServiceType] = useState<CateringServiceType>('buffet');
  const [specialRequests, setSpecialRequests] = useState('');

  const [submittedQuote, setSubmittedQuote] = useState<CateringQuote | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  // Find current selected package
  const activePackage = packages.find(p => p.id === selectedPackageId) || packages[1];

  // Dynamic estimated budget calculation:
  // Base package price prorated by guests, plus optional service supplement
  const basePricePerPerson = activePackage ? Math.round(activePackage.priceFCFA / activePackage.guestCount) : 3800;
  const rawBudget = basePricePerPerson * guestCount;
  const serviceMultiplier = serviceType === 'service_a_table' ? 1.15 : serviceType === 'buffet' ? 1.05 : 1.0;
  const estimatedBudget = Math.round(rawBudget * serviceMultiplier);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    setIsSubmitting(true);
    const quotePayload = {
      clientName,
      clientPhone,
      clientEmail,
      eventType,
      eventDate,
      eventLocation,
      guestCount,
      selectedPackageId,
      serviceType,
      budgetEstime: estimatedBudget,
      specialRequests,
    };

    try {
      const res = await fetch('/api/catering-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotePayload),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.data) {
        setSubmittedQuote(data.data);
        setSubmitSuccessMsg('Votre demande de devis a été enregistrée avec succès ! Notre cheffe traiteur vous contactera sous 24h.');
      } else {
        alert(data.error || 'Erreur lors de la soumission');
      }
    } catch {
      setIsSubmitting(false);
      // Fallback
      const localQuote: CateringQuote = {
        id: `DEV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        clientName,
        clientPhone,
        clientEmail,
        eventType,
        eventDate,
        eventLocation,
        guestCount,
        selectedPackageId,
        serviceType,
        budgetEstime: estimatedBudget,
        specialRequests,
        status: 'pending',
      };
      setSubmittedQuote(localQuote);
      setSubmitSuccessMsg('Votre demande de devis a été enregistrée avec succès ! Notre cheffe traiteur vous contactera sous 24h.');
    }
  };

  // WhatsApp quick quote message
  const generateWhatsAppQuoteLink = () => {
    const message = `*DEMANDE DE DEVIS TRAITEUR - NÉNÉ SERVICES*\n\n` +
      `👤 Nom : ${clientName || 'Client'}\n` +
      `📞 Tél : ${clientPhone || 'Non renseigné'}\n` +
      `🎉 Événement : ${eventType.toUpperCase()}\n` +
      `📅 Date : ${eventDate || 'À définir'}\n` +
      `📍 Lieu : ${eventLocation}\n` +
      `👥 Invités : ${guestCount} personnes\n` +
      `📦 Formule : ${activePackage?.name || 'Sur mesure'}\n` +
      `🍽️ Service : ${serviceType}\n` +
      `💰 Budget estimé : *${formatFCFA(estimatedBudget)}*\n` +
      (specialRequests ? `📝 Remarques : ${specialRequests}\n\n` : '\n') +
      `Bonjour Madame Néné, merci de me confirmer vos disponibilités et les détails pour cette prestation.`;

    return createWhatsAppUrl(RESTAURANT_INFO.whatsappRaw, message);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=80"
            alt="Traiteur buffet Néné Services Dakar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Service Traiteur Clé en Main à Dakar</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
            Sublimez vos réceptions avec la Téranga de Néné Services
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Mariages, baptêmes (Ngente), anniversaires, réceptions privées, séminaires d’entreprises et cocktails dînatoires.
            De 20 à plus de 200 personnes, nous assurons des buffets majestueux, des grillades succulentes et un service soigné avec nos maîtres d'hôtel.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-stone-200">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-xs">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Chafing dishes chauds inox</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-xs">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Maîtres d’hôtel en tenue</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-xs">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Devis sous 24h</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Catering Packages Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Nos Formules Clés en Main
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Choisissez la Formule Idéale pour vos Invités
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            Toutes nos formules incluent la livraison sur le lieu de votre événement à Dakar et sont ajustables selon vos préférences culinaires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;
            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-xl ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/20'
                    : 'border-stone-200'
                }`}
              >
                <div>
                  {/* Image */}
                  <div className="relative h-48 w-full bg-stone-100">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {pkg.popular && (
                      <div className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white px-2.5 py-0.5 rounded-full shadow-md">
                        ★ Le plus demandé
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                        {pkg.guestCount} personnes minimum
                      </div>
                      <h3 className="font-heading font-black text-lg text-white">
                        {pkg.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <p className="text-xs text-stone-600 leading-relaxed italic">
                      « {pkg.tagline} »
                    </p>

                    {/* Price in FCFA */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-baseline justify-between">
                      <span className="text-xs text-stone-500 font-medium">Tarif indicatif :</span>
                      <div>
                        <span className="font-heading font-black text-xl text-orange-600">
                          {formatFCFA(pkg.priceFCFA)}
                        </span>
                        <span className="text-[11px] text-stone-500 block text-right">
                          (~{formatFCFA(Math.round(pkg.priceFCFA / pkg.guestCount))} / pers)
                        </span>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Composition du buffet :
                      </div>
                      <ul className="space-y-1.5 text-xs text-stone-700">
                        {pkg.menuItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-orange-600 font-bold">•</span>
                            <span className="line-clamp-2">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Included Services */}
                    <div className="pt-2 border-t border-stone-100 space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        Services inclus :
                      </div>
                      <ul className="space-y-1 text-[11px] text-stone-500">
                        {pkg.includedServices.map((svc, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{svc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom select button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      setSelectedPackageId(pkg.id);
                      setGuestCount(pkg.guestCount);
                      const quoteForm = document.getElementById('devis-form-section');
                      if (quoteForm) {
                        quoteForm.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-orange-600 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    <span>{isSelected ? 'Formule sélectionnée ✓' : 'Sélectionner cette formule'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Quote Builder Form */}
      <div id="devis-form-section" className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8 bg-stone-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-400">
              <ChefHat className="w-4 h-4" />
              <span>Simulateur & Devis en Ligne Instantané</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Personnalisez votre devis traiteur
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Remplissez les détails de votre événement pour obtenir une estimation immédiate en FCFA.
            </p>
          </div>

          {/* Quick WhatsApp helper */}
          <a
            href={generateWhatsAppQuoteLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 shrink-0 transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            <span>Devis express sur WhatsApp</span>
          </a>
        </div>

        {submitSuccessMsg ? (
          <div className="p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="font-heading font-black text-2xl text-stone-900">
              Demande envoyée avec succès !
            </h3>
            <p className="text-stone-600 text-sm max-w-lg mx-auto">
              {submitSuccessMsg}
            </p>
            {submittedQuote && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto text-xs space-y-1 text-left">
                <div>Réf. Devis : <strong className="font-mono text-stone-900">{submittedQuote.id}</strong></div>
                <div>Invités : <strong>{submittedQuote.guestCount} personnes</strong></div>
                <div>Budget estimé : <strong className="text-orange-600 font-extrabold">{formatFCFA(submittedQuote.budgetEstime)}</strong></div>
              </div>
            )}
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <a
                href={generateWhatsAppQuoteLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>Confirmer directement sur WhatsApp</span>
              </a>
              <button
                onClick={() => setSubmitSuccessMsg('')}
                className="py-3 px-6 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs hover:bg-stone-200"
              >
                Faire une autre demande
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuote} className="p-6 sm:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Type d'événement <span className="text-orange-600">*</span>
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-hidden focus:border-orange-500"
                >
                  <option value="bapteme">Baptême traditionnel (Ngente)</option>
                  <option value="mariage">Mariage & Réception nuptiale</option>
                  <option value="anniversaire">Anniversaire & Fête privée</option>
                  <option value="seminaire_entreprise">Séminaire d'entreprise / Déjeuner corporate</option>
                  <option value="reception_privee">Cocktail & Réception dînatoire</option>
                  <option value="autre">Autre événement sur mesure</option>
                </select>
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Date prévue de l'événement <span className="text-orange-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Event Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Lieu / Quartier de l'événement à Dakar <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Villa aux Almadies, Salle au Plateau, Mermoz..."
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Formule de service souhaitée
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as CateringServiceType)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-hidden focus:border-orange-500"
                >
                  <option value="buffet">Buffet chaud avec réchauds & Maître d’hôtel</option>
                  <option value="service_a_table">Service à table complet avec serveurs</option>
                  <option value="cocktail_dinatoire">Cocktail dînatoire debout (Finger Food)</option>
                  <option value="livraison_uniquement">Livraison seule en contenants isothermes scellés</option>
                </select>
              </div>
            </div>

            {/* Guest Count Slider & Display */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Nombre d'invités estimé
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Ajustez le curseur pour simuler votre budget
                  </div>
                </div>
                <div className="font-heading font-black text-2xl text-orange-600">
                  {guestCount} personnes
                </div>
              </div>

              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />

              <div className="flex justify-between text-[10px] text-stone-400 font-bold uppercase">
                <span>10 pers</span>
                <span>50 pers</span>
                <span>100 pers</span>
                <span>200 pers</span>
                <span>300+ pers</span>
              </div>
            </div>

            {/* Client Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Votre Nom complet <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mamadou Diop"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
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
                  placeholder="+221 77 123 45 67"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email (facultatif)
                </label>
                <input
                  type="email"
                  placeholder="client@gmail.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Souhaits spécifiques & régimes alimentaires (facultatif)
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Prévoir des plats sans piment pour enfants, options végétariennes, disposition des tables, dégustation préalable..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm"
              />
            </div>

            {/* Live Estimation summary card */}
            <div className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                  Estimation indicative du devis
                </span>
                <div className="font-heading font-black text-2xl sm:text-3xl text-stone-900 mt-0.5">
                  {formatFCFA(estimatedBudget)}
                </div>
                <div className="text-[11px] text-stone-500">
                  Basé sur {guestCount} invités avec la formule « {activePackage.name} » ({serviceType}).
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/25 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Envoi...' : 'Envoyer ma demande'}</span>
                </button>

                <a
                  href={generateWhatsAppQuoteLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>Partager sur WhatsApp</span>
                </a>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
