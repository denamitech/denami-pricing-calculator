import React from "react";
import emblemImg from "../assets/images/denami-logo.webp";

interface DenamiLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  showSubtitle?: boolean;
}

/**
 * Denami Brand Lockup
 * - Authentic interlocking DN monogram from reference image
 * - Soft rounded corner radius with warm organic frame (no stiff harsh edges)
 * - Harmonious typography with DENAMI ✦ wordmark and tracked subtitle
 */
export const DenamiLogo: React.FC<DenamiLogoProps> = ({
  className = "",
  size = "md",
  subtitle = "SOURCING & SUPPLY SOLUTION",
  showSubtitle = true,
}) => {
  const badgeDimensions = {
    sm: "w-9 h-9 rounded-lg p-0.5",
    md: "w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl p-1",
    lg: "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1.5",
  }[size];

  const titleSizes = {
    sm: "text-base sm:text-lg",
    md: "text-lg sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  }[size];

  const subSizes = {
    sm: "text-[8.5px] sm:text-[9.5px]",
    md: "text-[9.5px] sm:text-[11px]",
    lg: "text-[11px] sm:text-xs",
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-3 sm:gap-3.5 select-none ${className}`}
    >
      {/* Rounded Monogram Badge with Corner Radius */}
      <div
        className={`${badgeDimensions} overflow-hidden border border-[#E7D9CE] bg-[#FAF3EA] shadow-2xs flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105`}
      >
        <img
          src={emblemImg}
          alt="DENAMI Logo"
          className="w-full h-full object-contain mix-blend-multiply rounded-md sm:rounded-xl"
          loading="eager"
        />
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-[#82543F]">
          <span
            className={`font-cinzel font-bold tracking-[0.25em] text-[#82543F] leading-tight ${titleSizes}`}
          >
            D E N A M I
          </span>
          <span className="text-[#82543F] font-bold transform -translate-y-0.5 text-xs sm:text-sm">
            ✦
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`font-semibold tracking-[0.22em] text-[#82543F]/80 uppercase mt-0.5 leading-tight ${subSizes}`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
