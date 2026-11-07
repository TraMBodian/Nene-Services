import React, { useState, useEffect } from 'react';
import { Search, Package, Clock, CheckCircle2, Truck, Store, Phone, MessageCircle, AlertCircle, Printer, ArrowRight } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatFCFA, formatDateFR, RESTAURANT_INFO, createWhatsAppUrl } from '../utils/helpers';

interface OrderTrackingPageProps {
  initialOrderId?: string;
  onOpenReceipt: (order: Order) => void;
  onNavigateToMenu: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderId,
  onOpenReceipt,
  onNavigateToMenu,
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderId || '');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchOrder = async (identifier: string) => {
    if (!identifier.trim()) return;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(identifier.trim())}`);
      const data = await res.json();
      setIsLoading(false);

      if (data.success && data.data) {
        setCurrentOrder(data.data);
      } else {
        setErrorMessage(data.error || 'Aucune commande trouvée avec ce numéro ou cette référence.');
        setCurrentOrder(null);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Erreur de connexion au serveur de suivi.');
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchInput);
  };

  // Helper status steps
  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'received', label: 'Reçue', desc: 'Commande enregistrée par notre système' },
    { key: 'confirmed', label: 'Confirmée', desc: 'Validée par l’équipe de Néné Services' },
    { key: 'preparing', label: 'En cuisine', desc: 'Préparation minute de vos plats chauds' },
    {
      key: currentOrder?.type === 'pickup' ? 'ready_for_pickup' : 'in_delivery',
      label: currentOrder?.type === 'pickup' ? 'Prête au retrait' : 'En livraison',
      desc: currentOrder?.type === 'pickup' ? 'Disponible au comptoir du restaurant' : 'Le livreur est en route vers chez vous'
    },
    { key: 'delivered', label: 'Livrée / Retirée', desc: 'Bon appétit !' },
  ];

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'received': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'in_delivery':
      case 'ready_for_pickup': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIndex = currentOrder ? getStepIndex(currentOrder.orderStatus) : 0;
  const isCancelled = currentOrder?.orderStatus === 'cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          Suivi en Temps Réel
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-stone-900">
          Suivre l'état de votre commande
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm">
          Entrez votre référence unique (ex: <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">NS-2026-000101</code>) ou votre numéro de téléphone.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Numéro de commande (NS-...) ou téléphone (+221...)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="py-3 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/25 active:scale-95 transition-all shrink-0"
          >
            {isLoading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>

        {/* Demo Quick Reference Pills */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
          <span>Exemples récents :</span>
          {['NS-2026-000101', 'NS-2026-000102', 'NS-2026-000103'].map((demoId) => (
            <button
              key={demoId}
              type="button"
              onClick={() => {
                setSearchInput(demoId);
                fetchOrder(demoId);
              }}
              className="px-2 py-0.5 bg-stone-100 hover:bg-orange-50 hover:text-orange-600 rounded-md font-mono text-[10px] text-stone-700 transition-colors"
            >
              {demoId}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-xs sm:text-sm max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Order Status Display */}
      {currentOrder && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden space-y-6">
          {/* Header Card */}
          <div className="p-6 bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-orange-400">
                  {currentOrder.id}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300">
                  {formatDateFR(currentOrder.createdAt)}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Client : <strong className="text-white">{currentOrder.customerName}</strong> ({currentOrder.customerPhone})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenReceipt(currentOrder)}
                className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Ticket de caisse</span>
              </button>
            </div>
          </div>

          {/* Cancelled Banner if cancelled */}
          {isCancelled ? (
            <div className="mx-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs sm:text-sm">
              <strong className="block text-red-900 font-bold mb-1">Commande Annulée</strong>
              Cette commande a été annulée. N’hésitez pas à contacter notre équipe pour toute question.
            </div>
          ) : (
            /* Visual Progress Stepper */
            <div className="px-6 py-4">
              <div className="relative">
                {/* Connecting Bar */}
                <div className="hidden md:block absolute top-1/2 left-6 right-6 h-1 bg-stone-200 -translate-y-1/2 z-0" />
                <div
                  className="hidden md:block absolute top-1/2 left-6 h-1 bg-orange-600 -translate-y-1/2 z-0 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, (currentStepIndex / 4) * 100))}%`,
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  {steps.map((step, idx) => {
                    const isPassed = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div
                        key={step.key}
                        className={`flex md:flex-col items-center md:items-center text-left md:text-center gap-3 md:gap-2 p-3 md:p-0 rounded-2xl md:rounded-none ${
                          isCurrent ? 'bg-orange-50 md:bg-transparent' : ''
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                            isCurrent
                              ? 'bg-orange-600 text-white ring-4 ring-orange-200 scale-110 shadow-md'
                              : isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          {isPassed && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>

                        <div>
                          <div
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-orange-600'
                                : isPassed
                                ? 'text-stone-900'
                                : 'text-stone-400'
                            }`}
                          >
                            {step.label}
                          </div>
                          <p className="text-[11px] text-stone-500 max-w-[130px] mx-auto hidden md:block">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Delivery Details Card */}
          <div className="mx-6 p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 font-medium block mb-1">Mode de remise :</span>
              <div className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                {currentOrder.type === 'delivery' ? (
                  <>
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span>Livraison à domicile ({currentOrder.deliveryZoneName})</span>
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4 text-orange-600" />
                    <span>Retrait au restaurant</span>
                  </>
                )}
              </div>
              {currentOrder.deliveryAddress && (
                <div className="text-stone-600 mt-1">{currentOrder.deliveryAddress}</div>
              )}
              {currentOrder.landmark && (
                <div className="text-stone-500 text-[11px] italic mt-0.5">
                  Repère : {currentOrder.landmark}
                </div>
              )}
            </div>

            <div>
              <span className="text-stone-400 font-medium block mb-1">Paiement :</span>
              <div className="font-bold text-stone-900 uppercase">
                {currentOrder.paymentMethod === 'wave' && 'Wave Mobile Money'}
                {currentOrder.paymentMethod === 'orange_money' && 'Orange Money'}
                {currentOrder.paymentMethod === 'cash' && 'Espèces à la réception'}
              </div>
              <div className="mt-1">
                Statut :{' '}
                <span
                  className={`font-bold ${
                    currentOrder.paymentStatus === 'paid'
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`}
                >
                  {currentOrder.paymentStatus === 'paid' ? 'Payé ✓' : 'En attente de paiement'}
                </span>
              </div>
              <div className="text-sm font-heading font-black text-orange-600 mt-1">
                Total : {formatFCFA(currentOrder.total)}
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="px-6 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Contenu de la commande :
            </h4>
            <div className="divide-y divide-stone-100">
              {currentOrder.items.map((item) => (
                <div key={item.cartItemId} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900">{item.quantity}x {item.menuItem.name}</span>
                    {item.selectedSize && <span className="text-stone-500"> ({item.selectedSize.name})</span>}
                    {item.spiciness && <span className="text-red-600 font-medium"> • {item.spiciness.replace('_', ' ')}</span>}
                  </div>
                  <span className="font-bold text-stone-800">{formatFCFA(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact & Assistance Footer */}
          <div className="p-6 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-stone-500">
              Une question ou une modification urgente sur cette commande ?
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${RESTAURANT_INFO.phoneRaw}`}
                className="py-2 px-3.5 rounded-xl bg-stone-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>Appeler {RESTAURANT_INFO.phone}</span>
              </a>

              <a
                href={createWhatsAppUrl(
                  RESTAURANT_INFO.whatsappRaw,
                  `Bonjour Néné Services, je vous écris au sujet de ma commande n° ${currentOrder.id}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3.5 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
