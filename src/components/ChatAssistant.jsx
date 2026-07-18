import React, { useState, useEffect, useRef } from 'react';

const MODELS = [
  { id: 'mistralai/Mistral-7B-Instruct-v0.3', name: 'Mistral 7B (Gratis)', template: 'mistral' },
  { id: 'HuggingFaceH4/zephyr-7b-beta', name: 'Zephyr 7B (Gratis)', template: 'zephyr' },
  { id: 'microsoft/Phi-3-mini-4k-instruct', name: 'Phi-3 Mini (Gratis)', template: 'phi3' },
];

const SYSTEM_PROMPT = `Anda adalah asisten pintar untuk petugas Sensus Ekonomi BPS 2026 di Indonesia. Tugas Anda: membantu klasifikasi kode KBLI, mengevaluasi kewajaran data keuangan usaha, menjelaskan konsep survei ekonomi BPS, dan membantu perhitungan probing data usaha. Jawab ringkas, ramah, profesional dalam Bahasa Indonesia.`;

function buildPrompt(template, messages) {
  const history = messages.filter(m => m.role !== 'system');
  
  if (template === 'mistral') {
    let prompt = '';
    for (let i = 0; i < history.length; i++) {
      if (history[i].role === 'user') {
        const instruction = i === 0 
          ? `${SYSTEM_PROMPT}\n\nPertanyaan: ${history[i].content}` 
          : history[i].content;
        prompt += `<s>[INST] ${instruction} [/INST]`;
      } else {
        prompt += ` ${history[i].content}</s>`;
      }
    }
    return prompt;
  }
  
  if (template === 'zephyr') {
    let prompt = `<|system|>\n${SYSTEM_PROMPT}</s>\n`;
    for (const msg of history) {
      if (msg.role === 'user') {
        prompt += `<|user|>\n${msg.content}</s>\n`;
      } else {
        prompt += `<|assistant|>\n${msg.content}</s>\n`;
      }
    }
    prompt += `<|assistant|>\n`;
    return prompt;
  }
  
  // phi3
  let prompt = `<|system|>\n${SYSTEM_PROMPT}<|end|>\n`;
  for (const msg of history) {
    if (msg.role === 'user') {
      prompt += `<|user|>\n${msg.content}<|end|>\n`;
    } else {
      prompt += `<|assistant|>\n${msg.content}<|end|>\n`;
    }
  }
  prompt += `<|assistant|>\n`;
  return prompt;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [selectedModelIdx, setSelectedModelIdx] = useState(0);
  
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya Asisten AI Sensus BPS. Ada yang bisa saya bantu terkait KBLI, kelogisan data, atau konsep survei?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('hf_api_key');
    const savedIdx = localStorage.getItem('hf_model_idx');
    if (savedKey) setApiKey(savedKey);
    if (savedIdx) setSelectedModelIdx(parseInt(savedIdx) || 0);
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
      localStorage.removeItem('hf_model_idx');
      setApiKey('');
      setIsOpen(false);
      setMessages([
        { role: 'assistant', content: 'Halo! Saya Asisten AI Sensus BPS. Ada yang bisa saya bantu terkait KBLI, kelogisan data, atau konsep survei?' }
      ]);
    }
  };

  const handleModelChange = (e) => {
    const idx = parseInt(e.target.value);
    setSelectedModelIdx(idx);
    localStorage.setItem('hf_model_idx', idx.toString());
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !apiKey || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    const model = MODELS[selectedModelIdx];

    try {
      const prompt = buildPrompt(model.template, newMessages);

      const response = await fetch(`https://api-inference.huggingface.co/models/${model.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.7,
            return_full_text: false,
            do_sample: true,
          }
        })
      });

      if (response.status === 401) {
        throw new Error('Token tidak valid. Pastikan HF Token Anda benar.');
      }
      if (response.status === 503) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`Model sedang dimuat (estimasi ${Math.round((errData.estimated_time || 30))}s). Coba lagi sebentar...`);
      }
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      
      let reply = '';
      if (Array.isArray(data) && data.length > 0) {
        reply = data[0].generated_text || '';
      } else if (data.generated_text) {
        reply = data.generated_text;
      } else {
        throw new Error('Format respons tidak dikenali.');
      }

      // Clean up the reply
      reply = reply.trim();
      if (!reply) reply = 'Maaf, saya tidak bisa merespons saat ini. Coba ulangi pertanyaan Anda.';

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      const errorMsg = error.message.includes('Failed to fetch') 
        ? 'Tidak bisa terhubung ke Hugging Face. Periksa koneksi internet atau coba model lain.'
        : error.message;
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${errorMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        className="chat-fab no-print"
        onClick={toggleChat}
        aria-label="Chat Assistant"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

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
                <input name="apiKey" type="password" className="input-field" placeholder="hf_..." required />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 1, background: 'var(--accent-primary)', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>Simpan</button>
                <button type="button" onClick={() => setShowApiKeyModal(false)} style={{ flex: 1, background: 'transparent', color: 'var(--text-secondary)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isOpen && apiKey && (
        <div className="chat-window glass-card no-print">
          <div className="chat-header">
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>🤖 AI Assistant Sensus</h3>
              <select 
                value={selectedModelIdx} 
                onChange={handleModelChange}
                style={{ fontSize: '0.7rem', color: 'var(--success)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px' }}
              >
                {MODELS.map((m, idx) => (
                  <option key={m.id} value={idx} style={{ color: 'black' }}>{m.name}</option>
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
