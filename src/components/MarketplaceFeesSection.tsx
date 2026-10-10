import React, { useState, useMemo } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { CalculatorState, MarketplaceFee, FeeBreakdownItem } from '../types/calculator';
import { formatPercent, formatRupiah } from '../utils/calculator';
import { Tooltip } from './common/Tooltip';

interface MarketplaceFeesSectionProps {
  state: CalculatorState;
  onUpdateFees: (fees: MarketplaceFee[]) => void;
  referenceRevenue: number; // The revenue used to calculate the preview amount next to each fee
  feeBreakdown?: FeeBreakdownItem[];
  stepNumber: number;
}

export const MarketplaceFeesSection: React.FC<MarketplaceFeesSectionProps> = ({
  state,
  onUpdateFees,
  referenceRevenue,
  feeBreakdown,
  stepNumber,
}) => {
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPct, setCustomPct] = useState('2.5');

  const { fees } = state;
  const activeFees = fees.filter((f) => f.isEnabled && f.percentage > 0);
  const totalPercentage = activeFees.reduce((acc, f) => acc + (f.percentage || 0), 0);
  const allDisabled = fees.every((f) => !f.isEnabled);

  const feeAmountMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (feeBreakdown) {
      feeBreakdown.forEach((item) => {
        map[item.id] = item.amount;
      });
    }
    return map;
  }, [feeBreakdown]);

  const toggleFee = (id: string) => {
    const updated = fees.map((f) => (f.id === id ? { ...f, isEnabled: !f.isEnabled } : f));
    onUpdateFees(updated);
  };

  const handlePercentageChange = (id: string, newPctStr: string) => {
    const cleanStr = newPctStr.replace(',', '.');
    const parsed = parseFloat(cleanStr);
    const updated = fees.map((f) => {
      if (f.id === id) {
        return {
          ...f,
          percentage: isNaN(parsed) ? 0 : Math.max(0, parsed),
        };
      }
      return f;
    });
    onUpdateFees(updated);
  };

  const handleToggleAll = () => {
    const targetState = allDisabled;
    const updated = fees.map((f) => ({ ...f, isEnabled: targetState }));
    onUpdateFees(updated);
  };

  const handleAddCustomFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const parsedPct = parseFloat(customPct.replace(',', '.')) || 0;
    const newFee: MarketplaceFee = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      percentage: Math.max(0, parsedPct),
      isEnabled: true,
      isCustom: true,
      description: 'Biaya persentase kustom tambahan.',
    };

    onUpdateFees([...fees, newFee]);
    setCustomName('');
    setCustomPct('2.5');
    setShowAddCustomModal(false);
  };

  const handleDeleteCustomFee = (id: string) => {
    const updated = fees.filter((f) => f.id !== id);
    onUpdateFees(updated);
  };

  return (
    <section className="bg-white rounded-2xl border border-[#E7D9CE] p-4 sm:p-5 shadow-xs mb-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[#82543F] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {stepNumber}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#18263D] leading-tight">
              Potongan Marketplace (%)
            </h2>
            <p className="text-xs sm:text-sm text-[#7C8798] mt-0.5">
              Aktifkan komponen biaya yang relevan dengan penjualanmu
            </p>
          </div>
        </div>

        {/* Total Badge */}
        <div className="px-3 py-1 rounded-full bg-[#F6E8DF] border border-[#E7D9CE] text-[#82543F] text-xs sm:text-sm font-bold shrink-0">
          Total: {formatPercent(totalPercentage, 2)}
        </div>
      </div>

      {/* Warning if total >= 100% */}
      {totalPercentage >= 100 && (
        <div className="mb-4 p-3 bg-[#FCEAEA] border border-[#E53945]/40 rounded-xl text-xs sm:text-sm text-[#E53945] flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Total potongan persentase mencapai 100% atau lebih. Kurangi biaya yang aktif sebelum menghitung rekomendasi harga jual.
          </span>
        </div>
      )}

      {/* Fee List */}
      <div className="divide-y divide-[#E7D9CE]/40 mb-4">
        {fees.map((fee) => {
          const nominalAmount = fee.isEnabled
            ? feeAmountMap[fee.id] !== undefined
              ? feeAmountMap[fee.id]
              : Math.round(referenceRevenue * (fee.percentage / 100))
            : 0;

          return (
            <div
              key={fee.id}
              className={`py-3 flex items-center justify-between gap-3 transition-opacity ${
                !fee.isEnabled ? 'opacity-55' : 'opacity-100'
              }`}
            >
              {/* Left: Toggle & Name */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Switch Button */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={fee.isEnabled}
                  onClick={() => toggleFee(fee.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-hidden self-center ${
                    fee.isEnabled ? 'bg-[#82543F]' : 'bg-[#D1D5DB]'
                  }`}
                  aria-label={`Toggle ${fee.name}`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      fee.isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>

                {/* Name & Tooltip */}
                <div className="flex items-center gap-1 min-w-0">
                  <span
                    className="text-xs sm:text-sm font-semibold text-[#18263D] truncate cursor-pointer select-none"
                    onClick={() => toggleFee(fee.id)}
                  >
                    {fee.name}
                  </span>
                  {fee.description && <Tooltip content={fee.description} />}
                  {fee.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomFee(fee.id)}
                      className="ml-1 p-1 text-[#7C8798] hover:text-[#E53945] transition-colors rounded-sm"
                      title="Hapus biaya ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right: Percentage Input & Live Nominal */}
              <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
                {/* Percentage input */}
                <div className="flex items-center border border-[#E7D9CE] rounded-lg overflow-hidden bg-white focus-within:border-[#82543F] focus-within:ring-1 focus-within:ring-[#82543F]/20">
                  <input
                    type="text"
                    inputMode="decimal"
                    defaultValue={fee.percentage.toString().replace('.', ',')}
                    key={`${fee.id}-${fee.percentage}`}
                    onBlur={(e) => handlePercentageChange(fee.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    className="w-14 sm:w-16 px-2.5 py-1 text-xs sm:text-sm font-bold text-center text-[#18263D] tabular-nums outline-hidden"
                  />
                  <span className="px-2 py-1 bg-[#F8F3EE] text-[#7C8798] text-xs font-semibold border-l border-[#E7D9CE] select-none">
                    %
                  </span>
                </div>

                {/* Live Nominal */}
                <div className="w-24 sm:w-28 text-right font-semibold text-xs sm:text-sm text-[#18263D] tabular-nums">
                  {fee.isEnabled ? formatRupiah(nominalAmount) : 'Rp 0'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E7D9CE]/60">
        <button
          type="button"
          onClick={() => setShowAddCustomModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7D9CE] bg-[#F8F3EE]/60 hover:bg-[#F8F3EE] text-[#82543F] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Biaya Lain</span>
        </button>

        <button
          type="button"
          onClick={handleToggleAll}
          className="text-xs sm:text-sm font-medium text-[#7C8798] hover:text-[#82543F] underline underline-offset-2 transition-colors cursor-pointer"
        >
          {allDisabled ? 'Aktifkan Semua' : 'Nonaktifkan Semua'}
        </button>
      </div>

      {/* Add Custom Fee Dialog */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#E7D9CE] p-5 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold text-[#18263D] mb-1">Tambah Biaya Kustom</h3>
            <p className="text-xs text-[#7C8798] mb-4">
              Tambahkan komponen potongan marketplace atau operasional berbasis persentase.
            </p>

            <form onSubmit={handleAddCustomFee} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#18263D] mb-1">Nama Biaya</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Biaya Penanganan Khusus"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#E7D9CE] text-[#18263D] outline-hidden focus:border-[#82543F] focus:ring-1 focus:ring-[#82543F]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18263D] mb-1">Persentase (%)</label>
                <div className="flex items-center rounded-lg border border-[#E7D9CE] overflow-hidden focus-within:border-[#82543F]">
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="2,5"
                    value={customPct}
                    onChange={(e) => setCustomPct(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-[#18263D] outline-hidden font-semibold tabular-nums"
                  />
                  <span className="px-3 py-2 bg-[#F8F3EE] text-[#7C8798] text-sm font-semibold border-l border-[#E7D9CE]">
                    %
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#7C8798] hover:bg-[#F8F3EE] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#82543F] text-white hover:bg-[#603D2D] transition-colors shadow-xs"
                >
                  Simpan Biaya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
