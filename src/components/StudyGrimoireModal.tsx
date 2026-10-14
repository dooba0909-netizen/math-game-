import React, { useState } from 'react';
import { BookOpen, X, Circle, ArrowDownRight, Lightbulb } from 'lucide-react';

interface StudyGrimoireModalProps {
  onClose: () => void;
}

export const StudyGrimoireModal: React.FC<StudyGrimoireModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'circles' | 'parabolas'>('circles');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto parchment-texture text-[#2b2520] border-2 border-[#5a483a] rounded-sm p-6 shadow-2xl"
        style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#c2b59f] mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#7a1c1c]" />
            <div>
              <span className="text-xs uppercase tracking-widest text-[#7a6452] font-mono">Archive Manuscript</span>
              <h2 className="text-2xl font-bold tracking-wide text-[#341d13]">
                Conic Sections Field Guide
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#7a6452] hover:text-[#2b2520] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-[#c2b59f] pb-3 mb-5">
          <button
            onClick={() => setActiveTab('circles')}
            className={`flex items-center gap-2 px-4 py-2 font-serif font-bold text-base rounded transition-colors ${
              activeTab === 'circles'
                ? 'bg-[#611919] text-[#e8dfd0]'
                : 'bg-[#dfd5c2] text-[#4d3b2b] hover:bg-[#d0c5af]'
            }`}
          >
            <Circle className="w-4 h-4" />
            <span>Circle Wards</span>
          </button>
          <button
            onClick={() => setActiveTab('parabolas')}
            className={`flex items-center gap-2 px-4 py-2 font-serif font-bold text-base rounded transition-colors ${
              activeTab === 'parabolas'
                ? 'bg-[#611919] text-[#e8dfd0]'
                : 'bg-[#dfd5c2] text-[#4d3b2b] hover:bg-[#d0c5af]'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Parabolic Wards</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'circles' ? (
          <div className="space-y-4 text-base leading-relaxed">
            <div className="p-3 bg-[#e8e0d0] border border-[#baa990] rounded">
              <h3 className="font-bold text-lg text-[#521919] mb-1">
                Standard Equation of a Circle
              </h3>
              <p className="font-mono text-center text-lg font-bold text-[#631818] my-2 p-2 bg-black/5 rounded">
                (x - h)² + (y - k)² = r²
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-[#3b3026]">
                <li><strong>Center (h, k):</strong> Beware the signs! For (x + 5)², the center coordinate is h = -5.</li>
                <li><strong>Radius r:</strong> Equal to the square root of the right-hand constant: r = √(r²).</li>
                <li><strong>Origin Center:</strong> If centered at (0, 0), the equation simplifies to x² + y² = r².</li>
              </ul>
            </div>

            <div className="p-3 bg-[#e8e0d0] border border-[#baa990] rounded">
              <h3 className="font-bold text-lg text-[#521919] mb-1">
                Completing the Square Technique
              </h3>
              <p className="text-sm text-[#3b3026] mb-2">
                When an equation is in general form <em>x² + y² + Dx + Ey + F = 0</em>:
              </p>
              <div className="bg-black/5 p-2 rounded text-xs font-mono space-y-1 text-[#221a14]">
                <div>1. Group variables: (x² + Dx) + (y² + Ey) = -F</div>
                <div>2. Add (D/2)² and (E/2)² to both sides.</div>
                <div>3. Factor into: (x - h)² + (y - k)² = r²</div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 bg-amber-950/10 border border-amber-800/25 rounded text-xs text-[#523d29]">
              <Lightbulb className="w-4 h-4 shrink-0 text-[#884e18] mt-0.5" />
              <span>
                <strong>Testing Points:</strong> Substitute coordinates (x, y) into the equation. If the left-hand sum equals r², the point rests precisely upon the ward's boundary.
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-base leading-relaxed">
            <div className="p-3 bg-[#e8e0d0] border border-[#baa990] rounded">
              <h3 className="font-bold text-lg text-[#521919] mb-1">
                Vertical Parabola (Symmetric to y-axis)
              </h3>
              <p className="font-mono text-center text-lg font-bold text-[#631818] my-2 p-2 bg-black/5 rounded">
                (x - h)² = 4p(y - k)
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-[#3b3026]">
                <li><strong>Vertex:</strong> (h, k)</li>
                <li><strong>Focal Parameter:</strong> p = (linear coefficient) ÷ 4</li>
                <li><strong>Opens:</strong> Upwards if p &gt; 0, Downwards if p &lt; 0</li>
                <li><strong>Focus:</strong> (h, k + p)</li>
                <li><strong>Directrix Line:</strong> y = k - p</li>
              </ul>
            </div>

            <div className="p-3 bg-[#e8e0d0] border border-[#baa990] rounded">
              <h3 className="font-bold text-lg text-[#521919] mb-1">
                Horizontal Parabola (Symmetric to x-axis)
              </h3>
              <p className="font-mono text-center text-lg font-bold text-[#631818] my-2 p-2 bg-black/5 rounded">
                (y - k)² = 4p(x - h)
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-[#3b3026]">
                <li><strong>Vertex:</strong> (h, k)</li>
                <li><strong>Opens:</strong> Right if p &gt; 0, Left if p &lt; 0</li>
                <li><strong>Focus:</strong> (h + p, k)</li>
                <li><strong>Directrix Line:</strong> x = h - p</li>
              </ul>
            </div>

            <div className="flex items-start gap-2 p-2.5 bg-amber-950/10 border border-amber-800/25 rounded text-xs text-[#523d29]">
              <Lightbulb className="w-4 h-4 shrink-0 text-[#884e18] mt-0.5" />
              <span>
                <strong>Quick Rule:</strong> The variable that is squared dictates the axis of symmetry. If x is squared, the curve opens vertically; if y is squared, it opens horizontally.
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-[#c2b59f] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 font-serif font-bold text-sm text-[#ded5c2] bg-[#422d21] hover:bg-[#573d2d] rounded transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
