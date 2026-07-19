import React from 'react';
import { formatCurrency } from '../utils';

export default function BusinessConclusion({ 
  namaResponden,
  namaUsaha,
  totalIncome, 
  totalExpense, 
  netProfitTahunan,
  expenseDetails = [],
  nonOperationalDetails = [],
  tahunBerdiri = '<=2025',
  bulanBerdiri = 1
}) {
  const labaBulan = netProfitTahunan / (tahunBerdiri === '2026' ? (12 - parseInt(bulanBerdiri) + 1) : 12);
  const bulanOperasi = tahunBerdiri === '2026' ? (12 - parseInt(bulanBerdiri) + 1) : 12;
  const namaBulan = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // Filter only valid positive expenses
  const validExpenses = expenseDetails.filter(e => e && e.value > 0);
  const validNonOps = nonOperationalDetails.filter(e => e && e.value > 0);

  return (
    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid var(--glass-border)' }}>
      <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.3rem' }}>
        📊 Kesimpulan Akhir (Ringkasan Total)
      </h3>

      <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
        <div style={{ color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Kalimat Konfirmasi:</strong>
          
          {tahunBerdiri === '2026' && (
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid var(--warning)', padding: '0.8rem', marginBottom: '1rem', borderRadius: '4px', color: 'var(--text-primary)' }}>
              ⚠️ Mengingat usaha ini baru dimulai pada <strong>{namaBulan[bulanBerdiri]} 2026</strong> (berjalan selama {bulanOperasi} bulan di tahun ini), maka perhitungan totalnya disesuaikan.
            </div>
          )}

          <p style={{ marginBottom: '1rem' }}>
            Berdasarkan hasil perhitungan atas nama Bapak/Ibu <strong>{namaResponden || '...'}</strong> untuk <strong>{namaUsaha || 'usaha ini'}</strong>, diperoleh rincian sebagai berikut:
          </p>
          
          <div style={{ marginBottom: '1rem', paddingLeft: '1rem' }}>
            <strong style={{ display: 'block', marginBottom: '0.3rem' }}>Rincian Biaya Operasional / Pengeluaran Tunai:</strong>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
              {validExpenses.length > 0 ? (
                validExpenses.map((e, idx) => (
                  <li key={idx} style={{ marginBottom: '0.2rem' }}>
                    {e.name}: <strong>{formatCurrency(e.value)}</strong>
                  </li>
                ))
              ) : (
                <li>Modal Operasional Global: <strong>{formatCurrency(totalExpense)}</strong></li>
              )}
            </ul>
          </div>

          {validNonOps.length > 0 && (
            <div style={{ marginBottom: '1rem', paddingLeft: '1rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.3rem' }}>Biaya Non-Operasional / Nilai Aset Pribadi:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontStyle: 'italic' }}>
                (Informasi tambahan: tidak dikurangkan dari laba bersih karena merupakan aset yang sudah dimiliki)
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                {validNonOps.map((e, idx) => (
                  <li key={idx} style={{ marginBottom: '0.2rem' }}>
                    {e.name}: <strong>{formatCurrency(e.value)}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Total Pengeluaran ({bulanOperasi} bln):</span>
              <strong style={{ color: 'var(--danger)' }}>{formatCurrency(totalExpense)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              <span>Total Pendapatan Kotor ({bulanOperasi} bln):</span>
              <strong style={{ color: 'var(--success)' }}>{formatCurrency(totalIncome)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Hasil Laba Bersih ({bulanOperasi} bln):</span>
              <strong style={{ color: netProfitTahunan >= 0 ? 'var(--success)' : 'var(--danger)' }}>{formatCurrency(netProfitTahunan)}</strong>
            </div>
          </div>
          
          <p style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
            Maka rata-rata laba bersih per bulan setara dengan <span style={{ color: labaBulan >= 0 ? 'var(--success)' : 'var(--danger)', fontSize: '1.1rem' }}>{formatCurrency(labaBulan)}</span>. <br/>
            Apakah perhitungan ini sudah sesuai dengan kondisi di lapangan?
          </p>
        </div>
      </div>
      
      <div className="grid-layout" style={{ gap: '1rem', marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Omset/Pendapatan (Tahunan)</p>
          <strong style={{ color: 'var(--success)', fontSize: '1.2rem' }}>{formatCurrency(totalIncome)}</strong>
        </div>
        
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Pengeluaran/Biaya (Tahunan)</p>
          <strong style={{ color: 'var(--danger)', fontSize: '1.2rem' }}>{formatCurrency(totalExpense)}</strong>
        </div>
      </div>
      
      <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)', textAlign: 'center' }}>
        <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Laba Bersih Usaha (Net Profit)</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Laba Tahunan: <strong style={{ color: netProfitTahunan >= 0 ? 'var(--success)' : 'var(--danger)' }}>{formatCurrency(netProfitTahunan)}</strong>
          </span>
          <div style={{ width: '100px', height: '1px', background: 'var(--glass-border)', margin: '0.5rem 0' }}></div>
          <span style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
            Rata-rata Bersih Per Bulan:
          </span>
          <span style={{ fontSize: '1.5rem', color: labaBulan >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
            {formatCurrency(labaBulan)}
          </span>
        </div>
      </div>
    </div>
  );
}
