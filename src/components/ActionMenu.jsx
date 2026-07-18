import React, { useState } from 'react';
import { Plus, Save, Clock, X, Check } from 'lucide-react';

export default function ActionMenu({ onSaveDraft, onSaveFinal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCatatan, setShowCatatan] = useState(false);
  const [catatan, setCatatan] = useState('');
  const [namaRecord, setNamaRecord] = useState('');

  if (showCatatan) {
    return (
      <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)', marginTop: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Simpan Arsip Final</h4>
        <input 
          type="text" 
          placeholder="Nama Responden / ID (Wajib)" 
          value={namaRecord} 
          onChange={e => setNamaRecord(e.target.value)}
          className="input-field"
          style={{ marginBottom: '1rem' }}
        />
        <textarea 
          placeholder="Catatan tambahan (opsional)..."
          value={catatan}
          onChange={e => setCatatan(e.target.value)}
          className="input-field"
          style={{ minHeight: '80px', marginBottom: '1rem', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="action-btn"
            style={{ flex: 1, background: 'var(--success)' }}
            onClick={() => {
              if(!namaRecord) { alert('Nama wajib diisi'); return; }
              onSaveFinal(namaRecord, catatan);
              setShowCatatan(false);
              setIsOpen(false);
            }}
          >
            <Check size={18} /> Simpan Final
          </button>
          <button 
            className="action-btn"
            style={{ flex: 1, background: 'var(--danger)' }}
            onClick={() => setShowCatatan(false)}
          >
            <X size={18} /> Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', marginTop: '2rem', textAlign: 'center' }}>
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          width: '280px',
          border: '1px solid var(--glass-border)',
          zIndex: 10
        }}>
          <button 
            onClick={() => { setShowCatatan(true); }}
            style={{
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--success)',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Save size={18} /> Simpan Data Final & Catatan
          </button>
          
          <button 
            onClick={() => {
              const nama = prompt("Masukkan nama/ID draft sementara ini:");
              if(nama) {
                onSaveDraft(nama);
                setIsOpen(false);
              }
            }}
            style={{
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(245, 158, 11, 0.1)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--warning)',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Clock size={18} /> Simpan Sementara (Draft)
          </button>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--accent-primary)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(234, 88, 12, 0.4)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
        }}
      >
        <Plus size={32} />
      </button>
    </div>
  );
}
