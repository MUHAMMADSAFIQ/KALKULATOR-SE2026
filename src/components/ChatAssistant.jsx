import React, { useState, useEffect, useRef } from 'react';

const MODELS = [
  { id: 'mistralai/Mistral-7B-Instruct-v0.3', name: 'Mistral 7B (Gratis)' },
  { id: 'HuggingFaceH4/zephyr-7b-beta', name: 'Zephyr 7B (Gratis)' },
  { id: 'microsoft/Phi-3-mini-4k-instruct', name: 'Phi-3 Mini (Gratis)' },
  { id: 'prism-ml/Ternary-Bonsai-27B-gguf:together', name: 'Ternary Bonsai 27B' },
];

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya Asisten AI Sensus BPS. Ada yang bisa saya bantu terkait KBLI, kelogisan data, atau konsep survei?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('hf_api_key');
    const savedModel = localStorage.getItem('hf_model');
    if (savedKey) setApiKey(savedKey);
    if (savedModel) setSelectedModel(savedModel);
  }, []);

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
    if (window.confirm("Hapus API Key dan reset chat?")) {
      localStorage.removeItem('hf_api_key');
      localStorage.removeItem('hf_model');
      setApiKey('');
      setIsOpen(false);
      setMessages([
        { role: 'assistant', content: 'Halo! Saya Asisten AI Sensus BPS. Ada yang bisa saya bantu terkait KBLI, kelogisan data, atau konsep survei?' }
      ]);
    }
  };

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    localStorage.setItem('hf_model', model);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !apiKey || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    const systemPrompt = `Anda adalah asisten pintar untuk petugas Sensus Ekonomi BPS 2026 di Indonesia. 
Tugas Anda:
- Membantu klasifikasi kode KBLI (Klasifikasi Baku Lapangan Usaha Indonesia)
- Mengevaluasi kewajaran data keuangan usaha (omset, laba, biaya operasional)
- Menjelaskan konsep-konsep survei ekonomi BPS
- Membantu perhitungan dan probing data usaha
Jawab dengan ringkas, ramah, dan profesional dalam Bahasa Indonesia.`;

    // Try HF Inference API (more reliable for browser)
    try {
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...newMessages.map(msg => ({ role: msg.role, content: msg.content }))
      ];

      const response = await fetch(`https://api-inference.huggingface.co/models/${selectedModel}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: apiMessages,
          max_tokens: 1024,
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (response.ok && data.choices && data.choices.length > 0) {
        const reply = data.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      } else if (response.status === 401) {
        throw new Error('Token tidak valid. Pastikan HF Token Anda benar.');
      } else if (response.status === 503) {
        throw new Error('Model sedang dimuat, coba lagi dalam 30 detik...');
      } else {
        throw new Error(data.error || data.message || `Error ${response.status}: Coba ganti model di pengaturan.`);
      }
    } catch (error) {
      const errorMsg = error.message.includes('Failed to fetch') 
        ? 'Tidak bisa terhubung ke server. Periksa koneksi internet Anda.'
        : error.message;
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${errorMsg}` }]);
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
              Masukkan <strong>Hugging Face Token</strong> Anda untuk mengaktifkan Asisten AI.
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
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>🤖 AI Assistant Sensus</h3>
              <select 
                value={selectedModel} 
                onChange={handleModelChange}
                style={{ fontSize: '0.7rem', color: 'var(--success)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px' }}
              >
                {MODELS.map(m => (
                  <option key={m.id} value={m.id} style={{ color: 'black' }}>{m.name}</option>
                ))}
              </select>
            </div>
            <button onClick={clearApiKey} title="Hapus API Key" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem' }}>
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
