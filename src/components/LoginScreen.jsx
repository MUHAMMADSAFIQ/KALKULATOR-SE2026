import React, { useState } from 'react';
import bgImage from '../assets/background.jpg';

export default function LoginScreen({ onLogin }) {
  const [kode, setKode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (kode === '2026') {
      onLogin();
    } else {
      setError('Kode Akses Salah! Gunakan 2026');
    }
  };

  return (
    <div 
      className="login-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 0 }} />

      <div className="glass-card login-card" style={{ maxWidth: '400px', width: '90%', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>BPS 2026</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sensus Ekonomi & Kalkulator Sosial Ekonomi</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label>Masukkan Kode Petugas / Akses</label>
            <input
              type="password"
              className="input-field"
              placeholder="Ketik 2026"
              value={kode}
              onChange={(e) => {
                setKode(e.target.value);
                setError('');
              }}
              style={{ fontSize: '1.5rem', letterSpacing: '0.5rem', textAlign: 'center' }}
            />
            {error && <p style={{ color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</p>}
          </div>
          
          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
          >
            Masuk ke Aplikasi
          </button>
        </form>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        zIndex: 1,
        color: '#f8fafc',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '0.5rem 1rem',
        borderRadius: '30px',
        backdropFilter: 'blur(4px)',
        fontSize: '0.85rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        ✨ <span>by <strong>muhammad safiq</strong> | follow ig <strong>@_mhmdsfq</strong></span>
      </div>
    </div>
  );
}
