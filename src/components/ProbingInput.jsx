import React, { useState, useEffect } from 'react';
import CurrencyInput from './CurrencyInput';
import { formatCurrency } from '../utils';

export default function ProbingInput({ title, type = 'income', onChange }) {
  const [maxVal, setMaxVal] = useState('');
  const [minVal, setMinVal] = useState('');
  const [days, setDays] = useState(1);

  const isIncome = type === 'income';
  const colorVar = isIncome ? 'var(--success)' : 'var(--danger)';
  const bgVar = isIncome ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)';

  useEffect(() => {
    const parsedDays = parseFloat(days) > 0 ? parseFloat(days) : 1;
    const max = parseFloat(maxVal) || 0;
    const min = parseFloat(minVal) || 0;
    
    let avgVal = 0;
    if (max > 0 && min > 0) {
      avgVal = (max + min) / 2;
    } else if (max > 0) {
      avgVal = max;
    } else if (min > 0) {
      avgVal = min;
    }

    const dailyVal = avgVal / parsedDays;
    const annualized = dailyVal * 365;

    onChange(annualized);
  }, [maxVal, minVal, days, onChange]);

  return (
    <div style={{ background: bgVar, padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '1.5rem', border: `1px dashed ${colorVar}` }}>
      <h4 style={{ color: colorVar, marginBottom: '1rem', fontSize: '1rem' }}>{title}</h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        *Isi bagian ini jika responden kesulitan menjawab total sebulan/setahun.
      </p>
      
      <CurrencyInput label="Nominal Saat Ramai (Terbesar)" value={maxVal} onChange={setMaxVal} />
      <CurrencyInput label="Nominal Saat Sepi (Terkecil)" value={minVal} onChange={setMinVal} />
      
      <div className="input-group" style={{ marginTop: '1rem' }}>
        <label>Siklus Tersebut Untuk Berapa Hari?</label>
        <input 
          type="number" 
          className="input-field" 
          value={days} 
          onChange={(e) => setDays(e.target.value)} 
          min="1"
          placeholder="Misal: 1 (harian), 7 (mingguan)"
        />
      </div>
    </div>
  );
}
