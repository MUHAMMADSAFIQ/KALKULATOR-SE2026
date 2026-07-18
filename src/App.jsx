import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import SearchKbli from './components/SearchKbli';
import UtpPadiCalculator from './components/UtpPadiCalculator';
import IndustriTempeCalculator from './components/IndustriTempeCalculator';
import TernakKambingCalculator from './components/TernakKambingCalculator';
import TokoBangunanCalculator from './components/TokoBangunanCalculator';
import AirIsiUlangCalculator from './components/AirIsiUlangCalculator';
import WarungCalculator from './components/WarungCalculator';
import GenericBusinessCalculator from './components/GenericBusinessCalculator';
import AssetCalculator from './components/AssetCalculator';
import WeeklyExpenses from './components/WeeklyExpenses';
import MonthlyExpenses from './components/MonthlyExpenses';
import YearlyExpenses from './components/YearlyExpenses';
import ArchiveTab from './components/ArchiveTab';
import ChatAssistant from './components/ChatAssistant';
import QuickCalculator from './components/QuickCalculator';
import { formatCurrency } from './utils';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeKbli, setActiveKbli] = useState(null);
  const [activeTab, setActiveTab] = useState('usaha'); // 'usaha', 'aset', 'konsumsi'

  // Pengeluaran Rumah Tangga (Global)
  const [totalWeekly, setTotalWeekly] = useState(0);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [totalYearlySpecific, setTotalYearlySpecific] = useState(0);

  const totalYearlyFromMonthly = totalMonthly * 12;
  const grandTotalYearly = totalYearlyFromMonthly + totalYearlySpecific;

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
            🖨️ Cetak / Simpan PDF
          </button>
          <button 
            onClick={() => window.location.reload()}
            style={{ background: 'transparent', border: '1px solid var(--accent-secondary)', color: 'var(--accent-secondary)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            🔄 Reset Data Baru
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)}
            style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Keluar
          </button>
        </div>
      </header>


      <main className="grid-layout fade-in-up">
        {/* TAB 1: USAHA */}
        {activeTab === 'usaha' && (
          <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
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

            {activeKbli?.id === 'utp_padi' && <UtpPadiCalculator activeKbli={activeKbli} />}
            {activeKbli?.id === 'industri_tempe' && <IndustriTempeCalculator />}
            {activeKbli?.id === 'ternak_kambing' && <TernakKambingCalculator />}
            {activeKbli?.id === 'toko_bangunan' && <TokoBangunanCalculator />}
            {activeKbli?.id === 'air_isi_ulang' && <AirIsiUlangCalculator />}
            {activeKbli?.id === 'warung' && <WarungCalculator />}
            {activeKbli?.id === 'kilat' && <QuickCalculator activeKbli={activeKbli} />}
            
            {/* Fallback untuk KBLI lainnya */}
            {(!['utp_padi', 'industri_tempe', 'ternak_kambing', 'toko_bangunan', 'air_isi_ulang', 'warung', 'kilat'].includes(activeKbli?.id)) && (
              <GenericBusinessCalculator activeKbli={activeKbli} title={activeKbli?.name || "Kalkulator Usaha Umum"} />
            )}

            {!activeKbli && (
              <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.7 }}>
                <p>Belum ada usaha yang dipilih. Silakan cari dan pilih KBLI di atas.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ASET */}
        {activeTab === 'aset' && (
          <div className="tab-content fade-in-up">
            <AssetCalculator />
          </div>
        )}

        {/* TAB 3: KONSUMSI RT */}
        {activeTab === 'konsumsi' && (
          <div className="tab-content fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <WeeklyExpenses onTotalChange={setTotalWeekly} />
            <MonthlyExpenses onTotalChange={setTotalMonthly} />
            <YearlyExpenses onTotalChange={setTotalYearlySpecific} />
            <div className="glass-card summary-card">
              <div className="card-header" style={{ borderBottomColor: 'var(--accent-primary)' }}>
                <h2 className="card-title" style={{ color: 'var(--accent-primary)' }}>📊 Ringkasan Pengeluaran Konsumsi</h2>
              </div>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Dari Bulanan (x12)</span>
                  <span className="value">{formatCurrency(totalYearlyFromMonthly)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Khusus Tahunan</span>
                  <span className="value">{formatCurrency(totalYearlySpecific)}</span>
                </div>
                <div className="summary-item total">
                  <span className="label">Total Pengeluaran Setahun</span>
                  <span className="value">{formatCurrency(grandTotalYearly)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'arsip' && (
          <div className="fade-in">
            <ArchiveTab />
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
          <span className="nav-icon">🏢</span>
          <span className="nav-label">Usaha</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'aset' ? 'active' : ''}`}
          onClick={() => setActiveTab('aset')}
        >
          <span className="nav-icon">🏗️</span>
          <span className="nav-label">Aset</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'konsumsi' ? 'active' : ''}`}
          onClick={() => setActiveTab('konsumsi')}
        >
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Konsumsi</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'arsip' ? 'active' : ''}`}
          onClick={() => setActiveTab('arsip')}
        >
          <span className="nav-icon">📁</span>
          <span className="nav-label">Arsip</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
