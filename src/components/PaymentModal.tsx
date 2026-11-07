import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, Smartphone, Banknote, CheckCircle, AlertTriangle, ArrowRight, RefreshCw, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, PaymentMethod } from '../types';
import { formatFCFA, RESTAURANT_INFO } from '../utils/helpers';

interface PaymentModalProps {
  order: Order;
  onPaymentSuccess: (updatedOrder: Order) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ order, onPaymentSuccess, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'prompt' | 'processing' | 'success' | 'failed'>('prompt');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.log('Confetti error', e);
    }
  };

  // Simulate payment completion via server webhook
  const handleConfirmMobilePayment = async () => {
    setIsSimulatingWebhook(true);
    setCurrentStep('processing');

    const webhookEndpoint = order.paymentMethod === 'wave' 
      ? '/api/webhooks/wave' 
      : '/api/webhooks/orange-money';

    const payload = order.paymentMethod === 'wave'
      ? {
          event: 'checkout.session.completed',
          data: {
            client_reference: order.id,
            amount: order.total,
            id: `WAVE-TX-${Date.now()}`
          }
        }
      : {
          order_id: order.id,
          status: 'SUCCESS',
          notif_token: `OM-NOTIF-${Date.now()}`
        };

    try {
      const res = await fetch(webhookEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      setTimeout(() => {
        setIsSimulatingWebhook(false);
        if (data.success && data.order) {
          setCurrentStep('success');
          triggerConfetti();
          onPaymentSuccess(data.order);
        } else {
          setCurrentStep('failed');
        }
      }, 1500);
    } catch {
      setTimeout(() => {
        setIsSimulatingWebhook(false);
        // Fallback simulated success
        const updatedOrder: Order = {
          ...order,
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
          paymentReference: `${order.paymentMethod.toUpperCase()}-TX-${Date.now().toString().slice(-6)}`
        };
        setCurrentStep('success');
        triggerConfetti();
        onPaymentSuccess(updatedOrder);
      }, 1500);
    }
  };

  // For cash payment: confirm order placement directly
  const handleConfirmCashOrder = () => {
    triggerConfetti();
    onPaymentSuccess(order);
  };

  const copyPaymentReference = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] sm:max-h-[90vh] overflow-y-auto border border-stone-200">
        {/* Header */}
        <div className={`p-5 text-white flex items-center justify-between ${
          order.paymentMethod === 'wave'
            ? 'bg-gradient-to-r from-[#1EA5FC] to-[#0A74DA]'
            : order.paymentMethod === 'orange_money'
            ? 'bg-gradient-to-r from-[#FF6600] to-[#E05200]'
            : 'bg-gradient-to-r from-emerald-600 to-teal-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              {order.paymentMethod === 'wave' && <Smartphone className="w-5 h-5 text-white" />}
              {order.paymentMethod === 'orange_money' && <Smartphone className="w-5 h-5 text-white" />}
              {order.paymentMethod === 'cash' && <Banknote className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg leading-tight">
                {order.paymentMethod === 'wave' && 'Paiement sécurisé Wave'}
                {order.paymentMethod === 'orange_money' && 'Paiement Orange Money Sénégal'}
                {order.paymentMethod === 'cash' && 'Paiement en Espèces'}
              </h3>
              <p className="text-xs text-white/80">
                Commande réf : <span className="font-mono font-bold">{order.id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">Montant net à régler :</span>
          <span className="font-heading font-extrabold text-xl text-stone-900">
            {formatFCFA(order.total)}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* STEP: PROCESSING */}
          {currentStep === 'processing' && (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto" />
              <h4 className="font-heading font-bold text-lg text-stone-800">
                Vérification du paiement en cours...
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Attente de la confirmation sécurisée du serveur ({order.paymentMethod.toUpperCase()}). Veuillez patienter un instant.
              </p>
            </div>
          )}

          {/* STEP: FAILED */}
          {currentStep === 'failed' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-lg text-stone-900">
                Paiement non confirmé
              </h4>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                La transaction n'a pas pu être validée (délai dépassé ou solde insuffisant). Vous pouvez réessayer ou choisir les espèces à la livraison.
              </p>
              <button
                onClick={() => setCurrentStep('prompt')}
                className="py-2.5 px-6 rounded-xl bg-stone-900 text-white font-bold text-xs"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* STEP: PROMPT (WAVE) */}
          {currentStep === 'prompt' && order.paymentMethod === 'wave' && (
            <div className="space-y-5 text-center">
              {/* QR Code Container */}
              <div className="inline-block p-4 bg-white rounded-2xl border-2 border-[#1EA5FC]/30 shadow-md">
                {/* Visual SVG QR Code placeholder */}
                <div className="w-44 h-44 bg-stone-50 border border-stone-200 rounded-xl flex flex-col items-center justify-center p-3 relative overflow-hidden group">
                  <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2 opacity-85">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 2 === 0 || i % 5 === 0) ? 'bg-[#0A74DA]' : 'bg-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Wave Logo overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-3 py-1 bg-white rounded-lg shadow-md border border-[#1EA5FC] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1EA5FC]" />
                      <span className="text-xs font-black text-[#0A74DA]">WAVE</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-stone-800">
                  Scannez ce QR Code avec votre application Wave
                </p>
                <p className="text-[11px] text-stone-500">
                  Ou confirmez le paiement instantané ci-dessous pour valider la commande.
                </p>
              </div>

              {/* Reference helper */}
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs text-stone-600">
                <span>Réf. Wave : <strong className="font-mono text-stone-900">{order.id}</strong></span>
                <button
                  onClick={copyPaymentReference}
                  className="flex items-center gap-1 text-[#0A74DA] font-semibold hover:underline"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copié' : 'Copier'}</span>
                </button>
              </div>

              {/* Simulation CTA Button */}
              <button
                onClick={handleConfirmMobilePayment}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1EA5FC] hover:bg-[#0A74DA] text-white font-extrabold text-sm shadow-md shadow-[#1EA5FC]/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span>Confirmer le paiement Wave ({formatFCFA(order.total)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP: PROMPT (ORANGE MONEY) */}
          {currentStep === 'prompt' && order.paymentMethod === 'orange_money' && (
            <div className="space-y-5 text-center">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-left space-y-3">
                <div className="text-xs font-bold text-[#FF6600] uppercase tracking-wide">
                  Instructions Orange Money Sénégal
                </div>
                <div className="text-xs text-stone-700 space-y-1.5">
                  <p>1. Composez <strong>#144#391#</strong> sur votre mobile Orange.</p>
                  <p>2. Entrez le code marchand Néné : <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-orange-300">NENE-DKR</strong></p>
                  <p>3. Montant exact : <strong>{formatFCFA(order.total)}</strong></p>
                  <p>4. Validez avec votre code secret Orange Money.</p>
                </div>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs text-stone-600">
                <span>Réf. Commande : <strong className="font-mono text-stone-900">{order.id}</strong></span>
                <button
                  onClick={copyPaymentReference}
                  className="flex items-center gap-1 text-[#FF6600] font-semibold hover:underline"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copié' : 'Copier'}</span>
                </button>
              </div>

              <button
                onClick={handleConfirmMobilePayment}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FF6600] hover:bg-[#E05200] text-white font-extrabold text-sm shadow-md shadow-[#FF6600]/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span>Simuler validation Orange Money</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP: PROMPT (CASH) */}
          {currentStep === 'prompt' && order.paymentMethod === 'cash' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Paiement en espèces à la livraison / au retrait</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Votre commande sera transmise à notre cuisine avec le statut <strong>« En attente de confirmation »</strong>.
                  Notre équipe vous appellera au <strong>{order.customerPhone}</strong> pour valider l'adresse et le point de repère avant le départ du livreur.
                </p>

                <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs">
                  <span className="text-stone-600">Montant exact à préparer :</span>
                  <span className="font-extrabold text-emerald-800 text-sm">{formatFCFA(order.total)}</span>
                </div>

                {order.changeRequestedFor && (
                  <div className="text-[11px] text-stone-500">
                    Monnaie demandée sur billet de : <strong>{formatFCFA(order.changeRequestedFor)}</strong>
                  </div>
                )}
              </div>

              <button
                onClick={handleConfirmCashOrder}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span>Confirmer ma commande en espèces</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="pt-3 border-t border-stone-100 flex items-start gap-2.5 text-[11px] text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Sécurité garantie :</strong> Néné Services ne stocke aucun code confidentiel ni coordonnées bancaires. Les paiements mobiles s’effectuent en conformité avec les normes de sécurité BCEAO.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
