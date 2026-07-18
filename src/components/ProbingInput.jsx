import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';
import CurrencyInput from './CurrencyInput';

export default function ProbingInput({ title, type = 'income', onChange }) {
  const [maxVal, setMaxVal] = useState('');
  const [minVal, setMinVal] = useState('');
  const [days, setDays] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const isIncome = type === 'income';
  const colorVar = 'var(--accent-primary)';
  const bgVar = 'var(--bg-secondary)';

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
    <div style={{ background: bgVar, borderRadius: 'var(--radius-md)', marginTop: '1.5rem', border: `1px dashed ${colorVar}`, overflow: 'hidden' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: colorVar,
          fontWeight: '600',
          fontSize: '1rem'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calculator size={18} /> {title}
        </span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div style={{ padding: '0 1rem 1rem 1rem', borderTop: `1px dashed rgba(249, 115, 22, 0.2)` }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '0.5rem' }}>
            *Buka dan isi alat bantu ini jika responden kesulitan menjawab total sebulan/setahun.
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
              style={{ background: 'var(--bg-primary)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
