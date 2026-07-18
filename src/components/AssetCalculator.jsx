import React, { useState } from 'react';
import { Gem, Save, MessageSquare } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import { formatCurrency, saveToArchive } from '../utils';

export default function AssetCalculator() {
  // Aset Tanah & Bangunan
  const [bangunanMeter, setBangunanMeter] = useState('');
  const [bangunanPrice, setBangunanPrice] = useState(2500000); // Default harga bangunan
  
  const [tanahMeter, setTanahMeter] = useState('');
  const [tanahPrice, setTanahPrice] = useState(1000000); 

  // Aset Lainnya
  const [asetLain, setAsetLain] = useState({
    kendaraan: 0,
    mesinProduksi: 0,
    peralatanUsaha: 0, // Etalase, komputer, dll
    lainnya: 0
  });

  const totalBangunan = (parseFloat(bangunanMeter) || 0) * bangunanPrice;
  const totalTanah = (parseFloat(tanahMeter) || 0) * tanahPrice;
  const totalLainnya = Object.values(asetLain).reduce((a, b) => a + b, 0);
  
  const totalAsset = totalBangunan + totalTanah + totalLainnya;

  const updateAsetLain = (key, value) => setAsetLain(prev => ({ ...prev, [key]: value }));

  return (
    <div className="glass-card property-card" style={{ marginTop: 'var(--spacing-xl)' }}>
      <div className="card-header">
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Gem size={20} color="var(--accent-primary)" /> Total Aset Usaha & Pribadi</h2>
      </div>
      
      <div className="grid-layout" style={{ gap: 'var(--spacing-md)' }}>
        
        {/* Tanah & Bangunan */}
        <div style={{ padding: 'var(--spacing-sm)' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Aset Tanah & Bangunan</h3>
          
          <div className="property-section" style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Luas Bangunan (m²)</h4>
            <div className="property-inputs">
              <div style={{ flex: 1 }}>
                <input 
                  type="number" 
                  className="input-field"
                  value={bangunanMeter}
                  onChange={(e) => setBangunanMeter(e.target.value)}
                  placeholder="Misal: 45"
                />
              </div>
              <div style={{ flex: 1 }}>
                <CurrencyInput label="Taksiran Harga per m²" value={bangunanPrice} onChange={setBangunanPrice} />
              </div>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)', marginTop: '0.5rem' }}>
              Nilai Bangunan: {formatCurrency(totalBangunan)}
            </div>
          </div>

          <div className="property-section">
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Luas Tanah (m²)</h4>
            <div className="property-inputs">
              <div style={{ flex: 1 }}>
                <input 
                  type="number" 
                  className="input-field"
                  value={tanahMeter}
                  onChange={(e) => setTanahMeter(e.target.value)}
                  placeholder="Misal: 100"
                />
              </div>
              <div style={{ flex: 1 }}>
                <CurrencyInput label="Taksiran Harga per m²" value={tanahPrice} onChange={setTanahPrice} />
              </div>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)', marginTop: '0.5rem' }}>
              Nilai Tanah: {formatCurrency(totalTanah)}
            </div>
          </div>
        </div>

        {/* Aset Lainnya */}
        <div style={{ padding: 'var(--spacing-sm)' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Aset Lainnya (Selain Tanah/Bangunan)</h3>
          
          <CurrencyInput label="Kendaraan Operasional (Mobil, Motor)" value={asetLain.kendaraan} onChange={(v) => updateAsetLain('kendaraan', v)} />
          <CurrencyInput label="Mesin Produksi / Alat Berat" value={asetLain.mesinProduksi} onChange={(v) => updateAsetLain('mesinProduksi', v)} />
          <CurrencyInput label="Peralatan Usaha (Komputer, Etalase, dll)" value={asetLain.peralatanUsaha} onChange={(v) => updateAsetLain('peralatanUsaha', v)} />
          <CurrencyInput label="Aset Berharga Lainnya" value={asetLain.lainnya} onChange={(v) => updateAsetLain('lainnya', v)} />
          
          <div style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)', marginTop: '1rem', textAlign: 'right' }}>
            Total Aset Lainnya: {formatCurrency(totalLainnya)}
          </div>
        </div>

      </div>

      <div className="result-box" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', marginTop: '1.5rem' }}>
        <span className="result-label" style={{ color: '#fff' }}>Total Keseluruhan Aset</span>
        <span className="result-value" style={{ color: 'var(--warning)', fontSize: '1.8rem' }}>{formatCurrency(totalAsset)}</span>
      </div>
    </div>
  );
}
