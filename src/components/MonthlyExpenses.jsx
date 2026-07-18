import React, { useState, useEffect } from 'react';
import CurrencyInput from './CurrencyInput';
import { formatCurrency } from '../utils';

export default function MonthlyExpenses({ onTotalChange }) {
  const [expenses, setExpenses] = useState({
    listrik: 0,
    internet: 0,
    pdam: 0,
    dapur: 0,
    kamarMandi: 0,
    lainnya: 0
  });

  const totalMonthly = Object.values(expenses).reduce((a, b) => a + b, 0);

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
      
      <CurrencyInput label="Listrik" value={expenses.listrik} onChange={(v) => updateExpense('listrik', v)} />
      <CurrencyInput label="Kuota Internet / WiFi" value={expenses.internet} onChange={(v) => updateExpense('internet', v)} />
      <CurrencyInput label="Air PAM / PDAM" value={expenses.pdam} onChange={(v) => updateExpense('pdam', v)} />
      <CurrencyInput label="Kebutuhan Dapur (Gas, Bumbu, dll)" value={expenses.dapur} onChange={(v) => updateExpense('dapur', v)} />
      <CurrencyInput label="Kebutuhan Kamar Mandi (Sabun, dll)" value={expenses.kamarMandi} onChange={(v) => updateExpense('kamarMandi', v)} />
      <CurrencyInput label="Lainnya" value={expenses.lainnya} onChange={(v) => updateExpense('lainnya', v)} />

      <div className="result-box">
        <span className="result-label">Total Bulanan</span>
        <span className="result-value">{formatCurrency(totalMonthly)}</span>
      </div>
    </div>
  );
}
