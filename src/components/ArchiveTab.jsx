import React, { useState, useEffect } from 'react';
import { FolderArchive, Download, Trash2, DatabaseBackup, Play, FileText, CheckCircle } from 'lucide-react';
import { getArchiveData, exportToXLSX, clearArchive, formatCurrency } from '../utils';

export default function ArchiveTab({ onContinueDraft }) {
  const [records, setRecords] = useState([]);
  const [tab, setTab] = useState('final'); // 'final' or 'draft'

  useEffect(() => {
    setRecords(getArchiveData());
  }, []);

  const handleExport = () => {
    exportToXLSX(records.filter(r => r.status !== 'draft'));
  };

  const handleClear = () => {
    if (window.confirm("AWAS! Apakah Anda yakin ingin MENGHAPUS SEMUA DATA arsip di HP ini? Pastikan Anda sudah mengekspornya (Download CSV) terlebih dahulu.")) {
      clearArchive();
      setRecords([]);
    }
  };

  const finalRecords = records.filter(r => r.status !== 'draft');
  const draftRecords = records.filter(r => r.status === 'draft');

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
            disabled={finalRecords.length === 0}
          >
            <Download size={16} /> Unduh Excel (XLSX Final)
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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setTab('final')}
          style={{ 
            flex: 1, 
            padding: '0.8rem', 
            borderRadius: 'var(--radius-sm)', 
            border: 'none', 
            background: tab === 'final' ? 'var(--success)' : 'var(--bg-secondary)', 
            color: tab === 'final' ? 'white' : 'var(--text-secondary)',
            fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <CheckCircle size={18}/> Final ({finalRecords.length})
        </button>
        <button 
          onClick={() => setTab('draft')}
          style={{ 
            flex: 1, 
            padding: '0.8rem', 
            borderRadius: 'var(--radius-sm)', 
            border: 'none', 
            background: tab === 'draft' ? 'var(--warning)' : 'var(--bg-secondary)', 
            color: tab === 'draft' ? 'black' : 'var(--text-secondary)',
            fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <FileText size={18}/> Draft / Tertunda ({draftRecords.length})
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(tab === 'final' ? finalRecords : draftRecords).length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <span style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><DatabaseBackup size={48} strokeWidth={1} /></span>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Belum ada data {tab === 'final' ? 'final' : 'draft'} yang tersimpan.</p>
          </div>
        ) : (
          (tab === 'final' ? finalRecords : draftRecords).map((item, idx) => (
            <div key={item.id} className="glass-card" style={{ padding: '1rem', borderLeft: `4px solid ${tab === 'final' ? 'var(--success)' : 'var(--warning)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(item.timestamp).toLocaleString('id-ID')}
                  </span>
                  <h4 style={{ margin: '0.2rem 0', color: 'var(--text-primary)' }}>{item.namaDraft || item.namaResponden || 'Responden Tanpa Nama'}</h4>
                  <span style={{ background: tab === 'final' ? 'var(--success)' : 'var(--warning)', color: tab === 'final' ? 'white' : 'black', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    KBLI: {item.kbliCode} - {item.namaUsaha}
                  </span>
                  {item.catatan && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                      Catatan: {item.catatan}
                    </p>
                  )}
                </div>
                
                {tab === 'final' ? (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Laba Bersih/Bln</span>
                    <strong style={{ color: item.labaBersihBulan >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {formatCurrency(item.labaBersihBulan)}
                    </strong>
                    <button 
                      className="action-btn"
                      style={{ padding: '0.3rem 0.6rem', marginTop: '0.5rem', background: 'transparent', border: '1px solid var(--warning)', color: 'var(--warning)', fontSize: '0.75rem', display: 'flex', gap: '0.2rem', alignItems: 'center' }}
                      onClick={() => {
                        if (onContinueDraft) onContinueDraft(item);
                      }}
                    >
                      <Play size={12} /> Edit
                    </button>
                  </div>
                ) : (
                  <button 
                    className="action-btn"
                    style={{ padding: '0.5rem 1rem', background: 'var(--warning)', color: 'black', fontWeight: 'bold', fontSize: '0.85rem' }}
                    onClick={() => {
                      if (onContinueDraft) onContinueDraft(item);
                    }}
                  >
                    <Play size={16} /> Lanjutkan
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
