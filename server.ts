import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_CATERING_PACKAGES,
  DELIVERY_ZONES,
  PROMO_CODES,
  SAMPLE_ORDERS,
  RESTAURANT_INFO
} from './src/data/initialData';
import { Order, MenuItem, CateringQuote, DeliveryZone, OrderStatus, PaymentStatus } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Dev server must always run on port 3000 in AI Studio
const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory data store with initial copies
let menuItems: MenuItem[] = [...INITIAL_MENU_ITEMS];
let cateringPackages = [...INITIAL_CATERING_PACKAGES];
let deliveryZones: DeliveryZone[] = [...DELIVERY_ZONES];
let orders: Order[] = [...SAMPLE_ORDERS];
let cateringQuotes: CateringQuote[] = [
  {
    id: 'DEV-2026-0042',
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    clientName: 'Fatou Bintou Ndiaye',
    clientPhone: '+221 77 987 65 43',
    clientEmail: 'fatou.ndiaye@teranga.sn',
    eventType: 'bapteme',
    eventDate: '2026-11-28',
    eventLocation: 'Sacré-Cœur 3, Villa 12, Dakar',
    guestCount: 50,
    selectedPackageId: 'pack_teranga',
    serviceType: 'buffet',
    budgetEstime: 195000,
    specialRequests: 'Prévoir un plat sans fruits de mer pour 5 personnes svp.',
    status: 'in_review',
  },
  {
    id: 'DEV-2026-0043',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    clientName: 'Orange Sénégal - Direction Marketing',
    clientPhone: '+221 78 123 45 67',
    clientEmail: 'events@orange.sn',
    eventType: 'seminaire_entreprise',
    eventDate: '2026-12-05',
    eventLocation: 'Immeuble Orange R+5, Dakar Plateau',
    guestCount: 40,
    selectedPackageId: 'pack_b2b',
    serviceType: 'livraison_uniquement',
    budgetEstime: 160000,
    specialRequests: 'Livraison de plateaux scellés à 12h précises avec facturation NINEA.',
    status: 'quote_sent',
  }
];

let orderCounter = 104;

// Helper to generate order number: NS-2026-000123
function generateOrderId(): string {
  const year = new Date().getFullYear();
  const numStr = String(orderCounter++).padStart(6, '0');
  return `NS-${year}-${numStr}`;
}

// ---------------- API ROUTES ----------------

// 1. Menu items
app.get('/api/menu', (req: Request, res: Response) => {
  res.json({ success: true, data: menuItems });
});

app.post('/api/menu', (req: Request, res: Response) => {
  const newItem: MenuItem = {
    ...req.body,
    id: 'm_' + Date.now(),
    isAvailable: req.body.isAvailable ?? true,
    preparationTimeMinutes: req.body.preparationTimeMinutes || 15
  };
  menuItems.unshift(newItem);
  res.status(201).json({ success: true, data: newItem });
});

app.put('/api/menu/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = menuItems.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Plat introuvable' });
  }
  menuItems[index] = { ...menuItems[index], ...req.body };
  res.json({ success: true, data: menuItems[index] });
});

app.delete('/api/menu/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  menuItems = menuItems.filter(m => m.id !== id);
  res.json({ success: true, message: 'Plat supprimé' });
});

// 2. Catering packages
app.get('/api/catering-packages', (req: Request, res: Response) => {
  res.json({ success: true, data: cateringPackages });
});

// 3. Delivery zones
app.get('/api/delivery-zones', (req: Request, res: Response) => {
  res.json({ success: true, data: deliveryZones });
});

app.put('/api/delivery-zones', (req: Request, res: Response) => {
  if (Array.isArray(req.body)) {
    deliveryZones = req.body;
    return res.json({ success: true, data: deliveryZones });
  }
  res.status(400).json({ success: false, error: 'Données invalides' });
});

// 4. Promo codes check
app.post('/api/check-promo', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'Code promo requis' });
  }

  const promo = PROMO_CODES.find(p => p.code.toUpperCase() === code.trim().toUpperCase() && p.active);
  if (!promo) {
    return res.status(404).json({ success: false, error: 'Code promo invalide ou expiré' });
  }

  if (subtotal < promo.minOrder) {
    return res.status(400).json({
      success: false,
      error: `Commande minimum de ${promo.minOrder.toLocaleString('fr-FR')} FCFA requise pour ce code.`
    });
  }

  const discount = promo.discountType === 'percent'
    ? Math.round((subtotal * promo.value) / 100)
    : promo.value;

  res.json({
    success: true,
    data: {
      code: promo.code,
      discount,
      description: promo.description
    }
  });
});

// 5. Orders API
app.get('/api/orders', (req: Request, res: Response) => {
  res.json({ success: true, data: orders });
});

app.get('/api/orders/:identifier', (req: Request, res: Response) => {
  const { identifier } = req.params;
  const cleanId = identifier.trim().toLowerCase();
  
  // Search by Order ID or phone number (stripping spaces and dashes)
  const order = orders.find(o => 
    o.id.toLowerCase() === cleanId ||
    o.customerPhone.replace(/\s+/g, '').includes(cleanId.replace(/\s+/g, ''))
  );

  if (!order) {
    return res.status(404).json({ success: false, error: 'Commande introuvable avec cette référence ou ce numéro.' });
  }

  res.json({ success: true, data: order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const {
    customerName,
    customerPhone,
    customerWhatsapp,
    customerEmail,
    type,
    deliveryAddress,
    deliveryZoneId,
    deliveryZoneName,
    deliveryFee = 0,
    landmark,
    items,
    subtotal,
    discount = 0,
    discountCode,
    total,
    paymentMethod,
    changeRequestedFor,
    notes
  } = req.body;

  if (!customerName || !customerPhone || !items || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Nom, téléphone et articles requis pour valider la commande.' });
  }

  const newOrderId = generateOrderId();
  
  // Determine initial payment and order statuses
  let paymentStatus: PaymentStatus = 'pending';
  let orderStatus: OrderStatus = 'received';

  if (paymentMethod === 'cash') {
    paymentStatus = 'pending'; // Pay at delivery/pickup
    orderStatus = 'received'; // Awaiting staff telephone confirmation
  } else if (paymentMethod === 'wave' || paymentMethod === 'orange_money') {
    // For mobile money, the client initiates payment.
    paymentStatus = 'pending';
    orderStatus = 'received';
  }

  const newOrder: Order = {
    id: newOrderId,
    createdAt: new Date().toISOString(),
    customerName,
    customerPhone,
    customerWhatsapp: customerWhatsapp || customerPhone,
    customerEmail,
    type,
    deliveryAddress,
    deliveryZoneId,
    deliveryZoneName,
    deliveryFee: Number(deliveryFee),
    landmark,
    pickupEstimatedTime: type === 'pickup' ? '20 - 25 min' : undefined,
    items,
    subtotal: Number(subtotal),
    discount: Number(discount),
    discountCode,
    total: Number(total),
    paymentMethod,
    paymentStatus,
    orderStatus,
    changeRequestedFor: changeRequestedFor ? Number(changeRequestedFor) : undefined,
    notes,
    paymentReference: `${paymentMethod.toUpperCase()}-REF-${Math.floor(100000 + Math.random() * 900000)}`
  };

  orders.unshift(newOrder);

  res.status(201).json({
    success: true,
    data: newOrder,
    message: 'Commande enregistrée avec succès.'
  });
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { orderStatus, paymentStatus } = req.body;

  const orderIndex = orders.findIndex(o => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, error: 'Commande introuvable' });
  }

  if (orderStatus) {
    orders[orderIndex].orderStatus = orderStatus as OrderStatus;
  }
  if (paymentStatus) {
    orders[orderIndex].paymentStatus = paymentStatus as PaymentStatus;
  }

  res.json({ success: true, data: orders[orderIndex] });
});

// 6. Catering quotes API
app.get('/api/catering-quotes', (req: Request, res: Response) => {
  res.json({ success: true, data: cateringQuotes });
});

app.post('/api/catering-quotes', (req: Request, res: Response) => {
  const {
    clientName,
    clientPhone,
    clientWhatsapp,
    clientEmail,
    eventType,
    eventDate,
    eventLocation,
    guestCount,
    selectedPackageId,
    serviceType,
    budgetEstime,
    specialRequests
  } = req.body;

  if (!clientName || !clientPhone || !eventType || !guestCount) {
    return res.status(400).json({ success: false, error: 'Informations obligatoires manquantes.' });
  }

  const quoteId = `DEV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
  const newQuote: CateringQuote = {
    id: quoteId,
    createdAt: new Date().toISOString(),
    clientName,
    clientPhone,
    clientWhatsapp: clientWhatsapp || clientPhone,
    clientEmail,
    eventType,
    eventDate,
    eventLocation,
    guestCount: Number(guestCount),
    selectedPackageId,
    serviceType: serviceType || 'buffet',
    budgetEstime: Number(budgetEstime) || 0,
    specialRequests,
    status: 'pending'
  };

  cateringQuotes.unshift(newQuote);

  res.status(201).json({
    success: true,
    data: newQuote,
    message: 'Demande de devis traiteur enregistrée avec succès. Notre cheffe vous contactera sous 24h.'
  });
});

app.put('/api/catering-quotes/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, internalNotes } = req.body;
  const quote = cateringQuotes.find(q => q.id === id);
  if (!quote) {
    return res.status(404).json({ success: false, error: 'Devis introuvable' });
  }
  if (status) quote.status = status;
  if (internalNotes !== undefined) quote.internalNotes = internalNotes;
  res.json({ success: true, data: quote });
});

// 7. Payment Webhooks
// Wave Webhook Endpoint
app.post('/api/webhooks/wave', (req: Request, res: Response) => {
  const { event, data } = req.body;
  // Format standard Wave webhook: { type: "checkout.session.completed", data: { client_reference: "NS-2026-000123", amount: 10500, id: "cos-..." } }
  const orderId = data?.client_reference || req.body.orderId;
  const status = req.body.status || 'succeeded';

  if (!orderId) {
    return res.status(400).json({ success: false, error: 'client_reference requis' });
  }

  const order = orders.find(o => o.id === orderId);
  if (order) {
    if (status === 'succeeded' || event === 'checkout.session.completed') {
      order.paymentStatus = 'paid';
      if (order.orderStatus === 'received') {
        order.orderStatus = 'confirmed';
      }
      order.paymentReference = data?.id || `WAVE-WH-${Date.now()}`;
    } else if (status === 'failed') {
      order.paymentStatus = 'failed';
    }
    return res.json({ success: true, message: `Webhook Wave traité pour la commande ${orderId}`, order });
  }

  res.status(404).json({ success: false, error: `Commande ${orderId} introuvable` });
});

// Orange Money Webhook Endpoint
app.post('/api/webhooks/orange-money', (req: Request, res: Response) => {
  const { order_id, notif_token, status } = req.body;
  const orderId = order_id || req.body.orderId;

  if (!orderId) {
    return res.status(400).json({ success: false, error: 'order_id requis' });
  }

  const order = orders.find(o => o.id === orderId);
  if (order) {
    if (status === 'SUCCESS' || status === 'PAID') {
      order.paymentStatus = 'paid';
      if (order.orderStatus === 'received') {
        order.orderStatus = 'confirmed';
      }
      order.paymentReference = notif_token || `OM-TX-${Date.now()}`;
    } else if (status === 'FAILED') {
      order.paymentStatus = 'failed';
    }
    return res.json({ success: true, message: `Webhook Orange Money traité pour ${orderId}`, order });
  }

  res.status(404).json({ success: false, error: `Commande ${orderId} introuvable` });
});

// 8. Admin Dashboard Stats
app.get('/api/stats', (req: Request, res: Response) => {
  const todayRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'received' || o.orderStatus === 'confirmed' || o.orderStatus === 'preparing').length;
  const activeDeliveriesCount = orders.filter(o => o.orderStatus === 'in_delivery').length;
  const cateringQuotesPending = cateringQuotes.filter(q => q.status === 'pending' || q.status === 'in_review').length;

  res.json({
    success: true,
    data: {
      todayRevenue,
      todayOrdersCount: orders.length,
      pendingOrdersCount,
      activeDeliveriesCount,
      cateringQuotesPending,
      restaurantInfo: RESTAURANT_INFO
    }
  });
});

// 9. Interactive QA Test Plan Scenario Trigger
app.post('/api/test-scenario', (req: Request, res: Response) => {
  const { scenario } = req.body;
  const testOrderId = `TEST-${Date.now().toString().slice(-4)}`;

  switch (scenario) {
    case 'cash_pickup': {
      const order: Order = {
        id: `NS-2026-${testOrderId}`,
        createdAt: new Date().toISOString(),
        customerName: 'Testeur Retrait Espèces',
        customerPhone: '+221 77 000 00 01',
        customerWhatsapp: '+221 77 000 00 01',
        type: 'pickup',
        pickupEstimatedTime: '20 min',
        deliveryFee: 0,
        items: [
          {
            cartItemId: 't1',
            menuItem: menuItems[0],
            selectedSauces: [],
            selectedExtras: [],
            quantity: 1,
            unitPrice: menuItems[0].price,
            totalPrice: menuItems[0].price
          }
        ],
        subtotal: menuItems[0].price,
        discount: 0,
        total: menuItems[0].price,
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        orderStatus: 'received',
        notes: 'Test QA : Commande Retrait au restaurant payée en espèces au guichet'
      };
      orders.unshift(order);
      return res.json({ success: true, message: 'Scénario Retrait Espèces exécuté avec succès', order });
    }

    case 'om_delivery_success': {
      const order: Order = {
        id: `NS-2026-${testOrderId}`,
        createdAt: new Date().toISOString(),
        customerName: 'Testeur Livraison Orange Money',
        customerPhone: '+221 77 111 22 33',
        customerWhatsapp: '+221 77 111 22 33',
        type: 'delivery',
        deliveryAddress: 'Plateau, Rue Carnot x Jean Jaurès',
        deliveryZoneId: 'z2',
        deliveryZoneName: 'Plateau / Médina',
        deliveryFee: 1500,
        landmark: 'Immeuble face pharmacie',
        items: [
          {
            cartItemId: 't2',
            menuItem: menuItems[3], // Poulet braisé
            selectedSauces: [],
            selectedExtras: [],
            quantity: 1,
            unitPrice: menuItems[3].price,
            totalPrice: menuItems[3].price
          }
        ],
        subtotal: menuItems[3].price,
        discount: 0,
        total: menuItems[3].price + 1500,
        paymentMethod: 'orange_money',
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        paymentReference: `OM-SIM-${Date.now()}`,
        notes: 'Test QA : Livraison Orange Money confirmée par Webhook OM'
      };
      orders.unshift(order);
      return res.json({ success: true, message: 'Scénario Orange Money Livraison payée exécuté', order });
    }

    case 'wave_delivery_success': {
      const order: Order = {
        id: `NS-2026-${testOrderId}`,
        createdAt: new Date().toISOString(),
        customerName: 'Testeur Commande Wave',
        customerPhone: '+221 76 999 88 77',
        customerWhatsapp: '+221 76 999 88 77',
        type: 'delivery',
        deliveryAddress: 'Almadies, après rond-point Nautilus',
        deliveryZoneId: 'z5',
        deliveryZoneName: 'Almadies / Ngor / Virage',
        deliveryFee: 2000,
        landmark: 'Résidence les Palmiers',
        items: [
          {
            cartItemId: 't3',
            menuItem: menuItems[20], // Formule combo
            selectedSauces: [],
            selectedExtras: [],
            quantity: 2,
            unitPrice: menuItems[20].price,
            totalPrice: menuItems[20].price * 2
          }
        ],
        subtotal: menuItems[20].price * 2,
        discount: 500,
        discountCode: 'BIENVENUE500',
        total: (menuItems[20].price * 2) - 500 + 2000,
        paymentMethod: 'wave',
        paymentStatus: 'paid',
        orderStatus: 'preparing',
        paymentReference: `WAVE-SIM-${Date.now()}`,
        notes: 'Test QA : Commande Wave validée via QR Code Wave'
      };
      orders.unshift(order);
      return res.json({ success: true, message: 'Scénario Wave réussi exécuté', order });
    }

    case 'payment_failed': {
      const order: Order = {
        id: `NS-2026-${testOrderId}`,
        createdAt: new Date().toISOString(),
        customerName: 'Testeur Échec Paiement',
        customerPhone: '+221 78 000 99 88',
        type: 'delivery',
        deliveryAddress: 'Point E, Rue 3',
        deliveryFee: 1000,
        items: [
          {
            cartItemId: 't4',
            menuItem: menuItems[1],
            selectedSauces: [],
            selectedExtras: [],
            quantity: 1,
            unitPrice: menuItems[1].price,
            totalPrice: menuItems[1].price
          }
        ],
        subtotal: menuItems[1].price,
        discount: 0,
        total: menuItems[1].price + 1000,
        paymentMethod: 'wave',
        paymentStatus: 'failed',
        orderStatus: 'received',
        notes: 'Test QA : Échec de validation du paiement solde insuffisant ou rejet'
      };
      orders.unshift(order);
      return res.json({ success: true, message: 'Scénario Paiement échoué généré', order });
    }

    case 'order_cancelled': {
      const order: Order = {
        id: `NS-2026-${testOrderId}`,
        createdAt: new Date().toISOString(),
        customerName: 'Testeur Commande Annulée',
        customerPhone: '+221 77 333 44 55',
        type: 'pickup',
        deliveryFee: 0,
        items: [
          {
            cartItemId: 't5',
            menuItem: menuItems[6],
            selectedSauces: [],
            selectedExtras: [],
            quantity: 1,
            unitPrice: menuItems[6].price,
            totalPrice: menuItems[6].price
          }
        ],
        subtotal: menuItems[6].price,
        discount: 0,
        total: menuItems[6].price,
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        orderStatus: 'cancelled',
        notes: 'Test QA : Commande annulée par le client'
      };
      orders.unshift(order);
      return res.json({ success: true, message: 'Scénario Commande annulée généré', order });
    }

    default:
      return res.status(400).json({ success: false, error: 'Scénario inconnu' });
  }
});

// Vite integration
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Néné Services Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
