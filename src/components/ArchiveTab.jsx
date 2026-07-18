import React, { useState, useEffect } from 'react';
import { FolderArchive, Download, Trash2, DatabaseBackup } from 'lucide-react';
import { getArchiveData, exportToCSV, clearArchive, formatCurrency } from '../utils';

export default function ArchiveTab() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Load data from local storage when component mounts
    setRecords(getArchiveData());
  }, []);

  const handleExport = () => {
    exportToCSV(records);
  };

  const handleClear = () => {
    if (window.confirm("AWAS! Apakah Anda yakin ingin MENGHAPUS SEMUA DATA arsip di HP ini? Pastikan Anda sudah mengekspornya (Download CSV) terlebih dahulu.")) {
      clearArchive();
      setRecords([]);
    }
  };

  return (
    <div className="tab-pane active slide-up">
      <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'rgba(99, 102, 241, 0.1)' }}>
        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FolderArchive size={20} /> Arsip Kuesioner (Offline)</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Semua data yang Anda simpan akan masuk ke sini dan tersimpan aman di memori HP Anda tanpa butuh internet.
        </p>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button 
            className="action-btn"
            style={{ flex: 2, background: 'var(--success)' }}
            onClick={handleExport}
            disabled={records.length === 0}
          >
            <Download size={16} /> Unduh Excel (CSV)
          </button>
          <button 
            className="action-btn"
            style={{ flex: 1, background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}
            onClick={handleClear}
            disabled={records.length === 0}
          >
            <Trash2 size={16} /> Kosongkan
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {records.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <span style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><DatabaseBackup size={48} strokeWidth={1} /></span>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Belum ada data yang tersimpan hari ini.</p>
          </div>
        ) : (
          records.map((item, idx) => (
            <div key={item.id} className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(item.timestamp).toLocaleString('id-ID')}
                  </span>
                  <h4 style={{ margin: '0.2rem 0', color: 'var(--text-primary)' }}>{item.namaResponden || 'Responden Tanpa Nama'}</h4>
                  <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    KBLI: {item.kbliCode}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Laba Bersih/Bln</span>
                  <strong style={{ color: item.labaBersihBulan >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {formatCurrency(item.labaBersihBulan)}
                  </strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
