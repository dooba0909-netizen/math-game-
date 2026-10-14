import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Hand } from 'lucide-react';

interface VirtualControlsProps {
  onDirectionChange: (dir: { up: boolean; down: boolean; left: boolean; right: boolean }) => void;
  onInteract: () => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({ onDirectionChange, onInteract }) => {
  const [activeDirs, setActiveDirs] = React.useState({ up: false, down: false, left: false, right: false });

  const setDir = (dir: 'up' | 'down' | 'left' | 'right', active: boolean) => {
    setActiveDirs((prev) => {
      const updated = { ...prev, [dir]: active };
      onDirectionChange(updated);
      return updated;
    });
  };

  return (
    <div className="absolute inset-x-0 bottom-3 px-4 flex justify-between items-end pointer-events-none md:hidden z-30 select-none">
      {/* Directional Pad */}
      <div className="grid grid-cols-3 gap-1.5 p-2 bg-black/60 border border-[#3e352b] rounded-lg pointer-events-auto backdrop-blur-xs">
        <div />
        <button
          onTouchStart={() => setDir('up', true)}
          onTouchEnd={() => setDir('up', false)}
          onMouseDown={() => setDir('up', true)}
          onMouseUp={() => setDir('up', false)}
          className={`w-11 h-11 flex items-center justify-center rounded border border-[#524436] bg-[#221c17] active:bg-[#483a2d] text-[#e0d6c5] transition-colors`}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div />

        <button
          onTouchStart={() => setDir('left', true)}
          onTouchEnd={() => setDir('left', false)}
          onMouseDown={() => setDir('left', true)}
          onMouseUp={() => setDir('left', false)}
          className={`w-11 h-11 flex items-center justify-center rounded border border-[#524436] bg-[#221c17] active:bg-[#483a2d] text-[#e0d6c5] transition-colors`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onTouchStart={() => setDir('down', true)}
          onTouchEnd={() => setDir('down', false)}
          onMouseDown={() => setDir('down', true)}
          onMouseUp={() => setDir('down', false)}
          className={`w-11 h-11 flex items-center justify-center rounded border border-[#524436] bg-[#221c17] active:bg-[#483a2d] text-[#e0d6c5] transition-colors`}
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <button
          onTouchStart={() => setDir('right', true)}
          onTouchEnd={() => setDir('right', false)}
          onMouseDown={() => setDir('right', true)}
          onMouseUp={() => setDir('right', false)}
          className={`w-11 h-11 flex items-center justify-center rounded border border-[#524436] bg-[#221c17] active:bg-[#483a2d] text-[#e0d6c5] transition-colors`}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Action / Interact button */}
      <button
        onTouchStart={onInteract}
        onClick={onInteract}
        className="w-16 h-16 rounded-full border-2 border-[#823a31] bg-[#421d18] active:bg-[#682e26] text-[#f2e9dc] flex flex-col items-center justify-center pointer-events-auto shadow-lg active:scale-95 transition-all"
      >
        <Hand className="w-6 h-6 mb-0.5" />
        <span className="text-[10px] font-mono font-bold tracking-wider">[E]</span>
      </button>
    </div>
  );
};
