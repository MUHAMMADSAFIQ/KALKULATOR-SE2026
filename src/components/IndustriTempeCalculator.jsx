import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';
import ProbingInput from './ProbingInput';
import { formatCurrency, saveToArchive } from '../utils';
import ActionMenu from './ActionMenu';
import BusinessConclusion from './BusinessConclusion';

export default function IndustriTempeCalculator({ initialData, onSaved }) {
  const [expenses, setExpenses] = useState(initialData?.rawState?.expenses ?? {
    upahGaji: 0,
    kedelai: 0,
    ragi: 0,
    plastik: 0,
    kayuBakarGas: 0,
    airProduksi: 0,
    bahanTambahan: 0,
    listrik: 0,
    bbm: 0,
    perawatanAlat: 0,
    pulsaInternet: 0,
    sewaKendaraan: 0,
    pajakRetribusi: 0,
    administrasiBank: 0,
  });

  const [income, setIncome] = useState(initialData?.rawState?.income ?? {
    penjualanTempe: 0,
    penjualanAmpas: 0,
    jasaPenggilingan: 0,
  });

  // Probing State
  const [annualOmsetProbing, setAnnualOmsetProbing] = useState(initialData?.rawState?.annualOmsetProbing ?? 0);
  const [annualModalProbing, setAnnualModalProbing] = useState(initialData?.rawState?.annualModalProbing ?? 0);

  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0) + annualModalProbing;
  const totalIncome = Object.values(income).reduce((a, b) => a + b, 0) + annualOmsetProbing;
  const netProfit = totalIncome - totalExpense;

  const updateExpense = (key, value) => setExpenses(prev => ({ ...prev, [key]: value }));
  const updateIncome = (key, value) => setIncome(prev => ({ ...prev, [key]: value }));

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: 'var(--spacing-md)' }}>
      <div className="card-header" style={{ borderBottomColor: '#d97706' }}>
        <h2 className="card-title" style={{ color: '#d97706' }}>🏭 Kalkulator Industri Tempe Rumah Tangga</h2>
      </div>

      <div className="grid-layout" style={{ gap: 'var(--spacing-md)' }}>
        {/* Kolom Pengeluaran */}
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '1.1rem' }}>📉 Pengeluaran Usaha Tempe</h3>
          
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.a Upah & Gaji</h4>
          <CurrencyInput label="Gaji Karyawan" value={expenses.upahGaji} onChange={(v) => updateExpense('upahGaji', v)} />
          
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.b Biaya Produksi</h4>
          <CurrencyInput label="Kedelai" value={expenses.kedelai} onChange={(v) => updateExpense('kedelai', v)} />
          <CurrencyInput label="Ragi Tempe" value={expenses.ragi} onChange={(v) => updateExpense('ragi', v)} />
          <CurrencyInput label="Plastik Pembungkus" value={expenses.plastik} onChange={(v) => updateExpense('plastik', v)} />
          <CurrencyInput label="Kayu Bakar / Gas" value={expenses.kayuBakarGas} onChange={(v) => updateExpense('kayuBakarGas', v)} />
          <CurrencyInput label="Air Produksi" value={expenses.airProduksi} onChange={(v) => updateExpense('airProduksi', v)} />
          <CurrencyInput label="Bahan Tambahan Lainnya" value={expenses.bahanTambahan} onChange={(v) => updateExpense('bahanTambahan', v)} />
          
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.d Biaya Operasional</h4>
          <CurrencyInput label="Listrik" value={expenses.listrik} onChange={(v) => updateExpense('listrik', v)} />
          <CurrencyInput label="BBM Distribusi" value={expenses.bbm} onChange={(v) => updateExpense('bbm', v)} />
          <CurrencyInput label="Perawatan Alat" value={expenses.perawatanAlat} onChange={(v) => updateExpense('perawatanAlat', v)} />
          <CurrencyInput label="Pulsa / Internet Usaha" value={expenses.pulsaInternet} onChange={(v) => updateExpense('pulsaInternet', v)} />
          <CurrencyInput label="Sewa Kendaraan" value={expenses.sewaKendaraan} onChange={(v) => updateExpense('sewaKendaraan', v)} />

          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.e Biaya Non-Operasional</h4>
          <CurrencyInput label="Pajak / Retribusi" value={expenses.pajakRetribusi} onChange={(v) => updateExpense('pajakRetribusi', v)} />
          <CurrencyInput label="Administrasi Bank" value={expenses.administrasiBank} onChange={(v) => updateExpense('administrasiBank', v)} />

          <div className="result-box" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'var(--danger)', marginTop: '2rem' }}>
            <span className="result-label" style={{ color: 'var(--text-primary)' }}>Total Pengeluaran</span>
            <span className="result-value" style={{ color: 'var(--danger)' }}>{formatCurrency(totalExpense)}</span>
          </div>
          
          <ProbingInput title="Estimasi Probing Biaya (Tahunan)" type="expense" onChange={setAnnualModalProbing} />
        </div>
      </div>
        {/* Kolom Pemasukan */}
        <div style={{ background: 'rgba(217, 119, 6, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(217, 119, 6, 0.2)' }}>
          <h3 style={{ color: '#d97706', marginBottom: '1rem', fontSize: '1.1rem' }}>📈 Pemasukan (Nilai Barang Jasa & Lainnya)</h3>
          <CurrencyInput label="27.a - Penjualan Tempe" value={income.penjualanTempe} onChange={(v) => updateIncome('penjualanTempe', v)} />
          <CurrencyInput label="27.a - Penjualan Ampas Kedelai" value={income.penjualanAmpas} onChange={(v) => updateIncome('penjualanAmpas', v)} />
          <CurrencyInput label="27.b - Pendapatan Lain (Jasa Penggilingan)" value={income.jasaPenggilingan} onChange={(v) => updateIncome('jasaPenggilingan', v)} />
          
          <div className="result-box" style={{ background: 'rgba(217, 119, 6, 0.1)', borderColor: '#d97706', marginTop: '2rem' }}>
            <span className="result-label" style={{ color: 'var(--text-primary)' }}>Total Pendapatan</span>
            <span className="result-value" style={{ color: '#d97706' }}>{formatCurrency(totalIncome)}</span>
          </div>
          
          <ProbingInput title="Estimasi Probing Omset (Tahunan)" type="income" onChange={setAnnualOmsetProbing} />
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
