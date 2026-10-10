import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { DataProdukSection } from './components/DataProdukSection';
import { BiayaTetapSection } from './components/BiayaTetapSection';
import { MarketplaceFeesSection } from './components/MarketplaceFeesSection';
import { ResultsPanel } from './components/ResultsPanel';
import { DenamiTips } from './components/DenamiTips';
import { DenamiFooter } from './components/DenamiFooter';
import { CalculatorState, CalculationMode, MarketplaceFee } from './types/calculator';
import { calculate, INITIAL_STATE } from './utils/calculator';

export default function App() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  // Single source of truth calculation engine
  const result = useMemo(() => {
    return calculate(state);
  }, [state]);

  // Mode change: preserves all entered fee configurations and relevant input values
  const handleModeChange = (mode: CalculationMode) => {
    setState((prev) => ({
      ...prev,
      mode,
    }));
  };

  const handleInputChange = <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUpdateFees = (fees: MarketplaceFee[]) => {
    setState((prev) => ({
      ...prev,
      fees,
    }));
  };

  const handleReset = () => {
    setState(INITIAL_STATE);
  };

  const handleRoundingChange = (roundingStep: number) => {
    setState((prev) => ({
      ...prev,
      roundingStep,
    }));
  };

  // Preview basis for fee amounts in left column
  // Based strictly on product data transaction baseline (never contaminated by fixed order fees)
  const referenceRevenueForFeePreviews = useMemo(() => {
    if (state.mode === 'PRICE') {
      return result.recommendedRevenue ?? 0;
    }
    const basePrice = state.sellingPrice > 0 ? state.sellingPrice : 0;
    const discountedPrice = Math.max(0, basePrice - (state.sellerDiscount || 0));
    return discountedPrice * (state.quantity || 1);
  }, [state.mode, state.sellingPrice, state.sellerDiscount, state.quantity, result.recommendedRevenue]);

  return (
    <div className="min-h-screen bg-[#F8F3EE] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Global Header */}
        <Header />

        {/* Mode Selector Tabs */}
        <ModeSelector currentMode={state.mode} onModeChange={handleModeChange} />

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Form Inputs (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Step 1: Data Produk */}
            <DataProdukSection
              state={state}
              onChange={handleInputChange}
              discountExceedsPrice={result.discountExceedsPrice}
            />

            {/* Step 2: Potongan Marketplace */}
            <MarketplaceFeesSection
              state={state}
              onUpdateFees={handleUpdateFees}
              referenceRevenue={referenceRevenueForFeePreviews}
              feeBreakdown={state.mode === 'PROFIT' ? result.feeBreakdown : result.recommendedFeeBreakdown}
              stepNumber={2}
            />

            {/* Step 3: Biaya Tetap per Pesanan (setelah potongan marketplace) */}
            <BiayaTetapSection state={state} onChange={handleInputChange} stepNumber={3} />
          </div>

          {/* Right Column: Results & Breakdown (5 cols on desktop, sticky on large screens) */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <ResultsPanel
              state={state}
              result={result}
              onReset={handleReset}
              onRoundingChange={handleRoundingChange}
            />
          </div>
        </div>

        {/* Tips Section */}
        <DenamiTips />

        {/* Denami Footer & Catalog Promo */}
        <DenamiFooter />
      </div>
    </div>
  );
}
