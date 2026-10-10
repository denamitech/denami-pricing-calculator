import React, { useState } from "react";
import {
  ArrowRight,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import bannerImage from "../assets/images/denami_wholesale_products_1791615253561.jpg";
import { DenamiLogo } from "./DenamiLogo";

// Configurable URLs as specified by PRD Section 14
export const DENAMI_CONFIG = {
  catalogUrl:
    "https://wa.me/?text=Halo%20DENAMI%2C%20saya%20ingin%20melihat%20katalog%20produk%20grosir%20dan%20sourcing.",
  whatsappUrl:
    "https://wa.me/?text=Halo%20DENAMI%2C%20saya%20ingin%20konsultasi%20kebutuhan%20sourcing%20dan%20pengadaan%20barang.",
  brandTagline: "GENERAL SUPPLIER & PROCUREMENT",
};

export const DenamiFooter: React.FC = () => {
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  return (
    <footer className="mt-8 pt-4 pb-12 border-t border-[#E7D9CE]/70">
      {/* 1. Value Proposition Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/80 border border-[#E7D9CE] rounded-xl p-4 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-[#FAF3EA] text-[#82543F] flex items-center justify-center shrink-0 mt-0.5">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#18263D]">
              Harga kompetitif
            </h4>
            <p className="text-xs text-[#7C8798] mt-0.5">
              Membantu bisnis mendapatkan produk dari jaringan pemasok dan pusat
              grosir sesuai kebutuhan.
            </p>
          </div>
        </div>

        <div className="bg-white/80 border border-[#E7D9CE] rounded-xl p-4 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-[#FAF3EA] text-[#82543F] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#18263D]">
              Beragam kategori produk
            </h4>
            <p className="text-xs text-[#7C8798] mt-0.5">
              Mendukung kebutuhan pengadaan Aksesoris, ATK, kebutuhan rumah
              tangga, dan kategori lainnya sesuai ketersediaan.
            </p>
          </div>
        </div>

        <div className="bg-white/80 border border-[#E7D9CE] rounded-xl p-4 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-[#FAF3EA] text-[#82543F] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#18263D]">
              Solusi sourcing untuk usaha
            </h4>
            <p className="text-xs text-[#7C8798] mt-0.5">
              Konsultasikan kebutuhan produk dan pengadaan dari Jakarta bersama
              DENAMI.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Promotional Showcase Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#EFE2D7]/50 border border-[#E7D9CE] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left Thumbnail Image */}
          <div className="w-full sm:w-64 lg:w-48 h-36 lg:h-36 shrink-0 rounded-xl overflow-hidden border border-[#E7D9CE] shadow-sm relative group bg-[#FAF3EA]">
            <img
              src={bannerImage}
              alt="DENAMI Wholesale Products Catalog"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>

          {/* Center Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <DenamiLogo size="sm" subtitle="SOURCING & SUPPLY SOLUTION" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#18263D] mt-2.5 leading-snug">
              Solusi Sourcing &amp; Supply untuk Bisnis Kamu
            </h3>

            <p className="text-xs sm:text-sm text-[#465268] mt-1 max-w-xl leading-relaxed">
              Membantu reseller, toko, dan pelaku usaha memenuhi kebutuhan
              produk melalui sourcing dan pengadaan dari Jakarta. Konsultasikan
              kebutuhan produkmu untuk mendapatkan pilihan dan penawaran yang
              sesuai.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowCatalogModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#82543F] hover:bg-[#603D2D] text-white text-xs sm:text-sm font-bold shadow-xs transition-all duration-150 cursor-pointer active:scale-95"
              >
                <span>Lihat Katalog Jepitan Rambut</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={DENAMI_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF3EA] border border-[#E7D9CE] text-[#603D2D] text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#16805D]" />
                <span>Hubungi DENAMI via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Script Signature */}
          <div className="shrink-0 text-center lg:text-right hidden sm:block">
            <span className="font-script text-2xl sm:text-3xl text-[#82543F] tracking-wide inline-block transform -rotate-3 select-none">
              Sourcing
              <br />
              Made Simple ✦
            </span>
          </div>
        </div>
      </div>

      {/* Copyright line */}
      <div className="mt-8 text-center text-xs text-[#7C8798]">
        © {new Date().getFullYear()} DENAMI — Sourcing &amp; Supply Solution.
      </div>

      {/* Catalog Info Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#E7D9CE] p-5 sm:p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7D9CE]">
              <div className="flex items-center gap-2">
                <DenamiLogo size="sm" subtitle="SOURCING & PROCUREMENT" />
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="text-[#7C8798] hover:text-[#18263D] text-xs font-semibold"
              >
                Tutup
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs sm:text-sm text-[#465268] leading-relaxed">
                DENAMI menghubungkan seller online, reseller, dan UMKM dengan
                stok grosir pilihan di Jakarta. Hubungi admin kami untuk
                mendapatkan update katalog produk terbaru, estimasi kuantiti,
                dan konsultasi pengadaan.
              </p>

              <div className="p-3 bg-[#FAF3EA] rounded-xl border border-[#E7D9CE] space-y-2 text-xs text-[#603D2D]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16805D] shrink-0" />
                  <span>
                    Kategori: Fashion, Hair Accessories, Stationery &amp; Home
                    Items
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16805D] shrink-0" />
                  <span>Minimal order fleksibel untuk UMKM pemula</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16805D] shrink-0" />
                  <span>Pengiriman aman langsung dari Jakarta</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#7C8798] hover:bg-[#F8F3EE] transition-colors"
              >
                Kembali
              </button>
              <a
                href={DENAMI_CONFIG.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCatalogModal(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#82543F] text-white hover:bg-[#603D2D] transition-colors shadow-xs"
              >
                <span>Chat Admin WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
