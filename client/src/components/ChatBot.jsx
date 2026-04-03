import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader } from 'lucide-react';
import api from '../services/api';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your HealthVault AI assistant 🏥\nAsk me anything about your medical records, medications, or health history." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { question });
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't process that. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 300,
          width: 54, height: 54, borderRadius: '50%',
          background: 'linear-gradient(135deg, #0891b2, #0e7490)',
          border: 'none', cursor: 'pointer', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(8,145,178,0.5)',
        }}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', bottom: '5rem', right: '1.5rem', zIndex: 300,
              width: 340, height: 460, display: 'flex', flexDirection: 'column',
              background: '#0f172a', border: '1px solid rgba(51,65,85,0.7)',
              borderRadius: 18, overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '0.875rem 1rem', borderBottom: '1px solid rgba(51,65,85,0.5)',
              background: 'linear-gradient(135deg, rgba(8,145,178,0.15), rgba(14,116,144,0.1))',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0891b2, #818cf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={16} color="white" />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>AI Health Assistant</div>
                <div style={{ fontSize: '0.7rem', color: '#0891b2' }}>● Online</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }} className="no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.role === 'ai' && (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#0891b2,#818cf8)', display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                        <Bot size={12} color="white" />
                      </div>
                      <div className="chat-bubble-ai" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <div className="chat-bubble-user">{msg.text}</div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#0891b2,#818cf8)', display:'flex',alignItems:'center',justifyContent:'center' }}>
                    <Bot size={12} color="white" />
                  </div>
                  <div className="chat-bubble-ai" style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background:'#0891b2', animation: 'bounce 0.6s infinite' }} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background:'#0891b2', animation: 'bounce 0.6s 0.1s infinite' }} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background:'#0891b2', animation: 'bounce 0.6s 0.2s infinite' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(51,65,85,0.4)', display: 'flex', gap: '0.5rem' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about your records..."
                className="input-field"
                style={{ flex: 1, padding: '0.55rem 0.75rem', fontSize: '0.82rem' }}
              />
              <button onClick={sendMessage} disabled={loading}
                style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: loading ? 'rgba(8,145,178,0.3)' : 'linear-gradient(135deg,#0891b2,#0e7490)',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                }}>
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
    </>
  );
}
