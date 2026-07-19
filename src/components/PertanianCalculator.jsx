import React, { useState } from 'react';
import { Wheat, Wallet, Sprout, Handshake } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import ProbingInput from './ProbingInput';
import { formatCurrency, saveToArchive } from '../utils';
import ActionMenu from './ActionMenu';
import BusinessConclusion from './BusinessConclusion';
import TahunBerdiriSelector from './TahunBerdiriSelector';

export default function PertanianCalculator({ activeKbli, namaResponden , initialData, onSaved }) {
  const [tahunBerdiri, setTahunBerdiri] = useState(initialData?.rawState?.tahunBerdiri ?? '<=2025');
  const [bulanBerdiri, setBulanBerdiri] = useState(initialData?.rawState?.bulanBerdiri ?? 1);
  const bulanOperasi = tahunBerdiri === '2026' ? (12 - parseInt(bulanBerdiri) + 1) : 12;

  // Lahan
  const [luasUbin, setLuasUbin] = useState(initialData?.rawState?.luasUbin ?? '');
  const [luasMeter, setLuasMeter] = useState(initialData?.rawState?.luasMeter ?? '');
  const [frekuensiPanen, setFrekuensiPanen] = useState(initialData?.rawState?.frekuensiPanen ?? 2);
  
  // Status Kepemilikan (Sawah Sendiri / Maro)
  const [statusKepemilikan, setStatusKepemilikan] = useState(initialData?.rawState?.statusKepemilikan ?? 'Sendiri'); // 'Sendiri', 'Maro'
  const [persentaseMaro, setPersentaseMaro] = useState(initialData?.rawState?.persentaseMaro ?? 50); // Bagian penggarap (default 50%)

  const UBIN_TO_M2 = 14.0625;

  const handleUbinChange = (e) => {
    const ubin = e.target.value;
    setLuasUbin(ubin);
    if (ubin) {
      const ubinVal = parseFloat(ubin);
      setLuasMeter((ubinVal * UBIN_TO_M2).toFixed(2));
      setExpenses(prev => ({
        ...prev,
        sewaTraktor: ubinVal * 3000,
        sewaLahan: statusKepemilikan === 'Sendiri' ? ubinVal * 350000 : 0
      }));
    } else {
      setLuasMeter('');
      setExpenses(prev => ({...prev, sewaTraktor: 0, sewaLahan: 0}));
    }
  };

  const handleMeterChange = (e) => {
    const m2 = e.target.value;
    setLuasMeter(m2);
    if (m2) {
      const ubinVal = parseFloat(m2) / UBIN_TO_M2;
      setLuasUbin(ubinVal.toFixed(2));
      setExpenses(prev => ({
        ...prev,
        sewaTraktor: ubinVal * 3000,
        sewaLahan: statusKepemilikan === 'Sendiri' ? ubinVal * 350000 : 0
      }));
    } else {
      setLuasUbin('');
      setExpenses(prev => ({...prev, sewaTraktor: 0, sewaLahan: 0}));
    }
  };

  const handleStatusChange = (mode) => {
    setStatusKepemilikan(mode);
    if (luasUbin) {
      const ubinVal = parseFloat(luasUbin);
      setExpenses(prev => ({
        ...prev,
        sewaLahan: mode === 'Sendiri' ? ubinVal * 350000 : 0
      }));
    }
  };
  
  // Mode Input Biaya Modal
  const [modeBiaya, setModeBiaya] = useState(initialData?.rawState?.modeBiaya ?? 'Global'); // 'Global', 'Rinci'
  const [modalGlobal, setModalGlobal] = useState(initialData?.rawState?.modalGlobal ?? 0);
  const [expenses, setExpenses] = useState(initialData?.rawState?.expenses ?? {
    benih: 0,
    pupuk: 0,
    pestisida: 0,
    sewaTraktor: 0,
    sewaLahan: 0,
    upahBuruh: 0,
    irigasi: 0,
  });

  // Mode Input Pendapatan
  const [modePendapatan, setModePendapatan] = useState(initialData?.rawState?.modePendapatan ?? 'Kuintal'); // 'Kuintal', 'Uang'
  const [jumlahKuintal, setJumlahKuintal] = useState(initialData?.rawState?.jumlahKuintal ?? '');
  const [hargaKuintal, setHargaKuintal] = useState(initialData?.rawState?.hargaKuintal ?? 650000);
  const [pendapatanUang, setPendapatanUang] = useState(initialData?.rawState?.pendapatanUang ?? 0);
  
  // Opsi Bawon (Biaya Panen)
  const [bawonFraction, setBawonFraction] = useState(initialData?.rawState?.bawonFraction ?? (1/7));

  // Kalkulasi
  const panenHasil = modePendapatan === 'Kuintal' 
    ? parseFloat(jumlahKuintal || 0) * parseFloat(hargaKuintal || 0)
    : parseFloat(pendapatanUang || 0);

  // 1. Potongan Bawon (Biaya Panen otomatis)
  const biayaBawon = panenHasil * bawonFraction;
  const sisaBawon = panenHasil - biayaBawon;

  // 2. Bagi Hasil Lahan
  const pendapatanKotorPenggarap = statusKepemilikan === 'Maro' 
    ? sisaBawon * (persentaseMaro / 100) 
    : sisaBawon;

  // 3. Kurangi Modal Operasional (selain biaya panen)
  const totalExpense = modeBiaya === 'Global' 
    ? parseFloat(modalGlobal || 0) 
    : (parseFloat(expenses?.benih || 0) +
       parseFloat(expenses?.pupuk || 0) +
       parseFloat(expenses?.pestisida || 0) +
       parseFloat(expenses?.sewaTraktor || 0) +
       parseFloat(expenses?.upahBuruh || 0) +
       parseFloat(expenses?.irigasi || 0));

  const profitSetelahMaro = pendapatanKotorPenggarap - totalExpense;

  const netProfitTahunan = (profitSetelahMaro * frekuensiPanen);

  const updateExpense = (key, value) => setExpenses(prev => ({ ...prev, [key]: value }));

  
  const getRawState = () => ({ luasUbin, luasMeter, frekuensiPanen, statusKepemilikan, persentaseMaro, modeBiaya, modalGlobal, expenses, modePendapatan, jumlahKuintal, hargaKuintal, pendapatanUang, bawonFraction });

  const buildRecord = (status, catatan = '', namaDraft = '') => {
    const defaultTotalIncome = typeof totalIncome !== 'undefined' ? totalIncome : (typeof netProfitTahunan !== 'undefined' ? netProfitTahunan : (typeof panenHasil !== 'undefined' ? panenHasil * frekuensiPanen : (typeof income !== 'undefined' ? income : 0)));
    const defaultTotalExpense = typeof totalExpense !== 'undefined' ? totalExpense : (typeof expense !== 'undefined' ? expense : 0);
    const defaultNetTahunan = typeof netProfitTahunan !== 'undefined' ? netProfitTahunan : (typeof labaTahun !== 'undefined' ? labaTahun : 0);
    
    return {
      status, // 'draft' | 'final'
      catatan,
      namaDraft: namaDraft || (typeof namaResponden !== 'undefined' ? namaResponden : ''),
      namaResponden: namaDraft || (typeof namaResponden !== 'undefined' ? namaResponden : ''),
      kbliCode: (typeof activeKbli !== 'undefined' && activeKbli?.code) ? activeKbli.code : '00000',
      namaUsaha: (typeof activeKbli !== 'undefined' && activeKbli?.name) ? activeKbli.name : 'Usaha',
      kbliId: (typeof activeKbli !== 'undefined' && activeKbli?.id) ? activeKbli.id : 'unknown',
      total_pendapatan: defaultTotalIncome,
      total_pengeluaran: defaultTotalExpense,
      labaBersihBulan: Math.round(defaultNetTahunan / 12),
      labaBersihTahun: defaultNetTahunan,
      rawState: { ...getRawState(), tahunBerdiri, bulanBerdiri }
    };
  };

  const handleSaveDraft = (namaDraft) => {
    saveToArchive(buildRecord('draft', '', namaDraft), initialData?.id);
    if(onSaved) onSaved();
  };

  const handleSaveFinal = (namaRecord, catatan) => {
    saveToArchive(buildRecord('final', catatan, namaRecord), initialData?.id);
    if(onSaved) onSaved();
  };
  
  const title = activeKbli?.name || "Kalkulator Usaha Pertanian";

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: 'var(--spacing-md)' }}>
      <div className="card-header" style={{ borderBottomColor: 'var(--accent-primary)' }}>
        <h2 className="card-title" style={{ color: 'var(--accent-primary)' }}><Wheat size={24} color="var(--accent-primary)" /> {title}</h2>
      </div>
      <TahunBerdiriSelector tahunBerdiri={tahunBerdiri} setTahunBerdiri={setTahunBerdiri} bulanBerdiri={bulanBerdiri} setBulanBerdiri={setBulanBerdiri} />

      <div className="calculation-section" style={{ marginBottom: '2rem' }}>
        <div className="section-header">
          <span className="section-icon"><Sprout size={24} color="var(--success)" /></span>
          <h3 className="section-title">Informasi & Status Lahan</h3>
        </div>
        
        <div className="grid-layout" style={{ gap: 'var(--spacing-md)', marginBottom: '1.5rem' }}>
          <div className="input-group">
            <label>Konversi Luas (Ubin)</label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="Misal: 100"
              value={luasUbin}
              onChange={handleUbinChange}
              onFocus={(e) => e.target.select()}
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent-primary)' }}
            />
          </div>
          <div className="input-group">
            <label>Konversi Luas (m²)</label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="Otomatis"
              value={luasMeter}
              onChange={handleMeterChange}
              onFocus={(e) => e.target.select()}
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent-primary)' }}
            />
          </div>
          <div className="input-group">
            <label>Frekuensi Panen (dalam setahun)</label>
            <input 
              type="number" 
              className="input-field" 
              value={frekuensiPanen}
              onChange={(e) => setFrekuensiPanen(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>

        <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Status Kepemilikan Lahan</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {['Sendiri', 'Maro'].map((mode) => (
            <button 
              key={mode}
              onClick={() => handleStatusChange(mode)}
              style={{ 
                flex: 1, padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                background: statusKepemilikan === mode ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: statusKepemilikan === mode ? 'white' : 'var(--text-secondary)',
                fontWeight: statusKepemilikan === mode ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              {mode === 'Sendiri' ? <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}><Sprout size={16}/> Sawah Sendiri</span> : <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}><Handshake size={16}/> Bagi Hasil (Maro)</span>}
            </button>
          ))}
        </div>
        
        {statusKepemilikan === 'Maro' && (
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <label style={{ color: 'var(--text-secondary)', width: '200px' }}>Persentase Bagian Anda:</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
              <input 
                type="range" 
                min="10" max="90" step="5"
                value={persentaseMaro}
                onChange={(e) => setPersentaseMaro(e.target.value)}
                style={{ flex: 1 }}
              />
              <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)', width: '50px' }}>{persentaseMaro}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid-layout">
        {/* KOLOM PENGELUARAN */}
        <div className="calculation-section">
          <div className="section-header">
            <span className="section-icon"><Wallet size={24} color="var(--danger)" /></span>
            <h3 className="section-title">Modal / Pengeluaran (Per Panen)</h3>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={() => setModeBiaya('Global')} className="action-btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', background: modeBiaya === 'Global' ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--accent-primary)', color: modeBiaya === 'Global' ? 'white' : 'var(--accent-primary)' }}>Input Keseluruhan</button>
            <button onClick={() => setModeBiaya('Rinci')} className="action-btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', background: modeBiaya === 'Rinci' ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--accent-primary)', color: modeBiaya === 'Rinci' ? 'white' : 'var(--accent-primary)' }}>Input Satu-Satu</button>
          </div>

          {modeBiaya === 'Global' ? (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <CurrencyInput label="Total Modal Sekali Tanam (Gabungan)" value={modalGlobal} onChange={setModalGlobal} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                *Gabungan biaya pupuk, obat, traktor, & buruh tanam (biaya panen sudah terpotong otomatis).
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <CurrencyInput label="Benih / Bibit" value={expenses.benih} onChange={(v) => updateExpense('benih', v)} />
              <CurrencyInput label="Pupuk" value={expenses.pupuk} onChange={(v) => updateExpense('pupuk', v)} />
              <CurrencyInput label="Obat / Pestisida" value={expenses.pestisida} onChange={(v) => updateExpense('pestisida', v)} />
              <CurrencyInput label="Sewa Traktor / Bajak (Auto)" value={expenses.sewaTraktor} onChange={(v) => updateExpense('sewaTraktor', v)} />
              <CurrencyInput label="Sewa Lahan (Hanya info - tdk potong laba)" value={expenses.sewaLahan} onChange={(v) => updateExpense('sewaLahan', v)} />
              <CurrencyInput label="Upah Buruh Tanam (Panen sdh otomatis dipotong)" value={expenses.upahBuruh} onChange={(v) => updateExpense('upahBuruh', v)} />
              <CurrencyInput label="Biaya Irigasi / Air" value={expenses.irigasi} onChange={(v) => updateExpense('irigasi', v)} />
            </div>
          )}

          <div className="subtotal" style={{ marginTop: '1rem', color: 'var(--danger)' }}>
            <span>Total Modal/Biaya:</span>
            <span>{formatCurrency(totalExpense)}</span>
          </div>
        </div>

        {/* KOLOM PENDAPATAN */}
        <div className="calculation-section">
          <div className="section-header">
            <span className="section-icon"><Wheat size={24} color="var(--accent-primary)" /></span>
            <h3 className="section-title">Pendapatan (Per Panen)</h3>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={() => setModePendapatan('Kuintal')} className="action-btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', background: modePendapatan === 'Kuintal' ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--accent-primary)', color: modePendapatan === 'Kuintal' ? 'white' : 'var(--accent-primary)' }}>Input Kuintal</button>
            <button onClick={() => setModePendapatan('Uang')} className="action-btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', background: modePendapatan === 'Uang' ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--accent-primary)', color: modePendapatan === 'Uang' ? 'white' : 'var(--accent-primary)' }}>Input Uang</button>
          </div>

          {modePendapatan === 'Kuintal' ? (
            <>
              <div className="input-group">
                <label>Jumlah Hasil Panen (Kuintal)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={jumlahKuintal}
                  onChange={(e) => setJumlahKuintal(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="Misal: 15"
                />
              </div>
              <CurrencyInput label="Harga per Kuintal" value={hargaKuintal} onChange={setHargaKuintal} />
            </>
          ) : (
            <CurrencyInput label="Total Uang Pendapatan Sekali Panen" value={pendapatanUang} onChange={setPendapatanUang} />
          )}
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Biaya Panen (Bawon):</label>
            <select 
              value={bawonFraction} 
              onChange={(e) => setBawonFraction(parseFloat(e.target.value))}
              className="input-field"
              style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderColor: 'var(--accent-primary)', color: 'var(--text-primary)' }}
            >
              <option value={1/6}>1/6 (Sekitar 16.6%)</option>
              <option value={1/7}>1/7 (Sekitar 14.3%)</option>
              <option value={1/8}>1/8 (Sekitar 12.5%)</option>
              <option value={1/10}>1/10 (10%)</option>
              <option value={0}>Tidak ada (0%)</option>
            </select>
          </div>

          <div className="subtotal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Panen Kotor:</span>
              <span>{formatCurrency(panenHasil)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--danger)' }}>
              <span>Biaya Panen / Bawon:</span>
              <span>- {formatCurrency(biayaBawon)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
              <span>Total Bersih Panen:</span>
              <span>{formatCurrency(sisaBawon)}</span>
            </div>
          </div>
        </div>
      </div>


      <div className="summary-card" style={{ marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
        {/* FASIH MAPPING */}
        {(() => {
          const baseUpah = modeBiaya === 'Global' ? 0 : parseFloat(expenses?.upahBuruh || 0);
          const fasihUpahBuruh = (baseUpah + biayaBawon) * frekuensiPanen;

          const baseProduksi = modeBiaya === 'Global' ? parseFloat(modalGlobal || 0) : (parseFloat(expenses?.benih || 0) + parseFloat(expenses?.pupuk || 0) + parseFloat(expenses?.pestisida || 0) + parseFloat(expenses?.sewaTraktor || 0));
          const fasihBiayaProduksi = baseProduksi * frekuensiPanen;
          
          const baseSewaLahan = parseFloat(expenses?.sewaLahan || 0);
          const fasihSewaLahan = baseSewaLahan * frekuensiPanen;

          const baseOperasional = modeBiaya === 'Global' ? 0 : parseFloat(expenses?.irigasi || 0);
          const fasihBiayaOperasional = baseOperasional * frekuensiPanen;

          const fasihBiayaNonOperasional = 0;
          const fasihTotalPengeluaran = fasihUpahBuruh + fasihBiayaProduksi + fasihSewaLahan + fasihBiayaOperasional + fasihBiayaNonOperasional;

          const fasihTotalPendapatan = panenHasil * frekuensiPanen;
          const fasihPendapatanLainnya = 0;
          const fasihTotalProduksi = fasihTotalPendapatan + fasihPendapatanLainnya;

          const fasihLabaBersih = fasihTotalProduksi - fasihTotalPengeluaran;

          return (
            <div>
              <h3 style={{ color: '#f97316', marginBottom: '1rem', textAlign: 'center', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Sprout size={20} /> Siap Salin ke Aplikasi FASIH (Total Setahun)
              </h3>

              <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', borderLeft: '4px solid #f97316', lineHeight: '1.8' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>BLOK 26: PENGELUARAN TAHUNAN</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>26.a. Upah/Gaji & Sosial (Buruh Tanam + Bawon)</span> <strong>{formatCurrency(fasihUpahBuruh)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>26.b. Biaya Produksi (Benih, Pupuk, Obat, Traktor)</span> <strong>{formatCurrency(fasihBiayaProduksi)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>26.c. Biaya Jasa/Lainnya (Sewa Lahan)</span> <strong>{formatCurrency(fasihSewaLahan)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>26.d. Biaya Operasional (Irigasi/Air/Bensin)</span> <strong>{formatCurrency(fasihBiayaOperasional)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>26.e. Biaya Non-Operasional</span> <strong>{formatCurrency(fasihBiayaNonOperasional)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '1rem', marginTop: '0.5rem', color: 'var(--danger)', fontWeight: 'bold' }}>
                    <span>26.f. TOTAL PENGELUARAN (a+b+c+d+e)</span> <strong>{formatCurrency(fasihTotalPengeluaran)}</strong>
                  </li>
                </ul>

                <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginTop: '1.5rem' }}>BLOK 27: PENDAPATAN TAHUNAN</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>27.a. Nilai Produksi (Panen Kotor)</span> <strong>{formatCurrency(fasihTotalPendapatan)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>27.b. Pendapatan Lainnya</span> <strong>{formatCurrency(fasihPendapatanLainnya)}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '1rem', marginTop: '0.5rem', color: 'var(--success)', fontWeight: 'bold' }}>
                    <span>27.c. TOTAL PENDAPATAN (a+b)</span> <strong>{formatCurrency(fasihTotalProduksi)}</strong>
                  </li>
                </ul>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', border: '1px solid var(--glass-border)', marginBottom: '1.5rem', color: fasihLabaBersih >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                  <span>LABA BERSIH SETAHUN (27.c - 26.f)</span>
                  <span>{formatCurrency(fasihLabaBersih)}</span>
                </div>

                <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>BLOK 28 & 29: ASET DAN KEPEMILIKAN</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>28.a & 28.b. Nilai Aset</span> <strong>Rp 0 (Lewati)</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>28.d. Luas Tanah (m2)</span> <strong>{luasMeter ? parseFloat(luasMeter).toLocaleString('id-ID') : 0} m2</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
                    <span>29.a. Kepemilikan Pribadi</span> <strong>100%</strong>
                  </li>
                </ul>
              </div>
              <ActionMenu onSaveDraft={handleSaveDraft} onSaveFinal={handleSaveFinal} />
            </div>
          );
        })()}
      </div>
    </div>
  );
}
