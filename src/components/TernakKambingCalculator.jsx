import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';
import ProbingInput from './ProbingInput';
import { formatCurrency } from '../utils';

export default function TernakKambingCalculator() {
  const [expenses, setExpenses] = useState({
    bibit: 0,
    pakanHijauan: 0,
    pakanKonsentrat: 0,
    vitaminObat: 0,
    perlengkapanKandang: 0,
    transportasiBeli: 0,
    lainProduksi: 0,
    listrik: 0,
    air: 0,
    sewaKandang: 0,
    perawatanKandang: 0,
    transportasiOps: 0,
    tenagaKerjaHarian: 0,
    administrasiKomunikasi: 0,
    penyusutanPeralatan: 0,
    pajak: 0,
    sumbangan: 0,
    iuranAsuransi: 0,
    biayaLainNonOps: 0,
  });

  const [income, setIncome] = useState({
    penjualanKambing: 0,
    penjualanKotoran: 0,
    penjualanKulit: 0,
    penjualanAfkir: 0,
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
        <h2 className="card-title" style={{ color: 'var(--accent-primary)' }}>🐐 Kalkulator Peternakan Kambing Potong</h2>
      </div>

      <div className="grid-layout" style={{ gap: 'var(--spacing-md)' }}>
        {/* Kolom Pemasukan */}
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>📈 27.a Nilai Barang dan Jasa</h3>
          <CurrencyInput label="Penjualan Kambing Siap Potong" value={income.penjualanUtama} onChange={(v) => updateIncome('penjualanUtama', v)} />
          <CurrencyInput label="Penjualan Anakan (Cempe)" value={income.penjualanAnakan} onChange={(v) => updateIncome('penjualanAnakan', v)} />
          <CurrencyInput label="Penjualan Kotoran/Pupuk Kandang" value={income.penjualanKotoran} onChange={(v) => updateIncome('penjualanKotoran', v)} />
          <CurrencyInput label="Pendapatan Lainnya" value={income.pendapatanLainnya} onChange={(v) => updateIncome('pendapatanLainnya', v)} />
          
          <div className="result-box" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent-primary)', marginTop: '2rem' }}>
            <span className="result-label" style={{ color: 'var(--text-primary)' }}>Total Pendapatan</span>
            <span className="result-value" style={{ color: 'var(--accent-primary)' }}>{formatCurrency(totalIncome)}</span>
          </div>
          
          <ProbingInput title="Estimasi Probing Pendapatan (Tahunan)" type="income" onChange={setAnnualOmsetProbing} />
        </div>

        {/* Kolom Pengeluaran */}
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '1.1rem' }}>📉 Pengeluaran Usaha Peternakan</h3>
          
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.b Biaya Produksi</h4>
          <CurrencyInput label="Pembelian Bibit Kambing" value={expenses.bibit} onChange={(v) => updateExpense('bibit', v)} />
          <CurrencyInput label="Pakan Hijauan (rumput, daun)" value={expenses.pakanHijauan} onChange={(v) => updateExpense('pakanHijauan', v)} />
          <CurrencyInput label="Pakan Konsentrat (dedak, jagung)" value={expenses.pakanKonsentrat} onChange={(v) => updateExpense('pakanKonsentrat', v)} />
          <CurrencyInput label="Vitamin & Obat-obatan" value={expenses.vitaminObat} onChange={(v) => updateExpense('vitaminObat', v)} />
          <CurrencyInput label="Perlengkapan Kandang" value={expenses.perlengkapanKandang} onChange={(v) => updateExpense('perlengkapanKandang', v)} />
          <CurrencyInput label="Transportasi Pembelian" value={expenses.transportasiBeli} onChange={(v) => updateExpense('transportasiBeli', v)} />
          <CurrencyInput label="Lain-lain (Air, kecil-kecilan)" value={expenses.lainProduksi} onChange={(v) => updateExpense('lainProduksi', v)} />
          
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.d Biaya Operasional</h4>
          <CurrencyInput label="Listrik" value={expenses.listrik} onChange={(v) => updateExpense('listrik', v)} />
          <CurrencyInput label="Air" value={expenses.air} onChange={(v) => updateExpense('air', v)} />
          <CurrencyInput label="Sewa Kandang / Lahan" value={expenses.sewaKandang} onChange={(v) => updateExpense('sewaKandang', v)} />
          <CurrencyInput label="Perawatan Kandang" value={expenses.perawatanKandang} onChange={(v) => updateExpense('perawatanKandang', v)} />
          <CurrencyInput label="Transportasi" value={expenses.transportasiOps} onChange={(v) => updateExpense('transportasiOps', v)} />
          <CurrencyInput label="Tenaga Kerja Harian (Bila Ada)" value={expenses.tenagaKerjaHarian} onChange={(v) => updateExpense('tenagaKerjaHarian', v)} />
          <CurrencyInput label="Administrasi & Komunikasi" value={expenses.administrasiKomunikasi} onChange={(v) => updateExpense('administrasiKomunikasi', v)} />
          <CurrencyInput label="Penyusutan Peralatan" value={expenses.penyusutanPeralatan} onChange={(v) => updateExpense('penyusutanPeralatan', v)} />

          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.e Biaya Non-Operasional</h4>
          <CurrencyInput label="Pajak (PBB, retribusi)" value={expenses.pajak} onChange={(v) => updateExpense('pajak', v)} />
          <CurrencyInput label="Sumbangan / Keagamaan" value={expenses.sumbangan} onChange={(v) => updateExpense('sumbangan', v)} />
          <CurrencyInput label="Iuran / Asuransi Hewan" value={expenses.iuranAsuransi} onChange={(v) => updateExpense('iuranAsuransi', v)} />
          <CurrencyInput label="Biaya Lain-lain" value={expenses.biayaLainNonOps} onChange={(v) => updateExpense('biayaLainNonOps', v)} />

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
