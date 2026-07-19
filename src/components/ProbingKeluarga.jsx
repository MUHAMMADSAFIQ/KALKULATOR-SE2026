import React, { useState } from 'react';
import { Home, User, Info, DollarSign, Package, Save } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import ActionMenu from './ActionMenu';
import { formatCurrency, saveToArchive } from '../utils';

export default function ProbingKeluarga({ initialData, onSaved }) {
  // Identitas & Administrasi (Optional/Header)
  const [namaKK, setNamaKK] = useState(initialData?.rawState?.namaKK ?? '');
  const [noBangunan, setNoBangunan] = useState(initialData?.rawState?.noBangunan ?? '');

  // Blok 15
  const [listrik, setListrik] = useState(initialData?.rawState?.listrik ?? 0);
  const [internet, setInternet] = useState(initialData?.rawState?.internet ?? 0);

  // Blok 16
  // Makan Seminggu Helper
  const [makanSehari, setMakanSehari] = useState(initialData?.rawState?.makanSehari ?? 0);
  const [makanSemingguManual, setMakanSemingguManual] = useState(initialData?.rawState?.makanSemingguManual ?? 0);
  const isMakanHelperMode = makanSehari > 0;
  const makanSeminggu = isMakanHelperMode ? makanSehari * 7 : makanSemingguManual;

  // Bukan Makan Bulanan Helper
  const [bukanMakanBulanan, setBukanMakanBulanan] = useState(initialData?.rawState?.bukanMakanBulanan ?? 0);
  const [showBulananHelper, setShowBulananHelper] = useState(false);
  const [b_air, setB_air] = useState(initialData?.rawState?.b_air ?? 0);
  const [b_transport, setB_transport] = useState(initialData?.rawState?.b_transport ?? 0);
  const [b_spp, setB_spp] = useState(initialData?.rawState?.b_spp ?? 0);
  const [b_sabun, setB_sabun] = useState(initialData?.rawState?.b_sabun ?? 0);
  const [b_lain, setB_lain] = useState(initialData?.rawState?.b_lain ?? 0);
  const totalHelperBulanan = b_air + b_transport + b_spp + b_sabun + b_lain;

  // Bukan Makan Tahunan Helper
  const [bukanMakanTahunan, setBukanMakanTahunan] = useState(initialData?.rawState?.bukanMakanTahunan ?? 0);
  const [showTahunanHelper, setShowTahunanHelper] = useState(false);
  const [t_pbb, setT_pbb] = useState(initialData?.rawState?.t_pbb ?? 0);
  const [t_pajak, setT_pajak] = useState(initialData?.rawState?.t_pajak ?? 0);
  const [t_baju, setT_baju] = useState(initialData?.rawState?.t_baju ?? 0);
  const [t_acara, setT_acara] = useState(initialData?.rawState?.t_acara ?? 0);
  const [t_lain, setT_lain] = useState(initialData?.rawState?.t_lain ?? 0);
  const totalHelperTahunan = t_pbb + t_pajak + t_baju + t_acara + t_lain;

  // Pendapatan & Pengeluaran
  const [pendapatanSebulan, setPendapatanSebulan] = useState(initialData?.rawState?.pendapatanSebulan ?? 0);
  
  // Rumus FASIH (sebulan = 4 minggu)
  const actualBukanMakanBulanan = showBulananHelper ? totalHelperBulanan : bukanMakanBulanan;
  const actualBukanMakanTahunan = showTahunanHelper ? totalHelperTahunan : bukanMakanTahunan;
  const pengeluaranSebulan = listrik + internet + (makanSeminggu * 4) + actualBukanMakanBulanan + (actualBukanMakanTahunan / 12);
  const selisih = pendapatanSebulan - pengeluaranSebulan;

  // Kepemilikan Aset (Blok 17 dsb)
  const [gas3kg, setGas3kg] = useState(initialData?.rawState?.gas3kg ?? 0);
  const [gas5kg, setGas5kg] = useState(initialData?.rawState?.gas5kg ?? 0);
  const [kulkas, setKulkas] = useState(initialData?.rawState?.kulkas ?? 0);
  const [ac, setAc] = useState(initialData?.rawState?.ac ?? 0);
  const [motor, setMotor] = useState(initialData?.rawState?.motor ?? 0);
  const [mobil, setMobil] = useState(initialData?.rawState?.mobil ?? 0);
  const [emas, setEmas] = useState(initialData?.rawState?.emas ?? 0);
  const [komputer, setKomputer] = useState(initialData?.rawState?.komputer ?? 0);
  const [luasTanahLain, setLuasTanahLain] = useState(initialData?.rawState?.luasTanahLain ?? 0); // m2
  const [luasSawah, setLuasSawah] = useState(initialData?.rawState?.luasSawah ?? 0); // ubin
  const [nilaiBangunanLain, setNilaiBangunanLain] = useState(initialData?.rawState?.nilaiBangunanLain ?? 0); // Rp

  const totalNilaiTanahSawah = (luasTanahLain * 1000000) + (luasSawah * 350000);

  const getRawState = () => ({
    namaKK, noBangunan,
    listrik, internet,
    makanSehari, makanSemingguManual, makanSeminggu,
    bukanMakanBulanan: actualBukanMakanBulanan,
    bukanMakanTahunan: actualBukanMakanTahunan,
    pendapatanSebulan, pengeluaranSebulan, selisih,
    gas3kg, gas5kg, kulkas, ac, motor, mobil, emas, komputer, luasTanahLain, luasSawah, nilaiBangunanLain, totalNilaiTanahSawah,
    b_air, b_transport, b_spp, b_sabun, b_lain,
    t_pbb, t_pajak, t_baju, t_acara, t_lain
  });

  const buildRecord = (status, catatan = '', namaDraft = '') => {
    return {
      status, 
      catatan,
      namaDraft: namaDraft || namaKK || 'Draft FASIH',
      namaResponden: namaKK || 'Keluarga Anonim',
      namaUsaha: 'Sensus Keluarga',
      kbliCode: 'RT-000',
      total_pendapatan: pendapatanSebulan, 
      total_pengeluaran: pengeluaranSebulan,
      labaBersihBulan: selisih, 
      labaBersihTahun: selisih * 12, 
      rawState: getRawState(),
      timestamp: new Date().toISOString()
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
    <div className="glass-card fade-in-up" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
      <div className="card-header" style={{ borderBottomColor: '#f97316', background: 'rgba(249, 115, 22, 0.1)' }}>
        <h2 className="card-title" style={{ color: '#f97316', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Home size={24} /> SE2026 - L BLOK IV (Catatan)
        </h2>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div className="grid-layout" style={{ gap: '1rem', marginBottom: '2rem' }}>
          <div className="input-group">
            <label>Nama Kepala Keluarga / Responden</label>
            <input type="text" className="input-field" value={namaKK} onChange={(e) => setNamaKK(e.target.value)} placeholder="Opsional untuk diingat" />
          </div>
          <div className="input-group">
            <label>No. Bangunan Sensus</label>
            <input type="text" className="input-field" value={noBangunan} onChange={(e) => setNoBangunan(e.target.value)} placeholder="001" />
          </div>
        </div>

        {/* BLOK 15 */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
          <CurrencyInput 
            label="15. a. Berapa nilai pengeluaran listrik sebulan?" 
            value={listrik} 
            onChange={setListrik} 
          />
          <CurrencyInput 
            label="15. b. Berapa pengeluaran pulsa dan internet seluruh anggota keluarga sebulan?" 
            value={internet} 
            onChange={setInternet} 
          />
        </div>

        {/* BLOK 16 */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              16. a. Berapa rata-rata pengeluaran makanan keluarga seminggu?
            </label>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
              <CurrencyInput 
                label="(Alat Bantu) Makan Sehari x 7" 
                value={makanSehari} 
                onChange={setMakanSehari} 
              />
              <div style={{ textAlign: 'center', margin: '0.5rem 0', color: 'var(--text-secondary)' }}>ATAU ISI MANUAL SEMINGGU</div>
              <CurrencyInput 
                label="Manual Seminggu (Rp)" 
                value={makanSemingguManual} 
                onChange={(v) => {
                  setMakanSemingguManual(v);
                  if (v > 0) setMakanSehari(0); // clear helper if manual typed
                }} 
              />
              <div style={{ marginTop: '0.8rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '4px', fontWeight: 'bold', borderLeft: '4px solid var(--success)' }}>
                Hasil 16.a: {formatCurrency(makanSeminggu)}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                16. b. Berapa rata-rata pengeluaran BUKAN makanan rutin keluarga bulanan?
              </label>
              <button onClick={() => setShowBulananHelper(!showBulananHelper)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                {showBulananHelper ? 'Tutup Rincian' : 'Buka Rincian'}
              </button>
            </div>
            
            {showBulananHelper ? (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                <CurrencyInput label="Air / PDAM" value={b_air} onChange={setB_air} />
                <CurrencyInput label="Transportasi / Bensin" value={b_transport} onChange={setB_transport} />
                <CurrencyInput label="SPP / Sekolah" value={b_spp} onChange={setB_spp} />
                <CurrencyInput label="Sabun / Kebersihan" value={b_sabun} onChange={setB_sabun} />
                <CurrencyInput label="Lain-lain" value={b_lain} onChange={setB_lain} />
                <div style={{ marginTop: '0.8rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '4px', fontWeight: 'bold', borderLeft: '4px solid var(--success)' }}>
                  Total Rincian Bulanan: {formatCurrency(totalHelperBulanan)}
                </div>
              </div>
            ) : (
              <CurrencyInput 
                label="Total Langsung Bulanan (Rp)" 
                value={bukanMakanBulanan} 
                onChange={setBukanMakanBulanan} 
              />
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                16. c. Berapa rata-rata pengeluaran BUKAN makanan rutin keluarga TAHUNAN?
              </label>
              <button onClick={() => setShowTahunanHelper(!showTahunanHelper)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                {showTahunanHelper ? 'Tutup Rincian' : 'Buka Rincian'}
              </button>
            </div>
            
            {showTahunanHelper ? (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                <CurrencyInput label="PBB" value={t_pbb} onChange={setT_pbb} />
                <CurrencyInput label="Pajak Kendaraan" value={t_pajak} onChange={setT_pajak} />
                <CurrencyInput label="Pakaian / Lebaran" value={t_baju} onChange={setT_baju} />
                <CurrencyInput label="Acara Tradisi/Sosial" value={t_acara} onChange={setT_acara} />
                <CurrencyInput label="Lain-lain Tahunan" value={t_lain} onChange={setT_lain} />
                <div style={{ marginTop: '0.8rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '4px', fontWeight: 'bold', borderLeft: '4px solid var(--success)' }}>
                  Total Rincian Tahunan: {formatCurrency(totalHelperTahunan)}
                </div>
              </div>
            ) : (
              <CurrencyInput 
                label="Total Langsung Tahunan (Rp)" 
                value={bukanMakanTahunan} 
                onChange={setBukanMakanTahunan} 
              />
            )}
          </div>
        </div>

        {/* PENDAPATAN & PENGELUARAN */}
        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <CurrencyInput 
            label="Total Pendapatan Keluarga Sebulan (Rp)" 
            value={pendapatanSebulan} 
            onChange={setPendapatanSebulan} 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', borderLeft: '4px solid var(--danger)' }}>
              <span style={{ fontWeight: 'bold' }}>Total Pengeluaran Keluarga Sebulan (Rp)</span>
              <span style={{ fontWeight: 'bold', color: 'var(--danger)' }}>{formatCurrency(pengeluaranSebulan)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: selisih >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', borderLeft: `4px solid ${selisih >= 0 ? 'var(--success)' : 'var(--danger)'}` }}>
              <span style={{ fontWeight: 'bold' }}>Selisih Pendapatan dan Pengeluaran (Rp)</span>
              <span style={{ fontWeight: 'bold', color: selisih >= 0 ? 'var(--success)' : 'var(--danger)' }}>{formatCurrency(selisih)}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'right' }}>
            *Pengeluaran Sebulan = 15a + 15b + (16a x 4) + 16b + (16c / 12)
          </p>
        </div>

        {/* BLOK 17 & ASET LAINNYA */}
        <div className="calculation-section" style={{ background: 'transparent' }}>
          <div className="section-header">
            <span className="section-icon"><Package size={20} color="#f97316" /></span>
            <h3 className="section-title" style={{ color: '#f97316' }}>KETERANGAN KEPEMILIKAN ASET</h3>
          </div>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Apakah keluarga ini memiliki barang-barang sebagai berikut? Berapa jumlahnya? :</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div className="input-group">
              <label>Tabung gas 3 kg (unit)</label>
              <input type="number" className="input-field" value={gas3kg} onChange={(e) => setGas3kg(parseInt(e.target.value) || 0)} min="0" />
            </div>
            <div className="input-group">
              <label>Tabung gas 5,5 kg atau lebih (unit)</label>
              <input type="number" className="input-field" value={gas5kg} onChange={(e) => setGas5kg(parseInt(e.target.value) || 0)} min="0" />
            </div>
            <div className="input-group">
              <label>Lemari es/kulkas (unit)</label>
              <input type="number" className="input-field" value={kulkas} onChange={(e) => setKulkas(parseInt(e.target.value) || 0)} min="0" />
            </div>
            <div className="input-group">
              <label>AC (unit)</label>
              <input type="number" className="input-field" value={ac} onChange={(e) => setAc(parseInt(e.target.value) || 0)} min="0" />
            </div>
            <div className="input-group">
              <label>Sepeda Motor (unit)</label>
              <input type="number" className="input-field" value={motor} onChange={(e) => setMotor(parseInt(e.target.value) || 0)} min="0" />
            </div>
            <div className="input-group">
              <label>Mobil (unit)</label>
              <input type="number" className="input-field" value={mobil} onChange={(e) => setMobil(parseInt(e.target.value) || 0)} min="0" />
            </div>
            <div className="input-group">
              <label>Komputer / Laptop (unit)</label>
              <input type="number" className="input-field" value={komputer} onChange={(e) => setKomputer(parseInt(e.target.value) || 0)} min="0" />
            </div>
            <div className="input-group">
              <label>Perhiasan Emas (gram)</label>
              <input type="number" className="input-field" value={emas} onChange={(e) => setEmas(parseInt(e.target.value) || 0)} min="0" />
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 'bold' }}>Aset Tanah & Bangunan (Selain Tempat Tinggal):</p>
              <div className="input-group">
                <label>Luas Tanah Lainnya (m²)</label>
                <input type="number" className="input-field" value={luasTanahLain} onChange={(e) => setLuasTanahLain(parseFloat(e.target.value) || 0)} min="0" placeholder="Otomatis dihitung Rp 1.000.000/m²" />
              </div>
              <div className="input-group">
                <label>Luas Sawah (Ubin)</label>
                <input type="number" className="input-field" value={luasSawah} onChange={(e) => setLuasSawah(parseFloat(e.target.value) || 0)} min="0" placeholder="Otomatis dihitung Rp 350.000/ubin" />
              </div>
              <CurrencyInput 
                label="Nilai Bangunan Lain (Rp)" 
                value={nilaiBangunanLain} 
                onChange={setNilaiBangunanLain} 
              />
              <div style={{ marginTop: '0.8rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '4px', fontWeight: 'bold', borderLeft: '4px solid var(--success)' }}>
                Taksiran Nilai Tanah & Sawah: {formatCurrency(totalNilaiTanahSawah)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="summary-card" style={{ marginTop: '0', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
        <h3 style={{ color: '#f97316', marginBottom: '1rem', textAlign: 'center', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Info size={20} /> Siap Salin ke Aplikasi FASIH
        </h3>
        
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', borderLeft: '4px solid #f97316', lineHeight: '1.8' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
              <span>15.a. Listrik</span> <strong>{formatCurrency(listrik)}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
              <span>15.b. Pulsa/Internet</span> <strong>{formatCurrency(internet)}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
              <span>16.a. Makanan Seminggu</span> <strong style={{ color: 'var(--danger)' }}>{formatCurrency(makanSeminggu)}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
              <span>16.b. Bukan Makan Bulanan</span> <strong style={{ color: 'var(--danger)' }}>{formatCurrency(actualBukanMakanBulanan)}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem' }}>
              <span>16.c. Bukan Makan Tahunan</span> <strong style={{ color: 'var(--danger)' }}>{formatCurrency(actualBukanMakanTahunan)}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem', marginTop: '1rem', color: 'var(--success)' }}>
              <span>Total Pendapatan Sebulan</span> <strong>{formatCurrency(pendapatanSebulan)}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem', color: 'var(--danger)' }}>
              <span>Total Pengeluaran Sebulan</span> <strong>{formatCurrency(pengeluaranSebulan)}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.3rem', marginBottom: '0.3rem', color: selisih >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              <span>Selisih</span> <strong>{formatCurrency(selisih)}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ width: '100%', fontWeight: 'bold' }}>Barang Elektronik / Otomotif:</span>
              <span>Gas 3kg / Gas 5kg / Kulkas</span> <strong>{gas3kg} / {gas5kg} / {kulkas} unit</strong>
              <span style={{ width: '100%' }}>AC: <strong>{ac}</strong> | Motor: <strong>{motor}</strong> | Mobil: <strong>{mobil}</strong> | PC/Laptop: <strong>{komputer}</strong> | Emas: <strong>{emas} gr</strong></span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ width: '100%', fontWeight: 'bold' }}>Tanah & Bangunan (Selain Tempat Tinggal):</span>
              <span>Taksiran Nilai Tanah & Sawah</span> <strong>{formatCurrency(totalNilaiTanahSawah)}</strong>
              <span>Taksiran Bangunan Lain</span> <strong>{formatCurrency(nilaiBangunanLain)}</strong>
            </li>
          </ul>
        </div>

        <ActionMenu onSaveDraft={handleSaveDraft} onSaveFinal={handleSaveFinal} />
      </div>
    </div>
  );
}
