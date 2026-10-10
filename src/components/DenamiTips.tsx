import React from "react";
import { Package, BarChart2, FileText, Sparkles } from "lucide-react";

export const DenamiTips: React.FC = () => {
  return (
    <section className="mt-8 mb-6 bg-[#FAF3EA] border border-[#E7D9CE] rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#C05621]" />
        <h3 className="text-sm sm:text-base font-bold text-[#18263D]">
          Tips dari DENAMI
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tip 1 */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EFE2D7] text-[#82543F] flex items-center justify-center shrink-0 mt-0.5">
            <Package className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-[13px] text-[#465268] leading-relaxed">
            Pertimbangkan biaya marketplace, packaging, diskon, dan biaya
            operasional agar estimasi profit lebih realistis.
          </p>
        </div>

        {/* Tip 2 */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EFE2D7] text-[#82543F] flex items-center justify-center shrink-0 mt-0.5">
            <BarChart2 className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-[13px] text-[#465268] leading-relaxed">
            Target yang ideal bergantung pada jenis produk, persaingan, volume
            penjualan, dan biaya yang dikeluarkan.
          </p>
        </div>

        {/* Tip 3 */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EFE2D7] text-[#82543F] flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-[13px] text-[#465268] leading-relaxed">
            Periksa kembali harga pasar dan biaya aktual sebelum menetapkan
            harga jual.
          </p>
        </div>
      </div>
    </section>
  );
};
