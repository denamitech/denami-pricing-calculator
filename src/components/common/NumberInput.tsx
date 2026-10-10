import React, { useState, useEffect } from 'react';

interface NumberInputProps {
  id?: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  isDecimal?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  id,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  isDecimal = false,
  placeholder = '0',
  className = '',
  error,
}) => {
  // Local string state to handle typing smoothly
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!isFocused) {
      if (value === 0 && !isDecimal && prefix === 'Rp' && value === 0) {
        setDisplayValue('0');
      } else if (isDecimal) {
        // e.g. 4.5 -> "4,5"
        setDisplayValue(value.toString().replace('.', ','));
      } else {
        setDisplayValue(value ? value.toLocaleString('id-ID') : '0');
      }
    }
  }, [value, isFocused, isDecimal, prefix]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (isDecimal) {
      // Allow numbers, comma, dot
      const sanitized = raw.replace(/[^0-9.,]/g, '');
      setDisplayValue(sanitized);
      const standardNum = parseFloat(sanitized.replace(',', '.'));
      if (!isNaN(standardNum)) {
        let finalVal = Math.max(min, standardNum);
        if (max !== undefined) finalVal = Math.min(max, finalVal);
        onChange(finalVal);
      } else if (sanitized === '' || sanitized === ',') {
        onChange(0);
      }
    } else {
      // Integer rupiah / quantity
      const cleanDigits = raw.replace(/[^0-9]/g, '');
      const parsed = parseInt(cleanDigits, 10);
      if (!isNaN(parsed)) {
        let finalVal = Math.max(min, parsed);
        if (max !== undefined) finalVal = Math.min(max, finalVal);
        setDisplayValue(finalVal.toLocaleString('id-ID'));
        onChange(finalVal);
      } else {
        setDisplayValue('0');
        onChange(0);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (isDecimal) {
      setDisplayValue(value.toString().replace('.', ','));
    } else {
      setDisplayValue(value ? value.toLocaleString('id-ID') : '0');
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div
        className={`flex items-stretch rounded-lg border bg-white transition-all overflow-hidden ${
          error
            ? 'border-[#E53945] ring-1 ring-[#E53945]/30'
            : isFocused
            ? 'border-[#82543F] ring-1 ring-[#82543F]/25 shadow-xs'
            : 'border-[#E7D9CE] hover:border-[#82543F]/60'
        }`}
      >
        {prefix && (
          <span className="inline-flex items-center px-3 bg-[#F8F3EE] text-[#7C8798] text-xs sm:text-sm font-semibold border-r border-[#E7D9CE] select-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode={isDecimal ? 'decimal' : 'numeric'}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm sm:text-base font-semibold text-[#18263D] tabular-nums outline-hidden focus:bg-[#FDFBF7] transition-colors"
        />
        {suffix && (
          <span className="inline-flex items-center px-3 bg-[#F8F3EE] text-[#7C8798] text-xs sm:text-sm font-medium border-l border-[#E7D9CE] select-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <span className="text-xs text-[#E53945] mt-1 font-medium">{error}</span>}
    </div>
  );
};
