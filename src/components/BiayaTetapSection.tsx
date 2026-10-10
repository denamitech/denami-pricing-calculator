import React from "react";
import { CalculatorState } from "../types/calculator";
import { NumberInput } from "./common/NumberInput";
import { Tooltip } from "./common/Tooltip";

interface BiayaTetapSectionProps {
  state: CalculatorState;
  onChange: <K extends keyof CalculatorState>(
    key: K,
    value: CalculatorState[K],
  ) => void;
  stepNumber?: number;
}

export const BiayaTetapSection: React.FC<BiayaTetapSectionProps> = ({
  state,
  onChange,
  stepNumber = 3,
}) => {
  return (
    <section className="bg-white rounded-2xl border border-[#E7D9CE] p-4 sm:p-5 shadow-xs mb-5">
      {/* Section Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-6 h-6 rounded-full bg-[#82543F] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
          {stepNumber}
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#18263D] leading-tight">
            Biaya Tetap per Pesanan
          </h2>
          <p className="text-xs sm:text-sm text-[#7C8798] mt-0.5">
            Biaya yang tidak bergantung pada harga jual
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        {/* Biaya proses pesanan */}
        <div>
          <div className="flex items-center text-xs sm:text-sm font-semibold text-[#18263D] mb-1.5">
            <span>Biaya proses pesanan</span>
            <Tooltip content="Biaya layanan tetap per pesanan selesai yang dikenakan Shopee, terpisah dari biaya administrasi dan biaya program lainnya." />
          </div>
          <NumberInput
            value={state.orderProcessFee}
            onChange={(val) => onChange("orderProcessFee", val)}
            prefix="Rp"
            min={0}
            placeholder="1.250"
          />
          <p className="text-[11px] text-[#7C8798] mt-1 italic">
            Biaya tetap marketplace per pesanan (sesuaikan)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Biaya packaging */}
          <div>
            <div className="flex items-center text-xs sm:text-sm font-semibold text-[#18263D] mb-1.5">
              <span>Biaya packaging (opsional)</span>
              <Tooltip content="Biaya kotak kardus khusus, polymailer premium, atau packaging berlogo." />
            </div>
            <NumberInput
              value={state.packagingFee}
              onChange={(val) => onChange("packagingFee", val)}
              prefix="Rp"
              min={0}
              placeholder="0"
            />
            <p className="text-[11px] text-[#7C8798] mt-1 italic">
              Biaya hardbox, lakban, bubble wrap, resi, dll
            </p>
          </div>

          {/* Biaya lain */}
          <div>
            <div className="flex items-center text-xs sm:text-sm font-semibold text-[#18263D] mb-1.5">
              <span>Biaya lain (opsional)</span>
              <Tooltip content="Biaya tambahan lain seperti thank you card, freebies stiker, atau plastik pelindung ekstra." />
            </div>
            <NumberInput
              value={state.otherFee}
              onChange={(val) => onChange("otherFee", val)}
              prefix="Rp"
              min={0}
              placeholder="0"
            />
            <p className="text-[11px] text-[#7C8798] mt-1 italic">
              Contoh: kartu ucapan, plastik tambahan, dll
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
