/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef } from 'react';
import { GameStateData, GameObject, InventoryItem, RoomId, GameContext } from './game/types';
import { CONIC_PUZZLES } from './game/puzzles';
import { ROOMS } from './game/rooms';
import { audio } from './game/audio';
import { GameCanvas } from './game/GameCanvas';
import { HUD } from './components/HUD';
import { DialogueBox } from './components/DialogueBox';
import { PuzzleModal } from './components/PuzzleModal';
import { StudyGrimoireModal } from './components/StudyGrimoireModal';
import { ItemInspectModal } from './components/ItemInspectModal';
import { EndingScreen } from './components/EndingScreen';
import { PrologueScreen } from './components/PrologueScreen';
import { FamilyPortraitModal } from './components/FamilyPortraitModal';
import { StudyTalismanModal } from './components/StudyTalismanModal';
import { VirtualControls } from './components/VirtualControls';
import { Play, BookOpen, Compass, ShieldCheck } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameStateData>({
    status: 'TITLE',
    currentRoom: 'livingRoom',
    objectiveStep: 0,
    inventory: [],
    flags: {
      unlockedExit: false,
      soupCooked: false,
      inspectedPortrait: false,
      readRecipe: false,
      solvedPuzzles: {},
      readDiary: false,
      visitedStudy: false,
      studiedTalismans: false,
      grandpaSoupRequested: false
    },
    timeOffset: 0,
    flashlightFlicker: 0
  });

  // UI Modals & Overlays
  const [activeDialogue, setActiveDialogue] = useState<{
    speaker: string;
    lines: string[];
    onComplete?: () => void;
  } | null>(null);

  const [activePuzzle, setActivePuzzle] = useState<{
    puzzleId: string;
    targetObj: GameObject;
  } | null>(null);

  const [inspectingItem, setInspectingItem] = useState<InventoryItem | null>(null);
  const [showGrimoire, setShowGrimoire] = useState(false);
  const [showPortraitModal, setShowPortraitModal] = useState(false);
  const [showStudyQuizModal, setShowStudyQuizModal] = useState(false);
  const [grandpaCutsceneActive, setGrandpaCutsceneActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Virtual mobile controls state
  const [virtualKeys, setVirtualKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  });
  const currentFocusedObjRef = useRef<GameObject | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const changeRoom = useCallback((roomId: RoomId, startX: number, startY: number) => {
    audio.play('door');
    setGameState((prev) => ({
      ...prev,
      currentRoom: roomId,
      playerSpawn: { x: startX, y: startY }
    }));
  }, []);

  const showDialogue = useCallback(
    (speaker: string, lines: string[], onComplete?: () => void) => {
      setActiveDialogue({ speaker, lines, onComplete });
    },
    []
  );

  const triggerPuzzle = useCallback((puzzleId: string, obj: GameObject) => {
    setActivePuzzle({ puzzleId, targetObj: obj });
  }, []);

  const addItem = useCallback((item: InventoryItem) => {
    setGameState((prev) => {
      if (prev.inventory.some((i) => i.id === item.id)) return prev;
      return {
        ...prev,
        inventory: [...prev.inventory, item]
      };
    });
  }, []);

  const hasItem = useCallback(
    (itemId: string) => {
      return gameState.inventory.some((i) => i.id === itemId);
    },
    [gameState.inventory]
  );

  const advanceObjective = useCallback((toStep: number) => {
    setGameState((prev) => ({
      ...prev,
      objectiveStep: Math.max(prev.objectiveStep, toStep)
    }));
  }, []);

  const playSfx = useCallback((type: string) => {
    audio.play(type);
  }, []);

  const inspectItem = useCallback((item: InventoryItem) => {
    setInspectingItem(item);
  }, []);

  const openStudyQuiz = useCallback(() => {
    setShowStudyQuizModal(true);
  }, []);

  const showFamilyPortrait = useCallback(() => {
    setShowPortraitModal(true);
  }, []);

  // Context passed to game canvas and interactables
  const gameContext: GameContext = {
    gameState,
    changeRoom,
    showDialogue,
    triggerPuzzle,
    addItem,
    hasItem,
    advanceObjective,
    showToast,
    playSfx,
    inspectItem,
    openStudyQuiz,
    showFamilyPortrait
  };

  const handleStartTitle = () => {
    audio.init();
    setAudioEnabled(true);
    setGameState((prev) => ({
      ...prev,
      status: 'PROLOGUE'
    }));
  };

  const handleStartGameFromPrologue = () => {
    setGameState((prev) => ({
      ...prev,
      status: 'PLAYING',
      currentRoom: 'livingRoom',
      playerSpawn: { x: 400, y: 380 }
    }));
    showDialogue("Grandpa", [
      "Good morning, Kira.",
      "Head to the Master Study through the north door. Review your talisman equations on the chalkboard.",
      "We must keep our geometric discipline strong."
    ]);
  };

  const handleToggleAudio = () => {
    const isNowOn = audio.toggle();
    setAudioEnabled(isNowOn);
  };

  const handleSolvePuzzle = () => {
    if (!activePuzzle) return;
    const { targetObj } = activePuzzle;
    targetObj.locked = false;

    setGameState((prev) => ({
      ...prev,
      flags: {
        ...prev.flags,
        solvedPuzzles: {
          ...prev.flags.solvedPuzzles,
          [activePuzzle.puzzleId]: true
        }
      }
    }));

    setActivePuzzle(null);

    // Auto-interact to collect the item immediately
    setTimeout(() => {
      if (targetObj.interact) {
        targetObj.interact(gameContext);
      }
    }, 300);
  };

  const handleStudyQuizComplete = () => {
    setShowStudyQuizModal(false);
    setGameState((prev) => ({
      ...prev,
      flags: {
        ...prev.flags,
        studiedTalismans: true
      }
    }));

    // Trigger in-engine Grandpa entrance into the study!
    setTimeout(() => {
      setGrandpaCutsceneActive(true);
    }, 400);
  };

  const handleGrandpaCutsceneFinish = () => {
    setGrandpaCutsceneActive(false);
    setGameState((prev) => ({
      ...prev,
      flags: {
        ...prev.flags,
        grandpaSoupRequested: true
      }
    }));
  };

  const handleRestart = () => {
    // Reset rooms
    Object.values(ROOMS).forEach((room) => {
      room.objects.forEach((obj) => {
        if (obj.puzzleId) obj.locked = true;
        if (obj.id === 'grandpa') obj.sprite = 'grandpa';
      });
    });

    setGameState({
      status: 'PROLOGUE',
      currentRoom: 'livingRoom',
      objectiveStep: 0,
      inventory: [],
      flags: {
        unlockedExit: false,
        soupCooked: false,
        inspectedPortrait: false,
        readRecipe: false,
        solvedPuzzles: {},
        readDiary: false,
        visitedStudy: false,
        studiedTalismans: false,
        grandpaSoupRequested: false
      },
      timeOffset: 0,
      flashlightFlicker: 0
    });
  };

  const handleVirtualInteract = () => {
    if (activeDialogue) {
      const enterKey = new KeyboardEvent('keydown', { key: 'e' });
      window.dispatchEvent(enterKey);
      return;
    }
    if (currentFocusedObjRef.current && currentFocusedObjRef.current.interact) {
      currentFocusedObjRef.current.interact(gameContext);
    }
  };

  return (
    <main className="relative w-screen h-screen bg-[#030303] flex items-center justify-center overflow-hidden font-mono select-none">
      {/* Title Screen Overlay */}
      {gameState.status === 'TITLE' && (
        <section 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/95 text-center text-[#dcd4c6]"
          style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
        >
          <div className="max-w-xl space-y-6">
            <div className="text-4xl text-[#9b2a2a] font-serif font-black mb-1">
              ⨂
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-black tracking-widest text-[#f0e8dc]">
              THE HOUSE THAT REMEMBERS
            </h1>
            <p className="text-lg md:text-xl text-[#a89c8b] leading-relaxed italic max-w-lg mx-auto">
              "We locked ourselves inside with fear of the unknown.<br />
              Mathematics anchored our minds against the darkness."
            </p>

            <div className="py-4 border-y border-[#3a3026] text-xs font-mono text-[#8c7f70] space-y-1.5 text-left max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#c49a62]" />
                <span>Move with <strong>WASD</strong> or <strong>Arrow Keys</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c49a62]" />
                <span>Press <strong>[E]</strong> or <strong>Space</strong> to interact with furnishings & doors</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#c49a62]" />
                <span>Study and solve Conic Section wards (Circles & Parabolas)</span>
              </div>
            </div>

            <button
              onClick={handleStartTitle}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#541e17] hover:bg-[#6e271e] active:bg-[#3d1510] text-[#f4ece0] font-mono text-base font-bold tracking-widest uppercase border border-[#85362c] rounded transition-all shadow-xl hover:scale-105 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Enter the Manor</span>
            </button>
          </div>
        </section>
      )}

      {/* Forgotten Hill Video Intro Prologue */}
      {gameState.status === 'PROLOGUE' && (
        <PrologueScreen onStartGame={handleStartGameFromPrologue} />
      )}

      {/* Main Game Arena */}
      <div className="relative w-full h-full max-w-[800px] max-h-[600px] flex items-center justify-center bg-black shadow-2xl">
        <GameCanvas
          context={gameContext}
          isDialogueActive={!!activeDialogue}
          isModalActive={!!activePuzzle || showGrimoire || !!inspectingItem || showPortraitModal || showStudyQuizModal}
          externalKeys={virtualKeys}
          grandpaCutsceneActive={grandpaCutsceneActive}
          onGrandpaCutsceneFinish={handleGrandpaCutsceneFinish}
          onInteractPrompt={(obj) => {
            currentFocusedObjRef.current = obj;
          }}
        />

        {/* HUD: Objectives, Belongings, Top Bar */}
        {gameState.status === 'PLAYING' && (
          <HUD
            currentRoomName={ROOMS[gameState.currentRoom].name}
            objectiveStep={gameState.objectiveStep}
            inventory={gameState.inventory}
            audioEnabled={audioEnabled}
            scanlinesEnabled={scanlinesEnabled}
            toastMessage={toastMessage}
            onToggleAudio={handleToggleAudio}
            onToggleScanlines={() => setScanlinesEnabled((prev) => !prev)}
            onOpenGrimoire={() => setShowGrimoire(true)}
            onInspectItem={inspectItem}
          />
        )}

        {/* Active Typewriter Dialogue with Speaker Portrait on Left */}
        {activeDialogue && (
          <DialogueBox
            speaker={activeDialogue.speaker}
            lines={activeDialogue.lines}
            onComplete={() => {
              const cb = activeDialogue.onComplete;
              setActiveDialogue(null);
              if (cb) cb();
            }}
          />
        )}

        {/* Math Conic Puzzle Modal */}
        {activePuzzle && (
          <PuzzleModal
            puzzle={CONIC_PUZZLES[activePuzzle.puzzleId]}
            onSolve={handleSolvePuzzle}
            onClose={() => setActivePuzzle(null)}
          />
        )}

        {/* Mathematics Study Grimoire Guide */}
        {showGrimoire && (
          <StudyGrimoireModal onClose={() => setShowGrimoire(false)} />
        )}

        {/* Item Inspection Modal */}
        {inspectingItem && (
          <ItemInspectModal
            item={inspectingItem}
            onClose={() => setInspectingItem(null)}
          />
        )}

        {/* Family Portrait Modal (Image 4) */}
        {showPortraitModal && (
          <FamilyPortraitModal onClose={() => setShowPortraitModal(false)} />
        )}

        {/* Master Study Talisman Blackboard Quiz */}
        {showStudyQuizModal && (
          <StudyTalismanModal
            onComplete={handleStudyQuizComplete}
            onClose={() => setShowStudyQuizModal(false)}
          />
        )}

        {/* Mobile / Touch Virtual Controls */}
        {gameState.status === 'PLAYING' && (
          <VirtualControls
            onDirectionChange={setVirtualKeys}
            onInteract={handleVirtualInteract}
          />
        )}

        {/* CRT Scanlines Overlay */}
        {scanlinesEnabled && (
          <div className="absolute inset-0 crt-scanlines crt-vignette pointer-events-none z-30" />
        )}
      </div>

      {/* Narrative Glitched Ending Screen (Image 1) */}
      {gameState.status === 'ENDING' && (
        <EndingScreen onRestart={handleRestart} />
      )}
    </main>
  );
}
