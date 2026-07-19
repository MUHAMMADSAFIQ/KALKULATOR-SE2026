import React, { useState } from 'react';
import { Home, User, MapPin, Calculator, Wallet, CheckCircle, Save } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import ActionMenu from './ActionMenu';
import { formatCurrency, saveToArchive } from '../utils';

export default function ProbingKeluarga({ initialData, onSaved }) {
  // A. Identitas
  const [namaKK, setNamaKK] = useState(initialData?.rawState?.namaKK ?? '');
  const [noBangunan, setNoBangunan] = useState(initialData?.rawState?.noBangunan ?? '');
  const [desa, setDesa] = useState(initialData?.rawState?.desa ?? '');
  const [rt, setRt] = useState(initialData?.rawState?.rt ?? '');
  const [rw, setRw] = useState(initialData?.rawState?.rw ?? '');
  const [jumlahAnggota, setJumlahAnggota] = useState(initialData?.rawState?.jumlahAnggota ?? 1);

  // B. Kepemilikan Lahan/Rumah
  const [panjangLahan, setPanjangLahan] = useState(initialData?.rawState?.panjangLahan ?? '');
  const [lebarLahan, setLebarLahan] = useState(initialData?.rawState?.lebarLahan ?? '');
  const luasLahan = (parseFloat(panjangLahan) || 0) * (parseFloat(lebarLahan) || 0);

  // C. Harian
  const [makanSehari, setMakanSehari] = useState(initialData?.rawState?.makanSehari ?? 0);
  const makanSeminggu = makanSehari * 7;
  const makanSebulan = makanSehari * 30;

  // D. Bulanan
  const [listrik, setListrik] = useState(initialData?.rawState?.listrik ?? 0);
  const [internet, setInternet] = useState(initialData?.rawState?.internet ?? 0);
  const [pdam, setPdam] = useState(initialData?.rawState?.pdam ?? 0);
  const [gas, setGas] = useState(initialData?.rawState?.gas ?? 0);
  const [transportasi, setTransportasi] = useState(initialData?.rawState?.transportasi ?? 0);
  const [spp, setSpp] = useState(initialData?.rawState?.spp ?? 0);
  const [kamarMandi, setKamarMandi] = useState(initialData?.rawState?.kamarMandi ?? 0);
  const [lainBulanan, setLainBulanan] = useState(initialData?.rawState?.lainBulanan ?? 0);

  const totalBulananRutin = listrik + internet + pdam + gas + transportasi + spp + kamarMandi + lainBulanan;
  const totalBulananDenganMakan = totalBulananRutin + makanSebulan;
  const setahunDariBulanan = totalBulananDenganMakan * 12;

  // E. Tahunan
  const [pbb, setPbb] = useState(initialData?.rawState?.pbb ?? 0);
  const [pajakKendaraan, setPajakKendaraan] = useState(initialData?.rawState?.pajakKendaraan ?? 0);
  const [ukt, setUkt] = useState(initialData?.rawState?.ukt ?? 0);
  const [acaraDesa, setAcaraDesa] = useState(initialData?.rawState?.acaraDesa ?? 0);
  
  // Baju lebaran dihitung dari budget per orang x jumlah anggota
  const [budgetBaju, setBudgetBaju] = useState(initialData?.rawState?.budgetBaju ?? 0);
  const totalBajuLebaran = budgetBaju * jumlahAnggota;
  
  const [lainTahunan, setLainTahunan] = useState(initialData?.rawState?.lainTahunan ?? 0);

  const totalTahunanKhusus = pbb + pajakKendaraan + ukt + acaraDesa + totalBajuLebaran + lainTahunan;
  const grandTotalTahunan = setahunDariBulanan + totalTahunanKhusus;

  const getRawState = () => ({
    namaKK, noBangunan, desa, rt, rw, jumlahAnggota,
    panjangLahan, lebarLahan, luasLahan,
    makanSehari,
    listrik, internet, pdam, gas, transportasi, spp, kamarMandi, lainBulanan,
    pbb, pajakKendaraan, ukt, acaraDesa, budgetBaju, lainTahunan
  });

  const buildRecord = (status, catatan = '', namaDraft = '') => {
    return {
      status, 
      catatan,
      namaDraft: namaDraft || namaKK || 'Draft Keluarga',
      namaResponden: namaKK || 'Keluarga Anonim',
      namaUsaha: 'Sensus Keluarga', // Identifies it's a household
      kbliCode: 'RT-000',
      total_pendapatan: 0, 
      total_pengeluaran: grandTotalTahunan,
      labaBersihBulan: totalBulananDenganMakan, 
      labaBersihTahun: grandTotalTahunan, 
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
      <div className="card-header" style={{ borderBottomColor: 'var(--accent-primary)' }}>
        <h2 className="card-title" style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Home size={24} /> Probing Ekonomi Keluarga
        </h2>
      </div>

      <div className="calculation-section" style={{ marginBottom: '2rem' }}>
        <div className="section-header">
          <span className="section-icon"><User size={24} color="var(--success)" /></span>
          <h3 className="section-title">Identitas Keluarga</h3>
        </div>
        
        <div className="grid-layout" style={{ gap: '1rem' }}>
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label>Nama Kepala Keluarga</label>
            <input type="text" className="input-field" value={namaKK} onChange={(e) => setNamaKK(e.target.value)} placeholder="Misal: Bp. Budi" style={{ background: 'rgba(255, 255, 255, 0.05)', fontSize: '1.1rem' }} />
          </div>
          <div className="input-group">
            <label>No. Bangunan Sensus</label>
            <input type="text" className="input-field" value={noBangunan} onChange={(e) => setNoBangunan(e.target.value)} placeholder="001" />
          </div>
          <div className="input-group">
            <label>Jumlah Anggota Keluarga (Orang)</label>
            <input type="number" className="input-field" value={jumlahAnggota} onChange={(e) => setJumlahAnggota(parseInt(e.target.value) || 1)} min="1" />
          </div>
          <div className="input-group" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
            <div>
              <label>RT</label>
              <input type="text" className="input-field" value={rt} onChange={(e) => setRt(e.target.value)} placeholder="01" />
            </div>
            <div>
              <label>RW</label>
              <input type="text" className="input-field" value={rw} onChange={(e) => setRw(e.target.value)} placeholder="02" />
            </div>
            <div>
              <label>Desa/Kelurahan</label>
              <input type="text" className="input-field" value={desa} onChange={(e) => setDesa(e.target.value)} placeholder="Nama Desa" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid-layout" style={{ gap: '2rem' }}>
        {/* Kolom Kiri */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="calculation-section">
            <div className="section-header">
              <span className="section-icon"><MapPin size={24} color="var(--warning)" /></span>
              <h3 className="section-title">Luas Tanah/Rumah</h3>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Panjang (m)</label>
                <input type="number" className="input-field" value={panjangLahan} onChange={(e) => setPanjangLahan(e.target.value)} placeholder="Misal: 10" />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Lebar (m)</label>
                <input type="number" className="input-field" value={lebarLahan} onChange={(e) => setLebarLahan(e.target.value)} placeholder="Misal: 15" />
              </div>
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Luas:</span> <strong style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>{luasLahan} m²</strong>
            </div>
          </div>

          <div className="calculation-section">
            <div className="section-header">
              <span className="section-icon"><Calculator size={24} color="var(--danger)" /></span>
              <h3 className="section-title">Pengeluaran Rutin (Makan & Bulanan)</h3>
            </div>
            
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>A. Makan & Minum (Dapur)</h4>
            <CurrencyInput label="Rata-rata makan SEHARI (Beras, lauk, bumbu)" value={makanSehari} onChange={setMakanSehari} />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <span>Per Minggu: <strong style={{color: 'var(--danger)'}}>{formatCurrency(makanSeminggu)}</strong></span>
              <span>Per Bulan: <strong style={{color: 'var(--danger)'}}>{formatCurrency(makanSebulan)}</strong></span>
            </div>

            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>B. Tagihan Bulanan (Sebulan)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <CurrencyInput label="Listrik (Token/Meteran)" value={listrik} onChange={setListrik} />
              <CurrencyInput label="Pulsa & Internet (Se-keluarga)" value={internet} onChange={setInternet} />
              <CurrencyInput label="PDAM / Beli Air" value={pdam} onChange={setPdam} />
              <CurrencyInput label="Gas Elpiji" value={gas} onChange={setGas} />
              <CurrencyInput label="Transportasi (Bensin/Angkot)" value={transportasi} onChange={setTransportasi} />
              <CurrencyInput label="Biaya Sekolah (SPP, Les)" value={spp} onChange={setSpp} />
              <CurrencyInput label="Keperluan Mandi & Cuci" value={kamarMandi} onChange={setKamarMandi} />
              <CurrencyInput label="Lain-lain bulanan" value={lainBulanan} onChange={setLainBulanan} />
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="calculation-section">
            <div className="section-header">
              <span className="section-icon"><Wallet size={24} color="var(--success)" /></span>
              <h3 className="section-title">Pengeluaran Tahunan Khusus</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <CurrencyInput label="Pajak Bumi Bangunan (PBB)" value={pbb} onChange={setPbb} />
              <CurrencyInput label="Pajak Kendaraan (Motor/Mobil)" value={pajakKendaraan} onChange={setPajakKendaraan} />
              <CurrencyInput label="UKT Kuliah / Pangkal Sekolah" value={ukt} onChange={setUkt} />
              <CurrencyInput label="Acara Desa (Maulid, Ruwah, Nyadran)" value={acaraDesa} onChange={setAcaraDesa} />
              
              <div style={{ border: '1px dashed var(--glass-border)', padding: '1rem', borderRadius: '4px', margin: '0.5rem 0' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Baju Lebaran (Budget per orang)</label>
                <CurrencyInput label={`Dikali ${jumlahAnggota} orang = ${formatCurrency(totalBajuLebaran)}`} value={budgetBaju} onChange={setBudgetBaju} />
              </div>
              
              <CurrencyInput label="Lain-lain (Arisan, Iuran Tahunan, dll)" value={lainTahunan} onChange={setLainTahunan} />
            </div>
          </div>
          
          <div className="summary-card" style={{ marginTop: 'auto', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
            <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.3rem' }}>
              📝 Kesimpulan Profil Keluarga
            </h3>
            
            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-primary)', lineHeight: '1.6' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>
                "Keluarga Bapak/Ibu <strong>{namaKK || '...'}</strong> yang bertempat tinggal di bangunan seluas <strong>{luasLahan} m²</strong> memiliki pengeluaran harian untuk makan sekitar <strong>{formatCurrency(makanSehari)}</strong> (atau sekitar {formatCurrency(makanSebulan)} per bulan).
              </p>
              <p style={{ fontStyle: 'italic', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
                Untuk tagihan rutin bulanan (listrik {formatCurrency(listrik)}, internet {formatCurrency(internet)}, dll), keluarga ini menghabiskan total <strong>{formatCurrency(totalBulananRutin)}</strong> per bulan. 
              </p>
              <p style={{ fontStyle: 'italic', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
                Jika digabung dengan biaya tahunan khusus seperti pajak, sekolah, dan hari raya sebesar <strong>{formatCurrency(totalTahunanKhusus)}</strong>, 
                maka total seluruh pengeluaran keluarga ini dalam setahun mencapai kurang lebih <strong style={{ color: 'var(--danger)', fontSize: '1.2rem' }}>{formatCurrency(grandTotalTahunan)}</strong> 
                (Rata-rata <strong>{formatCurrency(grandTotalTahunan / 12)}</strong> / bulan)."
              </p>
            </div>

            <ActionMenu onSaveDraft={handleSaveDraft} onSaveFinal={handleSaveFinal} />
          </div>
        </div>
      </div>
    </div>
  );
}
