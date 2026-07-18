import React from 'react';
import { Calendar } from 'lucide-react';

export default function TahunBerdiriSelector({ tahunBerdiri, setTahunBerdiri, bulanBerdiri, setBulanBerdiri }) {
  const bulanList = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ];

  return (
    <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid var(--accent-primary)' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
        <Calendar size={18} /> Kapan Usaha Ini Mulai Beroperasi?
      </h4>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Tahun Mulai Beroperasi</label>
          <select 
            className="input-field"
            value={tahunBerdiri}
            onChange={(e) => setTahunBerdiri(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}
          >
            <option value="<=2025" style={{ color: 'black' }}>Tahun 2025 atau sebelumnya</option>
            <option value="2026" style={{ color: 'black' }}>Baru buka di tahun 2026</option>
          </select>
        </div>
        
        {tahunBerdiri === '2026' && (
          <div style={{ flex: 1, minWidth: '150px', animation: 'fadeIn 0.3s ease' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Bulan Mulai Beroperasi</label>
            <select 
              className="input-field"
              value={bulanBerdiri}
              onChange={(e) => setBulanBerdiri(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid var(--warning)' }}
            >
              {bulanList.map(b => (
                <option key={b.value} value={b.value} style={{ color: 'black' }}>{b.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      {tahunBerdiri === '2026' && (
        <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          *Karena usaha baru mulai pada tahun 2026, perhitungan total dalam setahun akan disesuaikan secara proporsional.
        </p>
      )}
    </div>
  );
}
