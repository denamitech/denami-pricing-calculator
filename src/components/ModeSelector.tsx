import React from 'react';
import { Calculator, Target } from 'lucide-react';
import { CalculationMode } from '../types/calculator';

interface ModeSelectorProps {
  currentMode: CalculationMode;
  onModeChange: (mode: CalculationMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6" role="tablist" aria-label="Mode Kalkulator">
      {/* Tab 1: Hitung Profit */}
      <button
        type="button"
        role="tab"
        aria-selected={currentMode === 'PROFIT'}
        onClick={() => onModeChange('PROFIT')}
        className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
          currentMode === 'PROFIT'
            ? 'bg-[#82543F] text-white border-[#82543F] shadow-sm'
            : 'bg-white text-[#18263D] border-[#E7D9CE] hover:bg-[#F8F3EE]/80'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
            currentMode === 'PROFIT' ? 'bg-white/15 text-white' : 'bg-[#F8F3EE] text-[#82543F]'
          }`}
        >
          <Calculator className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm sm:text-base leading-tight">Hitung Profit</div>
          <div
            className={`text-xs mt-0.5 font-normal truncate ${
              currentMode === 'PROFIT' ? 'text-[#F6E8DF]' : 'text-[#7C8798]'
            }`}
          >
            Dari Harga Jual
          </div>
        </div>
      </button>

      {/* Tab 2: Hitung Harga Jual */}
      <button
        type="button"
        role="tab"
        aria-selected={currentMode === 'PRICE'}
        onClick={() => onModeChange('PRICE')}
        className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
          currentMode === 'PRICE'
            ? 'bg-[#82543F] text-white border-[#82543F] shadow-sm'
            : 'bg-white text-[#18263D] border-[#E7D9CE] hover:bg-[#F8F3EE]/80'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
            currentMode === 'PRICE' ? 'bg-white/15 text-white' : 'bg-[#F8F3EE] text-[#82543F]'
          }`}
        >
          <Target className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm sm:text-base leading-tight">Hitung Harga Jual</div>
          <div
            className={`text-xs mt-0.5 font-normal truncate ${
              currentMode === 'PRICE' ? 'text-[#F6E8DF]' : 'text-[#7C8798]'
            }`}
          >
            Dari Target Profit
          </div>
        </div>
      </button>
    </div>
  );
};
