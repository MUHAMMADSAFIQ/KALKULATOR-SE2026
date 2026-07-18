import React, { useState, useEffect } from 'react';
import CurrencyInput from './CurrencyInput';
import { formatCurrency } from '../utils';

export default function YearlyExpenses({ onTotalChange }) {
  const [expenses, setExpenses] = useState({
    pakaian: 0,
    pajakKendaraan: 0,
    servisBesar: 0,
    pbb: 0,
    acaraKhusus: 0,
    lainnya: 0
  });

  const totalYearlySpecific = Object.values(expenses).reduce((a, b) => a + b, 0);

  useEffect(() => {
    onTotalChange(totalYearlySpecific);
  }, [totalYearlySpecific, onTotalChange]);

  const updateExpense = (key, value) => {
    setExpenses(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="glass-card">
      <div className="card-header">
        <h2 className="card-title">📅 Pengeluaran Tahunan (Khusus)</h2>
      </div>
      
      <CurrencyInput label="Pakaian / Baju Lebaran" value={expenses.pakaian} onChange={(v) => updateExpense('pakaian', v)} />
      <CurrencyInput label="Pajak Kendaraan (STNK, dll)" value={expenses.pajakKendaraan} onChange={(v) => updateExpense('pajakKendaraan', v)} />
      <CurrencyInput label="Servis Besar Kendaraan" value={expenses.servisBesar} onChange={(v) => updateExpense('servisBesar', v)} />
      <CurrencyInput label="Pajak Bumi & Bangunan (PBB)" value={expenses.pbb} onChange={(v) => updateExpense('pbb', v)} />
      <CurrencyInput label="Acara Khusus (Hajatan, dll)" value={expenses.acaraKhusus} onChange={(v) => updateExpense('acaraKhusus', v)} />
      <CurrencyInput label="Lainnya" value={expenses.lainnya} onChange={(v) => updateExpense('lainnya', v)} />

      <div className="result-box">
        <span className="result-label">Total Tahunan (Khusus)</span>
        <span className="result-value">{formatCurrency(totalYearlySpecific)}</span>
      </div>
    </div>
  );
}
