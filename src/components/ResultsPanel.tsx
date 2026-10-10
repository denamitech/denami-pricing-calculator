import React, { useState } from 'react';
import {
  BarChart2,
  Tag,
  Clock,
  Layers,
  ShieldCheck,
  Target,
  Calculator,
  RotateCcw,
  Copy,
  Check,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import { CalculatorState, CalculationResult } from '../types/calculator';
import { formatPercent, formatRupiah, generateShareText } from '../utils/calculator';
import { Tooltip } from './common/Tooltip';

interface ResultsPanelProps {
  state: CalculatorState;
  result: CalculationResult;
  onReset: () => void;
  onRoundingChange: (step: number) => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  state,
  result,
  onReset,
  onRoundingChange,
}) => {
  const [viewUnit, setViewUnit] = useState<'RUPIAH' | 'PERCENT'>('RUPIAH');
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const isProfitMode = state.mode === 'PROFIT';
  const isLoss = isProfitMode && result.isLoss;
  const isBreakEven = isProfitMode && result.isBreakEven;

  const handleCopy = async () => {
    const text = generateShareText(state, result);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        setShowShareModal(true);
      }
    } catch {
      setShowShareModal(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Cara Pakai Card */}
      <div className="bg-[#FAF3EA] border border-[#E7D9CE] rounded-2xl p-4 sm:p-4.5 shadow-xs">
        <div className="flex items-center gap-2 text-[#82543F] font-bold text-sm mb-2.5">
          <Lightbulb className="w-4 h-4 text-[#C05621]" />
          <span className="text-[#18263D]">Cara Pakai</span>
        </div>
        <ol className="space-y-1.5 text-xs sm:text-[13px] text-[#465268]">
          <li className="flex items-start gap-2">
            <span className="w-4.5 h-4.5 rounded-full bg-[#EFE2D7] text-[#603D2D] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <span>Pilih mode perhitungan di atas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-4.5 h-4.5 rounded-full bg-[#EFE2D7] text-[#603D2D] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <span>Isi data produk dan biaya yang relevan</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-4.5 h-4.5 rounded-full bg-[#EFE2D7] text-[#603D2D] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <span>Lihat hasil dan rincian perhitungan secara otomatis</span>
          </li>
        </ol>
      </div>

      {/* 2. Header Hasil Perhitungan */}
      <div className="flex items-center justify-between gap-2 px-1">
        <h2 className="text-lg sm:text-xl font-bold text-[#18263D]">Hasil Perhitungan</h2>
        <span className="px-3 py-1 rounded-full bg-[#E8F5ED] text-[#16805D] text-xs font-semibold border border-[#16805D]/20">
          Mode: {isProfitMode ? 'Hitung Profit' : 'Hitung Harga Jual'}
        </span>
      </div>

      {/* Denominator Error Alert */}
      {result.denominatorInvalid && (
        <div className="p-4 bg-[#FCEAEA] border border-[#E53945]/40 rounded-2xl text-xs sm:text-sm text-[#E53945] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Potongan Melebihi Batas Maksimal</div>
            <div className="mt-0.5">
              Total potongan persentase mencapai 100% atau lebih. Kurangi biaya yang aktif sebelum menghitung rekomendasi harga jual.
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Result Card */}
      <div className="bg-white rounded-2xl border border-[#E7D9CE] p-4 sm:p-5 shadow-xs">
        {isProfitMode ? (
          /* Mode Hitung Profit: Estimasi Profit Setelah Biaya */
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isLoss
                      ? 'bg-[#FCEAEA] text-[#E53945]'
                      : isBreakEven
                      ? 'bg-[#EFE2D7] text-[#82543F]'
                      : 'bg-[#E8F5ED] text-[#16805D]'
                  }`}
                >
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#18263D]">
                    Estimasi Profit Setelah Biaya
                  </span>
                  <div className="text-[11px] text-[#7C8798]">
                    Setelah dipotong biaya marketplace &amp; biaya tetap
                  </div>
                </div>
              </div>

              {/* Margin Pill */}
              <div
                className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                  isLoss
                    ? 'bg-[#FCEAEA] text-[#E53945] border border-[#E53945]/20'
                    : isBreakEven
                    ? 'bg-[#EFE2D7] text-[#603D2D]'
                    : 'bg-[#E8F5ED] text-[#16805D] border border-[#16805D]/20'
                }`}
              >
                Margin Profit: {result.marginPct !== null ? formatPercent(result.marginPct) : '—'}
              </div>
            </div>

            {/* Big Amount */}
            <div
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight my-2 tabular-nums ${
                isLoss ? 'text-[#E53945]' : isBreakEven ? 'text-[#18263D]' : 'text-[#16805D]'
              }`}
            >
              {formatRupiah(result.profit)}
            </div>

            {/* 3 Mini KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-[#E7D9CE]/60">
              {/* Harga Jual */}
              <div className="p-2.5 rounded-xl bg-[#F8F3EE]/70 border border-[#E7D9CE]/70 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-[#7C8798] leading-tight">Harga Jual</div>
                  <div className="text-xs sm:text-sm font-bold text-[#18263D] truncate tabular-nums">
                    {formatRupiah(result.sellingPrice)}
                  </div>
                </div>
              </div>

              {/* Total Potongan Marketplace */}
              <div className="p-2.5 rounded-xl bg-[#F8F3EE]/70 border border-[#E7D9CE]/70 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-[#7C8798] leading-tight">Total Potongan Marketplace</div>
                  <div className="text-xs sm:text-sm font-bold text-[#18263D] truncate tabular-nums">
                    {formatRupiah(result.totalMarketplaceFeeAmount)}
                  </div>
                  <div className="text-[10px] text-[#7C8798]">({formatPercent(result.totalFeePercentage, 2)})</div>
                </div>
              </div>

              {/* Total Biaya Tetap dan HPP */}
              <div className="p-2.5 rounded-xl bg-[#F8F3EE]/70 border border-[#E7D9CE]/70 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-[#7C8798] leading-tight">Total Biaya Tetap dan HPP</div>
                  <div className="text-xs sm:text-sm font-bold text-[#18263D] truncate tabular-nums">
                    {formatRupiah(result.totalFixedAndHpp)}
                  </div>
                  <div className="text-[9px] text-[#7C8798] truncate">(HPP + Biaya Tetap)</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Mode Hitung Harga Jual: Harga Jual Rekomendasi */
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5ED] text-[#16805D] flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#18263D]">Harga Jual Rekomendasi</span>
                  <div className="text-[11px] text-[#7C8798]">
                    Untuk target keuntungan {formatRupiah(result.targetProfitNominal)}
                  </div>
                </div>
              </div>
            </div>

            {/* Big Amount */}
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight my-2 text-[#16805D] tabular-nums">
              {result.denominatorInvalid ? '—' : formatRupiah(result.recommendedPriceRounded)}
            </div>

            {/* 3 Mini KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-[#E7D9CE]/60">
              {/* Target Keuntungan */}
              <div className="p-2.5 rounded-xl bg-[#F8F3EE]/70 border border-[#E7D9CE]/70 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-[#7C8798] leading-tight">Target Keuntungan</div>
                  <div className="text-xs sm:text-sm font-bold text-[#18263D] truncate tabular-nums">
                    {formatRupiah(result.targetProfitNominal)}
                  </div>
                  <div className="text-[10px] text-[#7C8798]">Target nominal</div>
                </div>
              </div>

              {/* Total Potongan Marketplace */}
              <div className="p-2.5 rounded-xl bg-[#F8F3EE]/70 border border-[#E7D9CE]/70 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-[#7C8798] leading-tight">Total Potongan Marketplace</div>
                  <div className="text-xs sm:text-sm font-bold text-[#18263D] truncate tabular-nums">
                    {result.denominatorInvalid ? '—' : formatRupiah(result.recommendedMarketplaceFees)}
                  </div>
                  <div className="text-[10px] text-[#7C8798]">({formatPercent(result.totalFeePercentage, 2)})</div>
                </div>
              </div>

              {/* Total Biaya Tetap dan HPP */}
              <div className="p-2.5 rounded-xl bg-[#F8F3EE]/70 border border-[#E7D9CE]/70 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-[#7C8798] leading-tight">Total Biaya Tetap dan HPP</div>
                  <div className="text-xs sm:text-sm font-bold text-[#18263D] truncate tabular-nums">
                    {formatRupiah(result.totalFixedAndHpp)}
                  </div>
                  <div className="text-[9px] text-[#7C8798] truncate">(HPP + Biaya Tetap)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Rincian Perhitungan Card */}
      <div className="bg-white rounded-2xl border border-[#E7D9CE] p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E7D9CE]/60">
          <h3 className="text-sm sm:text-base font-bold text-[#18263D] flex items-center gap-2">
            <span>Rincian Perhitungan</span>
          </h3>

          {/* Rupiah / Persentase Toggle */}
          <div className="inline-flex p-1 rounded-lg bg-[#F8F3EE] border border-[#E7D9CE]">
            <button
              type="button"
              onClick={() => setViewUnit('RUPIAH')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewUnit === 'RUPIAH' ? 'bg-[#82543F] text-white shadow-xs' : 'text-[#7C8798] hover:text-[#18263D]'
              }`}
            >
              Rupiah
            </button>
            <button
              type="button"
              onClick={() => setViewUnit('PERCENT')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewUnit === 'PERCENT' ? 'bg-[#82543F] text-white shadow-xs' : 'text-[#7C8798] hover:text-[#18263D]'
              }`}
            >
              Persentase
            </button>
          </div>
        </div>

        {/* Detailed Rows */}
        {isProfitMode ? (
          /* PROFIT MODE BREAKDOWN */
          <div className="space-y-3 text-xs sm:text-sm">
            {/* Top Revenue Lines */}
            <div className="space-y-1.5 pb-2 border-b border-[#E7D9CE]/40">
              <div className="flex justify-between text-[#465268]">
                <span>Harga jual awal</span>
                <span className="font-semibold text-[#18263D] tabular-nums">
                  {formatRupiah(result.sellingPrice)}
                </span>
              </div>
              <div className="flex justify-between text-[#465268]">
                <span>Diskon toko</span>
                <span className="font-semibold text-[#E53945] tabular-nums">
                  - {formatRupiah(result.sellerDiscount)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[#18263D] pt-1">
                <span>Harga setelah diskon</span>
                <span className="tabular-nums">{formatRupiah(result.discountedPricePerUnit)}</span>
              </div>
              {result.quantity > 1 && (
                <div className="flex justify-between text-[11px] text-[#7C8798]">
                  <span>Total pendapatan ({result.quantity} unit)</span>
                  <span className="font-semibold tabular-nums">{formatRupiah(result.totalRevenue)}</span>
                </div>
              )}
            </div>

            {/* Potongan Marketplace Section */}
            <div className="space-y-1.5 pb-2 border-b border-[#E7D9CE]/40">
              <div className="font-bold text-[#18263D] flex justify-between">
                <span>Potongan marketplace ({formatPercent(result.totalFeePercentage, 2)})</span>
              </div>
              <div className="pl-2 space-y-1 text-xs">
                {result.feeBreakdown
                  .filter((item) => item.isEnabled)
                  .map((item) => (
                    <div key={item.id} className="flex justify-between text-[#7C8798]">
                      <span>
                        • {item.name} ({formatPercent(item.percentage, 1)})
                      </span>
                      <span className="text-[#E53945] font-semibold tabular-nums">
                        {viewUnit === 'RUPIAH' ? `- ${formatRupiah(item.amount)}` : `-${formatPercent(item.percentage, 2)}`}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="flex justify-between font-bold text-[#E53945] pt-1 text-xs sm:text-sm">
                <span>Total potongan</span>
                <span className="tabular-nums">
                  {viewUnit === 'RUPIAH'
                    ? `- ${formatRupiah(result.totalMarketplaceFeeAmount)}`
                    : `-${formatPercent(result.totalFeePercentage, 2)}`}
                </span>
              </div>
            </div>

            {/* Biaya Tetap Section */}
            <div className="space-y-1.5 pb-2 border-b border-[#E7D9CE]/40">
              <div className="font-bold text-[#18263D]">Biaya tetap dan HPP</div>
              <div className="pl-2 space-y-1 text-xs">
                <div className="flex justify-between text-[#7C8798]">
                  <span>• HPP / Modal {result.quantity > 1 ? `(x${result.quantity})` : ''}</span>
                  <span className="text-[#E53945] font-semibold tabular-nums">
                    - {formatRupiah(result.totalHpp)}
                  </span>
                </div>
                <div className="flex justify-between text-[#7C8798]">
                  <span>• Biaya proses pesanan</span>
                  <span className="text-[#E53945] font-semibold tabular-nums">
                    - {formatRupiah(result.orderProcessFee)}
                  </span>
                </div>
                <div className="flex justify-between text-[#7C8798]">
                  <span>• Biaya packaging</span>
                  <span className="text-[#E53945] font-semibold tabular-nums">
                    - {formatRupiah(result.packagingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-[#7C8798]">
                  <span>• Biaya lain</span>
                  <span className="text-[#E53945] font-semibold tabular-nums">
                    - {formatRupiah(result.otherFee)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-[#E53945] pt-1 text-xs sm:text-sm">
                <span>Total biaya tetap dan HPP</span>
                <span className="tabular-nums">
                  - {formatRupiah(result.totalFixedAndHpp)}
                </span>
              </div>
            </div>

            {/* Final Profit */}
            <div className="flex justify-between items-center pt-1 text-sm sm:text-base font-bold">
              <div>
                <span className={isLoss ? 'text-[#E53945]' : 'text-[#16805D]'}>
                  Estimasi profit setelah biaya
                </span>
                <div className="text-[11px] font-normal text-[#7C8798]">Margin profit setelah biaya</div>
              </div>
              <div className="text-right">
                <div className={isLoss ? 'text-[#E53945]' : 'text-[#16805D]'}>
                  {formatRupiah(result.profit)}
                </div>
                <div className={`text-xs ${isLoss ? 'text-[#E53945]' : 'text-[#16805D]'}`}>
                  {result.marginPct !== null ? formatPercent(result.marginPct) : '—'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* PRICE MODE BREAKDOWN - Exact mirror of Hitung Profit */
          <div className="space-y-3 text-xs sm:text-sm">
            {/* Top Revenue Lines at Recommended Price */}
            <div className="space-y-1.5 pb-2 border-b border-[#E7D9CE]/40">
              <div className="flex justify-between text-[#465268]">
                <span>Harga jual rekomendasi</span>
                <span className="font-semibold text-[#18263D] tabular-nums">
                  {result.denominatorInvalid ? '—' : formatRupiah(result.recommendedPriceRounded)}
                </span>
              </div>
              <div className="flex justify-between text-[#465268]">
                <span>Diskon toko</span>
                <span className="font-semibold text-[#E53945] tabular-nums">
                  - {formatRupiah(result.sellerDiscount)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[#18263D] pt-1">
                <span>Harga setelah diskon</span>
                <span className="tabular-nums">
                  {result.denominatorInvalid
                    ? '—'
                    : formatRupiah(Math.max(0, (result.recommendedPriceRounded || 0) - result.sellerDiscount))}
                </span>
              </div>
              {result.quantity > 1 && (
                <div className="flex justify-between text-[11px] text-[#7C8798]">
                  <span>Total pendapatan ({result.quantity} unit)</span>
                  <span className="font-semibold tabular-nums">
                    {result.denominatorInvalid ? '—' : formatRupiah(result.recommendedRevenue)}
                  </span>
                </div>
              )}
            </div>

            {/* Potongan Marketplace Section */}
            <div className="space-y-1.5 pb-2 border-b border-[#E7D9CE]/40">
              <div className="font-bold text-[#18263D] flex justify-between">
                <span>Potongan marketplace ({formatPercent(result.totalFeePercentage, 2)})</span>
              </div>
              <div className="pl-2 space-y-1 text-xs">
                {result.recommendedFeeBreakdown
                  .filter((item) => item.isEnabled)
                  .map((item) => (
                    <div key={item.id} className="flex justify-between text-[#7C8798]">
                      <span>
                        • {item.name} ({formatPercent(item.percentage, 1)})
                      </span>
                      <span className="text-[#E53945] font-semibold tabular-nums">
                        {viewUnit === 'RUPIAH' ? `- ${formatRupiah(item.amount)}` : `-${formatPercent(item.percentage, 2)}`}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="flex justify-between font-bold text-[#E53945] pt-1 text-xs sm:text-sm">
                <span>Total potongan</span>
                <span className="tabular-nums">
                  {viewUnit === 'RUPIAH'
                    ? `- ${formatRupiah(result.recommendedMarketplaceFees)}`
                    : `-${formatPercent(result.totalFeePercentage, 2)}`}
                </span>
              </div>
            </div>

            {/* Biaya Tetap Section */}
            <div className="space-y-1.5 pb-2 border-b border-[#E7D9CE]/40">
              <div className="font-bold text-[#18263D]">Biaya tetap dan HPP</div>
              <div className="pl-2 space-y-1 text-xs">
                <div className="flex justify-between text-[#7C8798]">
                  <span>• HPP / Modal {result.quantity > 1 ? `(x${result.quantity})` : ''}</span>
                  <span className="text-[#E53945] font-semibold tabular-nums">
                    - {formatRupiah(result.totalHpp)}
                  </span>
                </div>
                <div className="flex justify-between text-[#7C8798]">
                  <span>• Biaya proses pesanan</span>
                  <span className="text-[#E53945] font-semibold tabular-nums">
                    - {formatRupiah(result.orderProcessFee)}
                  </span>
                </div>
                <div className="flex justify-between text-[#7C8798]">
                  <span>• Biaya packaging</span>
                  <span className="text-[#E53945] font-semibold tabular-nums">
                    - {formatRupiah(result.packagingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-[#7C8798]">
                  <span>• Biaya lain</span>
                  <span className="text-[#E53945] font-semibold tabular-nums">
                    - {formatRupiah(result.otherFee)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-[#E53945] pt-1 text-xs sm:text-sm">
                <span>Total biaya tetap dan HPP</span>
                <span className="tabular-nums">
                  - {formatRupiah(result.totalFixedAndHpp)}
                </span>
              </div>
            </div>

            {/* Final Profit (Target Profit) */}
            <div className="flex justify-between items-center pt-1 text-sm sm:text-base font-bold">
              <div>
                <span className="text-[#16805D]">Estimasi profit setelah biaya</span>
                <div className="text-[11px] font-normal text-[#7C8798]">
                  Target keuntungan {formatRupiah(result.targetProfitNominal)} tercapai
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#16805D] tabular-nums">
                  {result.denominatorInvalid ? '—' : formatRupiah(result.recommendedProfitFinal)}
                </div>
                <div className="text-xs text-[#16805D] tabular-nums">
                  {result.recommendedRevenue && result.recommendedRevenue > 0 && result.recommendedProfitFinal !== null
                    ? formatPercent((result.recommendedProfitFinal / result.recommendedRevenue) * 100)
                    : '—'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Break-Even & Rekomendasi Secondary Cards (Konsisten di kedua tab: Hijau Break-Even lalu Biru Rekomendasi) */}
      <div className="space-y-3">
        {/* Harga Jual Minimal (Break-Even) Card - Hijau (Ijo) */}
        <div className="bg-[#E8F5ED]/70 border border-[#16805D]/25 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#16805D] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#18263D]">
                Harga Jual Minimal (Break Even)
              </div>
              <div className="text-[11px] text-[#465268]">
                Harga minimum agar tidak rugi (estimasi profit = Rp 0)
              </div>
            </div>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-[#16805D] tabular-nums text-right shrink-0">
            {result.denominatorInvalid ? '—' : formatRupiah(result.breakEvenPriceRounded)}
          </div>
        </div>

        {/* Rekomendasi Harga Jual Card - Biru (Blue) */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#18263D] flex items-center gap-1">
                <span>Rekomendasi Harga Jual</span>
                <Tooltip content={`Harga yang disarankan agar mencapai target keuntungan ${formatRupiah(result.targetProfitNominal)}.`} />
              </div>
              <div className="text-[11px] text-[#465268]">
                Untuk target keuntungan {formatRupiah(result.targetProfitNominal)}
              </div>
            </div>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-blue-600 tabular-nums text-right shrink-0">
            {result.denominatorInvalid ? '—' : formatRupiah(result.recommendedPriceRounded)}
          </div>
        </div>

        {/* Rounding Step Selector for Recommended Price */}
        <div className="bg-white border border-[#E7D9CE] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="text-xs font-semibold text-[#18263D]">
            <span>Pembulatan Rekomendasi:</span>
          </div>
          <div className="inline-flex rounded-lg bg-[#F8F3EE] p-0.5 border border-[#E7D9CE]">
            <button
              type="button"
              onClick={() => onRoundingChange(0)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                state.roundingStep === 0
                  ? 'bg-[#82543F] text-white shadow-xs font-semibold'
                  : 'text-[#465268] hover:text-[#18263D]'
              }`}
            >
              Rp 0
            </button>
            <button
              type="button"
              onClick={() => onRoundingChange(500)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                state.roundingStep === 500
                  ? 'bg-[#82543F] text-white shadow-xs font-semibold'
                  : 'text-[#465268] hover:text-[#18263D]'
              }`}
            >
              Rp 500
            </button>
            <button
              type="button"
              onClick={() => onRoundingChange(1000)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                state.roundingStep === 1000
                  ? 'bg-[#82543F] text-white shadow-xs font-semibold'
                  : 'text-[#465268] hover:text-[#18263D]'
              }`}
            >
              Rp 1.000
            </button>
          </div>
        </div>
      </div>

      {/* 6. Action Buttons: Reset Semua & Salin Hasil */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {/* Reset Semua */}
        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#E7D9CE] bg-white hover:bg-[#F8F3EE] text-[#603D2D] font-bold text-xs sm:text-sm transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4 text-[#82543F]" />
          <span>Reset Semua</span>
        </button>

        {/* Salin Hasil */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.98] ${
            copied
              ? 'bg-[#16805D] text-white'
              : 'bg-[#82543F] hover:bg-[#603D2D] text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Salin Hasil</span>
            </>
          )}
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#E7D9CE] p-5 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold text-[#18263D] mb-1">Reset Seluruh Form?</h3>
            <p className="text-xs text-[#7C8798] mb-5">
              Semua nilai input produk, biaya operasional, dan toggle biaya marketplace akan dikembalikan ke pengaturan awal DENAMI.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#7C8798] hover:bg-[#F8F3EE] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#E53945] text-white hover:bg-[#c52b36] transition-colors shadow-xs cursor-pointer"
              >
                Ya, Reset Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share / Copy Fallback Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#E7D9CE] p-5 w-full max-w-md shadow-xl">
            <h3 className="text-base font-bold text-[#18263D] mb-1">Salin Ringkasan Hasil</h3>
            <p className="text-xs text-[#7C8798] mb-3">
              Salin teks di bawah ini untuk dibagikan ke WhatsApp atau tim kamu:
            </p>
            <textarea
              readOnly
              rows={8}
              value={generateShareText(state, result)}
              className="w-full p-2.5 text-xs font-mono bg-[#F8F3EE] border border-[#E7D9CE] rounded-lg text-[#18263D] outline-hidden mb-3 select-all"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#82543F] text-white hover:bg-[#603D2D] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
