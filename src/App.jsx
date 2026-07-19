import React, { useState, useEffect } from 'react';
import { Printer, RefreshCw, LogOut, Sun, Moon, Briefcase, Building2, ShoppingCart, FolderArchive, BarChart3, Search, Users } from 'lucide-react';
import LoginScreen from './components/LoginScreen';
import SearchKbli from './components/SearchKbli';
import UtpPadiCalculator from './components/UtpPadiCalculator';
import IndustriTempeCalculator from './components/IndustriTempeCalculator';
import PeternakanCalculator from './components/PeternakanCalculator';
import TokoBangunanCalculator from './components/TokoBangunanCalculator';
import AirIsiUlangCalculator from './components/AirIsiUlangCalculator';
import WarungCalculator from './components/WarungCalculator';
import GenericBusinessCalculator from './components/GenericBusinessCalculator';
import AssetCalculator from './components/AssetCalculator';
import ArchiveTab from './components/ArchiveTab';
import ChatAssistant from './components/ChatAssistant';
import QuickCalculator from './components/QuickCalculator';
import ProbingKeluarga from './components/ProbingKeluarga';
import { formatCurrency } from './utils';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeKbli, setActiveKbli] = useState(null);
  const [activeTab, setActiveTab] = useState('usaha'); // 'usaha', 'aset', 'keluarga', 'arsip'
  const [activeDraft, setActiveDraft] = useState(null);

  // Identitas Responden (Global)
  const [namaResponden, setNamaResponden] = useState('');

  // Tema
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  // (Pengeluaran Rumah Tangga global dihapus, karena sudah ditangani di ProbingKeluarga)

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-container">
      <header className="header no-print">
        <h1>Sensus Ekonomi 2026</h1>
        <p>Aplikasi Pencatatan BPS - Kalkulator Usaha & Aset</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => window.print()}
            style={{ background: 'var(--accent-primary)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Printer size={16} /> Cetak / Simpan PDF
          </button>
          <button 
            onClick={() => window.location.reload()}
            style={{ background: 'transparent', border: '1px solid var(--accent-secondary)', color: 'var(--accent-secondary)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={16} /> Reset Data Baru
          </button>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ background: 'transparent', border: '1px solid var(--warning)', color: 'var(--warning)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {theme === 'dark' ? <><Sun size={16}/> Mode Terang</> : <><Moon size={16}/> Mode Gelap</>}
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)}
            style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </header>


      <main className="grid-layout fade-in-up">
        {/* TAB 1: USAHA */}
        {activeTab === 'usaha' && (
          <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>👤 Nama Kepala Keluarga / Pemilik Usaha</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ketik nama responden di sini..." 
                value={namaResponden}
                onChange={(e) => setNamaResponden(e.target.value)}
                style={{ fontSize: '1.1rem', background: 'rgba(255, 255, 255, 0.05)' }}
              />
            </div>

            <SearchKbli onSelectUsaha={setActiveKbli} />
            
            {activeKbli && (
              <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--success)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Usaha Terpilih (Kategori {activeKbli.category}):</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--success)' }}>{activeKbli.name}</strong>
                  <span style={{ marginLeft: '0.5rem', background: 'var(--success)', color: '#000', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    KBLI: {activeKbli.code}
                  </span>
                </div>
                <button 
                  onClick={() => setActiveKbli(null)}
                  style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                >
                  Ganti
                </button>
              </div>
            )}

            {activeKbli?.id === 'utp_padi' && <UtpPadiCalculator activeKbli={activeKbli} namaResponden={namaResponden} initialData={activeDraft} onSaved={() => setActiveDraft(null)} />}
            {activeKbli?.id === 'industri_tempe' && <IndustriTempeCalculator activeKbli={activeKbli} namaResponden={namaResponden} initialData={activeDraft} onSaved={() => setActiveDraft(null)} />}
            {(activeKbli?.id === 'ternak_kambing' || activeKbli?.name?.toLowerCase().includes('ternak') || activeKbli?.name?.toLowerCase().includes('peternakan')) && <PeternakanCalculator activeKbli={activeKbli} namaResponden={namaResponden} initialData={activeDraft} onSaved={() => setActiveDraft(null)} />}
            {activeKbli?.id === 'toko_bangunan' && <TokoBangunanCalculator activeKbli={activeKbli} namaResponden={namaResponden} initialData={activeDraft} onSaved={() => setActiveDraft(null)} />}
            {activeKbli?.id === 'air_isi_ulang' && <AirIsiUlangCalculator activeKbli={activeKbli} namaResponden={namaResponden} initialData={activeDraft} onSaved={() => setActiveDraft(null)} />}
            {activeKbli?.id === 'warung' && <WarungCalculator activeKbli={activeKbli} namaResponden={namaResponden} initialData={activeDraft} onSaved={() => setActiveDraft(null)} />}
            {activeKbli?.id === 'kilat' && <QuickCalculator activeKbli={activeKbli} namaResponden={namaResponden} initialData={activeDraft} onSaved={() => setActiveDraft(null)} />}
            
            {/* Fallback untuk KBLI lainnya */}
            {(!['utp_padi', 'industri_tempe', 'toko_bangunan', 'air_isi_ulang', 'warung', 'kilat'].includes(activeKbli?.id) && !(activeKbli?.id === 'ternak_kambing' || activeKbli?.name?.toLowerCase().includes('ternak') || activeKbli?.name?.toLowerCase().includes('peternakan'))) && (
              <GenericBusinessCalculator activeKbli={activeKbli} namaResponden={namaResponden} title={activeKbli?.name || "Kalkulator Usaha Umum"} initialData={activeDraft} onSaved={() => setActiveDraft(null)} />
            )}

            {!activeKbli && (
              <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.7 }}>
                <p>Belum ada usaha yang dipilih. Silakan cari dan pilih KBLI di atas.</p>
              </div>
            )}
          </div>
        )}



        {/* TAB 3: PROBING KELUARGA */}
        {activeTab === 'keluarga' && (
          <div className="tab-content fade-in-up">
            <ProbingKeluarga initialData={activeDraft} onSaved={() => setActiveDraft(null)} />
          </div>
        )}

        {activeTab === 'arsip' && (
          <div className="fade-in">
            <ArchiveTab onContinueDraft={(draft) => {
              if (draft.kbliCode === 'RT-000') {
                setActiveDraft(draft);
                setActiveTab('keluarga');
              } else {
                setActiveKbli({ id: draft.kbliId, name: draft.namaUsaha, code: draft.kbliCode, category: '' });
                if (draft.namaResponden) setNamaResponden(draft.namaResponden);
                setActiveDraft(draft);
                setActiveTab('usaha');
              }
            }} />
          </div>
        )}
      </main>

      {/* Floating Chat Assistant */}
      <ChatAssistant />

      {/* Bottom Navigation */}
      <nav className="bottom-nav no-print">
        <button 
          className={`nav-item ${activeTab === 'usaha' ? 'active' : ''}`}
          onClick={() => setActiveTab('usaha')}
        >
          <span className="nav-icon"><Briefcase size={24} strokeWidth={1.5} /></span>
          <span className="nav-label">Usaha</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'keluarga' ? 'active' : ''}`}
          onClick={() => setActiveTab('keluarga')}
        >
          <span className="nav-icon"><Users size={24} strokeWidth={1.5} /></span>
          <span className="nav-label">Keluarga</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'arsip' ? 'active' : ''}`}
          onClick={() => setActiveTab('arsip')}
        >
          <span className="nav-icon"><FolderArchive size={24} strokeWidth={1.5} /></span>
          <span className="nav-label">Arsip</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
