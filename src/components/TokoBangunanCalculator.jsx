import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';
import ProbingInput from './ProbingInput';
import { formatCurrency } from '../utils';

export default function TokoBangunanCalculator() {
  const [expenses, setExpenses] = useState({
    upahGaji: 0,
    biayaProduksi: 0, // Pembelian barang dagangan
    biayaOperasional: 0,
    biayaNonOperasional: 0,
  });

  const [income, setIncome] = useState({
    nilaiProduksi: 0, // Penjualan barang
    pendapatanLainnya: 0,
  });

  // Probing State
  const [annualOmsetProbing, setAnnualOmsetProbing] = useState(0);
  const [annualModalProbing, setAnnualModalProbing] = useState(0);

  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0) + annualModalProbing;
  const totalIncome = Object.values(income).reduce((a, b) => a + b, 0) + annualOmsetProbing;
  const netProfit = totalIncome - totalExpense;

  const updateExpense = (key, value) => setExpenses(prev => ({ ...prev, [key]: value }));
  const updateIncome = (key, value) => setIncome(prev => ({ ...prev, [key]: value }));

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: 'var(--spacing-md)' }}>
      <div className="card-header" style={{ borderBottomColor: 'var(--accent-primary)' }}>
        <h2 className="card-title" style={{ color: 'var(--accent-primary)' }}>🧱 Kalkulator Usaha Toko Bangunan</h2>
      </div>

      <div className="grid-layout" style={{ gap: 'var(--spacing-md)' }}>
        {/* Kolom Pemasukan */}
        <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>📈 27. Rincian Nilai Produksi / Pendapatan</h3>
          <CurrencyInput label="27.a - Penjualan Bahan Bangunan" value={income.penjualanBahan} onChange={(v) => updateIncome('penjualanBahan', v)} />
          <CurrencyInput label="27.b - Penjualan Barang Lainnya" value={income.penjualanLain} onChange={(v) => updateIncome('penjualanLain', v)} />
          
          <div className="result-box" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent-primary)', marginTop: '2rem' }}>
            <span className="result-label">Total Pendapatan Tahunan</span>
            <span className="result-value" style={{ color: 'var(--accent-primary)' }}>{formatCurrency(totalIncome)}</span>
          </div>
          
          <ProbingInput title="Estimasi Probing Pendapatan (Tahunan)" type="income" onChange={setAnnualOmsetProbing} />
        </div>

        {/* Kolom Pengeluaran */}
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '1.1rem' }}>📉 26. Rincian Pengeluaran Tahun 2025</h3>
          
          <CurrencyInput label="26.a - Upah dan Gaji Karyawan" value={expenses.upahGaji} onChange={(v) => updateExpense('upahGaji', v)} />
          <CurrencyInput label="26.b - Biaya Produksi (Pembelian Stok Semen, Besi, dll)" value={expenses.biayaProduksi} onChange={(v) => updateExpense('biayaProduksi', v)} />
          <CurrencyInput label="26.d - Biaya Operasional (Listrik, BBM, Perawatan)" value={expenses.biayaOperasional} onChange={(v) => updateExpense('biayaOperasional', v)} />
          <CurrencyInput label="26.e - Biaya Non-Operasional (Bunga Pinjaman Bank, dll)" value={expenses.biayaNonOperasional} onChange={(v) => updateExpense('biayaNonOperasional', v)} />

          <div className="result-box" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'var(--danger)', marginTop: '2rem' }}>
            <span className="result-label" style={{ color: 'var(--text-primary)' }}>Total Pengeluaran</span>
            <span className="result-value" style={{ color: 'var(--danger)' }}>{formatCurrency(totalExpense)}</span>
          </div>
          
          <ProbingInput title="Estimasi Probing Pengeluaran (Tahunan)" type="expense" onChange={setAnnualModalProbing} />
        </div>
      </div>

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
