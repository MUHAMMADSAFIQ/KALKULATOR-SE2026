import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';
import { formatCurrency, saveToArchive } from '../utils';

export default function QuickCalculator({ activeKbli }) {
  const [periode, setPeriode] = useState('Bulan'); // 'Hari', 'Minggu', 'Bulan'
  const [pemasukan, setPemasukan] = useState(0);
  const [pengeluaran, setPengeluaran] = useState(0);

  // Hitung Laba Bersih
  const labaBersihPeriode = (pemasukan || 0) - (pengeluaran || 0);

  // Estimasi ke Bulan dan Tahun
  let labaBulan = 0;
  if (periode === 'Hari') labaBulan = labaBersihPeriode * 30;
  if (periode === 'Minggu') labaBulan = labaBersihPeriode * 4;
  if (periode === 'Bulan') labaBulan = labaBersihPeriode;
  
  const labaTahun = labaBulan * 12;

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: 'var(--spacing-md)' }}>
      <div className="card-header" style={{ borderBottomColor: 'var(--accent-primary)' }}>
        <h2 className="card-title" style={{ color: 'var(--accent-primary)' }}>⚡ Kalkulator Kilat (Sederhana)</h2>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Gunakan kalkulator ini untuk wawancara cepat. Cukup tanyakan total pemasukan dan pengeluaran secara garis besar.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['Hari', 'Minggu', 'Bulan'].map((p) => (
          <button 
            key={p}
            onClick={() => setPeriode(p)}
            style={{ 
              flex: 1, 
              padding: '0.8rem', 
              borderRadius: 'var(--radius-sm)', 
              border: 'none', 
              cursor: 'pointer',
              background: periode === p ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
              color: periode === p ? 'white' : 'var(--text-secondary)',
              fontWeight: periode === p ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
          >
            Per {p}
          </button>
        ))}
      </div>

      <div className="grid-layout" style={{ gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <CurrencyInput label={`Total Pemasukan (Per ${periode})`} value={pemasukan} onChange={setPemasukan} />
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <CurrencyInput label={`Total Pengeluaran (Per ${periode})`} value={pengeluaran} onChange={setPengeluaran} />
        </div>
      </div>

      <div className="summary-card" style={{ marginTop: '1.5rem', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Perkiraan Laba Bersih Per Bulan</span>
          <span style={{ 
            fontFamily: 'Outfit', 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: labaBulan >= 0 ? 'var(--success)' : 'var(--danger)',
            textShadow: labaBulan >= 0 ? '0 0 15px rgba(16, 185, 129, 0.4)' : '0 0 15px rgba(239, 68, 68, 0.4)'
          }}>
            {formatCurrency(labaBulan)}
          </span>
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--accent-primary)', textAlign: 'left', fontStyle: 'italic', color: 'var(--text-primary)' }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontStyle: 'normal' }}>💬 Kesimpulan Wawancara:</strong>
            "Jadi, rata-rata pendapatan bersih Bapak/Ibu dari usaha ini sekitar 
            <strong style={{ color: labaBulan >= 0 ? 'var(--success)' : 'var(--danger)' }}> {formatCurrency(labaBulan)} per bulan</strong> ya?"
          </div>

          <button 
            className="action-btn"
            style={{ width: '100%', marginTop: '2rem', background: 'var(--success)', padding: '1rem', fontSize: '1.1rem' }}
            onClick={() => {
              saveToArchive({
                namaResponden: prompt("Masukkan Nama Responden:"),
                kbliCode: activeKbli?.code || '00000',
                namaUsaha: activeKbli?.name || 'Usaha (Sederhana)',
                labaBersihBulan: Math.round(labaBulan),
                labaBersihTahun: Math.round(labaTahun)
              });
              alert("Data berhasil disimpan ke Arsip Offline!");
            }}
          >
            💾 Simpan Data ke Arsip
          </button>
        </div>
      </div>
    </div>
  );
}
