export type CalculationMode = 'PROFIT' | 'PRICE';

export type FeeBasis = 'AFTER_DISCOUNT' | 'BEFORE_DISCOUNT';

export interface MarketplaceFee {
  id: string;
  name: string;
  percentage: number; // e.g. 10 for 10%
  isEnabled: boolean;
  basis?: FeeBasis; // default: 'AFTER_DISCOUNT' (harga setelah diskon toko)
  isCustom?: boolean;
  description?: string;
}

export interface CalculatorState {
  mode: CalculationMode;
  sellingPrice: number; // P (harga jual sebelum diskon toko per unit)
  hpp: number; // H (HPP/modal per unit)
  sellerDiscount: number; // D (diskon toko yang ditanggung seller per unit)
  quantity: number; // Q (jumlah produk dalam pesanan, minimal 1)
  orderProcessFee: number; // F1 (biaya proses pesanan per pesanan)
  packagingFee: number; // F2 (biaya packaging per pesanan)
  otherFee: number; // F3 (biaya lain per pesanan)
  targetProfitNominal: number; // Target keuntungan dalam nominal Rupiah
  roundingStep: number; // 0 (tanpa pembulatan / Rp 0 - default), 500, atau 1000 (hanya untuk harga jual rekomendasi)
  fees: MarketplaceFee[];
}

export interface FeeBreakdownItem {
  id: string;
  name: string;
  percentage: number;
  basis: FeeBasis;
  amount: number;
  isEnabled: boolean;
}

export interface CalculationResult {
  mode: CalculationMode;
  sellingPrice: number;
  sellerDiscount: number;
  discountedPricePerUnit: number;
  quantity: number;
  totalRevenue: number; // S * Q
  totalHpp: number; // H * Q
  totalFixedFee: number; // C = F1 + F2 + F3
  totalFixedAndHpp: number; // Total Biaya Tetap dan HPP = (H * Q) + C
  orderProcessFee: number;
  packagingFee: number;
  otherFee: number;
  totalFeePercentage: number; // in %
  totalMarketplaceFeeAmount: number;
  feeBreakdown: FeeBreakdownItem[];

  // Profit / Margin (Estimasi Profit & Margin Setelah Biaya)
  profit: number;
  marginPct: number | null;
  isLoss: boolean;
  isBreakEven: boolean;

  // Tab 2 (Hitung Harga Jual): Rekomendasi & Break-Even
  targetProfitNominal: number;
  recommendedPriceTheoretical: number | null; // Harga sebelum pembulatan
  recommendedPriceRounded: number | null; // Harga rekomendasi final (dengan pembulatan jika dipilih)
  recommendedRevenue: number | null;
  recommendedMarketplaceFees: number | null;
  recommendedFeeBreakdown: FeeBreakdownItem[];
  recommendedProfitFinal: number | null;
  recommendedMarginFinal: number | null;

  breakEvenPriceTheoretical: number | null;
  breakEvenPriceRounded: number | null; // alias for break-even price

  // Validations
  denominatorInvalid: boolean; // total fee rate >= 100% on revenue base
  discountExceedsPrice: boolean; // D >= P in Profit mode
  isHppInvalid: boolean;
  isPriceInvalid: boolean;
  isTargetProfitInvalid: boolean;
  validationError: string | null;
}
