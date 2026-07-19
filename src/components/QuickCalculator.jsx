import React, { useState } from 'react';
import { Zap, Save, MessageSquare } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import { formatCurrency, saveToArchive } from '../utils';
import ActionMenu from './ActionMenu';
import BusinessConclusion from './BusinessConclusion';
import TahunBerdiriSelector from './TahunBerdiriSelector';

export default function QuickCalculator({ activeKbli, namaResponden , initialData, onSaved, saveTrigger, onCollectData }) {
  const [tahunBerdiri, setTahunBerdiri] = useState(initialData?.rawState?.tahunBerdiri ?? '<=2025');
  const [bulanBerdiri, setBulanBerdiri] = useState(initialData?.rawState?.bulanBerdiri ?? 1);
  const bulanOperasi = tahunBerdiri === '2026' ? (12 - parseInt(bulanBerdiri) + 1) : 12;

  const [periode, setPeriode] = useState(initialData?.rawState?.periode ?? 'Bulan'); // 'Hari', 'Minggu', 'Bulan'
  const [pemasukan, setPemasukan] = useState(initialData?.rawState?.pemasukan ?? 0);
  const [pengeluaran, setPengeluaran] = useState(initialData?.rawState?.pengeluaran ?? 0);

  // Hitung Laba Bersih
  const labaBersihPeriode = (pemasukan || 0) - (pengeluaran || 0);

  // Estimasi ke Bulan dan Tahun
  let labaBulan = 0;
  if (periode === 'Hari') labaBulan = labaBersihPeriode * 30;
  if (periode === 'Minggu') labaBulan = labaBersihPeriode * 4;
  if (periode === 'Bulan') labaBulan = labaBersihPeriode;
  
  const labaTahun = labaBulan * bulanOperasi;

  
  const getRawState = () => ({ periode, pemasukan, pengeluaran });

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
        <h2 className="card-title" style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={20} /> Kalkulator Kilat (Sederhana)</h2>
      </div>
      <TahunBerdiriSelector tahunBerdiri={tahunBerdiri} setTahunBerdiri={setTahunBerdiri} bulanBerdiri={bulanBerdiri} setBulanBerdiri={setBulanBerdiri} />
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Gunakan kalkulator ini untuk wawancara cepat. Cukup tanyakan total pemasukan dan pengeluaran secara garis besar.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['Hari', 'Minggu', 'Bulan'].map((p) => (
          <button 
            key={p}
            onClick={() => setPeriode(p)}
            style={{ 
              flex: 1, 
              padding: '0.8rem', 
              borderRadius: 'var(--radius-sm)', 
              border: 'none', 
              cursor: 'pointer',
              background: periode === p ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
              color: periode === p ? 'white' : 'var(--text-secondary)',
              fontWeight: periode === p ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
          >
            Per {p}
          </button>
        ))}
      </div>

      <div className="grid-layout" style={{ gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <CurrencyInput label={`Total Pemasukan (Per ${periode})`} value={pemasukan} onChange={setPemasukan} />
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <CurrencyInput label={`Total Pengeluaran (Per ${periode})`} value={pengeluaran} onChange={setPengeluaran} />
        </div>
      </div>

      <div className="summary-card" style={{ marginTop: '1.5rem', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Perkiraan Laba Bersih Per Bulan</span>
          <span style={{ 
            fontFamily: 'Outfit', 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: labaBulan >= 0 ? 'var(--success)' : 'var(--danger)',
            textShadow: labaBulan >= 0 ? '0 0 15px rgba(16, 185, 129, 0.4)' : '0 0 15px rgba(239, 68, 68, 0.4)'
          }}>
            {formatCurrency(labaBulan)}
          </span>
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--accent-primary)', textAlign: 'left', fontStyle: 'italic', color: 'var(--text-primary)' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontStyle: 'normal' }}><MessageSquare size={16} /> Kesimpulan Wawancara:</strong>
            "Jadi, rata-rata pendapatan bersih Bapak/Ibu dari usaha ini sekitar 
            <strong style={{ color: labaBulan >= 0 ? 'var(--success)' : 'var(--danger)' }}> {formatCurrency(labaBulan)} per bulan</strong> ya?"
          </div>

          
      <>
        <BusinessConclusion namaResponden={typeof namaResponden !== 'undefined' ? namaResponden : ''} namaUsaha={typeof activeKbli !== 'undefined' && activeKbli?.name ? activeKbli.name : 'usaha ini'}  totalIncome={income} totalExpense={expense} netProfitTahunan={labaTahun}  expenseDetails={[{name: 'Pengeluaran/Biaya Operasional', value: parseFloat(pengeluaran || 0) * (periode === 'Hari' ? 30 : (periode === 'Minggu' ? 4 : 1)) }]} />
        <div style={{ display: 'none' }}>
                <ActionMenu onSaveDraft={handleSaveDraft} onSaveFinal={handleSaveFinal} />
              </div>
        {/* INJECTED_FUNCTIONS_PLACEHOLDER */}
      </>
    
        </div>
      </div>
    </div>
  );
}

