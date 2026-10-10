import React from "react";
import { ShoppingBag } from "lucide-react";
import { DenamiLogo } from "./DenamiLogo";

export const Header: React.FC = () => {
  return (
    <header className="mb-6">
      {/* Top Brand Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7D9CE]/60">
        <DenamiLogo size="md" subtitle="SOURCING & SUPPLY SOLUTION" />

        <div className="flex items-center self-start sm:self-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE2D7]/70 border border-[#E7D9CE] text-[#603D2D] text-xs font-medium shadow-xs">
            <ShoppingBag className="w-3.5 h-3.5 text-[#82543F]" />
            <span>Tools Gratis untuk Seller &amp; Reseller</span>
          </div>
        </div>
      </div>

      {/* Main Page Title */}
      <div className="mt-5">
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#18263D] tracking-tight leading-tight">
          Kalkulator Harga Jual & Profit
        </h1>
        <p className="text-sm sm:text-base text-[#465268] mt-1.5 font-normal">
          Hitung keuntungan dan tentukan harga jual produk dengan
          memperhitungkan biaya marketplace, modal, dan biaya lainnya.
        </p>
      </div>
    </header>
  );
};
