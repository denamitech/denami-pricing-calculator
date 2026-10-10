import React from 'react';
import { CalculatorState } from '../types/calculator';
import { NumberInput } from './common/NumberInput';
import { Tooltip } from './common/Tooltip';

interface DataProdukSectionProps {
  state: CalculatorState;
  onChange: <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) => void;
  discountExceedsPrice: boolean;
}

export const DataProdukSection: React.FC<DataProdukSectionProps> = ({
  state,
  onChange,
  discountExceedsPrice,
}) => {
  const isProfitMode = state.mode === 'PROFIT';

  return (
    <section className="bg-white rounded-2xl border border-[#E7D9CE] p-4 sm:p-5 shadow-xs mb-5">
      {/* Section Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-6 h-6 rounded-full bg-[#82543F] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
          1
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#18263D] leading-tight">Data Produk</h2>
          <p className="text-xs sm:text-sm text-[#7C8798] mt-0.5">
            {isProfitMode
              ? 'Masukkan informasi dasar produk yang dijual'
              : 'Masukkan informasi dasar produk dan target keuntungan'}
          </p>
        </div>
      </div>

      {/* Grid Inputs - Consistent 2x2 layout in both modes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isProfitMode ? (
          <>
            {/* 1. Harga Jual */}
            <div>
              <div className="flex items-center text-xs sm:text-sm font-semibold text-[#18263D] mb-1.5">
                <span>Harga Jual</span>
                <Tooltip content="Harga jual produk per unit sebelum potongan diskon toko." />
              </div>
              <NumberInput
                value={state.sellingPrice}
                onChange={(val) => onChange('sellingPrice', val)}
                prefix="Rp"
                min={0}
                placeholder="100.000"
                error={
                  discountExceedsPrice
                    ? 'Harga jual harus lebih besar dari diskon toko'
                    : undefined
                }
              />
            </div>

            {/* 2. HPP / Modal */}
            <div>
              <div className="flex items-center text-xs sm:text-sm font-semibold text-[#18263D] mb-1.5">
                <span>Harga Pokok Penjualan (HPP) / Modal</span>
                <Tooltip content="Modal per unit produk (harga beli grosir atau biaya produksi per pcs)." />
              </div>
              <NumberInput
                value={state.hpp}
                onChange={(val) => onChange('hpp', val)}
                prefix="Rp"
                min={0}
                placeholder="60.000"
              />
            </div>

            {/* 3. Diskon Toko */}
            <div>
              <div className="flex items-center text-xs sm:text-sm font-semibold text-[#18263D] mb-1.5">
                <span>Diskon dari Toko (opsional)</span>
                <Tooltip content="Diskon nominal per unit yang ditanggung oleh seller sendiri (bukan subsidi gratis ongkir/voucher dari marketplace)." />
              </div>
              <NumberInput
                value={state.sellerDiscount}
                onChange={(val) => onChange('sellerDiscount', val)}
                prefix="Rp"
                min={0}
                placeholder="0"
              />
              <p className="text-[11px] text-[#7C8798] mt-1 italic">
                Diskon yang ditanggung oleh seller (bukan subsidi Shopee)
              </p>
            </div>

            {/* 4. Jumlah Produk */}
            <div>
              <div className="flex items-center text-xs sm:text-sm font-semibold text-[#18263D] mb-1.5">
                <span>Jumlah Produk (opsional)</span>
                <Tooltip content="Jumlah produk yang dibeli pembeli dalam satu pesanan. Biaya tetap per pesanan hanya dihitung 1 kali." />
              </div>
              <NumberInput
                value={state.quantity}
                onChange={(val) => onChange('quantity', Math.max(1, val))}
                suffix="pcs"
                min={1}
                placeholder="1"
              />
              <p className="text-[11px] text-[#7C8798] mt-1">
                Untuk menghitung total keuntungan jika menjual lebih dari 1 pcs
              </p>
            </div>
          </>
        ) : (
          <>
            {/* 1. Mode Hitung Harga Jual: HPP / Modal */}
            <div>
              <div className="flex items-center text-xs sm:text-sm font-semibold text-[#18263D] mb-1.5">
                <span>Harga Pokok Penjualan (HPP) / Modal</span>
                <Tooltip content="Modal per unit produk yang ingin dihitung harga jual rekomendasinya." />
              </div>
              <NumberInput
                value={state.hpp}
                onChange={(val) => onChange('hpp', val)}
                prefix="Rp"
                min={0}
                placeholder="60.000"
              />
            </div>

            {/* 2. Target Keuntungan (Nominal Rp) */}
            <div>
              <div className="flex items-center text-xs sm:text-sm font-semibold text-[#18263D] mb-1.5">
                <span>Target Keuntungan</span>
                <Tooltip content="Target nominal keuntungan bersih (Rp) yang ingin dicapai setelah HPP, seluruh fee marketplace, dan biaya tetap dikurangkan." />
              </div>
              <NumberInput
                value={state.targetProfitNominal}
                onChange={(val) => onChange('targetProfitNominal', val)}
                prefix="Rp"
                min={0}
                placeholder="17.500"
              />
              <p className="text-[11px] text-[#7C8798] mt-1 italic">
                Nominal profit bersih (Rp) yang ingin dicapai
              </p>
            </div>

            {/* 3. Diskon dari Toko (opsional) */}
            <div>
              <div className="flex items-center text-xs sm:text-sm font-semibold text-[#18263D] mb-1.5">
                <span>Diskon dari Toko (opsional)</span>
                <Tooltip content="Jika Anda berencana memberikan diskon toko (voucher seller), masukkan di sini agar harga rekomendasi memperhitungkan diskon tersebut." />
              </div>
              <NumberInput
                value={state.sellerDiscount}
                onChange={(val) => onChange('sellerDiscount', val)}
                prefix="Rp"
                min={0}
                placeholder="0"
              />
              <p className="text-[11px] text-[#7C8798] mt-1 italic">
                Rekomendasi harga otomatis mengakomodasi diskon ini
              </p>
            </div>

            {/* 4. Jumlah Produk (opsional) */}
            <div>
              <div className="flex items-center text-xs sm:text-sm font-semibold text-[#18263D] mb-1.5">
                <span>Jumlah Produk (opsional)</span>
                <Tooltip content="Jumlah unit produk dalam pesanan. Biaya tetap per pesanan hanya dihitung 1 kali." />
              </div>
              <NumberInput
                value={state.quantity}
                onChange={(val) => onChange('quantity', Math.max(1, val))}
                suffix="pcs"
                min={1}
                placeholder="1"
              />
              <p className="text-[11px] text-[#7C8798] mt-1">
                Untuk menghitung rekomendasi jika menjual lebih dari 1 pcs
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
