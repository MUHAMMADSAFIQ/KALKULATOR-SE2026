import React, { useState } from 'react';
import { Sprout } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import ProbingInput from './ProbingInput';
import { formatCurrency, saveToArchive } from '../utils';
import ActionMenu from './ActionMenu';
import TahunBerdiriSelector from './TahunBerdiriSelector';

export default function PeternakanCalculator({ activeKbli, namaResponden, initialData, onSaved, saveTrigger, onCollectData }) {
  const [tahunBerdiri, setTahunBerdiri] = useState(initialData?.rawState?.tahunBerdiri ?? '<=2025');
  const [bulanBerdiri, setBulanBerdiri] = useState(initialData?.rawState?.bulanBerdiri ?? 1);
  const bulanOperasi = tahunBerdiri === '2026' ? (12 - parseInt(bulanBerdiri) + 1) : 12;

  const [luasKandangMeter, setLuasKandangMeter] = useState(initialData?.rawState?.luasKandangMeter ?? '');

  const [expenses, setExpenses] = useState(initialData?.rawState?.expenses ?? {
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
    tenagaKerjaHarian: 0, // 26.a
    administrasiKomunikasi: 0,
    penyusutanPeralatan: 0,
    pajak: 0,
    sumbangan: 0,
    iuranAsuransi: 0,
    biayaLainNonOps: 0,
  });

  const [income, setIncome] = useState(initialData?.rawState?.income ?? {
    penjualanUtama: 0, // Kambing / Ayam / Entok
    penjualanAnakan: 0, // Cempe / DOC / Anakan
    penjualanLainnya: 0, // Telur dll
    penjualanKotoran: 0,
    pendapatanLainnya: 0,
  });

  const [showRincianPengeluaran, setShowRincianPengeluaran] = useState(false);
  const [showRincianPendapatan, setShowRincianPendapatan] = useState(false);

  // Probing State (Global)
  const [annualOmsetProbing, setAnnualOmsetProbing] = useState(initialData?.rawState?.annualOmsetProbing ?? 0);
  const [annualModalProbing, setAnnualModalProbing] = useState(initialData?.rawState?.annualModalProbing ?? 0);

  const rincianTotalExpense = Object.values(expenses).reduce((a, b) => a + b, 0);
  const totalExpense = showRincianPengeluaran ? rincianTotalExpense : annualModalProbing;

  const rincianTotalIncome = Object.values(income).reduce((a, b) => a + b, 0);
  const totalIncome = showRincianPendapatan ? rincianTotalIncome : annualOmsetProbing;

  const netProfit = totalIncome - totalExpense;

  const updateExpense = (key, value) => setExpenses(prev => ({ ...prev, [key]: value }));
  const updateIncome = (key, value) => setIncome(prev => ({ ...prev, [key]: value }));

  const getRawState = () => ({ tahunBerdiri, bulanBerdiri, luasKandangMeter, expenses, income, annualOmsetProbing, annualModalProbing, showRincianPengeluaran, showRincianPendapatan });

  const buildRecord = (status, catatan = '', namaDraft = '') => {
    return {
      status, 
      catatan,
      namaDraft: namaDraft || (typeof namaResponden !== 'undefined' ? namaResponden : ''),
      namaResponden: namaDraft || (typeof namaResponden !== 'undefined' ? namaResponden : ''),
      kbliCode: activeKbli?.code || '00000',
      namaUsaha: activeKbli?.name || 'Peternakan',
      kbliId: activeKbli?.id || 'peternakan',
      total_pendapatan: totalIncome,
      total_pengeluaran: totalExpense,
      labaBersihBulan: Math.round(netProfit / 12),
      labaBersihTahun: netProfit,
      rawState: getRawState()
    };
  };

  const handleSaveDraft = (namaDraft) => {
    saveToArchive(buildRecord('draft', '', namaDraft), initialData?.id);
    if(onSaved) onSaved();
  };

  const handleSaveFinal = (catatan) => {
    saveToArchive(buildRecord('final', catatan), initialData?.id);
    if(onSaved) onSaved();
  };

  const title = activeKbli?.name || "Kalkulator Peternakan";

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: 'var(--spacing-md)' }}>
      <div className="card-header" style={{ borderBottomColor: 'var(--accent-primary)' }}>
        <h2 className="card-title" style={{ color: 'var(--accent-primary)' }}>🐐 {title}</h2>
      </div>
      <TahunBerdiriSelector tahunBerdiri={tahunBerdiri} setTahunBerdiri={setTahunBerdiri} bulanBerdiri={bulanBerdiri} setBulanBerdiri={setBulanBerdiri} />

      <div style={{ padding: '0 1.5rem', marginTop: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Luas Lahan/Kandang (m²)</label>
        <input 
          type="number" 
          className="input-field" 
          placeholder="Masukkan luas dalam meter persegi..." 
          value={luasKandangMeter}
          onChange={(e) => setLuasKandangMeter(e.target.value)}
          min="0"
        />
      </div>

      <div className="grid-layout" style={{ gap: 'var(--spacing-md)' }}>
        {/* Kolom Pengeluaran */}
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--danger)', fontSize: '1.1rem', margin: 0 }}>📉 Pengeluaran Tahunan</h3>
            <button onClick={() => setShowRincianPengeluaran(!showRincianPengeluaran)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              {showRincianPengeluaran ? 'Tutup Rincian' : 'Buka Rincian'}
            </button>
          </div>
          
          {showRincianPengeluaran ? (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0' }}>26.a Tenaga Kerja (Bila Ada)</h4>
              <CurrencyInput label="Upah Pegawai/Buruh Kandang" value={expenses.tenagaKerjaHarian} onChange={(v) => updateExpense('tenagaKerjaHarian', v)} />

              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.b Biaya Produksi</h4>
              <CurrencyInput label="Pembelian Bibit/DOC/Anakan" value={expenses.bibit} onChange={(v) => updateExpense('bibit', v)} />
              <CurrencyInput label="Pakan Hijauan (Rumput, Daun)" value={expenses.pakanHijauan} onChange={(v) => updateExpense('pakanHijauan', v)} />
              <CurrencyInput label="Pakan Konsentrat (Dedak, Jagung, Pur)" value={expenses.pakanKonsentrat} onChange={(v) => updateExpense('pakanKonsentrat', v)} />
              <CurrencyInput label="Vaksin & Obat-obatan" value={expenses.vitaminObat} onChange={(v) => updateExpense('vitaminObat', v)} />
              <CurrencyInput label="Perlengkapan Kandang" value={expenses.perlengkapanKandang} onChange={(v) => updateExpense('perlengkapanKandang', v)} />
              <CurrencyInput label="Transportasi Pembelian" value={expenses.transportasiBeli} onChange={(v) => updateExpense('transportasiBeli', v)} />
              <CurrencyInput label="Lain-lain (Terkait Produksi)" value={expenses.lainProduksi} onChange={(v) => updateExpense('lainProduksi', v)} />
              
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.d Biaya Operasional</h4>
              <CurrencyInput label="Sewa Kandang / Lahan (Bila Menyewa)" value={expenses.sewaKandang} onChange={(v) => updateExpense('sewaKandang', v)} />
              <CurrencyInput label="Listrik" value={expenses.listrik} onChange={(v) => updateExpense('listrik', v)} />
              <CurrencyInput label="Air" value={expenses.air} onChange={(v) => updateExpense('air', v)} />
              <CurrencyInput label="Perawatan Kandang" value={expenses.perawatanKandang} onChange={(v) => updateExpense('perawatanKandang', v)} />
              <CurrencyInput label="Transportasi (Operasional)" value={expenses.transportasiOps} onChange={(v) => updateExpense('transportasiOps', v)} />
              <CurrencyInput label="Administrasi & Komunikasi" value={expenses.administrasiKomunikasi} onChange={(v) => updateExpense('administrasiKomunikasi', v)} />
              
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>26.e Biaya Non-Operasional</h4>
              <CurrencyInput label="Penyusutan Peralatan" value={expenses.penyusutanPeralatan} onChange={(v) => updateExpense('penyusutanPeralatan', v)} />
              <CurrencyInput label="Pajak (PBB, Retribusi)" value={expenses.pajak} onChange={(v) => updateExpense('pajak', v)} />
              <CurrencyInput label="Sumbangan / Keagamaan" value={expenses.sumbangan} onChange={(v) => updateExpense('sumbangan', v)} />
              <CurrencyInput label="Iuran / Asuransi Ternak" value={expenses.iuranAsuransi} onChange={(v) => updateExpense('iuranAsuransi', v)} />
              <CurrencyInput label="Biaya Lain-lain Non-Ops" value={expenses.biayaLainNonOps} onChange={(v) => updateExpense('biayaLainNonOps', v)} />

              <div style={{ marginTop: '0.8rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '4px', fontWeight: 'bold', borderLeft: '4px solid var(--danger)' }}>
                Total Rincian: {formatCurrency(rincianTotalExpense)}
              </div>
            </div>
          ) : (
            <CurrencyInput label="Total Langsung Pengeluaran Tahunan (Rp)" value={annualModalProbing} onChange={setAnnualModalProbing} />
          )}
        </div>

        {/* Kolom Pemasukan */}
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', margin: 0 }}>📈 Pendapatan Tahunan</h3>
            <button onClick={() => setShowRincianPendapatan(!showRincianPendapatan)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              {showRincianPendapatan ? 'Tutup Rincian' : 'Buka Rincian'}
            </button>
          </div>

          {showRincianPendapatan ? (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0' }}>27.a Nilai Barang dan Jasa</h4>
              <CurrencyInput label="Penjualan Ternak Utama (Siap Potong/Jual)" value={income.penjualanUtama} onChange={(v) => updateIncome('penjualanUtama', v)} />
              <CurrencyInput label="Penjualan Anakan (Cempe/DOC)" value={income.penjualanAnakan} onChange={(v) => updateIncome('penjualanAnakan', v)} />
              <CurrencyInput label="Penjualan Produk Lain (Telur, Susu, dll)" value={income.penjualanLainnya} onChange={(v) => updateIncome('penjualanLainnya', v)} />
              
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>27.b Pendapatan Lainnya</h4>
              <CurrencyInput label="Penjualan Kotoran / Pupuk Kandang" value={income.penjualanKotoran} onChange={(v) => updateIncome('penjualanKotoran', v)} />
              <CurrencyInput label="Pendapatan Lain-lainnya" value={income.pendapatanLainnya} onChange={(v) => updateIncome('pendapatanLainnya', v)} />
              
              <div style={{ marginTop: '0.8rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '4px', fontWeight: 'bold', borderLeft: '4px solid var(--success)' }}>
                Total Rincian: {formatCurrency(rincianTotalIncome)}
              </div>
            </div>
          ) : (
            <CurrencyInput label="Total Langsung Pendapatan Tahunan (Rp)" value={annualOmsetProbing} onChange={setAnnualOmsetProbing} />
          )}
        </div>
      </div>

      <div className="summary-card" style={{ marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
        {/* FASIH MAPPING */}
        {(() => {
          const fasihUpahBuruh = expenses.tenagaKerjaHarian;
          const fasihBiayaProduksi = expenses.bibit + expenses.pakanHijauan + expenses.pakanKonsentrat + expenses.vitaminObat + expenses.perlengkapanKandang + expenses.transportasiBeli + expenses.lainProduksi;
          const fasihSewaLainnya = expenses.sewaKandang;
          const fasihBiayaOperasional = expenses.listrik + expenses.air + expenses.perawatanKandang + expenses.transportasiOps + expenses.administrasiKomunikasi;
          const fasihBiayaNonOperasional = expenses.penyusutanPeralatan + expenses.pajak + expenses.sumbangan + expenses.iuranAsuransi + expenses.biayaLainNonOps;
          
          const autoTotalPengeluaran = fasihUpahBuruh + fasihBiayaProduksi + fasihSewaLainnya + fasihBiayaOperasional + fasihBiayaNonOperasional;
          // Use probing (global) if entered, otherwise use detailed auto
          const finalTotalPengeluaran = annualModalProbing > 0 ? annualModalProbing : autoTotalPengeluaran;

          const fasihTotalPendapatanUtama = income.penjualanUtama + income.penjualanAnakan + income.penjualanLainnya;
          const fasihPendapatanLain = income.penjualanKotoran + income.pendapatanLainnya;
          
          const autoTotalPendapatan = fasihTotalPendapatanUtama + fasihPendapatanLain;
          const finalTotalPendapatan = annualOmsetProbing > 0 ? annualOmsetProbing : autoTotalPendapatan;

          const fasihLabaBersih = finalTotalPendapatan - finalTotalPengeluaran;

          return (
            <div>
              <h3 style={{ color: '#f97316', marginBottom: '1rem', textAlign: 'center', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Sprout size={20} /> Siap Salin ke Aplikasi FASIH (Total Setahun)
              </h3>

              <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', borderLeft: '4px solid #f97316', lineHeight: '1.8' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>BLOK 26: PENGELUARAN TAHUNAN</div>
                
                {!showRincianPengeluaran && (
                  <p style={{ color: 'var(--warning)', fontSize: '0.85rem', marginBottom: '1rem' }}>⚠️ Anda menggunakan input pengeluaran Global. Rincian di bawah diabaikan, hanya total yang akan dihitung.</p>
                )}

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem', opacity: !showRincianPengeluaran ? 0.5 : 1 }}>
                    <span>26.a. Upah/Gaji Pegawai</span> <strong>{formatCurrency(showRincianPengeluaran ? fasihUpahBuruh : 0)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem', opacity: !showRincianPengeluaran ? 0.5 : 1 }}>
                    <span>26.b. Biaya Produksi (Bibit, Pakan, Obat)</span> <strong>{formatCurrency(showRincianPengeluaran ? fasihBiayaProduksi : 0)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem', opacity: !showRincianPengeluaran ? 0.5 : 1 }}>
                    <span>26.c. Biaya Jasa/Lainnya (Sewa Lahan)</span> <strong>{formatCurrency(showRincianPengeluaran ? fasihSewaLainnya : 0)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem', opacity: !showRincianPengeluaran ? 0.5 : 1 }}>
                    <span>26.d. Biaya Operasional (Listrik, Air, Transport)</span> <strong>{formatCurrency(showRincianPengeluaran ? fasihBiayaOperasional : 0)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem', opacity: !showRincianPengeluaran ? 0.5 : 1 }}>
                    <span>26.e. Biaya Non-Operasional (Pajak, Penyusutan)</span> <strong>{formatCurrency(showRincianPengeluaran ? fasihBiayaNonOperasional : 0)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '1rem', marginTop: '0.5rem', color: 'var(--danger)', fontWeight: 'bold' }}>
                    <span>26.f. TOTAL PENGELUARAN (a+b+c+d+e)</span> <strong>{formatCurrency(finalTotalPengeluaran)}</strong>
                  </li>
                </ul>

                <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginTop: '1.5rem' }}>BLOK 27: PENDAPATAN TAHUNAN</div>
                
                {!showRincianPendapatan && (
                  <p style={{ color: 'var(--warning)', fontSize: '0.85rem', marginBottom: '1rem' }}>⚠️ Anda menggunakan input pendapatan Global. Rincian di bawah diabaikan, hanya total yang akan dihitung.</p>
                )}

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem', opacity: !showRincianPendapatan ? 0.5 : 1 }}>
                    <span>27.a. Nilai Produksi (Jual Ternak, Telur)</span> <strong>{formatCurrency(showRincianPendapatan ? fasihTotalPendapatanUtama : 0)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem', opacity: !showRincianPendapatan ? 0.5 : 1 }}>
                    <span>27.b. Pendapatan Lainnya (Kotoran)</span> <strong>{formatCurrency(showRincianPendapatan ? fasihPendapatanLain : 0)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '1rem', marginTop: '0.5rem', color: 'var(--success)', fontWeight: 'bold' }}>
                    <span>27.c. TOTAL PENDAPATAN (a+b)</span> <strong>{formatCurrency(finalTotalPendapatan)}</strong>
                  </li>
                </ul>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', border: '1px solid var(--glass-border)', marginBottom: '1.5rem', color: fasihLabaBersih >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                  <span>LABA BERSIH SETAHUN (27.c - 26.f)</span>
                  <span>{formatCurrency(fasihLabaBersih)}</span>
                </div>
                
                <div style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                  (Rata-rata Laba per Bulan: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(fasihLabaBersih / 12)}</strong>)
                </div>

                <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>BLOK 28 & 29: ASET DAN KEPEMILIKAN</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>28.a & 28.b. Nilai Aset</span> <strong>Rp 0 (Lewati)</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>28.d. Luas Kandang/Lahan (m²)</span> <strong>{luasKandangMeter ? parseFloat(luasKandangMeter).toLocaleString('id-ID') : 0} m²</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>29.a. Kepemilikan Pribadi</span> <strong>100%</strong>
                  </li>
                </ul>
              </div>
              <div style={{ display: 'none' }}>
                <ActionMenu onSaveDraft={handleSaveDraft} onSaveFinal={handleSaveFinal} />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

