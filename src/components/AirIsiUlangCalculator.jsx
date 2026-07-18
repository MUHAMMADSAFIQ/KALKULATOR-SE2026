import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';
import ProbingInput from './ProbingInput';
import { formatCurrency, saveToArchive } from '../utils';
import ActionMenu from './ActionMenu';
import BusinessConclusion from './BusinessConclusion';

export default function AirIsiUlangCalculator({ initialData, onSaved }) {
  const [expenses, setExpenses] = useState(initialData?.rawState?.expenses ?? {
    upahGaji: 0,
    airBaku: 0,
    tutupTisuGalon: 0,
    filterKarbon: 0,
    listrikPompa: 0,
    bbmMotor: 0,
    biayaNonOperasional: 0,
  });

  const [income, setIncome] = useState(initialData?.rawState?.income ?? {
    galonTerjualPerHari: 0,
    hargaPerGalon: 0,
    hariBukaPerBulan: 0,
    pendapatanLainnya: 0, // Cuci galon kosong baru
  });

  // Probing State
  const [annualOmsetProbing, setAnnualOmsetProbing] = useState(initialData?.rawState?.annualOmsetProbing ?? 0);
  const [annualModalProbing, setAnnualModalProbing] = useState(initialData?.rawState?.annualModalProbing ?? 0);

  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0) + annualModalProbing;
  
  // Hitung Omzet Tahunan
  const omzetTahunan = (income.galonTerjualPerHari * income.hargaPerGalon * income.hariBukaPerBulan) * 12;
  const totalIncome = omzetTahunan + parseFloat(income.pendapatanLainnya || 0) + annualOmsetProbing;

  const netProfit = totalIncome - totalExpense;

  const updateExpense = (key, value) => setExpenses(prev => ({ ...prev, [key]: value }));
  const updateIncome = (key, value) => setIncome(prev => ({ ...prev, [key]: value }));

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: 'var(--spacing-md)' }}>
      <div className="card-header" style={{ borderBottomColor: '#0ea5e9' }}>
        <h2 className="card-title" style={{ color: '#0ea5e9' }}>💧 Kalkulator Usaha Air Isi Ulang Galon</h2>
      </div>

      <div className="grid-layout" style={{ gap: 'var(--spacing-md)' }}>
        {/* Kolom Pengeluaran */}
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '1.1rem' }}>📉 3. Pengeluaran (Rincian 26)</h3>
          
          <CurrencyInput label="26.a - Upah dan Gaji Kurir / Karyawan" value={expenses.upahGaji} onChange={(v) => updateExpense('upahGaji', v)} />
          
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.b Biaya Produksi</h4>
          <CurrencyInput label="Air Baku (Truk Tangki)" value={expenses.airBaku} onChange={(v) => updateExpense('airBaku', v)} />
          <CurrencyInput label="Tutup Galon & Tisu Galon" value={expenses.tutupTisuGalon} onChange={(v) => updateExpense('tutupTisuGalon', v)} />
          <CurrencyInput label="Penggantian Filter / Karbon Aktif" value={expenses.filterKarbon} onChange={(v) => updateExpense('filterKarbon', v)} />
          
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.d Biaya Operasional</h4>
          <CurrencyInput label="Listrik Pompa & Lampu UV" value={expenses.listrikPompa} onChange={(v) => updateExpense('listrikPompa', v)} />
          <CurrencyInput label="BBM Motor Pengantar" value={expenses.bbmMotor} onChange={(v) => updateExpense('bbmMotor', v)} />

          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.e Biaya Non-Operasional</h4>
          <CurrencyInput label="Pajak, Bunga Pinjaman, dll" value={expenses.biayaNonOperasional} onChange={(v) => updateExpense('biayaNonOperasional', v)} />

          <div className="result-box" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'var(--danger)', marginTop: '2rem' }}>
            <span className="result-label" style={{ color: 'var(--text-primary)' }}>Total Pengeluaran</span>
            <span className="result-value" style={{ color: 'var(--danger)' }}>{formatCurrency(totalExpense)}</span>
          </div>
          
          <ProbingInput title="Estimasi Probing Pengeluaran (Tahunan)" type="expense" onChange={setAnnualModalProbing} />
        </div>
      </div>
        {/* Kolom Pemasukan */}
        <div style={{ background: 'rgba(14, 165, 233, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
          <h3 style={{ color: '#0ea5e9', marginBottom: '1rem', fontSize: '1.1rem' }}>📈 2. Pendapatan / Omzet</h3>
          
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem', marginBottom: '0.5rem' }}>Rumus Omzet Tahunan</h4>
          
          <div className="input-group">
            <label>Galon Terjual Per Hari</label>
            <input type="number" className="input-field" value={income.galonTerjualPerHari} onChange={(e) => updateIncome('galonTerjualPerHari', e.target.value)} />
          </div>
          
          <CurrencyInput label="Harga Per Galon" value={income.hargaPerGalon} onChange={(v) => updateIncome('hargaPerGalon', v)} />
          
          <div className="input-group">
            <label>Hari Buka Per Bulan</label>
            <input type="number" className="input-field" value={income.hariBukaPerBulan} onChange={(e) => updateIncome('hariBukaPerBulan', e.target.value)} />
          </div>

          <div style={{ padding: '0.5rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Pendapatan Setahun (Omzet Utama): <br/>
            <strong style={{ color: '#0ea5e9', fontSize: '1.1rem' }}>{formatCurrency(omzetTahunan)}</strong>
          </div>

          <CurrencyInput label="27.b - Pendapatan Lainnya (Jasa pembersihan galon)" value={income.pendapatanLainnya} onChange={(v) => updateIncome('pendapatanLainnya', v)} />
          
          <div className="result-box" style={{ background: 'rgba(14, 165, 233, 0.2)', borderColor: '#0ea5e9', marginTop: '2rem' }}>
            <span className="result-label" style={{ color: 'var(--text-primary)' }}>Total Pendapatan Keseluruhan</span>
            <span className="result-value" style={{ color: '#0ea5e9' }}>{formatCurrency(totalIncome)}</span>
          </div>
          
          <ProbingInput title="Estimasi Probing Pendapatan (Tahunan)" type="income" onChange={setAnnualOmsetProbing} />
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
