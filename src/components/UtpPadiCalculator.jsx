import React, { useState } from 'react';
import { Wheat, Wallet, Sprout, Handshake } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import ProbingInput from './ProbingInput';
import { formatCurrency, saveToArchive } from '../utils';
import ActionMenu from './ActionMenu';
import BusinessConclusion from './BusinessConclusion';
import TahunBerdiriSelector from './TahunBerdiriSelector';

export default function UtpPadiCalculator({ activeKbli, namaResponden , initialData, onSaved }) {
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
  
  // Kalkulasi
  const panenGabah = modePendapatan === 'Kuintal' 
    ? parseFloat(jumlahKuintal || 0) * parseFloat(hargaKuintal || 0)
    : parseFloat(pendapatanUang || 0);

  // 1. Potongan Bawon (Biaya Panen 1/7 otomatis)
  const biayaBawon = panenGabah * (1 / 7);
  const sisaBawon = panenGabah - biayaBawon;

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

  
  const getRawState = () => ({ luasUbin, luasMeter, frekuensiPanen, statusKepemilikan, persentaseMaro, modeBiaya, modalGlobal, expenses, modePendapatan, jumlahKuintal, hargaKuintal, pendapatanUang });

  const buildRecord = (status, catatan = '', namaDraft = '') => {
    const defaultTotalIncome = typeof totalIncome !== 'undefined' ? totalIncome : (typeof netProfitTahunan !== 'undefined' ? netProfitTahunan : (typeof panenGabah !== 'undefined' ? panenGabah * frekuensiPanen : (typeof income !== 'undefined' ? income : 0)));
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
  
  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: 'var(--spacing-md)' }}>
      <div className="card-header" style={{ borderBottomColor: 'var(--accent-primary)' }}>
        <h2 className="card-title" style={{ color: 'var(--accent-primary)' }}><Wheat size={24} color="var(--accent-primary)" /> Kalkulator UTP Padi Sawah</h2>
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
                <label>Jumlah Gabah (Kuintal)</label>
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
          
          <div className="subtotal" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Panen Kotor:</span>
              <span>{formatCurrency(panenGabah)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--danger)' }}>
              <span>Biaya Panen / Bawon (1/7):</span>
              <span>- {formatCurrency(biayaBawon)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
              <span>Total Bersih Panen (6/7):</span>
              <span>{formatCurrency(sisaBawon)}</span>
            </div>
          </div>
        </div>

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
                *Gabungan biaya pupuk, obat, traktor, & buruh tanam (biaya panen sudah terpotong otomatis 1/7).
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <CurrencyInput label="Benih / Bibit" value={expenses.benih} onChange={(v) => updateExpense('benih', v)} />
              <CurrencyInput label="Pupuk" value={expenses.pupuk} onChange={(v) => updateExpense('pupuk', v)} />
              <CurrencyInput label="Obat / Pestisida" value={expenses.pestisida} onChange={(v) => updateExpense('pestisida', v)} />
              <CurrencyInput label="Sewa Traktor / Bajak (Auto)" value={expenses.sewaTraktor} onChange={(v) => updateExpense('sewaTraktor', v)} />
              <CurrencyInput label="Sewa Lahan (Hanya info - tdk potong laba)" value={expenses.sewaLahan} onChange={(v) => updateExpense('sewaLahan', v)} />
              <CurrencyInput label="Upah Buruh Tanam (Panen sdh otomatis 1/7)" value={expenses.upahBuruh} onChange={(v) => updateExpense('upahBuruh', v)} />
              <CurrencyInput label="Biaya Irigasi / Air" value={expenses.irigasi} onChange={(v) => updateExpense('irigasi', v)} />
            </div>
          )}

          <div className="subtotal" style={{ marginTop: '1rem', color: 'var(--danger)' }}>
            <span>Total Modal/Biaya:</span>
            <span>{formatCurrency(totalExpense)}</span>
          </div>
        </div>
      </div>


      <div className="summary-card" style={{ marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Estimasi Pendapatan Bersih Setahun {statusKepemilikan === 'Maro' ? `(Bagian Anda: ${persentaseMaro}%)` : ''}
          </span>
          <span style={{ 
            fontFamily: 'Outfit', 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: netProfitTahunan >= 0 ? 'var(--success)' : 'var(--danger)',
            textShadow: netProfitTahunan >= 0 ? '0 0 15px rgba(16, 185, 129, 0.4)' : '0 0 15px rgba(239, 68, 68, 0.4)'
          }}>
            {formatCurrency(netProfitTahunan)}
          </span>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
            <span>Laba per Musim Tanam: {formatCurrency(profitSetelahMaro)}</span>
            <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>Rata-rata Bersih Per Bulan: {formatCurrency(netProfitTahunan / 12)}</span>
          </div>
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--accent-primary)', textAlign: 'left', fontStyle: 'italic', color: 'var(--text-primary)' }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontStyle: 'normal' }}>💬 Kesimpulan (Narasi Wawancara):</strong>
            "Berdasarkan data yang Bapak/Ibu berikan, lahan seluas 
            <strong style={{ color: 'var(--accent-primary)' }}> {luasUbin ? `${luasUbin} ubin` : '...'} </strong> 
            ini {statusKepemilikan === 'Maro' ? <span><strong>digarap secara bagi hasil ({persentaseMaro}%)</strong> dan </span> : ''} bisa dipanen <strong>{frekuensiPanen} kali setahun</strong>. 
            Setelah dipotong semua biaya modal (traktor, buruh, pupuk, dll), perkiraan penghasilan bersih Bapak/Ibu adalah sekitar 
            <strong style={{ color: netProfitTahunan >= 0 ? 'var(--success)' : 'var(--danger)' }}> {formatCurrency(netProfitTahunan / 12)} per bulannya</strong>. 
            Apakah kira-kira angka ini sudah sesuai dengan kenyataan sehari-hari?"
          </div>

          
      <>
        <BusinessConclusion namaResponden={typeof namaResponden !== 'undefined' ? namaResponden : ''} namaUsaha={typeof activeKbli !== 'undefined' && activeKbli?.name ? activeKbli.name : 'usaha ini'} totalIncome={panenGabah * frekuensiPanen} totalExpense={totalExpense * frekuensiPanen} netProfitTahunan={netProfitTahunan} expenseDetails={[{name: 'Benih', value: expenses?.benih || 0}, {name: 'Pupuk', value: expenses?.pupuk || 0}, {name: 'Pestisida', value: expenses?.pestisida || 0}, {name: 'Sewa Traktor', value: expenses?.sewaTraktor || 0}, {name: 'Sewa Lahan', value: expenses?.sewaLahan || 0}, {name: 'Upah Buruh', value: expenses?.upahBuruh || 0}, {name: 'Irigasi', value: expenses?.irigasi || 0}]} />
        <ActionMenu onSaveDraft={handleSaveDraft} onSaveFinal={handleSaveFinal} />
        {/* INJECTED_FUNCTIONS_PLACEHOLDER */}
      </>
    
        </div>
      </div>
    </div>
  );
}
