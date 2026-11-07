import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, MapPin, Truck, Store, Tag, ShieldCheck, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { DELIVERY_ZONES, RESTAURANT_INFO } from '../data/initialData';
import { formatFCFA, getStoreStatus } from '../utils/helpers';
import { DeliveryZone, PaymentMethod, Order } from '../types';

interface CartPageProps {
  onOrderCreated: (order: Order) => void;
  onNavigateToMenu: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onOrderCreated, onNavigateToMenu }) => {
  const {
    items,
    orderType,
    setOrderType,
    selectedZone,
    setSelectedZone,
    deliveryAddress,
    setDeliveryAddress,
    landmark,
    setLandmark,
    promoCode,
    discount,
    promoDescription,
    applyPromoCode,
    removePromoCode,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    itemsCount,
  } = useCart();

  // Customer Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wave');
  const [changeRequestedFor, setChangeRequestedFor] = useState<number | undefined>(undefined);
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const storeStatus = getStoreStatus();

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = await applyPromoCode(promoInput);
    if (res.success) {
      setPromoMsg({ text: res.message, error: false });
    } else {
      setPromoMsg({ text: res.message, error: true });
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);

    if (items.length === 0) {
      setErrorBanner('Votre panier est vide.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorBanner('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    if (orderType === 'delivery') {
      if (!deliveryAddress.trim()) {
        setErrorBanner('Veuillez renseigner votre adresse de livraison exacte.');
        return;
      }
      if (!selectedZone) {
        setErrorBanner('Veuillez sélectionner votre quartier à Dakar.');
        return;
      }
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerWhatsapp: customerWhatsapp.trim() || customerPhone.trim(),
      type: orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      deliveryZoneId: orderType === 'delivery' ? selectedZone?.id : undefined,
      deliveryZoneName: orderType === 'delivery' ? selectedZone?.name : undefined,
      deliveryFee,
      landmark: orderType === 'delivery' ? landmark.trim() : undefined,
      items,
      subtotal,
      discount,
      discountCode: promoCode || undefined,
      total,
      paymentMethod,
      changeRequestedFor: paymentMethod === 'cash' ? changeRequestedFor : undefined,
      notes: notes.trim() || undefined,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.data) {
        clearCart();
        onOrderCreated(data.data);
      } else {
        setErrorBanner(data.error || 'Erreur lors de la validation de la commande');
      }
    } catch {
      setIsSubmitting(false);
      // Fallback local simulated order
      const fallbackOrder: Order = {
        id: `NS-2026-000${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerWhatsapp: customerWhatsapp.trim() || customerPhone.trim(),
        type: orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        deliveryZoneId: orderType === 'delivery' ? selectedZone?.id : undefined,
        deliveryZoneName: orderType === 'delivery' ? selectedZone?.name : undefined,
        deliveryFee,
        landmark: orderType === 'delivery' ? landmark.trim() : undefined,
        pickupEstimatedTime: orderType === 'pickup' ? '20 - 25 min' : undefined,
        items,
        subtotal,
        discount,
        discountCode: promoCode || undefined,
        total,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'received',
        changeRequestedFor: paymentMethod === 'cash' ? changeRequestedFor : undefined,
        notes: notes.trim() || undefined,
        paymentReference: `${paymentMethod.toUpperCase()}-SIM-${Date.now().toString().slice(-6)}`
      };
      clearCart();
      onOrderCreated(fallbackOrder);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Votre panier est actuellement vide
          </h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
            Envie d’un délicieux burger gourmet, de pastels chaudes ou d’un bon Thiéboudienne ? Faites votre choix parmi nos spécialités.
          </p>
        </div>
        <button
          onClick={onNavigateToMenu}
          className="py-3.5 px-8 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/30 active:scale-95 transition-all"
        >
          Découvrir le menu et commander
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <div className="space-y-1">
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
          Votre Panier & Règlement
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm">
          Vérifiez vos articles, choisissez votre mode de livraison et payez en toute sécurité par Wave, Orange Money ou espèces.
        </p>
      </div>

      {errorBanner && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-xs sm:text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{errorBanner}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Items & Delivery Info (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Items List Card */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-orange-600" />
                  <span className="font-heading font-bold text-stone-900 text-sm">
                    Articles ({itemsCount})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vider tout</span>
                </button>
              </div>

              <div className="p-4 sm:p-5 space-y-4 divide-y divide-stone-100">
                {items.map((item) => (
                  <div key={item.cartItemId} className="pt-4 first:pt-0 flex gap-4">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-stone-900 truncate">
                          {item.menuItem.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Options */}
                      <div className="text-xs text-stone-500 space-y-0.5">
                        {item.selectedSize && (
                          <div>• Taille : <span className="font-medium text-stone-700">{item.selectedSize.name}</span></div>
                        )}
                        {item.spiciness && (
                          <div>• Piment : <span className="font-medium text-stone-700 capitalize">{item.spiciness.replace('_', ' ')}</span></div>
                        )}
                        {item.selectedSauces.length > 0 && (
                          <div>• Sauces : {item.selectedSauces.map(s => s.name).join(', ')}</div>
                        )}
                        {item.selectedExtras.length > 0 && (
                          <div>• Extras : {item.selectedExtras.map(e => e.name).join(', ')}</div>
                        )}
                        {item.specialInstructions && (
                          <div className="italic text-stone-400">Note : « {item.specialInstructions} »</div>
                        )}
                      </div>

                      {/* Quantity & Unit/Total Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center bg-stone-100 border border-stone-200 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-white rounded"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-white rounded"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="font-heading font-black text-sm sm:text-base text-stone-900">
                          {formatFCFA(item.totalPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Order Mode: Delivery or Pickup */}
            <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
              <h3 className="font-heading font-bold text-stone-900 text-base">
                Mode de réception de votre commande
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all ${
                    orderType === 'delivery'
                      ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 text-orange-950 font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <Truck className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="text-sm font-bold">Livraison à domicile</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">Partout à Dakar & banlieue</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all ${
                    orderType === 'pickup'
                      ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 text-orange-950 font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <Store className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="text-sm font-bold">Retrait sur place (À emporter)</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">Av. Cheikh Anta Diop • Gratuit</div>
                  </div>
                </button>
              </div>

              {/* Delivery Details */}
              {orderType === 'delivery' ? (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Zone / Quartier de Dakar <span className="text-orange-600">*</span>
                    </label>
                    <select
                      value={selectedZone?.id}
                      onChange={(e) => {
                        const zone = DELIVERY_ZONES.find(z => z.id === e.target.value);
                        if (zone) setSelectedZone(zone);
                      }}
                      className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-hidden focus:border-orange-500"
                    >
                      {DELIVERY_ZONES.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} — Frais : {formatFCFA(z.fee)} (~{z.estimatedTime})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Adresse complète de livraison <span className="text-orange-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Rue 10 x Boulevard de la République, Immeuble Horizon 2e ét."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-200 text-base sm:text-sm focus:outline-hidden focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Point de repère sénégalais (Très important)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: En face de la pharmacie, à côté de la boulangerie jaune..."
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-200 text-base sm:text-sm focus:outline-hidden focus:border-orange-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl text-xs space-y-1.5 text-orange-950">
                  <div className="font-bold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>Adresse du restaurant : {RESTAURANT_INFO.address}</span>
                  </div>
                  <p className="text-stone-600">
                    Votre commande sera prête au comptoir en environ <strong>15 à 25 minutes</strong> après confirmation.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Customer Info */}
            <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-heading font-bold text-stone-900 text-base">
                Vos Coordonnées de Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Nom & Prénom <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Moussa Ndiaye"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 text-base sm:text-sm focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Numéro de Téléphone (Orange/Wave/Free) <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+221 77 123 45 67"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 text-base sm:text-sm focus:outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Instructions pour le cuisinier ou le livreur (facultatif)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sonner à l'interphone 3B, sauce pimentée bien à part..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-base sm:text-sm focus:outline-hidden focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Payment Choice & Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Promo Code box */}
            <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Tag className="w-4 h-4 text-orange-600" />
                <span>Code Promo / Réduction</span>
              </div>

              {promoCode ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-800">{promoCode}</span>
                    <span className="block text-emerald-600 text-[11px]">{promoDescription}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-stone-400 hover:text-red-500 text-xs font-bold"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="BIENVENUE500, NENE10..."
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-stone-200 text-xs uppercase font-bold focus:outline-hidden focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="py-2.5 px-4 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800"
                  >
                    Appliquer
                  </button>
                </div>
              )}

              {promoMsg && (
                <div className={`text-xs ${promoMsg.error ? 'text-red-600' : 'text-emerald-600 font-semibold'}`}>
                  {promoMsg.text}
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-heading font-bold text-stone-900 text-base">
                Mode de Paiement Sécurisé
              </h3>

              <div className="space-y-2.5">
                {/* Wave Option */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'wave'
                      ? 'border-[#1EA5FC] bg-[#1EA5FC]/10 ring-2 ring-[#1EA5FC]/20 font-bold'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wave"
                      checked={paymentMethod === 'wave'}
                      onChange={() => setPaymentMethod('wave')}
                      className="text-[#1EA5FC] focus:ring-[#1EA5FC]"
                    />
                    <div>
                      <div className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1EA5FC]" />
                        <span>Wave Mobile Money</span>
                      </div>
                      <div className="text-[11px] text-stone-500">QR Code / 1-Clic Wave instantané</div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#0A74DA]">Wave</span>
                </label>

                {/* Orange Money Option */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'orange_money'
                      ? 'border-[#FF6600] bg-[#FF6600]/10 ring-2 ring-[#FF6600]/20 font-bold'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="orange_money"
                      checked={paymentMethod === 'orange_money'}
                      onChange={() => setPaymentMethod('orange_money')}
                      className="text-[#FF6600] focus:ring-[#FF6600]"
                    />
                    <div>
                      <div className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF7900]" />
                        <span>Orange Money Sénégal</span>
                      </div>
                      <div className="text-[11px] text-stone-500">Code marchand #144# / Web payment</div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#FF6600]">OM</span>
                </label>

                {/* Cash Option */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20 font-bold'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="text-emerald-600 focus:ring-emerald-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        Espèces à la livraison / au retrait
                      </div>
                      <div className="text-[11px] text-stone-500">Payer en mains propres au livreur</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">Espèces</span>
                </label>
              </div>

              {/* If cash selected: change helper */}
              {paymentMethod === 'cash' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    Avez-vous besoin de monnaie ?
                  </label>
                  <select
                    value={changeRequestedFor || ''}
                    onChange={(e) => setChangeRequestedFor(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-2 rounded-lg border border-stone-200 text-xs bg-white"
                  >
                    <option value="">Montant exact prévu (Pas de monnaie requise)</option>
                    <option value="5000">Prévoir la monnaie sur 5 000 FCFA</option>
                    <option value="10000">Prévoir la monnaie sur 10 000 FCFA</option>
                    <option value="20000">Prévoir la monnaie sur 20 000 FCFA</option>
                  </select>
                </div>
              )}
            </div>

            {/* Financial Summary Card */}
            <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-black text-lg border-b border-stone-800 pb-3">
                Récapitulatif de la Commande
              </h3>

              <div className="space-y-2.5 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span>Sous-total articles :</span>
                  <span className="font-bold text-white">{formatFCFA(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Remise promo ({promoCode}) :</span>
                    <span>-{formatFCFA(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frais de livraison :</span>
                  <span className="font-bold text-white">
                    {orderType === 'delivery' ? formatFCFA(deliveryFee) : '0 FCFA (Retrait)'}
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-800 flex justify-between items-baseline">
                  <span className="font-heading font-black text-sm uppercase text-stone-300">
                    Total Final Net :
                  </span>
                  <span className="font-heading font-black text-2xl text-orange-400">
                    {formatFCFA(total)}
                  </span>
                </div>
              </div>

              {/* Submit Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-base shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Validation en cours...' : 'Valider & Payer ma commande'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 text-center pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Paiement sécurisé et garanti par Néné Services</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
