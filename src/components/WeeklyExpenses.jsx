import React, { useState, useEffect } from 'react';
import CurrencyInput from './CurrencyInput';
import { formatCurrency } from '../utils';

export default function WeeklyExpenses({ onTotalChange }) {
  const [dailyFood, setDailyFood] = useState(0);
  const [otherWeekly, setOtherWeekly] = useState(0);
  
  const weeklyFood = dailyFood * 7;
  const totalWeekly = weeklyFood + otherWeekly;

  useEffect(() => {
    onTotalChange(totalWeekly);
  }, [totalWeekly, onTotalChange]);

  return (
    <div className="glass-card">
      <div className="card-header">
        <h2 className="card-title">🍲 Pengeluaran Mingguan</h2>
      </div>
      
      <CurrencyInput 
        label="Makan Sehari (Otomatis x 7 hari)" 
        value={dailyFood} 
        onChange={setDailyFood} 
      />
      
      <CurrencyInput 
        label="Lainnya (Rokok, Jajan, dll per minggu)" 
        value={otherWeekly} 
        onChange={setOtherWeekly} 
      />

      <div className="result-box">
        <span className="result-label">Total Mingguan</span>
        <span className="result-value">{formatCurrency(totalWeekly)}</span>
      </div>
    </div>
  );
}
