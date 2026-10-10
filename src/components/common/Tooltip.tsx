import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="text-[#7C8798] hover:text-[#82543F] transition-colors p-0.5 rounded-full focus:outline-hidden"
        aria-label="Informasi tambahan"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isVisible && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 sm:w-64 p-2.5 bg-[#18263D] text-white text-xs leading-relaxed rounded-lg shadow-lg pointer-events-none transition-all duration-150 animate-in fade-in"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#18263D]" />
        </div>
      )}
    </div>
  );
};
