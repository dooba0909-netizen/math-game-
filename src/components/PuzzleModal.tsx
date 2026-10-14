import React, { useState, useEffect, useRef } from 'react';
import { MathPuzzle } from '../game/types';
import { audio } from '../game/audio';
import { Sparkles, HelpCircle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PuzzleModalProps {
  puzzle: MathPuzzle;
  onSolve: () => void;
  onClose: () => void;
}

export const PuzzleModal: React.FC<PuzzleModalProps> = ({ puzzle, onSolve, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isShattering, setIsShattering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (puzzle.type === 'input') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [puzzle]);

  // Render mathematical conic diagram
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !puzzle.diagramParams) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Coordinate grid setup
    const cx = w / 2;
    const cy = h / 2;
    const scale = 14; // pixels per unit

    // Draw coordinate axes
    ctx.strokeStyle = '#c5baaa';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    // Axis markings
    ctx.fillStyle = '#9b8f7d';
    ctx.font = '9px "Courier New", monospace';
    for (let x = -8; x <= 8; x += 2) {
      if (x === 0) continue;
      const px = cx + x * scale;
      ctx.fillRect(px, cy - 2, 1, 4);
    }
    for (let y = -8; y <= 8; y += 2) {
      if (y === 0) continue;
      const py = cy - y * scale;
      ctx.fillRect(cx - 2, py, 4, 1);
    }

    const { type, h: ph, k: pk, r, p, orientation } = puzzle.diagramParams;

    if (type === 'circle' && r) {
      const centerX = cx + ph * scale;
      const centerY = cy - pk * scale;
      const radiusPx = r * scale;

      // Draw circle
      ctx.strokeStyle = '#8b2020';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radiusPx, 0, Math.PI * 2);
      ctx.stroke();

      // Center point
      ctx.fillStyle = '#b82323';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Center label
      ctx.fillStyle = '#42281d';
      ctx.font = 'bold 11px "Courier New", monospace';
      ctx.fillText(`C(${ph}, ${pk})`, centerX + 6, centerY - 6);

      // Radius line
      ctx.strokeStyle = '#5a4634';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radiusPx, centerY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText(`r=${r}`, centerX + radiusPx / 2 - 8, centerY - 4);
    } else if (type === 'parabola' && p !== undefined) {
      const vertX = cx + ph * scale;
      const vertY = cy - pk * scale;

      // Draw vertex
      ctx.fillStyle = '#8b2020';
      ctx.beginPath();
      ctx.arc(vertX, vertY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#42281d';
      ctx.font = 'bold 11px "Courier New", monospace';
      ctx.fillText(`V(${ph}, ${pk})`, vertX + 6, vertY - 6);

      // Draw parabola curve
      ctx.strokeStyle = '#8b2020';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      if (orientation === 'vertical') {
        // (x - h)^2 = 4p(y - k)  => y = (x - h)^2 / (4p) + k
        for (let xUnit = -9; xUnit <= 9; xUnit += 0.2) {
          const yUnit = Math.pow(xUnit - ph, 2) / (4 * p) + pk;
          const px = cx + xUnit * scale;
          const py = cy - yUnit * scale;
          if (xUnit === -9) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Focus: (h, k + p)
        const focY = cy - (pk + p) * scale;
        ctx.fillStyle = '#225588';
        ctx.beginPath();
        ctx.arc(vertX, focY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(`F(${ph}, ${pk + p})`, vertX + 6, focY + 12);

        // Directrix: y = k - p
        const dirY = cy - (pk - p) * scale;
        ctx.strokeStyle = '#225588';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(0, dirY);
        ctx.lineTo(w, dirY);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        // Horizontal: (y - k)^2 = 4p(x - h) => x = (y - k)^2 / (4p) + h
        for (let yUnit = -9; yUnit <= 9; yUnit += 0.2) {
          const xUnit = Math.pow(yUnit - pk, 2) / (4 * p) + ph;
          const px = cx + xUnit * scale;
          const py = cy - yUnit * scale;
          if (yUnit === -9) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Focus: (h + p, k)
        const focX = cx + (ph + p) * scale;
        ctx.fillStyle = '#225588';
        ctx.beginPath();
        ctx.arc(focX, vertY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(`F(${ph + p}, ${pk})`, focX + 4, vertY - 6);

        // Directrix: x = h - p
        const dirX = cx + (ph - p) * scale;
        ctx.strokeStyle = '#225588';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(dirX, 0);
        ctx.lineTo(dirX, h);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [puzzle]);

  const verifyAnswer = (input: string) => {
    const clean = (s: string) => String(s).replace(/\s+/g, '').toLowerCase();
    const isCorrect = clean(input) === clean(puzzle.answer);

    if (isCorrect) {
      audio.play('success');
      setFeedback({ text: 'The mathematical talisman resonates and shatters...', isError: false });
      setIsShattering(true);
      setTimeout(() => {
        audio.play('shatter');
        onSolve();
      }, 1200);
    } else {
      audio.play('error');
      setFeedback({
        text: 'The runes pulse defensively. Incorrect value.',
        isError: true
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div 
        className={`relative w-full max-w-lg rounded-sm border-2 border-[#5a483a] parchment-texture text-[#2b2520] p-6 shadow-2xl transition-all duration-300 ${
          isShattering ? 'scale-105 opacity-90 border-red-700' : ''
        }`}
        style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
      >
        {/* Top Seal Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-[#c2b59f] mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-[#8b1a1a] font-serif font-black animate-pulse">⨂</span>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#7a6452] font-mono">Conic Ward</span>
              <h2 className="text-xl font-bold leading-none tracking-wide text-[#341d13]">
                {puzzle.topic}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#7a6452] hover:text-[#2b2520] hover:bg-black/5 transition-colors"
            title="Step back"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <p className="text-lg leading-relaxed font-semibold text-[#29221d] whitespace-pre-wrap">
            {puzzle.question}
          </p>

          {puzzle.equationDisplay && (
            <div className="my-3 px-4 py-2 bg-black/5 border border-[#baa990] rounded text-center font-mono text-base font-bold text-[#6b1e1e] tracking-wider shadow-inner">
              {puzzle.equationDisplay}
            </div>
          )}
        </div>

        {/* Optional Conic Geometry Diagram */}
        {puzzle.diagramParams && (
          <div className="mb-4 flex flex-col items-center">
            <div className="text-xs uppercase tracking-wider text-[#7a6452] mb-1 font-mono">
              Geometric Projection
            </div>
            <div className="bg-[#f0ebe0] border border-[#c5baaa] p-1 rounded shadow-inner">
              <canvas
                ref={canvasRef}
                width={260}
                height={160}
                className="block"
              />
            </div>
          </div>
        )}

        {/* Options / Input Form */}
        {puzzle.type === 'mcq' && puzzle.options && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {puzzle.options.map((opt) => (
              <button
                key={opt}
                disabled={isShattering}
                onClick={() => verifyAnswer(opt)}
                className="px-4 py-2.5 text-base font-bold text-left rounded border border-[#8f7b66] bg-[#ded5c2] hover:bg-[#cfc3aa] active:bg-[#baa88c] transition-colors shadow-sm disabled:opacity-50"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {puzzle.type === 'input' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputValue.trim()) verifyAnswer(inputValue);
            }}
            className="mb-4"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                disabled={isShattering}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter coordinate or constant..."
                className="flex-1 px-4 py-2 text-lg font-mono font-bold bg-[#faf6ed] border border-[#8f7b66] rounded focus:outline-none focus:ring-2 focus:ring-[#8b1a1a] shadow-inner text-[#221c17]"
              />
              <button
                type="submit"
                disabled={isShattering || !inputValue.trim()}
                className="px-5 py-2 font-serif font-bold text-base text-[#e5ded0] bg-[#611919] hover:bg-[#852525] active:bg-[#481212] rounded transition-colors disabled:opacity-50 shadow"
              >
                Break Seal
              </button>
            </div>
          </form>
        )}

        {/* Feedback / Error / Success Message */}
        {feedback && (
          <div
            className={`flex items-center gap-2 p-2.5 rounded mb-3 text-sm font-semibold ${
              feedback.isError
                ? 'bg-red-950/15 text-[#881717] border border-red-800/30'
                : 'bg-emerald-950/15 text-[#1b5e20] border border-emerald-800/30'
            }`}
          >
            {feedback.isError ? (
              <ShieldAlert className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Hint Section */}
        {showHint ? (
          <div className="p-3 bg-amber-950/10 border border-amber-800/25 rounded text-sm text-[#4d3824] mb-3 leading-relaxed">
            <span className="font-bold">Grandpa's Inscription:</span> {puzzle.hint}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="flex items-center gap-1.5 text-xs text-[#705b46] hover:text-[#2b2520] underline mb-3"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Consult Grandpa's notes (Hint)</span>
          </button>
        )}

        {/* Step back button */}
        <div className="flex justify-between items-center pt-2 border-t border-[#c2b59f] text-xs text-[#7a6452]">
          <span>WASD to move · [E] to interact</span>
          <button
            type="button"
            onClick={onClose}
            className="hover:underline text-[#443425] font-semibold"
          >
            Step away
          </button>
        </div>
      </div>
    </div>
  );
};
