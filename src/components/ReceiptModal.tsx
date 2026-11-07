import React from 'react';
import { X, Printer, Share2, CheckCircle2, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { Order } from '../types';
import { formatFCFA, formatDateFR, RESTAURANT_INFO, createWhatsAppUrl } from '../utils/helpers';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose, onTrackOrder }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const shareViaWhatsApp = () => {
    const summaryLines = order.items
      .map(i => `• ${i.quantity}x ${i.menuItem.name} (${formatFCFA(i.totalPrice)})`)
      .join('\n');

    const message = `*COMMANDE NÉNÉ SERVICES - ${order.id}*\n\n` +
      `Client: ${order.customerName}\n` +
      `Téléphone: ${order.customerPhone}\n` +
      `Type: ${order.type === 'delivery' ? 'Livraison à domicile' : 'Retrait au restaurant'}\n` +
      (order.deliveryAddress ? `Adresse: ${order.deliveryAddress}\n` : '') +
      `\n*Articles:*\n${summaryLines}\n\n` +
      `Total: *${formatFCFA(order.total)}*\n` +
      `Paiement: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})\n` +
      `Statut: ${order.orderStatus}\n\n` +
      `Merci d'avoir commandé chez Néné Services !`;

    const url = createWhatsAppUrl(order.customerWhatsapp || RESTAURANT_INFO.whatsappRaw, message);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] sm:max-h-[90vh] overflow-y-auto border border-stone-200">
        {/* Top Controls */}
        <div className="p-4 bg-stone-100 border-b border-stone-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-stone-700 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ticket de Caisse & Reçu</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Imprimer le ticket"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
            <button
              onClick={shareViaWhatsApp}
              className="p-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Partager sur WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 sm:p-8 space-y-6 text-stone-900 bg-white">
          {/* Header */}
          <div className="text-center pb-6 border-b border-dashed border-stone-300 space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-heading font-black text-2xl mx-auto mb-2">
              N
            </div>
            <h3 className="font-heading font-black text-2xl tracking-tight text-stone-900">
              Néné Services
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              « {RESTAURANT_INFO.slogan} »
            </p>
            <p className="text-[11px] text-stone-500 pt-1">
              {RESTAURANT_INFO.address} • Tél : {RESTAURANT_INFO.phone}
            </p>
          </div>

          {/* Order Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs py-2 border-b border-stone-100">
            <div>
              <span className="text-stone-400 block">N° Commande</span>
              <span className="font-mono font-bold text-sm text-stone-900">{order.id}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block">Date & Heure</span>
              <span className="font-medium text-stone-800">{formatDateFR(order.createdAt)}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Client</span>
              <span className="font-bold text-stone-900">{order.customerName}</span>
              <span className="block text-stone-500">{order.customerPhone}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block">Mode de commande</span>
              <span className="font-bold uppercase text-orange-600">
                {order.type === 'delivery' ? 'Livraison à domicile' : 'Retrait sur place'}
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          {order.type === 'delivery' && (
            <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-700">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>Zone : {order.deliveryZoneName || 'Dakar'}</span>
              </div>
              <div className="text-stone-600">{order.deliveryAddress}</div>
              {order.landmark && (
                <div className="text-stone-500 text-[11px] italic">
                  Point de repère : {order.landmark}
                </div>
              )}
            </div>
          )}

          {/* Items Table */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400 pb-1 border-b border-stone-200 flex justify-between">
              <span>Articles commandés</span>
              <span>Total</span>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="flex justify-between items-start text-xs">
                  <div className="flex-1 pr-4">
                    <div className="font-bold text-stone-900">
                      {item.quantity}x {item.menuItem.name}
                    </div>
                    {/* options */}
                    <div className="text-[11px] text-stone-500 pl-4 space-y-0.5">
                      {item.selectedSize && <div>• Taille : {item.selectedSize.name}</div>}
                      {item.spiciness && <div>• Piment : {item.spiciness.replace('_', ' ')}</div>}
                      {item.selectedSauces.length > 0 && (
                        <div>• Sauces : {item.selectedSauces.map(s => s.name).join(', ')}</div>
                      )}
                      {item.selectedExtras.length > 0 && (
                        <div>• Extras : {item.selectedExtras.map(e => e.name).join(', ')}</div>
                      )}
                      {item.specialInstructions && (
                        <div className="italic">Note : {item.specialInstructions}</div>
                      )}
                    </div>
                  </div>
                  <div className="font-bold text-stone-900 shrink-0">
                    {formatFCFA(item.totalPrice)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="pt-4 border-t border-dashed border-stone-300 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-500">
              <span>Sous-total articles :</span>
              <span className="font-medium text-stone-800">{formatFCFA(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Remise appliquée ({order.discountCode}) :</span>
                <span>-{formatFCFA(order.discount)}</span>
              </div>
            )}

            {order.type === 'delivery' && (
              <div className="flex justify-between text-stone-500">
                <span>Frais de livraison :</span>
                <span className="font-medium text-stone-800">{formatFCFA(order.deliveryFee)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-stone-900 flex justify-between items-baseline">
              <span className="font-heading font-black text-base text-stone-900 uppercase">
                Total Net TTC :
              </span>
              <span className="font-heading font-extrabold text-xl text-orange-600">
                {formatFCFA(order.total)}
              </span>
            </div>
          </div>

          {/* Payment Status & Instructions */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-stone-500 block">Règlement :</span>
              <span className="font-bold uppercase text-stone-900">
                {order.paymentMethod === 'wave' && 'Wave Mobile Money'}
                {order.paymentMethod === 'orange_money' && 'Orange Money'}
                {order.paymentMethod === 'cash' && 'Espèces'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-stone-500 block">État paiement :</span>
              <span className={`font-bold uppercase ${
                order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {order.paymentStatus === 'paid' ? 'Payé ✓' : 'En attente'}
              </span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-stone-400 pt-2 border-t border-stone-100">
            Jërejëf ! Merci pour votre confiance. Néné Services vous souhaite un excellent appétit !
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between no-print">
          <button
            onClick={() => {
              onClose();
              onTrackOrder(order.id);
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 active:scale-98 transition-all"
          >
            <span>Suivre l’avancement de ma commande</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
