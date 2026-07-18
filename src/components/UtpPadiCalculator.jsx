import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';
import ProbingInput from './ProbingInput';
import { formatCurrency, saveToArchive } from '../utils';

export default function UtpPadiCalculator({ activeKbli, namaResponden }) {
  // Lahan
  const [luasUbin, setLuasUbin] = useState('');
  const [luasMeter, setLuasMeter] = useState('');
  const [frekuensiPanen, setFrekuensiPanen] = useState(2);
  
  // Status Kepemilikan (Sawah Sendiri / Maro)
  const [statusKepemilikan, setStatusKepemilikan] = useState('Sendiri'); // 'Sendiri', 'Maro'
  const [persentaseMaro, setPersentaseMaro] = useState(50); // Bagian penggarap (default 50%)

  const UBIN_TO_M2 = 14.0625;

  const handleUbinChange = (e) => {
    const ubin = e.target.value;
    setLuasUbin(ubin);
    if (ubin) {
      setLuasMeter((parseFloat(ubin) * UBIN_TO_M2).toFixed(2));
    } else {
      setLuasMeter('');
    }
  };

  const handleMeterChange = (e) => {
    const m2 = e.target.value;
    setLuasMeter(m2);
    if (m2) {
      setLuasUbin((parseFloat(m2) / UBIN_TO_M2).toFixed(2));
    } else {
      setLuasUbin('');
    }
  };
  
  // Mode Input Biaya Modal
  const [modeBiaya, setModeBiaya] = useState('Global'); // 'Global', 'Rinci'
  const [modalGlobal, setModalGlobal] = useState(0);
  const [expenses, setExpenses] = useState({
    benih: 0,
    pupuk: 0,
    pestisida: 0,
    sewaTraktor: 0,
    upahBuruh: 0,
    irigasi: 0,
  });

  // Mode Input Pendapatan
  const [modePendapatan, setModePendapatan] = useState('Kuintal'); // 'Kuintal', 'Uang'
  const [jumlahKuintal, setJumlahKuintal] = useState('');
  const [hargaKuintal, setHargaKuintal] = useState(650000);
  const [pendapatanUang, setPendapatanUang] = useState(0);
  
  // Kalkulasi
  const panenGabah = modePendapatan === 'Kuintal' 
    ? parseFloat(jumlahKuintal || 0) * parseFloat(hargaKuintal || 0)
    : parseFloat(pendapatanUang || 0);

  const totalExpense = modeBiaya === 'Global' 
    ? parseFloat(modalGlobal || 0) 
    : Object.values(expenses).reduce((a, b) => a + b, 0);

  // Profit sebelum dibagi hasil
  const profitKotor = panenGabah - totalExpense;
  
  // Profit setelah dibagi hasil (jika Maro)
  const profitSetelahMaro = statusKepemilikan === 'Maro' 
    ? profitKotor * (persentaseMaro / 100) 
    : profitKotor;

  const netProfitTahunan = (profitSetelahMaro * frekuensiPanen);

  const updateExpense = (key, value) => setExpenses(prev => ({ ...prev, [key]: value }));

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: 'var(--spacing-md)' }}>
      <div className="card-header" style={{ borderBottomColor: '#84cc16' }}>
        <h2 className="card-title" style={{ color: '#84cc16' }}>🌾 Kalkulator UTP Padi Sawah</h2>
      </div>

      <div className="grid-layout" style={{ gap: '1rem', marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="input-group">
          <label>Luas (Ubin)</label>
          <input 
            type="number" 
            className="input-field" 
            placeholder="Misal: 100"
            value={luasUbin}
            onChange={handleUbinChange}
            onFocus={(e) => e.target.select()}
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
            style={{ background: 'rgba(132, 204, 22, 0.1)', borderColor: '#84cc16' }}
          />
        </div>
      </div>

      {/* --- STATUS KEPEMILIKAN --- */}
      <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-sm)' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Status Lahan</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {['Sendiri', 'Maro'].map((mode) => (
            <button 
              key={mode}
              onClick={() => setStatusKepemilikan(mode)}
              style={{ 
                flex: 1, padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                background: statusKepemilikan === mode ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                color: statusKepemilikan === mode ? 'white' : 'var(--text-secondary)',
                fontWeight: statusKepemilikan === mode ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              {mode === 'Sendiri' ? '🌱 Sawah Sendiri' : '🤝 Bagi Hasil (Maro)'}
            </button>
          ))}
        </div>
        
        {statusKepemilikan === 'Maro' && (
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <span className="section-icon">🌾</span>
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
          
          <div className="subtotal">
            <span>Total Pendapatan:</span>
            <span>{formatCurrency(panenGabah)}</span>
          </div>

          <div className="input-group" style={{ marginTop: '1.5rem' }}>
            <label>Berapa kali panen dalam setahun?</label>
            <input 
              type="number" 
              className="input-field" 
              value={frekuensiPanen}
              onChange={(e) => setFrekuensiPanen(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>

        {/* KOLOM PENGELUARAN */}
        <div className="calculation-section">
          <div className="section-header">
            <span className="section-icon">💸</span>
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
                *Gabungan dari biaya pupuk, obat, traktor, dan buruh tandur/panen.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <CurrencyInput label="Benih / Bibit" value={expenses.benih} onChange={(v) => updateExpense('benih', v)} />
              <CurrencyInput label="Pupuk" value={expenses.pupuk} onChange={(v) => updateExpense('pupuk', v)} />
              <CurrencyInput label="Obat / Pestisida" value={expenses.pestisida} onChange={(v) => updateExpense('pestisida', v)} />
              <CurrencyInput label="Sewa Traktor / Bajak" value={expenses.sewaTraktor} onChange={(v) => updateExpense('sewaTraktor', v)} />
              <CurrencyInput label="Upah Buruh (Tanam & Panen)" value={expenses.upahBuruh} onChange={(v) => updateExpense('upahBuruh', v)} />
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
          
          {/* Kesimpulan Manusiawi */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--accent-primary)', textAlign: 'left', fontStyle: 'italic', color: 'var(--text-primary)' }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontStyle: 'normal' }}>💬 Kesimpulan (Narasi Wawancara):</strong>
            "Berdasarkan data yang Bapak/Ibu berikan, lahan seluas 
            <strong style={{ color: '#84cc16' }}> {luasUbin ? `${luasUbin} ubin` : '...'} </strong> 
            ini {statusKepemilikan === 'Maro' ? <strong>digarap secara bagi hasil ({persentaseMaro}%)</strong> dan : ''} bisa dipanen <strong>{frekuensiPanen} kali setahun</strong>. 
            Setelah dipotong semua biaya modal (traktor, buruh, pupuk, dll), perkiraan penghasilan bersih Bapak/Ibu adalah sekitar 
            <strong style={{ color: netProfitTahunan >= 0 ? 'var(--success)' : 'var(--danger)' }}> {formatCurrency(netProfitTahunan / 12)} per bulannya</strong>. 
            Apakah kira-kira angka ini sudah sesuai dengan kenyataan sehari-hari?"
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
                kbliCode: activeKbli?.code || '01111',
                namaUsaha: activeKbli?.name || 'Pertanian Padi Sawah',
                labaBersihBulan: Math.round(netProfitTahunan / 12),
                labaBersihTahun: netProfitTahunan,
                luasUbin: luasUbin
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
