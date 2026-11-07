export type DishCategory =
  | 'tous'
  | 'burgers'
  | 'poulet'
  | 'sandwichs'
  | 'plats_du_jour'
  | 'accompagnements'
  | 'boissons'
  | 'desserts'
  | 'formules'
  | 'enfants';

export interface SauceOption {
  id: string;
  name: string;
  price: number;
}

export interface SizeOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export type SpicinessLevel = 'sans_piment' | 'doux' | 'pimente' | 'tres_pimente';

export type DishBadge = 'populaire' | 'nouveau' | 'epuise' | 'weekend' | 'promo' | null;

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in FCFA
  category: DishCategory;
  image: string;
  badge?: DishBadge;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  allergens?: string[];
  sizes?: SizeOption[];
  availableSauces?: SauceOption[];
  availableExtras?: ExtraOption[];
  allowsSpiciness?: boolean;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  selectedSize?: SizeOption;
  selectedSauces: SauceOption[];
  spiciness?: SpicinessLevel;
  selectedExtras: ExtraOption[];
  specialInstructions?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderType = 'delivery' | 'pickup';

export type PaymentMethod = 'wave' | 'orange_money' | 'cash';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type OrderStatus =
  | 'received'       // Reçue
  | 'confirmed'      // Confirmée
  | 'preparing'      // En préparation
  | 'in_delivery'    // En livraison
  | 'ready_for_pickup' // Prête au retrait
  | 'delivered'      // Livrée
  | 'cancelled';     // Annulée

export interface Order {
  id: string; // Format: NS-2026-000123
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string;
  customerEmail?: string;
  type: OrderType;
  deliveryAddress?: string;
  deliveryZoneId?: string;
  deliveryZoneName?: string;
  deliveryFee: number;
  landmark?: string; // Point de repère
  pickupEstimatedTime?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  paymentReference?: string;
  changeRequestedFor?: number; // Pour paiement en espèces
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number; // in FCFA
  estimatedTime: string;
  popular?: boolean;
}

export interface CateringPackage {
  id: string;
  name: string;
  tagline: string;
  guestCount: number;
  priceFCFA: number;
  description: string;
  menuItems: string[];
  includedServices: string[];
  image: string;
  popular?: boolean;
}

export type CateringServiceType = 'buffet' | 'service_a_table' | 'cocktail_dinatoire' | 'livraison_uniquement';

export interface CateringQuote {
  id: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientWhatsapp?: string;
  clientEmail?: string;
  eventType: 'mariage' | 'bapteme' | 'anniversaire' | 'seminaire_entreprise' | 'reception_privee' | 'autre';
  eventDate: string;
  eventLocation: string;
  guestCount: number;
  selectedPackageId?: string;
  serviceType: CateringServiceType;
  budgetEstime: number;
  specialRequests?: string;
  status: 'pending' | 'in_review' | 'quote_sent' | 'confirmed' | 'cancelled';
  internalNotes?: string;
}

export interface PromoCode {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  description: string;
  active: boolean;
}

export interface AdminStats {
  todayRevenue: number;
  todayOrdersCount: number;
  pendingOrdersCount: number;
  activeDeliveriesCount: number;
  cateringQuotesPending: number;
  popularDishes: { name: string; count: number }[];
}
