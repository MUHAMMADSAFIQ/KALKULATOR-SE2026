import React, { useState } from 'react';
import { Store, TrendingUp, TrendingDown } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import ProbingInput from './ProbingInput';
import { formatCurrency } from '../utils';

export default function WarungCalculator() {
  // State Pengeluaran (Biaya)
  const [expenses, setExpenses] = useState({
    upahGaji: 0,
    biayaProduksi: 0, // Plastik, kresek, dll
    pembelianBarang: 0, // Modal sembako
    biayaOperasional: 0, // Listrik, air, sewa
    biayaNonOperasional: 0, // Pajak, retribusi
  });

  // State Pendapatan
  const [income, setIncome] = useState({
    penjualanBarang: 0,
    pendapatanLainnya: 0, // Kardus bekas, konsinyasi
  });

  // Probing State
  const [annualOmsetProbing, setAnnualOmsetProbing] = useState(0);
  const [annualModalProbing, setAnnualModalProbing] = useState(0);

  // Kalkulasi Warung Detail
  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0) + annualModalProbing;
  const totalIncome = Object.values(income).reduce((a, b) => a + b, 0) + annualOmsetProbing;
  const netProfit = totalIncome - totalExpense;

  const updateExpense = (key, value) => setExpenses(prev => ({ ...prev, [key]: value }));
  const updateIncome = (key, value) => setIncome(prev => ({ ...prev, [key]: value }));

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: 'var(--spacing-lg)' }}>
      <div className="card-header" style={{ borderBottomColor: 'var(--accent-primary)' }}>
        <h2 className="card-title" style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Store size={20} /> Kalkulator Usaha Warung Kelontong</h2>
      </div>
      
      <div className="grid-layout" style={{ gap: 'var(--spacing-md)' }}>
        {/* Kolom Pendapatan */}
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={18} /> Pemasukan (Pendapatan)</h3>
          <CurrencyInput label="27.a - Total Penjualan Barang" value={income.penjualanBarang} onChange={(v) => updateIncome('penjualanBarang', v)} />
          <CurrencyInput label="27.b - Pendapatan Lain (Kardus, Konsinyasi)" value={income.pendapatanLainnya} onChange={(v) => updateIncome('pendapatanLainnya', v)} />
          
          <div className="result-box" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'var(--success)' }}>
            <span className="result-label" style={{ color: 'var(--text-primary)' }}>Total Pendapatan</span>
            <span className="result-value" style={{ color: 'var(--success)' }}>{formatCurrency(totalIncome)}</span>
          </div>
          
          <ProbingInput title="Estimasi Probing Omset (Tahunan)" type="income" onChange={setAnnualOmsetProbing} />
        </div>

        {/* Kolom Pengeluaran */}
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingDown size={18} /> Pengeluaran (Biaya)</h3>
          <CurrencyInput label="26.a - Upah & Gaji Pekerja" value={expenses.upahGaji} onChange={(v) => updateExpense('upahGaji', v)} />
          <CurrencyInput label="26.b - Biaya Perlengkapan (Plastik, dll)" value={expenses.biayaProduksi} onChange={(v) => updateExpense('biayaProduksi', v)} />
          <CurrencyInput label="26.c - Pembelian Barang Dagangan" value={expenses.pembelianBarang} onChange={(v) => updateExpense('pembelianBarang', v)} />
          <CurrencyInput label="26.d - Operasional (Listrik, Sewa, ATK)" value={expenses.biayaOperasional} onChange={(v) => updateExpense('biayaOperasional', v)} />
          <CurrencyInput label="26.e - Non-Operasional (Retribusi, Pajak)" value={expenses.biayaNonOperasional} onChange={(v) => updateExpense('biayaNonOperasional', v)} />
          
          <div className="result-box" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'var(--danger)' }}>
            <span className="result-label" style={{ color: 'var(--text-primary)' }}>Total Pengeluaran</span>
            <span className="result-value" style={{ color: 'var(--danger)' }}>{formatCurrency(totalExpense)}</span>
          </div>
          
          <ProbingInput title="Estimasi Probing Biaya Belanja (Tahunan)" type="expense" onChange={setAnnualModalProbing} />
        </div>
      </div>

      {/* Ringkasan Laba Bersih */}
      <div className="summary-card" style={{ marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Estimasi Laba Bersih Setahun</span>
          <span style={{ 
            fontFamily: 'Outfit', 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: netProfit >= 0 ? 'var(--success)' : 'var(--danger)',
            textShadow: netProfit >= 0 ? '0 0 15px rgba(16, 185, 129, 0.4)' : '0 0 15px rgba(239, 68, 68, 0.4)'
          }}>
            {formatCurrency(netProfit)}
          </span>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
            <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>Rata-rata Bersih Per Bulan: {formatCurrency(netProfit / 12)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
