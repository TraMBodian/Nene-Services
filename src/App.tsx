/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { CartDrawer } from './components/CartDrawer';
import { ItemCustomizerModal } from './components/ItemCustomizerModal';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';

import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CateringPage } from './pages/CateringPage';
import { CartPage } from './pages/CartPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

import { MenuItem, CateringPackage, Order } from './types';
import { INITIAL_MENU_ITEMS, INITIAL_CATERING_PACKAGES } from './data/initialData';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('accueil');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [cateringPackages, setCateringPackages] = useState<CateringPackage[]>(INITIAL_CATERING_PACKAGES);

  // Modals state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [activePaymentOrder, setActivePaymentOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);

  // Fetch live menu items on mount
  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setMenuItems(data.data);
        }
      })
      .catch(() => {
        // Fallback to initial items
      });

    fetch('/api/catering-packages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCateringPackages(data.data);
        }
      })
      .catch(() => {
        // Fallback to initial packages
      });
  }, []);

  const handleOrderCreated = (order: Order) => {
    // Open payment modal
    setActivePaymentOrder(order);
  };

  const handlePaymentSuccess = (updatedOrder: Order) => {
    setActivePaymentOrder(null);
    setReceiptOrder(updatedOrder);
  };

  const handleTrackOrderFromReceipt = (orderId: string) => {
    setTrackingOrderId(orderId);
    setCurrentTab('suivi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={navigateToTab} />

      {/* Main Pages */}
      <main className="flex-1">
        {currentTab === 'accueil' && (
          <HomePage
            popularItems={menuItems.filter(m => m.badge === 'populaire' || m.badge === 'nouveau')}
            onSelectItem={(item) => setCustomizingItem(item)}
            onNavigateToMenu={() => navigateToTab('menu')}
            onNavigateToCatering={() => navigateToTab('traiteur')}
            onNavigateToTracking={() => navigateToTab('suivi')}
          />
        )}

        {currentTab === 'menu' && (
          <MenuPage
            menuItems={menuItems}
            onSelectItem={(item) => setCustomizingItem(item)}
          />
        )}

        {currentTab === 'traiteur' && (
          <CateringPage packages={cateringPackages} />
        )}

        {currentTab === 'panier' && (
          <CartPage
            onOrderCreated={handleOrderCreated}
            onNavigateToMenu={() => navigateToTab('menu')}
          />
        )}

        {currentTab === 'suivi' && (
          <OrderTrackingPage
            initialOrderId={trackingOrderId}
            onOpenReceipt={(order) => setReceiptOrder(order)}
            onNavigateToMenu={() => navigateToTab('menu')}
          />
        )}

        {currentTab === 'a-propos' && (
          <AboutPage
            onNavigateToMenu={() => navigateToTab('menu')}
            onNavigateToCatering={() => navigateToTab('traiteur')}
          />
        )}

        {currentTab === 'contact' && <ContactPage />}

        {currentTab === 'admin' && (
          <AdminDashboard onOpenReceipt={(order) => setReceiptOrder(order)} />
        )}
      </main>

      {/* Footer */}
      <Footer setCurrentTab={navigateToTab} />

      {/* Floating Actions (WhatsApp & Mobile/Tablet Bottom Navigation) */}
      <FloatingActions currentTab={currentTab} onNavigate={navigateToTab} />

      {/* Slide-over Quick Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => navigateToTab('panier')}
        onNavigateToMenu={() => navigateToTab('menu')}
      />

      {/* Item Customizer Modal (Size, Sauces, Spiciness, Extras) */}
      <ItemCustomizerModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
      />

      {/* Payment Modal (Wave, Orange Money, Cash) */}
      {activePaymentOrder && (
        <PaymentModal
          order={activePaymentOrder}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => {
            setActivePaymentOrder(null);
            navigateToTab('suivi');
          }}
        />
      )}

      {/* Receipt Modal (Printable Ticket & WhatsApp share) */}
      <ReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
        onTrackOrder={handleTrackOrderFromReceipt}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
