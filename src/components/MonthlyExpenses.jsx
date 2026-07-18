import React, { useState, useEffect } from 'react';
import CurrencyInput from './CurrencyInput';
import { formatCurrency } from '../utils';

export default function MonthlyExpenses({ onTotalChange }) {
  const [modeBiaya, setModeBiaya] = useState('Global'); // 'Global', 'Rinci'
  const [totalGlobal, setTotalGlobal] = useState(0);

  const [expenses, setExpenses] = useState({
    listrik: 0,
    internet: 0,
    pdam: 0,
    dapur: 0,
    kamarMandi: 0,
    lainnya: 0
  });

  const totalMonthly = modeBiaya === 'Global' 
    ? parseFloat(totalGlobal || 0) 
    : Object.values(expenses).reduce((a, b) => a + b, 0);

  useEffect(() => {
    onTotalChange(totalMonthly);
  }, [totalMonthly, onTotalChange]);

  const updateExpense = (key, value) => {
    setExpenses(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="glass-card">
      <div className="card-header">
        <h2 className="card-title">💡 Pengeluaran Bulanan</h2>
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
          <CurrencyInput label="Total Pengeluaran Bulanan (Gabungan)" value={totalGlobal} onChange={setTotalGlobal} />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            *Masukkan perkiraan total biaya hidup bulanan.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <CurrencyInput label="Listrik" value={expenses.listrik} onChange={(v) => updateExpense('listrik', v)} />
          <CurrencyInput label="Kuota Internet / WiFi" value={expenses.internet} onChange={(v) => updateExpense('internet', v)} />
          <CurrencyInput label="Air PAM / PDAM" value={expenses.pdam} onChange={(v) => updateExpense('pdam', v)} />
          <CurrencyInput label="Kebutuhan Dapur (Gas, Bumbu, dll)" value={expenses.dapur} onChange={(v) => updateExpense('dapur', v)} />
          <CurrencyInput label="Kebutuhan Kamar Mandi (Sabun, dll)" value={expenses.kamarMandi} onChange={(v) => updateExpense('kamarMandi', v)} />
          <CurrencyInput label="Lainnya" value={expenses.lainnya} onChange={(v) => updateExpense('lainnya', v)} />
        </div>
      )}
      <div className="result-box">
        <span className="result-label">Total Bulanan</span>
        <span className="result-value">{formatCurrency(totalMonthly)}</span>
      </div>
    </div>
  );
}
