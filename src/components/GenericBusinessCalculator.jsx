import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';
import ProbingInput from './ProbingInput';
import { formatCurrency, saveToArchive } from '../utils';

export default function GenericBusinessCalculator({ activeKbli, namaResponden, title = "Usaha Umum / Lainnya" }) {
  // Pengeluaran Umum
  const [expenses, setExpenses] = useState({
    gaji: 0,
    bahanBaku: 0,
    operasional: 0,
    sewa: 0,
    pajak: 0,
    lainnya: 0,
  });

  // Pemasukan Umum
  const [income, setIncome] = useState({
    omsetUtama: 0,
    pendapatanLain: 0,
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
      <div className="card-header" style={{ borderBottomColor: '#10b981' }}>
        <h2 className="card-title" style={{ color: '#10b981' }}>💼 Kalkulator Usaha: {title}</h2>
      </div>

      <div className="grid-layout" style={{ gap: 'var(--spacing-md)' }}>
        {/* Kolom Pemasukan */}
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <h3 style={{ color: 'var(--success)', marginBottom: '1rem', fontSize: '1.1rem' }}>📈 Total Pendapatan</h3>
          <CurrencyInput label="Omset / Penjualan Utama" value={income.omsetUtama} onChange={(v) => updateIncome('omsetUtama', v)} />
          <CurrencyInput label="Pendapatan Sampingan / Lainnya" value={income.pendapatanLain} onChange={(v) => updateIncome('pendapatanLain', v)} />
          
          <div className="result-box" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'var(--success)', marginTop: '2rem' }}>
            <span className="result-label" style={{ color: 'var(--text-primary)' }}>Total Pemasukan</span>
            <span className="result-value" style={{ color: 'var(--success)' }}>{formatCurrency(totalIncome)}</span>
          </div>
          
          <ProbingInput title="Estimasi Probing Omset (Tahunan)" type="income" onChange={setAnnualOmsetProbing} />
        </div>

        {/* Kolom Pengeluaran */}
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '1.1rem' }}>📉 Total Biaya Operasional</h3>
          <CurrencyInput label="Gaji / Upah Karyawan" value={expenses.gaji} onChange={(v) => updateExpense('gaji', v)} />
          <CurrencyInput label="Bahan Baku / Modal Dagang" value={expenses.bahanBaku} onChange={(v) => updateExpense('bahanBaku', v)} />
          <CurrencyInput label="Biaya Operasional (Listrik, Air, Transport)" value={expenses.operasional} onChange={(v) => updateExpense('operasional', v)} />
          <CurrencyInput label="Sewa Tempat Usaha" value={expenses.sewa} onChange={(v) => updateExpense('sewa', v)} />
          <CurrencyInput label="Pajak / Retribusi / Bunga Pinjaman" value={expenses.pajak} onChange={(v) => updateExpense('pajak', v)} />
          <CurrencyInput label="Pengeluaran Lainnya" value={expenses.lainnya} onChange={(v) => updateExpense('lainnya', v)} />
          
          <div className="result-box" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'var(--danger)' }}>
            <span className="result-label" style={{ color: 'var(--text-primary)' }}>Total Pengeluaran</span>
            <span className="result-value" style={{ color: 'var(--danger)' }}>{formatCurrency(totalExpense)}</span>
          </div>
          
          <ProbingInput title="Estimasi Probing Biaya Operasional (Tahunan)" type="expense" onChange={setAnnualModalProbing} />
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

          {/* Kesimpulan Manusiawi */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--accent-primary)', textAlign: 'left', fontStyle: 'italic', color: 'var(--text-primary)' }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontStyle: 'normal' }}>💬 Kesimpulan (Narasi Wawancara):</strong>
            "Berdasarkan pendapatan bulanan dan tahunan dikurangi biaya operasional, perkiraan penghasilan bersih dari usaha <strong>{title}</strong> ini adalah sekitar 
            <strong style={{ color: netProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}> {formatCurrency(netProfit / 12)} per bulannya</strong>. 
            Apakah menurut Bapak/Ibu angka ini wajar dengan kondisi sehari-hari?"
          </div>

          <button 
            className="action-btn"
            style={{ width: '100%', marginTop: '2rem', background: 'var(--success)', padding: '1rem', fontSize: '1.1rem' }}
            onClick={() => {
              if (!namaResponden) {
                alert("Mohon isi Nama Kepala Keluarga / Pemilik Usaha di bagian atas terlebih dahulu.");
                return;
              }
              saveToArchive({
                namaResponden: namaResponden,
                kbliCode: activeKbli?.code || '00000',
                namaUsaha: activeKbli?.name || title,
                labaBersihBulan: Math.round(netProfit / 12),
                labaBersihTahun: netProfit
              });
              alert("Data berhasil disimpan ke Arsip Offline!");
            }}
          >
            💾 Simpan Data ke Arsip
          </button>
        </div>
      </div>
    </div>
  );
}
