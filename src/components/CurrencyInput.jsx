import React, { useState, useEffect } from 'react';
import { formatCurrency, parseCurrency } from '../utils';

export default function CurrencyInput({ label, value, onChange, placeholder = '0' }) {
  const [displayValue, setDisplayValue] = useState(formatCurrency(value) || '');

  useEffect(() => {
    setDisplayValue(value ? formatCurrency(value) : '');
  }, [value]);

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = parseCurrency(rawValue);
    
    // Update local display immediately for fast typing response
    setDisplayValue(rawValue);
    
    // Send numeric value up
    onChange(numericValue);
  };

  const handleBlur = () => {
    setDisplayValue(value ? formatCurrency(value) : '');
  };

  const handleFocus = (e) => {
    // Auto-select text so user can immediately overwrite without backspacing
    e.target.select();
  };

  const handleKeyDown = (e) => {
    // Pressing Enter jumps to the next input field
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll('input:not([disabled]), button:not([disabled])'));
      const index = inputs.indexOf(e.target);
      if (index > -1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  };

  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input
        type="text"
        inputMode="numeric"
        className="input-field"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}
