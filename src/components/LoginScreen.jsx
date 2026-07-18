import React, { useState } from 'react';

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
    <div className="login-container">
      <div className="glass-card login-card" style={{ maxWidth: '400px', margin: '10vh auto', textAlign: 'center' }}>
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
    </div>
  );
}
