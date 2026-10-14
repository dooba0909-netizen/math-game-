import React, { useState, useEffect } from 'react';
import { audio } from '../game/audio';
import { Play, Sparkles, BookOpen } from 'lucide-react';

interface PrologueScreenProps {
  onStartGame: () => void;
}

export const PrologueScreen: React.FC<PrologueScreenProps> = ({ onStartGame }) => {
  const [slide, setSlide] = useState(0);

  const introSlides = [
    {
      title: "FORGOTTEN HILL TALES",
      subtitle: "LITTLE CABIN IN THE WOODS",
      lines: [
        "A child, her grandfather, a painful past...",
        "And the burning desire to escape."
      ]
    },
    {
      title: "THE SECLUDED CABIN",
      subtitle: "YEARS IN ISOLATION",
      lines: [
        "A tragic event years ago forced you to live locked inside this remote cabin deep within the forest.",
        "Grandfather warned you that terrible monsters stalk the woods, and that only geometric discipline and the ancient conic talismans can ward off the darkness."
      ]
    },
    {
      title: "A NEW DAY BEGINS",
      subtitle: "THE MASTER STUDY",
      lines: [
        "'Never touch the southern storm doors,' Grandpa repeats every morning. 'Stay inside, study your geometry, and we will be safe forever.'",
        "Today, Grandpa calls to you from the parlor:",
        "'Kira... head to the Master Study through the north door. Review your conic talismans. We must keep the seals strong.'"
      ]
    }
  ];

  useEffect(() => {
    audio.play('heavy');
  }, [slide]);

  const handleNext = () => {
    if (slide < introSlides.length - 1) {
      setSlide((prev) => prev + 1);
      audio.play('blip');
    } else {
      audio.play('objective');
      onStartGame();
    }
  };

  const current = introSlides[slide];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/95 text-[#e5ddd0] font-mono select-none overflow-hidden">
      {/* Subtle CRT Scanlines & Film Grain Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/70 to-black pointer-events-none" />

      <div className="relative max-w-2xl w-full text-center space-y-8 z-10 animate-fade-in">
        {/* FM Studio / Forgotten Hill Title Header */}
        <div className="space-y-2">
          <div className="text-xs tracking-[0.3em] uppercase text-[#a83232] font-serif font-bold">
            FM STUDIO PRESENTS • A FORGOTTEN HILL TALE
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-black tracking-widest text-[#f5eedc]">
            {current.title}
          </h1>
          <div className="text-xs tracking-widest uppercase text-[#c49a62]">
            {current.subtitle}
          </div>
        </div>

        {/* Story Text Box with Antique Parchment Styling */}
        <div className="bg-[#120e0b]/90 border border-[#4a3b2c] p-6 md:p-8 rounded shadow-2xl space-y-4 text-left">
          {current.lines.map((line, idx) => (
            <p key={idx} className="text-base md:text-lg text-[#ded3c1] leading-relaxed font-serif italic">
              {line}
            </p>
          ))}
        </div>

        {/* Progress dots & Continue button */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {introSlides.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === slide ? 'bg-[#c49a62] w-8' : 'bg-[#4a3b2c]'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="group flex items-center gap-2 px-8 py-3 bg-[#382618] hover:bg-[#523722] text-[#f5eedc] border border-[#78593a] rounded transition-all transform hover:scale-105 shadow-xl cursor-pointer"
          >
            <span className="font-serif tracking-wider text-sm md:text-base font-bold">
              {slide < introSlides.length - 1 ? "Next ▶" : "Enter the Cabin ▶"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
