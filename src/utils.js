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
