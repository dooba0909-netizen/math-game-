import React, { useEffect, useState } from 'react';
import { mirrorEnding } from '../assets/images';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { audio } from '../game/audio';

interface EndingScreenProps {
  onRestart: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ onRestart }) => {
  const [glitchPhase, setGlitchPhase] = useState(0);

  useEffect(() => {
    audio.play('shatter');
    const t1 = setTimeout(() => {
      setGlitchPhase(1);
      audio.play('heavy');
    }, 1500);
    const t2 = setTimeout(() => {
      setGlitchPhase(2);
      audio.play('heartbeat');
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-[#e8dfcf] p-4 text-center select-none overflow-y-auto">
      {/* Glitch & CRT overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/80 to-black pointer-events-none" />

      <div className="relative max-w-lg w-full z-10 flex flex-col items-center gap-5 my-auto animate-fade-in">
        {/* Error Header */}
        <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-widest animate-pulse">
          <AlertTriangle className="w-4 h-4" />
          <span>SYSTEM ERROR • MEMORY DESYNCHRONIZED</span>
        </div>

        {/* The Horrifying Glitched Mirror Image (Image 1) */}
        <div className="relative w-72 md:w-80 aspect-3/4 rounded-sm border-2 border-[#822222] bg-black overflow-hidden shadow-[0_0_40px_rgba(180,20,20,0.4)]">
          <img
            src={mirrorEnding}
            alt="The Glitched Mirror Reflection"
            className="w-full h-full object-cover filter contrast-110 brightness-95"
          />
          {/* Subtle Scanline Lines */}
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.3)_0px,rgba(0,0,0,0.3)_1px,transparent_2px,transparent_4px)]" />
        </div>

        {/* Narrative Revelation */}
        <div className="space-y-2 font-mono text-center max-w-md">
          <div className="text-red-400 font-bold text-sm tracking-wider uppercase">
            To continue: KIRA
          </div>
          <p className="text-xs md:text-sm text-[#bfb3a2] leading-relaxed italic font-serif">
            "The fears you harbored were never monsters in the dark...<br />
            Stop suppressing the memory of that day.<br />
            The person you seek in the mirror no longer exists."
          </p>
        </div>

        {/* Statistics & Restart */}
        {glitchPhase >= 1 && (
          <div className="w-full space-y-4 pt-2 border-t border-[#3b2320]">
            <div className="grid grid-cols-2 gap-2 text-left p-3 bg-black/70 border border-[#442824] rounded font-mono text-[11px] text-[#a89582]">
              <div>
                <span className="block text-[#705852]">CONIC WARDS:</span>
                <span className="text-xs font-bold text-[#e0d6c5]">All Pierced</span>
              </div>
              <div>
                <span className="block text-[#705852]">SLUMBER ELIXIR:</span>
                <span className="text-xs font-bold text-[#e0d6c5]">Completed</span>
              </div>
              <div>
                <span className="block text-[#705852]">THE MIRROR:</span>
                <span className="text-xs font-bold text-red-400">Memory Unsealed</span>
              </div>
              <div>
                <span className="block text-[#705852]">KIRA'S TRUTH:</span>
                <span className="text-xs font-bold text-[#e0d6c5]">Awakened</span>
              </div>
            </div>

            <button
              onClick={onRestart}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#421b1b] hover:bg-[#5e2727] text-[#ece4d6] font-mono text-xs tracking-wider uppercase border border-[#7a3737] rounded transition-all shadow-lg hover:scale-105 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Awaken From the Nightmare</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
