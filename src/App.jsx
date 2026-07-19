import React, { useState, useEffect } from 'react';
import { Printer, RefreshCw, LogOut, Sun, Moon, Briefcase, FolderArchive, MapPin, Users } from 'lucide-react';
import LoginScreen from './components/LoginScreen';
import SearchKbli from './components/SearchKbli';
import PertanianCalculator from './components/PertanianCalculator';
import IndustriTempeCalculator from './components/IndustriTempeCalculator';
import PeternakanCalculator from './components/PeternakanCalculator';
import TokoBangunanCalculator from './components/TokoBangunanCalculator';
import AirIsiUlangCalculator from './components/AirIsiUlangCalculator';
import WarungCalculator from './components/WarungCalculator';
import GenericBusinessCalculator from './components/GenericBusinessCalculator';
import ArchiveTab from './components/ArchiveTab';
import ChatAssistant from './components/ChatAssistant';
import QuickCalculator from './components/QuickCalculator';
import ProbingKeluarga from './components/ProbingKeluarga';
import { ShoppingBag } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('sensus'); // 'sensus', 'arsip'
  const [activeDraft, setActiveDraft] = useState(null);

  // Global Save System
  const [saveTrigger, setSaveTrigger] = useState(0);
  const collectedDataRef = React.useRef([]);

  // Identitas Responden (Global)
  const [desa, setDesa] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  const [noBangunan, setNoBangunan] = useState('');
  const [namaResponden, setNamaResponden] = useState('');
  
  // Keranjang Usaha (Untuk Sensus Terpadu)
  const [addedBusinesses, setAddedBusinesses] = useState([]);
  const [openBusinessIndex, setOpenBusinessIndex] = useState(null); // Accordion state

  // State untuk Usaha Lepas
  const [lepasKbli, setLepasKbli] = useState(null);
  const [lepasNamaPemilik, setLepasNamaPemilik] = useState('');
  const [lepasSaveTrigger, setLepasSaveTrigger] = useState(0);
  const lepasCollectedDataRef = React.useRef([]);

  // Tema
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleAddBusiness = (kbli) => {
    // Prevent duplicate exact KBLI id if needed, but allow multiple same business if they want? 
    // Usually they just need one form per KBLI.
    if (!addedBusinesses.find(b => b.id === kbli.id)) {
      setAddedBusinesses([...addedBusinesses, kbli]);
      setOpenBusinessIndex(addedBusinesses.length); // Auto open the newly added one
    }
  };

  const handleQuickAdd = (type) => {
    let kbli = {};
    if (type === 'pertanian') kbli = { id: 'utp_padi', name: 'Pertanian / Tanaman', code: '011' };
    else if (type === 'peternakan') kbli = { id: 'ternak_kambing', name: 'Peternakan', code: '014' };
    else if (type === 'warung') kbli = { id: 'warung', name: 'Warung / Kelontong', code: '471' };
    else if (type === 'industri_tempe') kbli = { id: 'industri_tempe', name: 'Industri Tempe/Tahu', code: '103' };
    else if (type === 'umum') kbli = { id: 'umum', name: 'Usaha Lainnya (Umum)', code: '000' };
    
    handleAddBusiness(kbli);
  };

  const toggleAccordion = (index) => {
    setOpenBusinessIndex(openBusinessIndex === index ? null : index);
  };

  const handleRemoveBusiness = (index) => {
    const newBusinesses = [...addedBusinesses];
    newBusinesses.splice(index, 1);
    setAddedBusinesses(newBusinesses);
  };

  const getFullNamaResponden = () => {
    return `${namaResponden}${noBangunan ? ` - Bangunan ${noBangunan}` : ''}${desa ? ` - ${desa}` : ''}`;
  };

  const handleGlobalSave = () => {
    if (!namaResponden) {
      alert("Mohon isi Nama Kepala Keluarga / Responden terlebih dahulu!");
      return;
    }
    // Prepare for collection
    collectedDataRef.current = [];
    setSaveTrigger(prev => prev + 1);
    
    // Check collected data after a short delay
    setTimeout(() => {
      const records = collectedDataRef.current;
      if (records.length === 0) {
        alert("Tidak ada data yang disimpan. Pastikan Anda telah menambahkan minimal 1 usaha atau mengisi Probing Keluarga.");
        return;
      }
      
      import('./utils').then(({ saveToArchive }) => {
        records.forEach(r => saveToArchive(r));
        alert("BERHASIL! Seluruh data keluarga dan usaha berhasil diarsipkan.");
        setActiveTab('arsip');
      });
    }, 500);
  };

  const handleCollectData = (data) => {
    if (data) collectedDataRef.current.push(data);
  };

  // Handler for Usaha Lepas
  const handleLepasQuickAdd = (type) => {
    let kbli = {};
    if (type === 'pertanian') kbli = { id: 'utp_padi', name: 'Pertanian / Tanaman', code: '011' };
    else if (type === 'peternakan') kbli = { id: 'ternak_kambing', name: 'Peternakan', code: '014' };
    else if (type === 'warung') kbli = { id: 'warung', name: 'Warung / Kelontong', code: '471' };
    else if (type === 'industri_tempe') kbli = { id: 'industri_tempe', name: 'Industri Tempe/Tahu', code: '103' };
    else if (type === 'umum') kbli = { id: 'umum', name: 'Usaha Lainnya (Umum)', code: '000' };
    
    setLepasKbli(kbli);
  };

  const handleLepasSave = () => {
    lepasCollectedDataRef.current = [];
    setLepasSaveTrigger(prev => prev + 1);
    
    setTimeout(() => {
      const records = lepasCollectedDataRef.current;
      if (records.length === 0) return;
      
      import('./utils').then(({ saveToArchive }) => {
        records.forEach(r => saveToArchive(r));
        alert("BERHASIL! Data Usaha Lepas berhasil diarsipkan.");
        setActiveTab('arsip');
      });
    }, 500);
  };

  const handleLepasCollect = (data) => {
    if (data) lepasCollectedDataRef.current.push(data);
  };

  const renderCalculator = (kbli, isLepas = false) => {
    const kbliId = kbli.id;
    const kbliName = kbli.name.toLowerCase();
    const fullNama = isLepas ? `${lepasNamaPemilik} (Usaha Lepas)` : getFullNamaResponden();
    
    const trigger = isLepas ? lepasSaveTrigger : saveTrigger;
    const collector = isLepas ? handleLepasCollect : handleCollectData;
    
    const isPertanian = kbliId === 'utp_padi' || kbliName.includes('tanaman') || kbliName.includes('hortikultura') || kbliName.includes('perkebunan') || kbliName.includes('kehutanan') || kbliName.includes('pertanian') || kbliName.includes('padi') || kbliName.includes('palawija') || kbliName.includes('sayur');
    const isPeternakan = kbliId === 'ternak_kambing' || kbliName.includes('ternak') || kbliName.includes('peternakan');
    const isIndustriTempe = kbliId === 'industri_tempe' || kbliName.includes('tempe') || kbliName.includes('tahu');
    const isTokoBangunan = kbliId === 'toko_bangunan' || kbliName.includes('bahan bangunan');
    const isAirIsiUlang = kbliId === 'air_isi_ulang' || kbliName.includes('air minum') || kbliName.includes('isi ulang');
    const isWarung = kbliId === 'warung' || kbliName.includes('warung') || kbliName.includes('kelontong');
    const isKilat = kbliId === 'kilat';

    if (isPertanian) return <PertanianCalculator activeKbli={kbli} namaResponden={fullNama} saveTrigger={trigger} onCollectData={collector} />;
    if (isPeternakan) return <PeternakanCalculator activeKbli={kbli} namaResponden={fullNama} saveTrigger={trigger} onCollectData={collector} />;
    if (isIndustriTempe) return <IndustriTempeCalculator activeKbli={kbli} namaResponden={fullNama} saveTrigger={trigger} onCollectData={collector} />;
    if (isTokoBangunan) return <TokoBangunanCalculator activeKbli={kbli} namaResponden={fullNama} saveTrigger={trigger} onCollectData={collector} />;
    if (isAirIsiUlang) return <AirIsiUlangCalculator activeKbli={kbli} namaResponden={fullNama} saveTrigger={trigger} onCollectData={collector} />;
    if (isWarung) return <WarungCalculator activeKbli={kbli} namaResponden={fullNama} saveTrigger={trigger} onCollectData={collector} />;
    if (isKilat) return <QuickCalculator activeKbli={kbli} namaResponden={fullNama} saveTrigger={trigger} onCollectData={collector} />;
    return <GenericBusinessCalculator activeKbli={kbli} namaResponden={fullNama} title={kbli.name} saveTrigger={trigger} onCollectData={collector} />;
  };

  return (
    <div className="app-container">
      <header className="header no-print">
        <h1>Sensus Ekonomi 2026</h1>
        <p>Aplikasi Pencatatan BPS - Sensus Terpadu Satu Pintu</p>
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
            <RefreshCw size={16} /> Reset Form Baru
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

      <main className="grid-layout fade-in-up" style={{ paddingBottom: '100px' }}>
        {activeTab === 'sensus' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', gridColumn: '1 / -1' }}>
            
            {/* 1. IDENTITAS WILAYAH & RESPONDEN */}
            <div className="glass-card">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
                <MapPin size={24} /> Identitas Wilayah & Responden
              </h2>
              <div className="grid-layout" style={{ gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Desa / Kelurahan</label>
                  <input type="text" className="input-field" value={desa} onChange={e => setDesa(e.target.value)} placeholder="Nama Desa..." />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>RT</label>
                    <input type="text" className="input-field" value={rt} onChange={e => setRt(e.target.value)} placeholder="RT..." />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>RW</label>
                    <input type="text" className="input-field" value={rw} onChange={e => setRw(e.target.value)} placeholder="RW..." />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No. Urut Bangunan</label>
                  <input type="text" className="input-field" value={noBangunan} onChange={e => setNoBangunan(e.target.value)} placeholder="Misal: 001..." />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>👤 Nama Kepala Keluarga / Responden</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={namaResponden} 
                    onChange={e => setNamaResponden(e.target.value)} 
                    placeholder="Nama lengkap KRT..." 
                    style={{ fontSize: '1.1rem', background: 'rgba(255, 255, 255, 0.05)', borderColor: 'var(--accent-primary)' }}
                  />
                </div>
              </div>
            </div>

            {/* 2. PENCARIAN & DAFTAR USAHA */}
            <div className="glass-card" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', marginBottom: '1rem' }}>
                <Briefcase size={24} /> Usaha yang Dimiliki Keluarga
              </h2>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <button onClick={() => handleQuickAdd('pertanian')} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>+ Pertanian</button>
                <button onClick={() => handleQuickAdd('peternakan')} style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>+ Peternakan</button>
                <button onClick={() => handleQuickAdd('warung')} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>+ Warung</button>
                <button onClick={() => handleQuickAdd('industri_tempe')} style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>+ Industri Tempe</button>
                <button onClick={() => handleQuickAdd('umum')} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>+ Usaha Lain (Umum)</button>
              </div>

              {/* Hapus SearchKbli lama jika tidak perlu, atau simpan di bawah button cepat */}
              {/* <SearchKbli onSelectUsaha={handleAddBusiness} /> */}
              
              {addedBusinesses.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '1rem' }}>Belum ada usaha yang ditambahkan. Klik tombol di atas.</p>
              )}
            </div>

            {/* 3. KALKULATOR USAHA (DILOOP) */}
            {addedBusinesses.map((activeKbli, index) => {
              const kbliId = activeKbli.id;
              const kbliName = activeKbli.name.toLowerCase();
              const fullNama = getFullNamaResponden();
              
              const isPertanian = kbliId === 'utp_padi' || kbliName.includes('tanaman') || kbliName.includes('hortikultura') || kbliName.includes('perkebunan') || kbliName.includes('kehutanan') || kbliName.includes('pertanian') || kbliName.includes('padi') || kbliName.includes('palawija') || kbliName.includes('sayur');
              const isPeternakan = kbliId === 'ternak_kambing' || kbliName.includes('ternak') || kbliName.includes('peternakan');
              const isIndustriTempe = kbliId === 'industri_tempe' || kbliName.includes('tempe') || kbliName.includes('tahu');
              const isTokoBangunan = kbliId === 'toko_bangunan' || kbliName.includes('bahan bangunan');
              const isAirIsiUlang = kbliId === 'air_isi_ulang' || kbliName.includes('air minum') || kbliName.includes('isi ulang');
              const isWarung = kbliId === 'warung' || kbliName.includes('warung') || kbliName.includes('kelontong');
              const isOpen = openBusinessIndex === index;

              return (
                <div key={`${kbliId}-${index}`} style={{ animation: 'fadeIn 0.5s ease', marginTop: '0.5rem' }}>
                  <div 
                    onClick={() => toggleAccordion(index)}
                    className="print-hide"
                    style={{ background: isOpen ? 'var(--accent-primary)' : 'var(--bg-secondary)', color: isOpen ? 'white' : 'var(--text-primary)', padding: '1rem', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: isOpen ? 'none' : '1px solid var(--glass-border)' }}
                  >
                    <span>Usaha #{index + 1}: {activeKbli.name}</span>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'normal', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {isOpen ? 'Sembunyikan Rincian ▲' : 'Isi Form / Buka Rincian ▼'}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRemoveBusiness(index); }} 
                        style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Hapus Usaha
                      </button>
                    </div>
                  </div>
                  
                  <div className="print-force-show" style={{ display: isOpen ? 'block' : 'none', marginTop: '-0.5rem', paddingTop: '0.5rem' }}>
                    <div className="print-only" style={{ display: 'none', fontWeight: 'bold', color: 'black', margin: '1rem 0' }}>Usaha: {activeKbli.name}</div>
                    {renderCalculator(activeKbli, false)}
                  </div>
                </div>
              );
            })}

            {/* 4. PROBING KELUARGA (PENGELUARAN & ASET) */}
            <div style={{ marginTop: '2rem', borderTop: '2px dashed var(--glass-border)', paddingTop: '2rem' }}>
              <div style={{ background: '#f59e0b', color: 'white', padding: '0.5rem 1rem', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} /> Blok Probing Pengeluaran & Aset Keluarga
              </div>
              <ProbingKeluarga namaResponden={getFullNamaResponden()} saveTrigger={saveTrigger} onCollectData={handleCollectData} />
            </div>

            {/* GLOBAL SAVE BUTTON */}
            <div className="no-print" style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button 
                onClick={handleGlobalSave}
                style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.8rem' }}
              >
                <FolderArchive size={24} /> SIMPAN & ARSIPKAN SENSUS KELUARGA
              </button>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Sekali klik, seluruh form usaha dan keluarga akan dibundel ke arsip.</p>
            </div>
            
          </div>
        )}

        {/* TAB USAHA LEPAS */}
        {activeTab === 'lepas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', gridColumn: '1 / -1' }}>
            <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'var(--success)' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
                <ShoppingBag size={24} /> Kalkulator Usaha Lepas
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Gunakan menu ini jika Anda HANYA ingin menghitung 1 usaha secara cepat tanpa mendata identitas wilayah dan keluarganya.
              </p>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>👤 Nama Pemilik Usaha (Opsional)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={lepasNamaPemilik} 
                  onChange={e => setLepasNamaPemilik(e.target.value)} 
                  placeholder="Ketik nama pemilik..." 
                />
              </div>

              {!lepasKbli && (
                <div>
                  <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Pilih Kategori Usaha Secara Cepat:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <button onClick={() => handleLepasQuickAdd('pertanian')} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Pertanian</button>
                    <button onClick={() => handleLepasQuickAdd('peternakan')} style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Peternakan</button>
                    <button onClick={() => handleLepasQuickAdd('warung')} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Warung</button>
                    <button onClick={() => handleLepasQuickAdd('industri_tempe')} style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Industri Tempe</button>
                    <button onClick={() => handleLepasQuickAdd('umum')} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Usaha Lain (Umum)</button>
                  </div>
                  
                  <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Atau Cari Berdasarkan KBLI:</h4>
                  <SearchKbli onSelectUsaha={setLepasKbli} />
                </div>
              )}

              {lepasKbli && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--success)' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Usaha Terpilih:</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--success)' }}>{lepasKbli.name}</strong>
                  </div>
                  <button onClick={() => setLepasKbli(null)} style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                    Batal / Ganti
                  </button>
                </div>
              )}
            </div>

            {lepasKbli && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                {renderCalculator(lepasKbli, true)}

                <div className="no-print" style={{ marginTop: '2rem', textAlign: 'center' }}>
                  <button 
                    onClick={handleLepasSave}
                    style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.8rem' }}
                  >
                    <FolderArchive size={20} /> SIMPAN USAHA LEPAS
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'arsip' && (
          <div className="fade-in" style={{ gridColumn: '1 / -1' }}>
            <ArchiveTab onContinueDraft={(draft) => {
              alert("Fitur muat ulang arsip sedang disempurnakan untuk alur baru.");
            }} />
          </div>
        )}
      </main>

      <ChatAssistant />

      <nav className="bottom-nav no-print" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <button className={`nav-item ${activeTab === 'sensus' ? 'active' : ''}`} onClick={() => setActiveTab('sensus')}>
          <span className="nav-icon"><Briefcase size={24} strokeWidth={1.5} /></span>
          <span className="nav-label">Sensus Terpadu</span>
        </button>
        <button className={`nav-item ${activeTab === 'lepas' ? 'active' : ''}`} onClick={() => setActiveTab('lepas')}>
          <span className="nav-icon"><ShoppingBag size={24} strokeWidth={1.5} /></span>
          <span className="nav-label">Usaha Lepas</span>
        </button>
        <button className={`nav-item ${activeTab === 'arsip' ? 'active' : ''}`} onClick={() => setActiveTab('arsip')}>
          <span className="nav-icon"><FolderArchive size={24} strokeWidth={1.5} /></span>
          <span className="nav-label">Arsip</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
