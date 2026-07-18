import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';
import ProbingInput from './ProbingInput';
import { formatCurrency } from '../utils';

export default function UtpPadiCalculator() {
  const [luasUbin, setLuasUbin] = useState('');
  const [frekuensiPanen, setFrekuensiPanen] = useState(2);
  
  // Pengeluaran
  const [expenses, setExpenses] = useState({
    benih: 0,
    pupuk: 0,
    pestisida: 0,
    sewaTraktor: 0,
    upahBuruh: 0,
    irigasi: 0,
  });

  // Pemasukan
  const [jumlahKuintal, setJumlahKuintal] = useState('');
  const [hargaKuintal, setHargaKuintal] = useState(650000);
  
  const panenGabah = parseFloat(jumlahKuintal || 0) * parseFloat(hargaKuintal || 0);

  // Probing State
  const [annualOmsetProbing, setAnnualOmsetProbing] = useState(0);
  const [annualModalProbing, setAnnualModalProbing] = useState(0);

  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0);
  const netProfitMusiman = panenGabah - totalExpense;
  const netProfitTahunan = (netProfitMusiman * frekuensiPanen) + annualOmsetProbing - annualModalProbing;

  const updateExpense = (key, value) => setExpenses(prev => ({ ...prev, [key]: value }));

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: 'var(--spacing-md)' }}>
      <div className="card-header" style={{ borderBottomColor: '#84cc16' }}>
        <h2 className="card-title" style={{ color: '#84cc16' }}>🌾 Kalkulator UTP Padi Sawah</h2>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
        <div className="input-group" style={{ flex: '1 1 200px' }}>
          <label>Luas Lahan Garapan (Dalam Ubin)</label>
          <input 
            type="number" 
            className="input-field" 
            placeholder="Misal: 100"
            value={luasUbin}
            onChange={(e) => setLuasUbin(e.target.value)}
          />
        </div>
        <div className="input-group" style={{ flex: '1 1 200px' }}>
          <label>Frekuensi Panen Setahun</label>
          <input 
            type="number" 
            className="input-field" 
            placeholder="Misal: 2 atau 3"
            value={frekuensiPanen}
            onChange={(e) => setFrekuensiPanen(e.target.value || 0)}
          />
        </div>
      </div>

      <div className="grid-layout" style={{ gap: 'var(--spacing-md)' }}>
        {/* Kolom Pemasukan */}
        <div style={{ background: 'rgba(132, 204, 22, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(132, 204, 22, 0.2)' }}>
          <h3 style={{ color: '#84cc16', marginBottom: '1rem', fontSize: '1.1rem' }}>📈 Hasil Panen (Pemasukan)</h3>
          
          <div className="input-group">
            <label>Jumlah Panen Gabah (Dalam Kuintal)</label>
            <input 
              type="number" 
              inputMode="numeric"
              className="input-field" 
              placeholder="Misal: 25"
              value={jumlahKuintal}
              onChange={(e) => setJumlahKuintal(e.target.value)}
            />
          </div>

          <CurrencyInput label="Harga Per Kuintal (Rp)" value={hargaKuintal} onChange={setHargaKuintal} />
          
          <div className="result-box" style={{ background: 'rgba(132, 204, 22, 0.2)', borderColor: '#84cc16', marginTop: '2rem' }}>
            <span className="result-label" style={{ color: 'var(--text-primary)' }}>Total Penjualan (Musim Ini)</span>
            <span className="result-value" style={{ color: '#84cc16' }}>{formatCurrency(panenGabah)}</span>
          </div>

          <hr style={{ margin: '1.5rem 0', borderColor: 'var(--glass-border)' }} />
          
          <ProbingInput title="Estimasi Probing Panen (Tahunan)" type="income" onChange={setAnnualOmsetProbing} />
        </div>

        {/* Kolom Pengeluaran */}
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '1.1rem' }}>📉 Biaya Tanam (Pengeluaran)</h3>
          <CurrencyInput label="Benih / Bibit Padi" value={expenses.benih} onChange={(v) => updateExpense('benih', v)} />
          <CurrencyInput label="Pupuk (Urea, NPK, dll)" value={expenses.pupuk} onChange={(v) => updateExpense('pupuk', v)} />
          <CurrencyInput label="Obat Hama / Pestisida" value={expenses.pestisida} onChange={(v) => updateExpense('pestisida', v)} />
          <CurrencyInput label="Sewa Traktor / Bajak Sawah" value={expenses.sewaTraktor} onChange={(v) => updateExpense('sewaTraktor', v)} />
          <CurrencyInput label="Upah Buruh (Tanam & Panen)" value={expenses.upahBuruh} onChange={(v) => updateExpense('upahBuruh', v)} />
          <CurrencyInput label="Biaya Irigasi / Air" value={expenses.irigasi} onChange={(v) => updateExpense('irigasi', v)} />
          
          <div className="result-box" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'var(--danger)' }}>
            <span className="result-label" style={{ color: 'var(--text-primary)' }}>Total Biaya Tanam</span>
            <span className="result-value" style={{ color: 'var(--danger)' }}>{formatCurrency(totalExpense)}</span>
          </div>
          
          <ProbingInput title="Estimasi Probing Biaya (Tahunan)" type="expense" onChange={setAnnualModalProbing} />
        </div>
      </div>

      <div className="summary-card" style={{ marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Laba Bersih Setahun (x{frekuensiPanen} Musim)</span>
          <span style={{ 
            fontFamily: 'Outfit', 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: netProfitTahunan >= 0 ? 'var(--success)' : 'var(--danger)',
            textShadow: netProfitTahunan >= 0 ? '0 0 15px rgba(16, 185, 129, 0.4)' : '0 0 15px rgba(239, 68, 68, 0.4)'
          }}>
            {formatCurrency(netProfitTahunan)}
          </span>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
            <span>Laba per Musim: {formatCurrency(netProfitMusiman)}</span>
            <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>Rata-rata Bersih Per Bulan: {formatCurrency(netProfitTahunan / 12)}</span>
          </div>
          {luasUbin && (
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Hasil untuk garapan seluas {luasUbin} Ubin.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
