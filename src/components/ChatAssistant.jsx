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
    const savedKey = localStorage.getItem('hf_api_key');
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
      localStorage.setItem('hf_api_key', key);
      setApiKey(key);
      setShowApiKeyModal(false);
      setIsOpen(true);
    }
  };

  const clearApiKey = () => {
    if (window.confirm("Hapus API Key dari perangkat ini?")) {
      localStorage.removeItem('hf_api_key');
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
      // Build OpenAI-compatible messages array with system prompt
      const apiMessages = [
        {
          role: 'system',
          content: `Anda adalah asisten pintar untuk petugas Sensus Ekonomi BPS 2026 di Indonesia. 
Tugas Anda:
- Membantu klasifikasi kode KBLI (Klasifikasi Baku Lapangan Usaha Indonesia)
- Mengevaluasi kewajaran data keuangan usaha (omset, laba, biaya operasional)
- Menjelaskan konsep-konsep survei ekonomi BPS
- Membantu perhitungan dan probing data usaha
- Menjawab pertanyaan seputar sensus ekonomi 2026
Jawab dengan ringkas, ramah, dan profesional dalam Bahasa Indonesia. Gunakan format poin jika perlu.`
        },
        ...newMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'prism-ml/Ternary-Bonsai-27B-gguf:together',
          messages: apiMessages,
          max_tokens: 1024,
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (response.ok && data.choices && data.choices.length > 0) {
        const reply = data.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      } else {
        throw new Error(data.error?.message || 'Gagal merespons. Pastikan HF Token Anda valid.');
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
            <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>🔑 Setup Hugging Face Token</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Untuk menggunakan Asisten AI, masukkan <strong>Hugging Face Token</strong> Anda. Token akan disimpan dengan aman di <i>Local Storage</i> browser Anda.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', opacity: 0.7 }}>
              Dapatkan token gratis di <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>huggingface.co/settings/tokens</a>
            </p>
            <form onSubmit={saveApiKey}>
              <div className="input-group">
                <input 
                  name="apiKey"
                  type="password"
                  className="input-field" 
                  placeholder="hf_..."
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
              <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Online (Ternary-Bonsai-27B)</span>
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
