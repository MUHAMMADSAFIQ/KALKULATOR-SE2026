import React, { useState, useEffect, useRef } from 'react';
import { HfInference } from '@huggingface/inference';

const SYSTEM_PROMPT = `Anda adalah asisten pintar untuk petugas Sensus Ekonomi BPS 2026 di Indonesia. Jawab ringkas, ramah, profesional dalam Bahasa Indonesia. Jika ditanya siapa yang membuat atau mengembangkan website/aplikasi ini, jawab bahwa pembuatnya adalah Muhammad Safiq, mahasiswa Universitas Muhammadiyah Purworejo umur 21 tahun jurusan Teknologi Informasi.`;

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
  const hfRef = useRef(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('hf_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      hfRef.current = new HfInference(savedKey);
    }
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
      hfRef.current = new HfInference(key);
      setShowApiKeyModal(false);
      setIsOpen(true);
    }
  };

  const clearApiKey = () => {
    if (window.confirm("Hapus API Key dan reset chat?")) {
      localStorage.removeItem('hf_api_key');
      setApiKey('');
      hfRef.current = null;
      setIsOpen(false);
      setMessages([
        { role: 'assistant', content: 'Halo! Saya Asisten AI Sensus BPS. Ada yang bisa saya bantu terkait KBLI, kelogisan data, atau konsep survei?' }
      ]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !apiKey || isLoading || !hfRef.current) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const chatMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...newMessages.map(msg => ({ role: msg.role, content: msg.content }))
      ];

      // Try multiple models - some may be unavailable on free tier
      const modelsToTry = [
        'Qwen/Qwen2.5-72B-Instruct',
        'mistralai/Mixtral-8x7B-Instruct-v0.1',
        'meta-llama/Meta-Llama-3-8B-Instruct',
        'google/gemma-2-2b-it',
      ];

      let reply = null;
      let lastError = null;

      for (const model of modelsToTry) {
        try {
          const response = await hfRef.current.chatCompletion({
            model,
            messages: chatMessages,
            max_tokens: 400,
            temperature: 0.7,
          });
          reply = response.choices?.[0]?.message?.content?.trim();
          if (reply) break;
        } catch (err) {
          lastError = err;
          continue;
        }
      }

      if (!reply && lastError) throw lastError;
      if (!reply) throw new Error('Semua model gagal merespons.');
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

    } catch (error) {
      let errorMsg = error.message || 'Terjadi kesalahan.';

      if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        errorMsg = '🔑 Token tidak valid. Klik ⚙️ untuk memasukkan ulang.';
      } else if (errorMsg.includes('503') || errorMsg.includes('loading')) {
        errorMsg = '⏳ Model sedang dimuat. Tunggu 30 detik lalu coba lagi...';
      } else if (errorMsg.includes('429') || errorMsg.includes('rate')) {
        errorMsg = '⏳ Terlalu banyak permintaan. Tunggu sebentar...';
      } else {
        errorMsg = `❌ ${errorMsg}`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${errorMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="chat-fab no-print" onClick={toggleChat} aria-label="Chat Assistant">
        {isOpen ? '✕' : '🤖'}
      </button>

      {showApiKeyModal && (
        <div className="modal-overlay no-print">
          <div className="glass-card modal-content" style={{ width: '90%', maxWidth: '400px', padding: '1.5rem', background: 'var(--bg-primary)' }}>
            <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>🔑 Setup Hugging Face Token</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Masukkan <strong>Hugging Face Token</strong> untuk mengaktifkan Asisten AI.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', opacity: 0.7 }}>
              Dapatkan gratis di <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>huggingface.co/settings/tokens</a>
            </p>
            <form onSubmit={saveApiKey}>
              <input name="apiKey" type="password" className="input-field" placeholder="hf_..." required style={{ marginBottom: '1rem' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
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
              <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Zephyr 7B via HuggingFace</span>
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
                <div className="chat-bubble assistant typing-indicator">Sedang mengetik...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-footer" onSubmit={sendMessage}>
            <input
              type="text" className="chat-input" value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanya KBLI, kelogisan data..."
              disabled={isLoading}
            />
            <button type="submit" className="chat-send-btn" disabled={isLoading || !inputMessage.trim()}>➤</button>
          </form>
        </div>
      )}
    </>
  );
}
