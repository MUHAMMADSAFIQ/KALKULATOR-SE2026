import React, { useState, useEffect, useRef } from 'react';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya Asisten AI Sensus BPS. Ada yang bisa saya bantu terkait KBLI, kelogisan data, atau konsep survei?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Load API Key from local storage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    if (!isOpen && !apiKey) {
      setShowApiKeyModal(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const saveApiKey = (e) => {
    e.preventDefault();
    const key = e.target.apiKey.value.trim();
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      setApiKey(key);
      setShowApiKeyModal(false);
      setIsOpen(true);
    }
  };

  const clearApiKey = () => {
    if (window.confirm("Hapus API Key dari perangkat ini?")) {
      localStorage.removeItem('gemini_api_key');
      setApiKey('');
      setIsOpen(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !apiKey || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to UI
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Map messages to Gemini format
      const geminiContents = newMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const payload = {
        systemInstruction: {
          parts: [{ text: 'Anda adalah asisten pintar untuk membantu petugas sensus ekonomi BPS 2026. Jawab dengan ringkas, ramah, dan profesional. Fokus membantu klasifikasi KBLI dan mengevaluasi kewajaran data/pengeluaran.' }]
        },
        contents: geminiContents
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (response.ok && data.candidates && data.candidates.length > 0) {
        const reply = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      } else {
        throw new Error(data.error?.message || 'Gagal merespons (Cek API Key Anda)');
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        className="chat-fab no-print"
        onClick={toggleChat}
        aria-label="Chat Assistant"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="modal-overlay no-print">
          <div className="glass-card modal-content" style={{ width: '90%', maxWidth: '400px', padding: '1.5rem', background: 'var(--bg-primary)' }}>
            <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>🔑 Setup Gemini API Key</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Untuk menggunakan Asisten AI, masukkan API Key Gemini Anda. Key akan disimpan dengan aman di <i>Local Storage</i> browser Anda.
            </p>
            <form onSubmit={saveApiKey}>
              <div className="input-group">
                <input 
                  name="apiKey"
                  type="password"
                  className="input-field" 
                  placeholder="AIzaSy..."
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 1, background: 'var(--accent-primary)', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>Simpan</button>
                <button type="button" onClick={() => setShowApiKeyModal(false)} style={{ flex: 1, background: 'transparent', color: 'var(--text-secondary)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && apiKey && (
        <div className="chat-window glass-card no-print">
          <div className="chat-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>🤖 AI Assistant Sensus</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Online (Gemini 1.5 Flash)</span>
            </div>
            <button onClick={clearApiKey} title="Hapus API Key" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              ⚙️
            </button>
          </div>
          
          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-wrapper ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                <div className={`chat-bubble ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-bubble-wrapper assistant">
                <div className="chat-bubble assistant typing-indicator">
                  Sedang mengetik...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-footer" onSubmit={sendMessage}>
            <input 
              type="text" 
              className="chat-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanya KBLI, kelogisan data..."
              disabled={isLoading}
            />
            <button type="submit" className="chat-send-btn" disabled={isLoading || !inputMessage.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
