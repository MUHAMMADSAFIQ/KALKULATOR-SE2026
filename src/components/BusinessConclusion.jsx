import React from 'react';
import { formatCurrency } from '../utils';

export default function BusinessConclusion({ 
  totalIncome, 
  totalExpense, 
  netProfitTahunan 
}) {
  const labaBulan = netProfitTahunan / 12;

  return (
    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid var(--glass-border)' }}>
      <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.3rem' }}>
        📊 Kesimpulan Akhir (Ringkasan Total)
      </h3>
      
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
