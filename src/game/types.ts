export type RoomId = 'livingRoom' | 'kitchen' | 'pantry' | 'backRoom' | 'studyRoom' | 'void';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  dir: Direction;
  isMoving: boolean;
  stepTimer: number;
  animFrame: number;
}

export interface Wall {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GameObject {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sprite?: string;
  color?: string;
  locked?: boolean;
  puzzleId?: string;
  state?: string;
  isSolid?: boolean;
  interact?: (context: GameContext) => void;
  inspectText?: string[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface DustMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

export interface MathPuzzle {
  id: string;
  type: 'mcq' | 'input';
  topic: string;
  conicType: 'circle' | 'parabola';
  question: string;
  equationDisplay?: string;
  options?: string[];
  answer: string;
  hint: string;
  explanation: string;
  diagramParams?: {
    type: 'circle' | 'parabola';
    h: number;
    k: number;
    r?: number;
    p?: number;
    orientation?: 'vertical' | 'horizontal';
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  lore?: string;
}

export interface GameContext {
  gameState: GameStateData;
  changeRoom: (roomId: RoomId, startX: number, startY: number) => void;
  showDialogue: (speaker: string, textArray: string[], onComplete?: () => void) => void;
  triggerPuzzle: (puzzleId: string, obj: GameObject) => void;
  addItem: (item: InventoryItem) => void;
  hasItem: (itemId: string) => boolean;
  advanceObjective: (toStep: number) => void;
  showToast: (msg: string) => void;
  playSfx: (type: string) => void;
  inspectItem: (item: InventoryItem) => void;
  openStudyQuiz?: () => void;
  showFamilyPortrait?: () => void;
}

export interface GameStateData {
  status: 'TITLE' | 'PROLOGUE' | 'PLAYING' | 'ENDING';
  currentRoom: RoomId;
  objectiveStep: number;
  inventory: InventoryItem[];
  flags: {
    unlockedExit: boolean;
    soupCooked: boolean;
    inspectedPortrait: boolean;
    readRecipe: boolean;
    solvedPuzzles: Record<string, boolean>;
    readDiary: boolean;
    visitedStudy: boolean;
    studiedTalismans: boolean;
    grandpaSoupRequested: boolean;
  };
  timeOffset: number;
  flashlightFlicker: number;
  playerSpawn?: { x: number; y: number };
}
