import React, { useState } from 'react';
import { audio } from '../game/audio';
import { BookOpen, CheckCircle, HelpCircle, X, ShieldAlert, Sparkles } from 'lucide-react';

interface StudyTalismanModalProps {
  onComplete: () => void;
  onClose: () => void;
}

export const StudyTalismanModal: React.FC<StudyTalismanModalProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'study' | 'quiz1' | 'quiz2' | 'finished'>('study');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleStudyNext = () => {
    audio.play('blip');
    setCurrentStep('quiz1');
  };

  const handleAnswer1 = (ans: string) => {
    setSelectedAnswer(ans);
    if (ans === 'A') {
      audio.play('success');
      setFeedback('Correct! The center is (h, k) = (5, -3).');
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
        setCurrentStep('quiz2');
      }, 1200);
    } else {
      audio.play('error');
      setFeedback('Incorrect: Remember (x - h)² has h=+5, and (y - k)² = (y - (-3))² so k=-3.');
    }
  };

  const handleAnswer2 = (ans: string) => {
    setSelectedAnswer(ans);
    if (ans === 'A') {
      audio.play('success');
      setFeedback('Splendid! 4p = 12 so p = 3 > 0, meaning it opens upward.');
      setTimeout(() => {
        setFeedback(null);
        setCurrentStep('finished');
      }, 1200);
    } else {
      audio.play('error');
      setFeedback('Incorrect: 4p = 12 means p = 3. Since the x-term is squared and p > 0, it opens upward.');
    }
  };

  const handleFinish = () => {
    audio.play('objective');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm select-none">
      <div className="relative max-w-2xl w-full bg-[#161d17] border-2 border-[#3d523e] rounded-sm p-6 text-[#d7e6d8] shadow-2xl space-y-5 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2b3a2c]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#85ba88]" />
            <span className="text-lg font-serif font-black tracking-wider text-[#eaf5eb]">
              Master Study: Conic Talisman Principles
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6e8a70] hover:text-[#eaf5eb] transition-colors rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chalkboard Content */}
        {currentStep === 'study' && (
          <div className="space-y-4">
            <div className="bg-[#0f1710] border border-[#2b3a2c] p-4 rounded text-sm md:text-base leading-relaxed space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-[#85ba88]">
                Lesson I: The Circle Ward
              </div>
              <p className="font-mono text-[#a3c9a6]">
                Formula: <span className="text-[#f5d77f] font-bold">(x - h)² + (y - k)² = r²</span>
              </p>
              <ul className="list-disc list-inside text-xs space-y-1 text-[#bcd9be]">
                <li><strong className="text-white">(h, k)</strong> is the center coordinate of the ward circle.</li>
                <li><strong className="text-white">r</strong> is the ward boundary radius (square root of the constant).</li>
              </ul>

              <div className="text-xs font-bold uppercase tracking-widest text-[#85ba88] pt-2">
                Lesson II: The Parabola Ward
              </div>
              <p className="font-mono text-[#a3c9a6]">
                Vertical Formula: <span className="text-[#f5d77f] font-bold">(x - h)² = 4p(y - k)</span>
              </p>
              <ul className="list-disc list-inside text-xs space-y-1 text-[#bcd9be]">
                <li>Opens <strong className="text-white">Upward</strong> if p &gt; 0, and <strong className="text-white">Downward</strong> if p &lt; 0.</li>
                <li>The focal length parameter is <strong>p</strong> (found by dividing the coefficient by 4).</li>
              </ul>
            </div>

            <button
              onClick={handleStudyNext}
              className="w-full py-3 bg-[#243d26] hover:bg-[#325735] text-[#eaf5eb] border border-[#4a7a4e] rounded font-bold tracking-wider transition-colors cursor-pointer"
            >
              Begin Talisman Review Quiz ▶
            </button>
          </div>
        )}

        {currentStep === 'quiz1' && (
          <div className="space-y-4">
            <div className="bg-[#0f1710] border border-[#2b3a2c] p-4 rounded space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#85ba88]">Question 1 of 2</span>
              <p className="text-base text-[#eaf5eb]">
                What is the center coordinate <strong>(h, k)</strong> of this ward circle?
              </p>
              <div className="p-3 bg-black/50 text-[#f5d77f] font-bold text-center text-lg rounded border border-[#3d523e]">
                (x - 5)² + (y + 3)² = 25
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'A', text: '(5, -3)' },
                { key: 'B', text: '(-5, 3)' },
                { key: 'C', text: '(5, 3)' },
                { key: 'D', text: '(-5, -3)' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleAnswer1(opt.key)}
                  className={`p-3 text-left border rounded transition-all cursor-pointer ${
                    selectedAnswer === opt.key
                      ? 'bg-[#3d5e40] border-[#85ba88] text-white'
                      : 'bg-[#18261a] hover:bg-[#253b27] border-[#314733] text-[#cbe0cd]'
                  }`}
                >
                  <span className="font-bold text-[#85ba88] mr-2">{opt.key})</span>
                  {opt.text}
                </button>
              ))}
            </div>

            {feedback && (
              <p className="text-sm font-bold text-center text-[#f5d77f] animate-pulse">
                {feedback}
              </p>
            )}
          </div>
        )}

        {currentStep === 'quiz2' && (
          <div className="space-y-4">
            <div className="bg-[#0f1710] border border-[#2b3a2c] p-4 rounded space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#85ba88]">Question 2 of 2</span>
              <p className="text-base text-[#eaf5eb]">
                For the vertical conic ward equation below, what is the parameter <strong>p</strong> and which direction does it open?
              </p>
              <div className="p-3 bg-black/50 text-[#f5d77f] font-bold text-center text-lg rounded border border-[#3d523e]">
                (x - 1)² = 12(y - 4)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'A', text: 'p = 3, Opens Upward' },
                { key: 'B', text: 'p = 12, Opens Downward' },
                { key: 'C', text: 'p = -3, Opens Downward' },
                { key: 'D', text: 'p = 4, Opens Right' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleAnswer2(opt.key)}
                  className={`p-3 text-left border rounded transition-all cursor-pointer ${
                    selectedAnswer === opt.key
                      ? 'bg-[#3d5e40] border-[#85ba88] text-white'
                      : 'bg-[#18261a] hover:bg-[#253b27] border-[#314733] text-[#cbe0cd]'
                  }`}
                >
                  <span className="font-bold text-[#85ba88] mr-2">{opt.key})</span>
                  {opt.text}
                </button>
              ))}
            </div>

            {feedback && (
              <p className="text-sm font-bold text-center text-[#f5d77f] animate-pulse">
                {feedback}
              </p>
            )}
          </div>
        )}

        {currentStep === 'finished' && (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 bg-[#2b4d2e] rounded-full flex items-center justify-center mx-auto text-[#85ba88]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-black text-[#eaf5eb]">
              Talisman Knowledge Mastered!
            </h3>
            <p className="text-sm text-[#b8d9ba] max-w-md mx-auto leading-relaxed">
              You have reviewed the conic principles of the protective wards. The sacred geometry is fresh in your mind.
            </p>
            <button
              onClick={handleFinish}
              className="px-8 py-3 bg-[#2f5732] hover:bg-[#407344] text-[#eaf5eb] border border-[#64ab6a] rounded font-bold tracking-widest uppercase transition-colors cursor-pointer shadow-lg"
            >
              Close Grimoire & Step Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
