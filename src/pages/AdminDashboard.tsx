import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  TrendingUp,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  AlertTriangle,
  Printer,
  Phone,
  MessageCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Settings,
  HelpCircle,
  Play,
  RotateCcw,
  Check,
  Eye,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';
import { Order, MenuItem, CateringQuote, DeliveryZone, OrderStatus, PaymentStatus } from '../types';
import { formatFCFA, formatDateFR, RESTAURANT_INFO, createWhatsAppUrl } from '../utils/helpers';

interface AdminDashboardProps {
  onOpenReceipt: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenReceipt }) => {
  // PIN Code Protection (Default PIN: 1234)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'catering' | 'zones' | 'docs' | 'tests'>('orders');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cateringQuotes, setCateringQuotes] = useState<CateringQuote[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [testNotification, setTestNotification] = useState<string | null>(null);

  // New Dish Modal state
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState(3000);
  const [newDishCategory, setNewDishCategory] = useState<any>('burgers');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishImage, setNewDishImage] = useState('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resOrders, resMenu, resQuotes, resZones] = await Promise.all([
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/menu').then(r => r.json()),
        fetch('/api/catering-quotes').then(r => r.json()),
        fetch('/api/delivery-zones').then(r => r.json()),
      ]);

      if (resOrders.success) setOrders(resOrders.data);
      if (resMenu.success) setMenuItems(resMenu.data);
      if (resQuotes.success) setCateringQuotes(resQuotes.data);
      if (resZones.success) setDeliveryZones(resZones.data);
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '0000') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Change Order Status
  const handleUpdateOrderStatus = async (orderId: string, orderStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o.id === orderId ? data.data : o));
      }
    } catch (e) {
      console.error('Error updating status', e);
    }
  };

  // Change Payment Status
  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o.id === orderId ? data.data : o));
      }
    } catch (e) {
      console.error('Error updating payment', e);
    }
  };

  // Toggle dish availability
  const handleToggleDishStock = async (dish: MenuItem) => {
    try {
      const updated = { ...dish, isAvailable: !dish.isAvailable };
      const res = await fetch(`/api/menu/${dish.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems(menuItems.map(m => m.id === dish.id ? data.data : m));
      }
    } catch (e) {
      console.error('Error toggling dish', e);
    }
  };

  // Add new dish
  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    try {
      const payload: Partial<MenuItem> = {
        name: newDishName,
        price: Number(newDishPrice),
        category: newDishCategory,
        description: newDishDesc,
        image: newDishImage,
        isAvailable: true,
        preparationTimeMinutes: 15,
      };

      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems([data.data, ...menuItems]);
        setShowAddDishModal(false);
        setNewDishName('');
        setNewDishDesc('');
      }
    } catch (e) {
      console.error('Error creating dish', e);
    }
  };

  // Update Catering Quote Status
  const handleUpdateQuoteStatus = async (quoteId: string, status: any) => {
    try {
      const res = await fetch(`/api/catering-quotes/${quoteId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setCateringQuotes(cateringQuotes.map(q => q.id === quoteId ? data.data : q));
      }
    } catch (e) {
      console.error('Error updating quote', e);
    }
  };

  // Update delivery zone fee
  const handleUpdateZoneFee = async (zoneId: string, newFee: number) => {
    const updated = deliveryZones.map(z => z.id === zoneId ? { ...z, fee: newFee } : z);
    setDeliveryZones(updated);
    try {
      await fetch('/api/delivery-zones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error('Error updating zones', e);
    }
  };

  // Trigger test scenario
  const handleRunTestScenario = async (scenario: string) => {
    try {
      const res = await fetch('/api/test-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });
      const data = await res.json();
      if (data.success) {
        setTestNotification(data.message);
        fetchData();
        setTimeout(() => setTestNotification(null), 4000);
      }
    } catch (e) {
      console.error('Test scenario error', e);
    }
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Client', 'Telephone', 'Type', 'Quartier', 'Articles', 'Total_FCFA', 'Paiement', 'Statut_Paiement', 'Statut_Commande'];
    const rows = orders.map(o => [
      o.id,
      new Date(o.createdAt).toLocaleString('fr-FR'),
      `"${o.customerName}"`,
      o.customerPhone,
      o.type,
      `"${o.deliveryZoneName || 'Retrait'}"`,
      `"${o.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(' | ')}"`,
      o.total,
      o.paymentMethod,
      o.paymentStatus,
      o.orderStatus
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nene_services_commandes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPIs
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(o => o.orderStatus === 'received' || o.orderStatus === 'confirmed' || o.orderStatus === 'preparing').length;
  const inDeliveryCount = orders.filter(o => o.orderStatus === 'in_delivery').length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'delivered').length;

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return o.orderStatus === 'received' || o.orderStatus === 'confirmed';
    if (statusFilter === 'preparing') return o.orderStatus === 'preparing';
    if (statusFilter === 'in_delivery') return o.orderStatus === 'in_delivery' || o.orderStatus === 'ready_for_pickup';
    if (statusFilter === 'delivered') return o.orderStatus === 'delivered';
    if (statusFilter === 'cancelled') return o.orderStatus === 'cancelled';
    return true;
  });

  // If not authenticated: show PIN screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-stone-900 text-orange-500 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="font-heading font-black text-2xl text-stone-900">
              Espace Administrateur
            </h2>
            <p className="text-stone-500 text-xs">
              Accès réservé à la gérance et au personnel de Néné Services.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Code PIN Administrateur
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-40 mx-auto text-center font-mono font-black text-2xl tracking-widest p-3 rounded-2xl border border-stone-200 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-600 font-bold">
                Code PIN incorrect. Veuillez réessayer.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/25 transition-all"
            >
              Déverrouiller le Tableau de Bord
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
            Astuce démonstration : Code PIN par défaut = <strong className="text-stone-800 font-mono">1234</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Bar with Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-heading font-black text-2xl">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-xl text-stone-900">
                Tableau de Bord Gérant
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                En direct
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Néné Services Dakar • Fast-Food & Traiteur
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="py-2.5 px-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Exporter CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-500 transition-colors"
            title="Verrouiller"
          >
            <Unlock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Test Notification Banner if active */}
      {testNotification && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-fade-in text-xs sm:text-sm font-bold">
          <span>{testNotification}</span>
          <Check className="w-5 h-5 stroke-[3]" />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Chiffre d’Affaires</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-heading font-black text-xl sm:text-2xl text-stone-900">
            {formatFCFA(totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Paiements Wave, OM & espèces encaissés
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">En Attente / Cuisine</span>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div className="font-heading font-black text-xl sm:text-2xl text-orange-600">
            {pendingCount}
          </div>
          <div className="text-[11px] text-stone-500">
            Commandes à préparer
          </div>
        </div>

        {/* In Delivery */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">En Livraison</span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-heading font-black text-xl sm:text-2xl text-blue-600">
            {inDeliveryCount}
          </div>
          <div className="text-[11px] text-stone-500">
            Livreurs à moto en route
          </div>
        </div>

        {/* Catering Quotes */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Devis Traiteur</span>
            <ShoppingBag className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-heading font-black text-xl sm:text-2xl text-purple-600">
            {cateringQuotes.length}
          </div>
          <div className="text-[11px] text-stone-500">
            Prospects mariages & événements
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        {[
          { id: 'orders', label: `Commandes en direct (${orders.length})` },
          { id: 'menu', label: `Gestion du Menu (${menuItems.length} plats)` },
          { id: 'catering', label: `Devis Traiteur (${cateringQuotes.length})` },
          { id: 'zones', label: 'Zones de Livraison Dakar' },
          { id: 'docs', label: 'Intégrations Wave & OM' },
          { id: 'tests', label: 'Plan de Test QA' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---------------- TAB 1: ORDERS MANAGEMENT ---------------- */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Status filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {[
                { id: 'all', label: 'Toutes' },
                { id: 'pending', label: 'En attente' },
                { id: 'preparing', label: 'En cuisine' },
                { id: 'in_delivery', label: 'En cours de livraison' },
                { id: 'delivered', label: 'Livrées' },
                { id: 'cancelled', label: 'Annulées' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    statusFilter === f.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-stone-500 font-semibold">
              {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} affichée{filteredOrders.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Orders list */}
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4 hover:border-orange-300 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-stone-900">
                      {order.id}
                    </span>
                    <span className="text-stone-400 text-xs">•</span>
                    <span className="text-xs text-stone-500">
                      {formatDateFR(order.createdAt)}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      order.type === 'delivery' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {order.type === 'delivery' ? 'Livraison' : 'Retrait'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Payment Badge with toggle */}
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}
                    >
                      <option value="pending">Paiement : En attente</option>
                      <option value="paid">Paiement : Payé ✓</option>
                      <option value="failed">Paiement : Échoué</option>
                    </select>

                    <button
                      onClick={() => onOpenReceipt(order)}
                      className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs"
                      title="Imprimer ticket"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Client & Address */}
                  <div>
                    <div className="font-bold text-stone-900">{order.customerName}</div>
                    <div className="text-stone-600 mt-0.5 flex items-center gap-1.5">
                      <a href={`tel:${order.customerPhone}`} className="hover:underline text-orange-600 font-bold">
                        {order.customerPhone}
                      </a>
                      <a
                        href={createWhatsAppUrl(order.customerWhatsapp || order.customerPhone, `Bonjour ${order.customerName}, nous préparons votre commande Néné Services ${order.id}.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#25D366] hover:underline"
                        title="Écrire sur WhatsApp"
                      >
                        [WhatsApp]
                      </a>
                    </div>
                    {order.deliveryAddress && (
                      <div className="text-stone-500 mt-1">
                        📍 {order.deliveryZoneName} — {order.deliveryAddress}
                        {order.landmark && <span className="block italic text-[11px]">({order.landmark})</span>}
                      </div>
                    )}
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1">
                    <span className="font-bold text-stone-700 block">Articles :</span>
                    <ul className="space-y-0.5 text-stone-600 text-[11px]">
                      {order.items.map((i) => (
                        <li key={i.cartItemId}>
                          {i.quantity}x <strong>{i.menuItem.name}</strong>
                          {i.selectedSize && ` (${i.selectedSize.name})`}
                          {i.spiciness && ` [${i.spiciness.replace('_', ' ')}]`}
                        </li>
                      ))}
                    </ul>
                    {order.notes && (
                      <div className="text-stone-400 italic text-[10px] mt-1">
                        Note : « {order.notes} »
                      </div>
                    )}
                  </div>

                  {/* Financial & Payment mode */}
                  <div className="space-y-1 md:text-right">
                    <div className="font-heading font-black text-base text-orange-600">
                      {formatFCFA(order.total)}
                    </div>
                    <div className="text-stone-500 text-[11px] uppercase font-bold">
                      Mode : {order.paymentMethod}
                    </div>
                    {order.changeRequestedFor && (
                      <div className="text-amber-700 font-semibold text-[11px]">
                        Prévoir monnaie sur : {formatFCFA(order.changeRequestedFor)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status stepper control */}
                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-stone-500">
                    Changer l’état :
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { key: 'received', label: 'Reçue' },
                      { key: 'confirmed', label: 'Confirmée' },
                      { key: 'preparing', label: 'En cuisine' },
                      { key: order.type === 'pickup' ? 'ready_for_pickup' : 'in_delivery', label: order.type === 'pickup' ? 'Prête au retrait' : 'En livraison' },
                      { key: 'delivered', label: 'Livrée ✓' },
                      { key: 'cancelled', label: 'Annuler ✕' },
                    ].map((st) => (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => handleUpdateOrderStatus(order.id, st.key as OrderStatus)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                          order.orderStatus === st.key
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: MENU MANAGEMENT ---------------- */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Gestion des Plats & Disponibilités
              </h3>
              <p className="text-xs text-stone-500">
                Activez ou désactivez les plats en rupture de stock en temps réel.
              </p>
            </div>

            <button
              onClick={() => setShowAddDishModal(true)}
              className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un plat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((dish) => (
              <div
                key={dish.id}
                className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs flex gap-3 text-xs"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-stone-900 truncate">{dish.name}</h4>
                    <span className="font-extrabold text-orange-600 shrink-0">{formatFCFA(dish.price)}</span>
                  </div>
                  <p className="text-stone-500 text-[11px] line-clamp-1">{dish.description}</p>
                  
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-stone-400">
                      {dish.category}
                    </span>

                    <button
                      onClick={() => handleToggleDishStock(dish)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors ${
                        dish.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {dish.isAvailable ? 'En stock ✓' : 'Épuisé ✕'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Dish Modal */}
          {showAddDishModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg text-stone-900">
                    Ajouter un Nouveau Plat
                  </h3>
                  <button onClick={() => setShowAddDishModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
                </div>

                <form onSubmit={handleCreateDish} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Nom du plat</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Burger Spécial Ndakarou"
                      value={newDishName}
                      onChange={(e) => setNewDishName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Prix (FCFA)</label>
                      <input
                        type="number"
                        required
                        value={newDishPrice}
                        onChange={(e) => setNewDishPrice(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Catégorie</label>
                      <select
                        value={newDishCategory}
                        onChange={(e) => setNewDishCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="burgers">Burgers</option>
                        <option value="poulet">Poulet</option>
                        <option value="sandwichs">Sandwichs</option>
                        <option value="plats_du_jour">Plats du jour</option>
                        <option value="accompagnements">Accompagnements</option>
                        <option value="boissons">Boissons</option>
                        <option value="desserts">Desserts</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Ingrédients et préparation..."
                      value={newDishDesc}
                      onChange={(e) => setNewDishDesc(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">URL Photo</label>
                    <input
                      type="url"
                      value={newDishImage}
                      onChange={(e) => setNewDishImage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 font-mono text-[10px]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddDishModal(false)}
                      className="px-4 py-2 rounded-xl bg-stone-100 font-bold"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold"
                    >
                      Enregistrer le plat
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- TAB 3: CATERING QUOTES ---------------- */}
      {activeTab === 'catering' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-stone-900">
              Demandes de Devis Traiteur Reçues
            </h3>
            <span className="text-xs text-stone-500">
              {cateringQuotes.length} demandes au total
            </span>
          </div>

          <div className="space-y-3">
            {cateringQuotes.map((quote) => (
              <div
                key={quote.id}
                className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-stone-900">{quote.id}</span>
                    <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">
                      {quote.eventType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={quote.status}
                      onChange={(e) => handleUpdateQuoteStatus(quote.id, e.target.value)}
                      className="text-xs font-bold p-1.5 rounded-xl border border-stone-200 bg-stone-50"
                    >
                      <option value="pending">En attente</option>
                      <option value="in_review">En examen</option>
                      <option value="quote_sent">Devis envoyé</option>
                      <option value="confirmed">Confirmé ✓</option>
                      <option value="cancelled">Annulé</option>
                    </select>

                    <a
                      href={createWhatsAppUrl(
                        quote.clientWhatsapp || quote.clientPhone,
                        `Bonjour ${quote.clientName}, suite à votre demande de devis traiteur pour ${quote.guestCount} personnes le ${quote.eventDate}, nous avons le plaisir de vous transmettre notre proposition.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                      <span>Répondre sur WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="font-bold text-stone-900">{quote.clientName}</div>
                    <div className="text-stone-600">{quote.clientPhone}</div>
                    {quote.clientEmail && <div className="text-stone-400">{quote.clientEmail}</div>}
                  </div>

                  <div>
                    <div>Date : <strong>{quote.eventDate || 'Non fixée'}</strong></div>
                    <div>Lieu : <strong>{quote.eventLocation}</strong></div>
                    <div>Nombre d'invités : <strong>{quote.guestCount} personnes</strong></div>
                  </div>

                  <div className="md:text-right">
                    <div className="text-stone-500">Budget prévisionnel :</div>
                    <div className="font-heading font-black text-lg text-orange-600">
                      {formatFCFA(quote.budgetEstime)}
                    </div>
                  </div>
                </div>

                {quote.specialRequests && (
                  <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 italic">
                    Remarques : « {quote.specialRequests} »
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 4: DELIVERY ZONES ---------------- */}
      {activeTab === 'zones' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-stone-900">
              Zones de Livraison à Dakar & Tarifs
            </h3>
            <p className="text-xs text-stone-500">
              Modifiez les frais de livraison appliqués automatiquement dans le panier des clients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveryZones.map((zone) => (
              <div key={zone.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <div className="font-bold text-stone-900">{zone.name}</div>
                <div className="text-stone-500">Délai estimé : {zone.estimatedTime}</div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-semibold text-stone-700">Frais (FCFA) :</span>
                  <input
                    type="number"
                    step="100"
                    value={zone.fee}
                    onChange={(e) => handleUpdateZoneFee(zone.id, Number(e.target.value))}
                    className="w-24 text-right p-1.5 rounded-lg border border-stone-300 font-bold bg-white text-stone-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 5: PAYMENT DOCUMENTATION ---------------- */}
      {activeTab === 'docs' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-8 text-stone-800 text-xs sm:text-sm">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Guide Technique & Passerelles Mobiles
            </span>
            <h3 className="font-heading font-black text-2xl text-stone-900 mt-2">
              Comment Connecter Wave & Orange Money en Production
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Wave Integration */}
            <div className="p-6 rounded-3xl bg-[#1EA5FC]/5 border border-[#1EA5FC]/20 space-y-3">
              <div className="flex items-center gap-2 text-[#0A74DA] font-bold text-base">
                <span className="w-3 h-3 rounded-full bg-[#1EA5FC]" />
                <h4>Intégration Wave Business Checkout</h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                1. Créez un compte marchand sur <strong>Wave Business Sénégal</strong>.
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                2. Récupérez votre <code>WAVE_API_KEY</code> dans le portail développeur Wave.
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                3. Configurez l'URL de webhook vers votre serveur :
                <code className="block mt-1 p-2 bg-white rounded-lg border font-mono text-[11px] text-[#0A74DA]">
                  POST https://votre-domaine.sn/api/webhooks/wave
                </code>
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                4. Dès que le client valide le QR code, Wave envoie l'événement <code>checkout.session.completed</code> qui passe automatiquement la commande en <strong>Payé</strong> et <strong>Confirmée</strong>.
              </p>
            </div>

            {/* Orange Money Integration */}
            <div className="p-6 rounded-3xl bg-[#FF6600]/5 border border-[#FF6600]/20 space-y-3">
              <div className="flex items-center gap-2 text-[#FF6600] font-bold text-base">
                <span className="w-3 h-3 rounded-full bg-[#FF7900]" />
                <h4>Intégration Orange Money Web Payment</h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                1. Souscrivez à l'offre <strong>Orange Money Web Payment</strong> auprès de Sonatel Sénégal.
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                2. Obtenez votre <code>MERCHANT_KEY</code>, <code>AUTH_HEADER</code> et code marchand.
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                3. Configurez l'URL de notification retour (IPN) :
                <code className="block mt-1 p-2 bg-white rounded-lg border font-mono text-[11px] text-[#FF6600]">
                  POST https://votre-domaine.sn/api/webhooks/orange-money
                </code>
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                4. Après confirmation du code PIN par le client sur son mobile, le statut passe en <code>SUCCESS</code> et le bon est imprimable.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 6: QA TEST PLAN (1-CLICK TEST SCENARIOS) ---------------- */}
      {activeTab === 'tests' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Assurance Qualité & Tests
            </span>
            <h3 className="font-heading font-black text-2xl text-stone-900 mt-2">
              Plan de Test Interactif des Scénarios de Commande
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm">
              Exécutez en 1 clic l'ensemble des cas d'usage exigés pour vérifier le bon comportement de l'application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: 'cash_pickup',
                title: 'Test 1 : Retrait en espèces',
                desc: 'Crée une commande retrait au comptoir avec paiement en espèces (statut Reçue / En attente confirmation).',
                badge: 'Espèces',
                color: 'border-emerald-200 bg-emerald-50/50',
              },
              {
                id: 'om_delivery_success',
                title: 'Test 2 : Livraison Orange Money',
                desc: 'Simule une commande livraison Plateau avec validation instantanée par Webhook Orange Money.',
                badge: 'Orange Money',
                color: 'border-orange-200 bg-orange-50/50',
              },
              {
                id: 'wave_delivery_success',
                title: 'Test 3 : Commande Wave Réussie',
                desc: 'Simule une commande Almadies avec paiement Wave Checkout validé par Webhook.',
                badge: 'Wave',
                color: 'border-blue-200 bg-blue-50/50',
              },
              {
                id: 'payment_failed',
                title: 'Test 4 : Paiement Échoué',
                desc: 'Génère une tentative de paiement rejetée (solde insuffisant ou expiration) pour tester les alertes.',
                badge: 'Échec',
                color: 'border-amber-200 bg-amber-50/50',
              },
              {
                id: 'order_cancelled',
                title: 'Test 5 : Commande Annulée',
                desc: 'Crée une commande annulée avec mise à jour immédiate du suivi client.',
                badge: 'Annulée',
                color: 'border-red-200 bg-red-50/50',
              },
            ].map((test) => (
              <div
                key={test.id}
                className={`p-5 rounded-3xl border ${test.color} space-y-3 flex flex-col justify-between`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-sm text-stone-900">
                      {test.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white shadow-2xs">
                      {test.badge}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {test.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleRunTestScenario(test.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Exécuter le scénario</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
