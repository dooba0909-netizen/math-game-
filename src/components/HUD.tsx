import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../game/types';
import { OBJECTIVES_LIST } from '../game/rooms';
import { 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Monitor, 
  CheckCircle, 
  CircleDot, 
  PanelRightClose, 
  PanelRightOpen,
  ChevronRight,
  ListTodo
} from 'lucide-react';

interface HUDProps {
  currentRoomName: string;
  objectiveStep: number;
  inventory: InventoryItem[];
  audioEnabled: boolean;
  scanlinesEnabled: boolean;
  toastMessage: string | null;
  onToggleAudio: () => void;
  onToggleScanlines: () => void;
  onOpenGrimoire: () => void;
  onInspectItem: (item: InventoryItem) => void;
}

export const HUD: React.FC<HUDProps> = ({
  currentRoomName,
  objectiveStep,
  inventory,
  audioEnabled,
  scanlinesEnabled,
  toastMessage,
  onToggleAudio,
  onToggleScanlines,
  onOpenGrimoire,
  onInspectItem
}) => {
  const [showProgressPanel, setShowProgressPanel] = useState(true);

  // Keyboard shortcut: Tab to toggle progress panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setShowProgressPanel((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Top Header Bar */}
      <header className="absolute top-0 inset-x-0 h-12 bg-black/85 border-b border-[#3e342b] px-4 flex items-center justify-between z-30 select-none">
        {/* Brand / Room */}
        <div className="flex items-center gap-3">
          <span className="font-serif font-black text-lg tracking-wider text-[#d3ccc0]">
            THE HOUSE THAT REMEMBERS
          </span>
          <span className="text-[#645648] text-xs font-mono">/</span>
          <span className="text-xs font-mono tracking-widest uppercase text-[#c49a62]">
            {currentRoomName}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle Progress Window button */}
          <button
            onClick={() => setShowProgressPanel((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
              showProgressPanel
                ? 'bg-[#3d2f25] text-[#e8dfd0] border-[#685340]'
                : 'bg-[#221c17] text-[#8a7a6a] border-[#44362b] hover:text-[#d3ccc0]'
            }`}
            title="Toggle Progress & Belongings Panel (Tab)"
          >
            {showProgressPanel ? (
              <PanelRightClose className="w-3.5 h-3.5 text-[#c49a62]" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5 text-[#c49a62]" />
            )}
            <span className="hidden sm:inline">
              {showProgressPanel ? 'Hide Journal' : 'Show Journal'}
            </span>
          </button>

          <button
            onClick={onOpenGrimoire}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#dcd4c6] bg-[#2d221a] hover:bg-[#423226] border border-[#524133] rounded transition-colors"
            title="Open Conic Sections Field Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#c49a62]" />
            <span className="hidden sm:inline">Conic Field Guide</span>
          </button>

          <button
            onClick={onToggleScanlines}
            className={`p-1.5 text-xs rounded border border-[#524133] transition-colors ${
              scanlinesEnabled
                ? 'bg-[#423226] text-[#c49a62]'
                : 'bg-[#221c17] text-[#706456] hover:text-[#dcd4c6]'
            }`}
            title="Toggle CRT Scanline Effect"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleAudio}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded border border-[#524133] transition-colors ${
              audioEnabled
                ? 'bg-[#2d221a] text-[#c49a62]'
                : 'bg-[#221c17] text-[#706456]'
            }`}
            title="Toggle Audio Engine"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Muted</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Floating Side Panels (When Visible) */}
      {showProgressPanel ? (
        <div className="absolute top-14 right-3 flex flex-col gap-2.5 pointer-events-none z-20 max-w-[280px] animate-fade-in">
          {/* Objectives / Memory Panel */}
          <div className="bg-black/90 border border-[#3e342b] p-3 rounded pointer-events-auto backdrop-blur-xs shadow-2xl">
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#7a6e60] pb-1 mb-2 border-b border-[#2d251e] flex items-center justify-between">
              <span>MEMORIES & OBJECTIVES</span>
              <div className="flex items-center gap-2">
                <span>{Math.min(objectiveStep, OBJECTIVES_LIST.length)} / {OBJECTIVES_LIST.length}</span>
                <button
                  onClick={() => setShowProgressPanel(false)}
                  className="p-0.5 text-[#7a6e60] hover:text-[#e0d6c5] transition-colors"
                  title="Hide progress window"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs font-mono">
              {OBJECTIVES_LIST.map((objText, idx) => {
                if (idx > objectiveStep) return null;
                const isDone = idx < objectiveStep;
                return (
                  <li
                    key={idx}
                    className={`flex items-start gap-1.5 leading-snug transition-all ${
                      isDone
                        ? 'text-[#5a5044] line-through opacity-70'
                        : 'text-[#e5dcce] font-bold'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle className="w-3.5 h-3.5 text-[#5a5044] shrink-0 mt-0.5" />
                    ) : (
                      <CircleDot className="w-3.5 h-3.5 text-[#c49a62] shrink-0 mt-0.5 animate-pulse" />
                    )}
                    <span>{objText}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Belongings / Inventory Panel */}
          <div className="bg-black/90 border border-[#3e342b] p-3 rounded pointer-events-auto backdrop-blur-xs shadow-2xl">
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#7a6e60] pb-1 mb-2 border-b border-[#2d251e] flex items-center justify-between">
              <span>BELONGINGS</span>
              <span className="text-[9px] text-[#5a5044]">Click to inspect</span>
            </div>
            {inventory.length === 0 ? (
              <p className="text-xs font-mono text-[#5a5044] italic">Satchel is empty</p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5">
                {inventory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onInspectItem(item)}
                    title={`${item.name} (Click to inspect)`}
                    className="aspect-square flex items-center justify-center text-xl bg-[#1f1915] hover:bg-[#342921] border border-[#483a2d] hover:border-[#c49a62] rounded transition-all transform hover:scale-105 active:scale-95 shadow-sm"
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Floating Compact Re-open Button when panel is hidden */
        <button
          onClick={() => setShowProgressPanel(true)}
          className="absolute top-14 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/85 hover:bg-[#2e231c] border border-[#483a2d] hover:border-[#c49a62] text-[#dcd4c6] rounded font-mono text-xs z-20 shadow-xl transition-all pointer-events-auto"
          title="Open Journal & Belongings (Tab)"
        >
          <ListTodo className="w-4 h-4 text-[#c49a62]" />
          <span>Journal</span>
          <span className="text-[10px] bg-[#3a2e24] px-1.5 py-0.2 rounded text-[#c49a62]">
            {Math.min(objectiveStep, OBJECTIVES_LIST.length)}/{OBJECTIVES_LIST.length}
          </span>
        </button>
      )}

      {/* Controls Reminder (Desktop Bottom-Left) */}
      <div className="hidden md:flex items-center gap-3 absolute bottom-3 left-3 bg-black/75 border border-[#3e342b] px-3 py-1.5 rounded text-xs font-mono text-[#7a6e60] pointer-events-none z-20">
        <span><strong className="text-[#c49a62]">WASD / Arrows:</strong> Move</span>
        <span>·</span>
        <span><strong className="text-[#c49a62]">[E] or Space:</strong> Interact</span>
        <span>·</span>
        <span><strong className="text-[#c49a62]">[Tab]:</strong> Journal</span>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/90 border border-[#8a4235] text-[#f2e6d5] px-5 py-2.5 rounded-sm font-mono text-xs md:text-sm shadow-2xl z-40 pointer-events-none animate-bounce">
          {toastMessage}
        </div>
      )}
    </>
  );
};
