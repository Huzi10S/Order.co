import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CatalogView } from './components/CatalogView';
import { ApprovalsView } from './components/ApprovalsView';
import { PurchaseOrdersView } from './components/PurchaseOrdersView';
import { InvoicesView } from './components/InvoicesView';
import { VirtualCardsView } from './components/VirtualCardsView';
import { AnalyticsView } from './components/AnalyticsView';
import { AIAssistant } from './components/AIAssistant';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cart, setCart] = useState([]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveTab} onOpenCart={() => setActiveTab('catalog')} />;
      case 'catalog':
        return <CatalogView cart={cart} setCart={setCart} onNavigate={setActiveTab} />;
      case 'approvals':
        return <ApprovalsView onNavigate={setActiveTab} />;
      case 'pos':
        return <PurchaseOrdersView />;
      case 'invoices':
        return <InvoicesView />;
      case 'cards':
        return <VirtualCardsView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DashboardView onNavigate={setActiveTab} onOpenCart={() => setActiveTab('catalog')} />;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Application Area */}
      <div className="main-wrapper">
        <Header 
          activeTab={activeTab} 
          cartCount={cart.reduce((a, b) => a + b.qty, 0)} 
          onOpenCart={() => setActiveTab('catalog')} 
        />
        
        <main className="content-area">
          {renderActiveView()}
        </main>
      </div>

      {/* Order.co Floating AI Assistant */}
      <AIAssistant onNavigate={setActiveTab} />
    </div>
  );
}

export default App;
