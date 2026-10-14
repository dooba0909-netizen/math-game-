import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../game/audio';
import { grandpaPortrait, kiraPortrait, mirrorEnding, familyPortrait } from '../assets/images';
import { Sparkles, BookOpen, Flame, Utensils } from 'lucide-react';

interface DialogueBoxProps {
  speaker: string;
  lines: string[];
  onComplete: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ speaker, lines, onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const typeIndexRef = useRef(0);
  const fullText = lines[currentLineIndex] || '';

  useEffect(() => {
    setCurrentLineIndex(0);
  }, [lines]);

  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    typeIndexRef.current = 0;

    const timer = setInterval(() => {
      if (typeIndexRef.current < fullText.length) {
        setDisplayedText(fullText.slice(0, typeIndexRef.current + 1));
        if (typeIndexRef.current % 4 === 0) {
          audio.play('blip');
        }
        typeIndexRef.current++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 28);

    return () => clearInterval(timer);
  }, [currentLineIndex, fullText]);

  const advance = () => {
    if (isTyping) {
      setDisplayedText(fullText);
      setIsTyping(false);
      return;
    }

    if (currentLineIndex < lines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        advance();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isTyping, currentLineIndex, lines.length, fullText]);

  const isLastLine = currentLineIndex === lines.length - 1;

  // Determine portrait image or avatar based on speaker name
  const speakerLower = speaker.toLowerCase();
  let portraitSrc: string | null = null;
  let fallbackIcon = <Sparkles className="w-8 h-8 text-[#c49a62]" />;

  if (speakerLower.includes('grandpa')) {
    portraitSrc = grandpaPortrait;
  } else if (speakerLower.includes('kira') || speakerLower.includes('protagonist')) {
    portraitSrc = kiraPortrait;
  } else if (speakerLower.includes('mirror') || speakerLower.includes('glitch')) {
    portraitSrc = mirrorEnding;
  } else if (speakerLower.includes('portrait')) {
    portraitSrc = familyPortrait;
  } else if (speakerLower.includes('hearth') || speakerLower.includes('oven')) {
    fallbackIcon = <Flame className="w-8 h-8 text-[#e89138]" />;
  } else if (speakerLower.includes('pot') || speakerLower.includes('recipe')) {
    fallbackIcon = <Utensils className="w-8 h-8 text-[#c49a62]" />;
  } else if (speakerLower.includes('chalkboard') || speakerLower.includes('manuscript')) {
    fallbackIcon = <BookOpen className="w-8 h-8 text-[#85ba88]" />;
  }

  return (
    <div 
      onClick={advance}
      className="absolute bottom-5 left-1/2 -translate-x-1/2 w-11/12 max-w-3xl bg-[#0e0a07]/95 border-2 border-[#544130] rounded-sm p-4 text-[#e3dac9] z-40 shadow-2xl cursor-pointer select-none transition-all flex gap-4 items-center"
    >
      {/* Speaker Portrait on the Left */}
      <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded border-2 border-[#69523b] bg-black/80 overflow-hidden flex items-center justify-center shadow-inner">
        {portraitSrc ? (
          <img
            src={portraitSrc}
            alt={speaker}
            className="w-full h-full object-cover filter contrast-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#1d1610]">
            {fallbackIcon}
          </div>
        )}
      </div>

      {/* Dialogue Content on the Right */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-[#3e3023]">
          <span className="text-sm font-bold tracking-widest uppercase text-[#c49a62] font-serif">
            {speaker}
          </span>
          <span className="text-xs text-[#706050] font-mono">
            {currentLineIndex + 1} / {lines.length}
          </span>
        </div>

        <div className="text-sm md:text-base min-h-[48px] leading-relaxed font-mono text-[#ded5c5]">
          {displayedText}
          {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-[#c49a62] animate-pulse" />}
        </div>

        <div className="flex justify-end mt-1.5 text-xs text-[#8c7a68] font-mono tracking-wider">
          <span className="animate-pulse">
            {isTyping ? 'Click or [E] to skip' : isLastLine ? '[E] Close' : '[E] Continue ▶'}
          </span>
        </div>
      </div>
    </div>
  );
};
