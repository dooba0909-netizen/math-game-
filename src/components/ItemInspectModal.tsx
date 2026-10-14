import React from 'react';
import { InventoryItem } from '../game/types';
import { X } from 'lucide-react';

interface ItemInspectModalProps {
  item: InventoryItem;
  onClose: () => void;
}

export const ItemInspectModal: React.FC<ItemInspectModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md parchment-texture text-[#2b2520] border-2 border-[#5a483a] rounded-sm p-6 shadow-2xl"
        style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#c2b59f] mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{item.icon}</span>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#7a6452] font-mono">Belongings</span>
              <h3 className="text-xl font-bold tracking-wide text-[#341d13]">{item.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#7a6452] hover:text-[#2b2520] hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-base text-[#382e25] leading-relaxed mb-4">
          {item.description}
        </p>

        {item.lore && (
          <div className="p-3 bg-[#e8dfcf] border border-[#baa990] rounded text-sm italic text-[#544131] mb-4">
            "{item.lore}"
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-[#c2b59f]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-serif font-bold text-sm text-[#ded5c2] bg-[#422d21] hover:bg-[#573d2d] rounded transition-colors"
          >
            Put Away
          </button>
        </div>
      </div>
    </div>
  );
};
