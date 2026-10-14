import React from 'react';
import { familyPortrait } from '../assets/images';
import { X, Sparkles, Eye } from 'lucide-react';

interface FamilyPortraitModalProps {
  onClose: () => void;
}

export const FamilyPortraitModal: React.FC<FamilyPortraitModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm select-none">
      <div className="relative max-w-xl w-full bg-[#18110b] border-2 border-[#5a432d] rounded-sm p-4 text-[#e2d7c5] shadow-2xl flex flex-col items-center gap-4">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-[#3d2c1e]">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#c49a62]" />
            <h2 className="text-lg font-serif font-black tracking-wider text-[#f5eedc]">
              The Family in Autumn (1934)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8c7965] hover:text-[#f5eedc] transition-colors rounded cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Vintage Framed Painting (Image 4) */}
        <div className="relative w-full max-h-[58vh] flex items-center justify-center overflow-hidden rounded border border-[#3e2b1c] bg-black">
          <img
            src={familyPortrait}
            alt="Family in Autumn"
            className="w-full h-full object-contain max-h-[56vh] filter contrast-105"
          />
        </div>

        {/* Lore / Description */}
        <div className="space-y-1 text-center font-serif text-sm md:text-base text-[#c9bcaa] leading-relaxed italic px-2">
          <p>
            An ornate gilded baroque frame holding a photograph of the family from the golden autumn of 1934.
          </p>
          <p className="text-[#a3907c] text-xs font-mono not-italic">
            The faces of the mother, daughters, and relatives are unnervingly obscured in dark, smudged shadow... Only the grandmother with her accordion smiles into the lens. A handwritten inscription on the back reads: <span className="text-[#c49a62] font-semibold">"Seek truth in geometry."</span>
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="px-6 py-1.5 bg-[#382618] hover:bg-[#4f3622] text-[#f5eedc] border border-[#78593a] rounded text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
        >
          Put Down Frame [ESC]
        </button>
      </div>
    </div>
  );
};
