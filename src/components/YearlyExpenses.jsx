import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import { formatCurrency } from '../utils';

export default function YearlyExpenses({ onTotalChange }) {
  const [modeBiaya, setModeBiaya] = useState('Global'); // 'Global', 'Rinci'
  const [totalGlobal, setTotalGlobal] = useState(0);

  const [expenses, setExpenses] = useState({
    pakaian: 0,
    pajakKendaraan: 0,
    servisBesar: 0,
    pbb: 0,
    acaraKhusus: 0,
    lainnya: 0
  });

  const totalYearlySpecific = modeBiaya === 'Global'
    ? parseFloat(totalGlobal || 0)
    : Object.values(expenses).reduce((a, b) => a + b, 0);

  useEffect(() => {
    onTotalChange(totalYearlySpecific);
  }, [totalYearlySpecific, onTotalChange]);

  const updateExpense = (key, value) => {
    setExpenses(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="glass-card">
      <div className="card-header">
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={20} color="var(--accent-primary)" /> Pengeluaran Tahunan (Khusus)</h2>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setModeBiaya('Global')} 
          className="action-btn" 
          style={{ 
            flex: 1, padding: '0.5rem', fontSize: '0.85rem', 
            background: modeBiaya === 'Global' ? 'var(--accent-primary)' : 'transparent', 
            border: '1px solid var(--accent-primary)', 
            color: modeBiaya === 'Global' ? 'white' : 'var(--accent-primary)' 
          }}
        >
          Input Keseluruhan
        </button>
        <button 
          onClick={() => setModeBiaya('Rinci')} 
          className="action-btn" 
          style={{ 
            flex: 1, padding: '0.5rem', fontSize: '0.85rem', 
            background: modeBiaya === 'Rinci' ? 'var(--accent-primary)' : 'transparent', 
            border: '1px solid var(--accent-primary)', 
            color: modeBiaya === 'Rinci' ? 'white' : 'var(--accent-primary)' 
          }}
        >
          Input Satu-Satu
        </button>
      </div>

      {modeBiaya === 'Global' ? (
        <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <CurrencyInput label="Total Pengeluaran Khusus Tahunan (Gabungan)" value={totalGlobal} onChange={setTotalGlobal} />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            *Masukkan perkiraan total biaya tahunan khusus (PBB, pajak motor, baju lebaran, hajatan).
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <CurrencyInput label="Pakaian / Baju Lebaran" value={expenses.pakaian} onChange={(v) => updateExpense('pakaian', v)} />
          <CurrencyInput label="Pajak Kendaraan (STNK, dll)" value={expenses.pajakKendaraan} onChange={(v) => updateExpense('pajakKendaraan', v)} />
          <CurrencyInput label="Servis Besar Kendaraan" value={expenses.servisBesar} onChange={(v) => updateExpense('servisBesar', v)} />
          <CurrencyInput label="Pajak Bumi & Bangunan (PBB)" value={expenses.pbb} onChange={(v) => updateExpense('pbb', v)} />
          <CurrencyInput label="Acara Khusus (Hajatan, dll)" value={expenses.acaraKhusus} onChange={(v) => updateExpense('acaraKhusus', v)} />
          <CurrencyInput label="Lainnya" value={expenses.lainnya} onChange={(v) => updateExpense('lainnya', v)} />
        </div>
      )}
      <div className="result-box">
        <span className="result-label">Total Tahunan (Khusus)</span>
        <span className="result-value">{formatCurrency(totalYearlySpecific)}</span>
      </div>
    </div>
  );
}
