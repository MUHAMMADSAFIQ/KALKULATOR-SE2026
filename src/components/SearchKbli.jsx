import React, { useState } from 'react';

export default function SearchKbli({ onSelectUsaha }) {
  const [searchTerm, setSearchTerm] = useState('');

  const kbliData = [
    // --- SPESIFIK DENGAN KALKULATOR KHUSUS ---
    { id: 'utp_padi', category: 'A', name: 'Pertanian Padi Sawah', code: '01111' },
    { id: 'ternak_kambing', category: 'A', name: 'Peternakan Kambing Potong', code: '01441' },
    { id: 'industri_tempe', category: 'C', name: 'Industri Tempe Kedelai', code: '10792' },
    { id: 'air_isi_ulang', category: 'E', name: 'Usaha Air Minum Isi Ulang', code: '36001' },
    { id: 'toko_bangunan', category: 'G', name: 'Perdagangan Eceran Bahan Bangunan', code: '4752' },
    { id: 'warung', category: 'G', name: 'Warung Kelontong / Perdagangan Eceran Berbagai Macam Barang', code: '47111' },
    
    // --- KATEGORI A: PERTANIAN, KEHUTANAN & PERIKANAN ---
    { id: 'a_sayur', category: 'A', name: 'Pertanian Sayuran, Buah, dan Palawija', code: '011' },
    { id: 'a_kebun', category: 'A', name: 'Perkebunan (Sawit, Karet, dll)', code: '012' },
    { id: 'a_ikan', category: 'A', name: 'Perikanan Tangkap & Budidaya', code: '03' },

    // --- KATEGORI B: PERTAMBANGAN ---
    { id: 'b_tambang', category: 'B', name: 'Pertambangan Pasir, Batu, Tanah Liat', code: '081' },

    // --- KATEGORI C: INDUSTRI PENGOLAHAN ---
    { id: 'c_makanan', category: 'C', name: 'Industri Makanan Olahan Lainnya', code: '10' },
    { id: 'c_pakaian', category: 'C', name: 'Industri Pakaian Jadi (Konveksi/Penjahit)', code: '14' },
    { id: 'c_kayu', category: 'C', name: 'Industri Barang dari Kayu / Mebel', code: '16' },

    // --- KATEGORI F: KONSTRUKSI ---
    { id: 'f_bangunan', category: 'F', name: 'Konstruksi Gedung / Pemborong', code: '410' },

    // --- KATEGORI G: PERDAGANGAN BESAR & ECERAN ---
    { id: 'g_grosir', category: 'G', name: 'Perdagangan Besar (Grosir/Distributor)', code: '46' },
    { id: 'g_pakaian', category: 'G', name: 'Toko Pakaian, Sepatu, Tas', code: '4771' },
    { id: 'g_motor', category: 'G', name: 'Perdagangan Kendaraan Bermotor', code: '45' },
    { id: 'g_bengkel', category: 'G', name: 'Bengkel / Reparasi Motor & Mobil', code: '452' },

    // --- KATEGORI H: TRANSPORTASI & PERGUDANGAN ---
    { id: 'h_ojek', category: 'H', name: 'Ojek Online / Pangkalan (Roda Dua)', code: '4942' },
    { id: 'h_truk', category: 'H', name: 'Angkutan Barang (Truk, Pikap)', code: '4943' },
    { id: 'h_kurir', category: 'H', name: 'Jasa Kurir & Ekspedisi', code: '53' },

    // --- KATEGORI I: AKOMODASI & MAKAN MINUM ---
    { id: 'i_restoran', category: 'I', name: 'Restoran, Rumah Makan, Kafe, Warung Makan', code: '56' },
    { id: 'i_hotel', category: 'I', name: 'Hotel, Penginapan, Kos-kosan', code: '55' },

    // --- KATEGORI J: INFORMASI & KOMUNIKASI (DIGITAL) ---
    { id: 'j_konten', category: 'J', name: 'Kreator Konten, Youtuber, Influencer', code: '591' },
    { id: 'j_software', category: 'J', name: 'Jasa Pembuatan Web / Aplikasi (Programmer)', code: '620' },

    // --- KATEGORI K-N: JASA KEUANGAN & PROFESIONAL ---
    { id: 'k_agen', category: 'K', name: 'Agen BRILink / Jasa Keuangan Lainnya', code: '649' },
    { id: 'l_properti', category: 'L', name: 'Agen Properti / Real Estat', code: '68' },
    { id: 'm_konsultan', category: 'M', name: 'Jasa Konsultasi Bisnis / Pajak', code: '69' },
    { id: 'n_sewa', category: 'N', name: 'Jasa Penyewaan Mobil, Tenda, Alat Pesta', code: '77' },

    // --- KATEGORI P-S: PENDIDIKAN, KESEHATAN & JASA LAINNYA ---
    { id: 'p_pendidikan', category: 'P', name: 'Bimbingan Belajar / Kursus', code: '85' },
    { id: 'q_kesehatan', category: 'Q', name: 'Klinik Kesehatan, Praktik Dokter/Bidan', code: '86' },
    { id: 's_salon', category: 'S', name: 'Salon Kecantikan / Pangkas Rambut / Barbershop', code: '961' },
    { id: 's_laundry', category: 'S', name: 'Jasa Laundry / Penatu Pakaian', code: '962' },
    { id: 's_reparasi_hp', category: 'S', name: 'Reparasi Handphone / Komputer', code: '95' },
    { id: 's_pijat', category: 'S', name: 'Jasa Pijat / Spa / Refleksi', code: '961' },

    // --- SAPU JAGAT ---
    { id: 'umum', category: 'U', name: 'Usaha Lainnya (Gunakan Kalkulator Umum)', code: '00000' },
  ];

  const filteredData = kbliData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
      <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>🔍 Cari Usaha Berdasarkan KBLI 2025</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Database disesuaikan dengan KBLI 2025 (Perban BPS No. 7 Tahun 2025) untuk keperluan Sensus Ekonomi 2026.
      </p>
      
      <div className="input-group">
        <input 
          type="text" 
          className="input-field" 
          placeholder="Ketik nama usaha, kode, atau kategori (A-U)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ fontSize: '1.1rem', padding: '1rem' }}
        />
      </div>

      {searchTerm && (
        <div style={{ marginTop: '1rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: 'var(--radius-md)', padding: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
          {filteredData.length > 0 ? (
            filteredData.map(item => (
              <div 
                key={item.id}
                onClick={() => {
                  onSelectUsaha(item);
                  setSearchTerm(''); // Auto close after selection
                }}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>
                    KATEGORI {item.category}
                  </span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>{item.name}</span>
                </div>
                <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', marginLeft: '1rem' }}>
                  {item.code}
                </span>
              </div>
            ))
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Tidak ditemukan. <br />
              <button onClick={() => { onSelectUsaha({ id: 'umum', name: 'Usaha Lainnya (Belum Terklasifikasi)', code: '00000' }); setSearchTerm(''); }} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: 'var(--accent-secondary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Gunakan Form Usaha Umum
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
