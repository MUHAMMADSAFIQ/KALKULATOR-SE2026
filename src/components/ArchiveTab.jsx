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
          (() => {
            const currentRecords = tab === 'final' ? finalRecords : draftRecords;
            // Group by namaResponden
            const grouped = currentRecords.reduce((acc, curr) => {
              const name = curr.namaResponden || 'Responden Tanpa Nama';
              if (!acc[name]) acc[name] = [];
              acc[name].push(curr);
              return acc;
            }, {});

            return Object.entries(grouped).map(([name, items]) => (
              <div key={name} className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${tab === 'final' ? 'var(--success)' : 'var(--warning)'}` }}>
                <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                  Keluarga: {name}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.8rem', borderRadius: '4px' }}>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>{item.namaUsaha}</strong>
                        <span style={{ marginLeft: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                          KBLI: {item.kbliCode}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Status: </span>
                        <span style={{ color: tab === 'final' ? 'var(--success)' : 'var(--warning)', fontWeight: 'bold' }}>{item.status.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                  <button 
                    className="action-btn no-print"
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--accent-secondary)', color: 'var(--accent-secondary)' }}
                    onClick={() => alert('Untuk mencetak PDF Arsip Terpadu Keluarga ini, pastikan data dimuat ke form utama lalu tekan "Cetak PDF" (Fitur muat ulang keluarga utuh sedang disempurnakan).')}
                  >
                    <FileText size={16} /> Info Cetak PDF
                  </button>
                </div>
              </div>
            ));
          })()
        )}
      </div>
    </div>
  );
}
