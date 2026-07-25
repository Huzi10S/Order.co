import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  ShoppingBag,
  CreditCard,
  Package
} from 'lucide-react';
import { MOCK_CATALOG, MOCK_DEPARTMENTS, MOCK_PURCHASE_ORDERS } from '../data/mockData';

export function AIAssistant({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'bot',
      text: "Hello Alex! I am Order.co AI. I monitor vendor pricing, prevent duplicate invoices, and manage procurement flows. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');

  const promptChips = [
    "Find cheapest 27\" monitors",
    "Show Engineering remaining budget",
    "Check status of PO-9405",
    "How much saved YTD?"
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Generate intelligent AI Response based on intent
    setTimeout(() => {
      let botResponseText = "";
      const lower = query.toLowerCase();

      if (lower.includes('monitor') || lower.includes('cheapest') || lower.includes('dell')) {
        botResponseText = "I found the Dell UltraSharp 27\" 4K Hub Monitor at CDW for $549.99 ($80 below list price). I can add 4 units directly to your Engineering requisition!";
      } else if (lower.includes('budget') || lower.includes('engineering') || lower.includes('remaining')) {
        botResponseText = "Engineering & IT has spent $62,400 of its $85,000 monthly allocation. You have $22,600 (26.5%) remaining for Q3 purchases.";
      } else if (lower.includes('po-9405') || lower.includes('tracking') || lower.includes('po')) {
        botResponseText = "PO-9405 (CDW Direct, $4,399.92) is currently In Transit via UPS Ground (Tracking: 1Z9999999999999999). Estimated delivery is Jul 24.";
      } else if (lower.includes('saved') || lower.includes('savings')) {
        botResponseText = "Your team has saved $34,850 YTD across 42 vendors through automated price matching and contract tiering!";
      } else {
        botResponseText = `I analyzed "${query}". Would you like me to open the Central Catalog or check the Approval Queue?`;
      }

      const botMsg = { id: `b-${Date.now()}`, sender: 'bot', text: botResponseText };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div style={styles.floatingContainer}>
      {/* Trigger Button */}
      {!isOpen && (
        <button style={styles.triggerBtn} onClick={() => setIsOpen(true)}>
          <Sparkles size={20} color="#fff" />
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Order.co AI</span>
          <span style={styles.onlineDot} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.chatHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={styles.botIconBadge}>
                <Bot size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>Order.co AI Procurement Agent</div>
                <div style={{ fontSize: '0.7rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="pulse-dot" style={{ width: 6, height: 6 }} /> Active Sourcing System
                </div>
              </div>
            </div>
            <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
          </div>

          {/* Messages Feed */}
          <div style={styles.messagesFeed}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                style={{
                  ...styles.msgBubble,
                  ...(msg.sender === 'user' ? styles.userBubble : styles.botBubble)
                }}
              >
                {msg.sender === 'bot' && (
                  <Bot size={14} style={{ minWidth: 14, marginTop: 3, color: 'var(--primary-indigo)' }} />
                )}
                <div style={{ flex: 1 }}>{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Prompt Chips */}
          <div style={styles.chipsRow}>
            {promptChips.map(chip => (
              <button 
                key={chip} 
                style={styles.chipBtn}
                onClick={() => handleSend(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={styles.inputRow}
          >
            <input 
              type="text"
              placeholder="Ask Order.co AI about products, budgets, or POs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.chatInput}
            />
            <button type="submit" style={styles.sendBtn}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  floatingContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 90
  },
  triggerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    background: 'linear-gradient(135deg, var(--primary-indigo) 0%, #4338ca 100%)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '0.75rem 1.25rem',
    borderRadius: 'var(--radius-full)',
    boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
    cursor: 'pointer',
    transition: 'all 0.25s ease'
  },
  onlineDot: {
    width: '8px',
    height: '8px',
    background: '#34d399',
    borderRadius: '50%',
    boxShadow: '0 0 8px #34d399'
  },
  chatWindow: {
    width: '380px',
    height: '520px',
    background: 'var(--bg-card-solid)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  chatHeader: {
    padding: '0.85rem 1.1rem',
    background: 'rgba(12, 18, 30, 0.95)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  botIconBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'var(--primary-indigo)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '1.4rem',
    cursor: 'pointer'
  },
  messagesFeed: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
  },
  msgBubble: {
    padding: '0.7rem 0.9rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.82rem',
    lineHeight: 1.45,
    maxWidth: '88%',
    display: 'flex',
    gap: '0.5rem'
  },
  botBubble: {
    background: 'var(--bg-input)',
    color: 'var(--text-main)',
    border: '1px solid var(--border-color)',
    alignSelf: 'flex-start'
  },
  userBubble: {
    background: 'var(--primary-indigo)',
    color: '#fff',
    alignSelf: 'flex-end'
  },
  chipsRow: {
    display: 'flex',
    gap: '0.35rem',
    overflowX: 'auto',
    padding: '0.5rem 1rem',
    borderTop: '1px solid var(--border-color)',
    background: 'rgba(255, 255, 255, 0.01)'
  },
  chipBtn: {
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-muted)',
    fontSize: '0.72rem',
    padding: '3px 8px',
    borderRadius: 'var(--radius-full)',
    whiteSpace: 'nowrap',
    cursor: 'pointer'
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderTop: '1px solid var(--border-color)',
    gap: '0.5rem'
  },
  chatInput: {
    flex: 1,
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.55rem 0.85rem',
    color: '#fff',
    fontSize: '0.82rem',
    outline: 'none'
  },
  sendBtn: {
    background: 'var(--primary-indigo)',
    border: 'none',
    color: '#fff',
    width: '34px',
    height: '34px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  }
};
