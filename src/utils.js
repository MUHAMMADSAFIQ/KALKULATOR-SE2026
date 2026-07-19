import * as XLSX from 'xlsx';

export const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const parseCurrency = (value) => {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  // Remove all non-numeric characters
  const numericValue = value.replace(/[^0-9]/g, '');
  return parseInt(numericValue, 10) || 0;
};

// --- OFFLINE ARCHIVE SYSTEM ---
const ARCHIVE_KEY = 'se2026_archive';

export const getArchiveData = () => {
  try {
    const data = localStorage.getItem(ARCHIVE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse archive data', error);
    return [];
  }
};

export const saveToArchive = (record, id = null) => {
  const currentData = getArchiveData();
  
  if (id) {
    const updatedData = currentData.map(item => 
      item.id === id ? { ...item, ...record, timestamp: new Date().toISOString() } : item
    );
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updatedData));
    return updatedData;
  } else {
    const newRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...record
    };
    const updatedData = [newRecord, ...currentData];
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updatedData));
    return updatedData;
  }
};

export const clearArchive = () => {
  localStorage.removeItem(ARCHIVE_KEY);
};

export const exportToXLSX = (data) => {
  if (!data || data.length === 0) return;

  const flattenedData = data.map(record => {
    let flat = {
      "WAKTU INPUT": new Date(record.timestamp).toLocaleString('id-ID'),
      "STATUS DATA": record.status.toUpperCase(),
      "NAMA RESPONDEN": record.namaResponden || '-',
      "NAMA USAHA / KOMODITAS": record.namaUsaha || '-',
      "KODE KBLI": record.kbliCode || '-',
      "TOTAL PENDAPATAN KOTOR (Rp)": record.total_pendapatan || 0,
      "TOTAL BIAYA OPERASIONAL (Rp)": record.total_pengeluaran || 0,
      "LABA BERSIH TAHUNAN (Rp)": record.labaBersihTahun || 0,
      "RATA-RATA LABA PER BULAN (Rp)": record.labaBersihBulan || 0,
      "CATATAN / KESIMPULAN WAWANCARA": record.catatan || '-'
    };
    
    // Add raw state explicitly for more details
    if (record.rawState) {
      Object.keys(record.rawState).forEach(key => {
        let val = record.rawState[key];
        if (typeof val === 'object' && val !== null) {
          Object.keys(val).forEach(subKey => {
            flat[`DETAIL_${subKey.toUpperCase()}`] = val[subKey];
          });
        } else {
          flat[`INFO_${key.toUpperCase()}`] = val;
        }
      });
    }
    return flat;
  });

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);

  // Auto-width adjustment & Styling
  const colWidths = Object.keys(flattenedData[0] || {}).map(key => ({
    wch: Math.max(key.length + 5, 15)
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap_Sensus");

  XLSX.writeFile(workbook, `Rekap_Sensus_${new Date().toISOString().slice(0,10)}.xlsx`);
};
