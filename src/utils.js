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

export const saveToArchive = (record) => {
  const currentData = getArchiveData();
  const newRecord = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...record
  };
  const updatedData = [newRecord, ...currentData];
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updatedData));
  return updatedData;
};

export const clearArchive = () => {
  localStorage.removeItem(ARCHIVE_KEY);
};

export const exportToCSV = (data) => {
  if (!data || data.length === 0) return;
  
  // Get all unique keys from all records to form the header
  const allKeys = data.reduce((keys, record) => {
    Object.keys(record).forEach(key => {
      if (!keys.includes(key) && key !== 'id') keys.push(key);
    });
    return keys;
  }, ['timestamp']); // force timestamp to be first

  // Build CSV string
  const headerRow = allKeys.join(',');
  const rows = data.map(record => {
    return allKeys.map(key => {
      let val = record[key];
      if (val === undefined || val === null) val = '';
      // Escape quotes and commas
      if (typeof val === 'string') {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',');
  });

  const csvContent = [headerRow, ...rows].join('\n');
  
  // Download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `rekap_sensus_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
