import {
  CalculatorState,
  CalculationResult,
  FeeBreakdownItem,
  MarketplaceFee,
} from '../types/calculator';

export const DEFAULT_FEES: MarketplaceFee[] = [
  {
    id: 'admin_fee',
    name: 'Biaya admin',
    percentage: 10,
    isEnabled: true,
    basis: 'AFTER_DISCOUNT',
    description: 'Biaya administrasi non-star / star seller marketplace.',
  },
  {
    id: 'gratis_ongkir_xtra',
    name: 'Gratis Ongkir Xtra',
    percentage: 6,
    isEnabled: true,
    basis: 'AFTER_DISCOUNT',
    description: 'Biaya keikutsertaan program Gratis Ongkir Xtra.',
  },
  {
    id: 'biaya_xtra',
    name: 'Biaya Xtra',
    percentage: 4.5,
    isEnabled: true,
    basis: 'AFTER_DISCOUNT',
    description: 'Biaya partisipasi program cashback / promo xtra.',
  },
  {
    id: 'live_xtra',
    name: 'Biaya Live Xtra',
    percentage: 3,
    isEnabled: true,
    basis: 'AFTER_DISCOUNT',
    description: 'Biaya komisi khusus pesanan dari sesi live streaming.',
  },
  {
    id: 'spaylater',
    name: 'Biaya Spaylater',
    percentage: 2.5,
    isEnabled: true,
    basis: 'AFTER_DISCOUNT',
    description: 'Biaya penanganan metode cicilan / SpayLater.',
  },
  {
    id: 'ppn_tax',
    name: 'Tax (PPN)',
    percentage: 0.5,
    isEnabled: true,
    basis: 'AFTER_DISCOUNT',
    description: 'Pajak Pertambahan Nilai atas jasa marketplace.',
  },
  {
    id: 'biaya_iklan',
    name: 'Biaya Iklan',
    percentage: 15,
    isEnabled: true,
    basis: 'AFTER_DISCOUNT',
    description: 'Estimasi alokasi budget iklan berbayar (Shopee Ads/TikTok Ads).',
  },
  {
    id: 'komisi_affiliate',
    name: 'Komisi Affiliate',
    percentage: 5,
    isEnabled: true,
    basis: 'AFTER_DISCOUNT',
    description: 'Komisi bagi affiliate creator yang mempromosikan produk.',
  },
  {
    id: 'pembayaran_mall',
    name: 'Biaya Pembayaran (Mall)',
    percentage: 2,
    isEnabled: true,
    basis: 'AFTER_DISCOUNT',
    description: 'Biaya pemrosesan transaksi pembayaran pembeli.',
  },
];

export const INITIAL_STATE: CalculatorState = {
  mode: 'PROFIT',
  sellingPrice: 100000,
  hpp: 70000, // Default 70.000 matches test standard
  sellerDiscount: 0,
  quantity: 1,
  orderProcessFee: 1250,
  packagingFee: 0,
  otherFee: 0,
  targetProfitNominal: 17500, // Target keuntungan nominal Rp (default Rp 17.500)
  roundingStep: 0, // Default 0 (tanpa pembulatan / Rp 0: rekomendasi harga jual tidak dibulatkan secara default)
  fees: DEFAULT_FEES,
};

/**
 * Format number to Indonesian Rupiah representation
 * Applies standard decimal rounding (Math.round):
 * - If >= .5 round up, if < .5 round down
 * - Strips fractional decimals to display clean integers without digits behind the comma
 * - Example: 101955.31 -> "Rp 101.955", 10705.80 -> "Rp 10.706"
 */
export function formatRupiah(amount: number | null | undefined, withPrefix = true): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—';
  }

  const isNegative = amount < 0;
  // Standard decimal rounding rule (>= 0.5 rounds up, < 0.5 rounds down)
  const roundedAmount = Math.round(Math.abs(amount));

  const formattedNumber = roundedAmount.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (!withPrefix) {
    return isNegative ? `-${formattedNumber}` : formattedNumber;
  }

  return isNegative ? `-Rp ${formattedNumber}` : `Rp ${formattedNumber}`;
}

/**
 * Format percentage in Indonesian locale (e.g. 48.5 -> "48,5%" or "48,50%")
 */
export function formatPercent(pct: number | null | undefined, decimals = 2, padZero = true): string {
  if (pct === null || pct === undefined || isNaN(pct)) {
    return '—';
  }

  const formatted = pct.toLocaleString('id-ID', {
    minimumFractionDigits: padZero ? decimals : 0,
    maximumFractionDigits: decimals,
  });

  return `${formatted}%`;
}

/**
 * Parse Indonesian number input string into a valid number
 */
export function parseNumberInput(value: string): number {
  if (!value) return 0;
  const clean = value.replace(/[^0-9.,-]/g, '').replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

interface PriceEvaluation {
  sellingPrice: number;
  sellerDiscount: number;
  discountedPricePerUnit: number;
  quantity: number;
  totalRevenue: number;
  totalHpp: number;
  totalFixedFee: number;
  totalFixedAndHpp: number;
  totalFeeAmount: number;
  feeBreakdown: FeeBreakdownItem[];
  profit: number;
  marginPct: number | null;
}

/**
 * Single Unified Evaluation Function
 * Evaluates full marketplace fee deductions, fixed costs, HPP, and profit
 * for a given selling price P.
 * STRICTLY PRESERVES full decimal precision without rounding intermediate components.
 */
export function evaluateAtPrice(
  P: number,
  state: CalculatorState,
  sanitizedQty?: number,
  sanitizedHpp?: number,
  sanitizedDiscount?: number,
  sanitizedFixedFee?: number
): PriceEvaluation {
  const safeQty = sanitizedQty !== undefined ? sanitizedQty : Math.max(1, Math.floor(state.quantity || 1));
  const safeHpp = sanitizedHpp !== undefined ? sanitizedHpp : Math.max(0, state.hpp || 0);
  const safeDiscount = sanitizedDiscount !== undefined ? sanitizedDiscount : Math.max(0, state.sellerDiscount || 0);
  const safeFixedFee =
    sanitizedFixedFee !== undefined
      ? sanitizedFixedFee
      : Math.max(0, state.orderProcessFee || 0) +
        Math.max(0, state.packagingFee || 0) +
        Math.max(0, state.otherFee || 0);

  const safeP = Math.max(0, P);
  const discountedPricePerUnit = Math.max(0, safeP - safeDiscount);
  const totalRevenue = discountedPricePerUnit * safeQty;
  const totalHpp = safeHpp * safeQty;

  // Calculate fees with full decimal precision (NO rounding intermediate items)
  let rawTotalFee = 0;
  const feeBreakdown: FeeBreakdownItem[] = state.fees.map((fee) => {
    const isEnabled = fee.isEnabled && (fee.percentage || 0) > 0;
    const basis = fee.basis || 'AFTER_DISCOUNT';
    const rate = isEnabled ? fee.percentage / 100 : 0;

    let baseAmount = 0;
    if (isEnabled) {
      if (basis === 'BEFORE_DISCOUNT') {
        baseAmount = safeP * safeQty;
      } else {
        // default 'AFTER_DISCOUNT' = S * Q
        baseAmount = totalRevenue;
      }
    }

    const exactAmount = baseAmount * rate;
    rawTotalFee += exactAmount;

    return {
      id: fee.id,
      name: fee.name,
      percentage: fee.percentage,
      basis,
      amount: exactAmount, // Exact decimal amount (NO rounding)
      isEnabled,
    };
  });

  // Profit = Total Revenue (S) - Total Fee Marketplace - Total HPP - Total Biaya Tetap (C)
  const profit = totalRevenue - rawTotalFee - totalHpp - safeFixedFee;
  const marginPct = totalRevenue > 0 ? (profit / totalRevenue) * 100 : null;

  return {
    sellingPrice: safeP,
    sellerDiscount: safeDiscount,
    discountedPricePerUnit,
    quantity: safeQty,
    totalRevenue,
    totalHpp,
    totalFixedFee: safeFixedFee,
    totalFixedAndHpp: totalHpp + safeFixedFee,
    totalFeeAmount: rawTotalFee, // Exact decimal total fee (NO rounding)
    feeBreakdown,
    profit,
    marginPct,
  };
}

/**
 * Main Calculation Engine
 * Adheres strictly to Section 1-8 of final prompt
 */
export function calculate(state: CalculatorState): CalculationResult {
  const {
    mode,
    sellingPrice,
    hpp,
    sellerDiscount,
    quantity,
    orderProcessFee,
    packagingFee,
    otherFee,
    targetProfitNominal,
    roundingStep,
    fees,
  } = state;

  // 1. Sanitization & Input Validations
  const safeQty = Math.max(1, Math.floor(quantity || 1));
  const safeHpp = Math.max(0, hpp || 0);
  const safeDiscount = Math.max(0, sellerDiscount || 0);
  const safeProcessFee = Math.max(0, orderProcessFee || 0);
  const safePackagingFee = Math.max(0, packagingFee || 0);
  const safeOtherFee = Math.max(0, otherFee || 0);
  const safeTargetProfit = Math.max(0, targetProfitNominal || 0);
  const safeSellingPrice = Math.max(0, sellingPrice || 0);

  const totalFixedFee = safeProcessFee + safePackagingFee + safeOtherFee;
  const totalHpp = safeHpp * safeQty;
  const totalFixedAndHpp = totalHpp + totalFixedFee;

  // Validation flags
  const isHppInvalid = hpp <= 0 || isNaN(hpp);
  const isPriceInvalid = mode === 'PROFIT' && (sellingPrice <= 0 || isNaN(sellingPrice));
  const isTargetProfitInvalid = targetProfitNominal < 0 || isNaN(targetProfitNominal);
  const discountExceedsPrice = mode === 'PROFIT' && safeSellingPrice > 0 && safeDiscount >= safeSellingPrice;

  // Fee rates summary
  const activeFees = fees.filter((f) => f.isEnabled && (f.percentage || 0) > 0);
  const totalFeePercentage = activeFees.reduce((acc, f) => acc + (f.percentage || 0), 0);

  // Rate on after discount vs before discount
  let rAfter = 0;
  let rBefore = 0;
  activeFees.forEach((f) => {
    const basis = f.basis || 'AFTER_DISCOUNT';
    if (basis === 'BEFORE_DISCOUNT') {
      rBefore += f.percentage / 100;
    } else {
      rAfter += f.percentage / 100;
    }
  });

  const rTotal = rAfter + rBefore;
  const denominatorInvalid = rTotal >= 1.0;

  let validationError: string | null = null;
  if (denominatorInvalid) {
    validationError =
      'Total potongan persentase mencapai 100% atau lebih. Harga rekomendasi tidak dapat dihitung dengan asumsi tersebut.';
  } else if (discountExceedsPrice) {
    validationError = 'Diskon toko yang ditanggung seller melebihi atau sama dengan harga jual.';
  } else if (isHppInvalid) {
    validationError = 'Harga Pokok Penjualan (HPP) / Modal harus lebih besar dari Rp 0.';
  }

  // 2. Tab 1 Evaluation (Hitung Profit):
  const profitModeEval = evaluateAtPrice(
    safeSellingPrice,
    state,
    safeQty,
    safeHpp,
    safeDiscount,
    totalFixedFee
  );

  // 3. Tab 2 Solving (Hitung Harga Jual):
  // Target: Profit(P) = safeTargetProfit (nominal Rp)
  let recommendedPriceTheoretical: number | null = null;
  let recommendedPriceRounded: number | null = null;
  let recommendedRevenue: number | null = null;
  let recommendedMarketplaceFees: number | null = null;
  let recommendedFeeBreakdown: FeeBreakdownItem[] = [];
  let recommendedProfitFinal: number | null = null;
  let recommendedMarginFinal: number | null = null;

  let breakEvenPriceTheoretical: number | null = null;
  let breakEvenPriceRounded: number | null = null;

  if (!denominatorInvalid) {
    // Exact analytical solution:
    // Profit(P) = (P - D) * Q * (1 - rTotal) - D * Q * rBefore - Total HPP - C
    // Target: Profit(P) = Target Profit
    // => (P - D) * Q * (1 - rTotal) = Total HPP + C + Target Profit + D * Q * rBefore
    // => P_raw = D + [Total HPP + C + Target Profit + (D * Q * rBefore)] / [Q * (1 - rTotal)]
    const numeratorRec = totalHpp + totalFixedFee + safeTargetProfit + safeDiscount * safeQty * rBefore;
    const pRecRaw = safeDiscount + numeratorRec / (safeQty * (1 - rTotal));
    recommendedPriceTheoretical = pRecRaw;

    // Theoretical baseline evaluation (independent of roundingStep):
    // All marketplace fees, revenue, breakdown, profit, and margin are anchored strictly to the true target
    const theoreticalRecEval = evaluateAtPrice(
      pRecRaw,
      state,
      safeQty,
      safeHpp,
      safeDiscount,
      totalFixedFee
    );

    // Apply rounding option ONLY to recommended price display/final value:
    // roundingStep: 0 (tanpa pembulatan / Rp 0), 500 (kelipatan 500), 1000 (kelipatan 1000)
    let pRecFinal = pRecRaw;
    if (roundingStep && roundingStep > 0) {
      pRecFinal = Math.ceil(pRecRaw / roundingStep) * roundingStep;
    }

    // Recommended price is rounded according to roundingStep:
    recommendedPriceRounded = pRecFinal;

    // Components (revenue, fees, breakdown, profit, margin) stay at real values anchored to the exact formula:
    recommendedRevenue = theoreticalRecEval.totalRevenue;
    recommendedMarketplaceFees = theoreticalRecEval.totalFeeAmount;
    recommendedFeeBreakdown = theoreticalRecEval.feeBreakdown;
    recommendedProfitFinal = safeTargetProfit; // Exactly matches target profit requested by user
    recommendedMarginFinal = theoreticalRecEval.marginPct;

    // Break-even price (Profit = 0):
    // P_be = D + [Total HPP + C + (D * Q * rBefore)] / [Q * (1 - rTotal)]
    const numeratorBe = totalHpp + totalFixedFee + safeDiscount * safeQty * rBefore;
    const pBeRaw = safeDiscount + numeratorBe / (safeQty * (1 - rTotal));
    breakEvenPriceTheoretical = pBeRaw;
    breakEvenPriceRounded = pBeRaw;
  }

  const isLoss = profitModeEval.profit < 0;
  const isBreakEven = Math.abs(profitModeEval.profit) < 0.01;

  return {
    mode,
    sellingPrice: safeSellingPrice,
    sellerDiscount: safeDiscount,
    discountedPricePerUnit: profitModeEval.discountedPricePerUnit,
    quantity: safeQty,
    totalRevenue: profitModeEval.totalRevenue,
    totalHpp,
    totalFixedFee,
    totalFixedAndHpp,
    orderProcessFee: safeProcessFee,
    packagingFee: safePackagingFee,
    otherFee: safeOtherFee,
    totalFeePercentage,
    totalMarketplaceFeeAmount: profitModeEval.totalFeeAmount,
    feeBreakdown: profitModeEval.feeBreakdown,
    profit: profitModeEval.profit,
    marginPct: profitModeEval.marginPct,
    isLoss,
    isBreakEven,
    targetProfitNominal: safeTargetProfit,
    recommendedPriceTheoretical,
    recommendedPriceRounded,
    recommendedRevenue,
    recommendedMarketplaceFees,
    recommendedFeeBreakdown,
    recommendedProfitFinal,
    recommendedMarginFinal,
    breakEvenPriceTheoretical,
    breakEvenPriceRounded,
    denominatorInvalid,
    discountExceedsPrice,
    isHppInvalid,
    isPriceInvalid,
    isTargetProfitInvalid,
    validationError,
  };
}

/**
 * Generate shareable WhatsApp summary text
 */
export function generateShareText(state: CalculatorState, result: CalculationResult): string {
  const line = '--------------------------------';
  const timestamp = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (state.mode === 'PROFIT') {
    return [
      `*DENAMI — Ringkasan Estimasi Profit Marketplace*`,
      `📅 ${timestamp}`,
      line,
      `*Data Produk:*`,
      `• Harga Jual: ${formatRupiah(result.sellingPrice)}`,
      `• Diskon Toko: ${formatRupiah(result.sellerDiscount)}`,
      `• Harga Setelah Diskon: ${formatRupiah(result.discountedPricePerUnit)}`,
      `• HPP / Modal: ${formatRupiah(state.hpp)} (x${result.quantity} = ${formatRupiah(result.totalHpp)})`,
      `• Jumlah Produk: ${result.quantity} pcs`,
      line,
      `*Biaya & Potongan:*`,
      `• Total Potongan Marketplace (${formatPercent(result.totalFeePercentage, 1)}): ${formatRupiah(result.totalMarketplaceFeeAmount)}`,
      `• Total Biaya Tetap per Pesanan: ${formatRupiah(result.totalFixedFee)}`,
      `  - Biaya Proses: ${formatRupiah(result.orderProcessFee)}`,
      result.packagingFee > 0 ? `  - Biaya Packaging: ${formatRupiah(result.packagingFee)}` : null,
      result.otherFee > 0 ? `  - Biaya Lain: ${formatRupiah(result.otherFee)}` : null,
      `• Total Biaya Tetap dan HPP: ${formatRupiah(result.totalFixedAndHpp)}`,
      line,
      `*Hasil Perhitungan:*`,
      `• *Estimasi Profit Setelah Biaya: ${formatRupiah(result.profit)}*`,
      `• Margin Profit Setelah Biaya: ${result.marginPct !== null ? formatPercent(result.marginPct) : '—'}`,
      `• Harga Jual Minimal (Break-Even): ${formatRupiah(result.breakEvenPriceRounded)}`,
      line,
      `_Dihitung dengan DENAMI — Sourcing & Supply Solution_`,
    ]
      .filter(Boolean)
      .join('\n');
  } else {
    return [
      `*DENAMI — Ringkasan Rekomendasi Harga Jual*`,
      `📅 ${timestamp}`,
      line,
      `*Data Produk & Target:*`,
      `• HPP / Modal: ${formatRupiah(state.hpp)} (x${result.quantity} = ${formatRupiah(result.totalHpp)})`,
      `• Target Keuntungan: ${formatRupiah(result.targetProfitNominal)}`,
      `• Diskon Toko: ${formatRupiah(result.sellerDiscount)}`,
      `• Jumlah Produk: ${result.quantity} pcs`,
      `• Total Biaya Tetap per Pesanan: ${formatRupiah(result.totalFixedFee)}`,
      `• Total Biaya Tetap dan HPP: ${formatRupiah(result.totalFixedAndHpp)}`,
      `• Total Potongan Marketplace: ${formatPercent(result.totalFeePercentage, 1)} (${formatRupiah(result.recommendedMarketplaceFees)})`,
      line,
      `*Hasil Rekomendasi:*`,
      `• *Estimasi Harga Jual Rekomendasi: ${formatRupiah(result.recommendedPriceRounded)}*`,
      `• Estimasi Profit Setelah Biaya: ${formatRupiah(result.recommendedProfitFinal)}`,
      `• Margin Profit Setelah Biaya: ${result.recommendedMarginFinal !== null ? formatPercent(result.recommendedMarginFinal) : '—'}`,
      `• Harga Jual Minimal (Break-Even): ${formatRupiah(result.breakEvenPriceRounded)}`,
      line,
      `_Dihitung dengan DENAMI — Sourcing & Supply Solution_`,
    ]
      .filter(Boolean)
      .join('\n');
  }
}
