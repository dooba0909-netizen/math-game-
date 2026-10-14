import React, { useEffect, useRef, useState } from 'react';
import { Player, Particle, DustMote, GameObject, GameContext } from './types';
import { ROOMS } from './rooms';
import { renderSprite, initSpriteCache } from './sprites';
import { audio } from './audio';

interface GameCanvasProps {
  context: GameContext;
  isDialogueActive: boolean;
  isModalActive: boolean;
  onInteractPrompt: (obj: GameObject | null) => void;
  externalKeys: { up: boolean; down: boolean; left: boolean; right: boolean };
  grandpaCutsceneActive?: boolean;
  onGrandpaCutsceneFinish?: () => void;
}

export const SCREEN_W = 800;
export const SCREEN_H = 600;
export const CAMERA_ZOOM = 1.36;

export const GameCanvas: React.FC<GameCanvasProps> = ({
  context,
  isDialogueActive,
  isModalActive,
  onInteractPrompt,
  externalKeys,
  grandpaCutsceneActive = false,
  onGrandpaCutsceneFinish
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reusable offscreen canvas for dynamic lantern lighting (avoids GC lag)
  const lightCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Smooth Camera following player
  const cameraRef = useRef<{ x: number; y: number }>({ x: 400, y: 300 });

  // Player state
  const playerRef = useRef<Player>({
    x: 400,
    y: 380,
    width: 36,
    height: 48,
    speed: 3.8,
    dir: 'up',
    isMoving: false,
    stepTimer: 0,
    animFrame: 0
  });

  // Cutscene Grandpa state in Study
  const cutsceneGrandpaRef = useRef<{
    active: boolean;
    x: number;
    y: number;
    targetY: number;
    phase: 'entering' | 'talking' | 'exiting' | 'done';
    stepTimer: number;
  }>({
    active: false,
    x: 520,
    y: 520,
    targetY: 230,
    phase: 'done',
    stepTimer: 0
  });

  // Local keyboard tracking
  const keysRef = useRef<{ w: boolean; a: boolean; s: boolean; d: boolean; e: boolean }>({
    w: false,
    a: false,
    s: false,
    d: false,
    e: false
  });
  const prevERef = useRef(false);
  const lastDialogueCloseTimeRef = useRef<number>(0);
  const wasDialogueActiveRef = useRef(false);

  // Track cutscene activation
  useEffect(() => {
    if (grandpaCutsceneActive && context.gameState.currentRoom === 'studyRoom') {
      cutsceneGrandpaRef.current = {
        active: true,
        x: 520,
        y: 520,
        targetY: 230,
        phase: 'entering',
        stepTimer: 0
      };
    }
  }, [grandpaCutsceneActive, context.gameState.currentRoom]);

  // Track dialogue active state to prevent accidental interaction re-triggers
  useEffect(() => {
    if (wasDialogueActiveRef.current && !isDialogueActive) {
      lastDialogueCloseTimeRef.current = Date.now();
      keysRef.current.e = false;
      prevERef.current = true;
    }
    wasDialogueActiveRef.current = isDialogueActive;
  }, [isDialogueActive]);

  // Particles & dust motes
  const particlesRef = useRef<Particle[]>([]);
  const dustMotesRef = useRef<DustMote[]>([]);
  const timeOffsetRef = useRef(0);

  // Initialize cached sprite matrices and dust motes
  useEffect(() => {
    initSpriteCache();
    const motes: DustMote[] = [];
    for (let i = 0; i < 40; i++) {
      motes.push({
        x: Math.random() * SCREEN_W,
        y: Math.random() * SCREEN_H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.15 - Math.random() * 0.2,
        alpha: Math.random() * 0.4 + 0.1,
        size: Math.random() * 2 + 1
      });
    }
    dustMotesRef.current = motes;

    // Allocate lighting canvas
    const lCanvas = document.createElement('canvas');
    lCanvas.width = 1100;
    lCanvas.height = 900;
    lightCanvasRef.current = lCanvas;
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') keysRef.current.w = true;
      if (k === 's' || e.key === 'ArrowDown') keysRef.current.s = true;
      if (k === 'a' || e.key === 'ArrowLeft') keysRef.current.a = true;
      if (k === 'd' || e.key === 'ArrowRight') keysRef.current.d = true;
      if (k === 'e' || e.key === ' ') keysRef.current.e = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') keysRef.current.w = false;
      if (k === 's' || e.key === 'ArrowDown') keysRef.current.s = false;
      if (k === 'a' || e.key === 'ArrowLeft') keysRef.current.a = false;
      if (k === 'd' || e.key === 'ArrowRight') keysRef.current.d = false;
      if (k === 'e' || e.key === ' ') keysRef.current.e = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Reposition player accurately when room changes or spawn is set
  useEffect(() => {
    if (context.gameState.playerSpawn) {
      playerRef.current.x = context.gameState.playerSpawn.x;
      playerRef.current.y = context.gameState.playerSpawn.y;
      playerRef.current.isMoving = false;
      keysRef.current.e = false;
      prevERef.current = true;
      // Immediately snap camera to player center
      cameraRef.current.x = context.gameState.playerSpawn.x + playerRef.current.width / 2;
      cameraRef.current.y = context.gameState.playerSpawn.y + playerRef.current.height / 2;
    }
  }, [context.gameState.currentRoom, context.gameState.playerSpawn]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animId: number;

    // Tight player foot hitbox (18x12 px at sprite base) so the player glides through doors & around furniture
    const FOOT_OFFSET_X = 9;
    const FOOT_OFFSET_Y = 34;
    const FOOT_WIDTH = 18;
    const FOOT_HEIGHT = 12;

    const checkCollision = (x: number, y: number) => {
      const room = ROOMS[context.gameState.currentRoom];
      if (!room) return false;
      const fx = x + FOOT_OFFSET_X;
      const fy = y + FOOT_OFFSET_Y;

      // Check walls
      for (const wall of room.walls) {
        if (fx < wall.x + wall.w && fx + FOOT_WIDTH > wall.x && fy < wall.y + wall.h && fy + FOOT_HEIGHT > wall.y) {
          return true;
        }
      }

      // Check solid objects
      for (const obj of room.objects) {
        if (obj.isSolid) {
          const isDoor = obj.sprite === 'doorV' || obj.sprite === 'doorH' || obj.sprite === 'exitDoor' || obj.sprite === 'hatch' || obj.sprite === 'stairs_down';

          let ox = obj.x;
          let oy = obj.y;
          let ow = obj.w;
          let oh = obj.h;

          if (!isDoor) {
            // Furniture: relaxed collision box so player easily walks past and behind
            ox = obj.x + 4;
            oy = obj.y + Math.floor(obj.h * 0.4);
            ow = Math.max(8, obj.w - 8);
            oh = Math.max(8, obj.h - Math.floor(obj.h * 0.4) - 4);
          }

          if (fx < ox + ow && fx + FOOT_WIDTH > ox && fy < oy + oh && fy + FOOT_HEIGHT > oy) {
            return true;
          }
        }
      }
      return false;
    };

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      timeOffsetRef.current += 0.05;
      const player = playerRef.current;
      const room = ROOMS[context.gameState.currentRoom];
      if (!room) return;

      const pxCenter = player.x + player.width / 2;
      const pyCenter = player.y + player.height / 2;
      let closestObj: GameObject | null = null;

      // Cutscene logic for Grandpa entering the study
      const cutscene = cutsceneGrandpaRef.current;
      if (cutscene.active && context.gameState.currentRoom === 'studyRoom') {
        if (cutscene.phase === 'entering') {
          cutscene.stepTimer++;
          if (cutscene.y > cutscene.targetY) {
            cutscene.y -= 2.0;
            if (cutscene.stepTimer % 24 === 0) {
              audio.play('step');
            }
          } else {
            cutscene.phase = 'talking';
            context.showDialogue("Grandpa", [
              "Well done, Kira. Your mathematical discipline remains strong.",
              "The winter draft is creeping into the cabin today... My old joints ache, and I grow weary.",
              "Could you prepare some warm restorative soup for me in the kitchen? Check the family recipe on the counter.",
              "I will be waiting by the hearth in the parlor."
            ], () => {
              cutscene.phase = 'exiting';
              context.advanceObjective(1);
            });
          }
        } else if (cutscene.phase === 'exiting') {
          cutscene.stepTimer++;
          if (cutscene.y < 540) {
            cutscene.y += 2.0;
            if (cutscene.stepTimer % 24 === 0) {
              audio.play('step');
            }
          } else {
            cutscene.active = false;
            cutscene.phase = 'done';
            if (onGrandpaCutsceneFinish) {
              onGrandpaCutsceneFinish();
            }
          }
        }
      }

      // Freeze player movement and interaction if dialogue, modal, or cutscene talking is active
      const isCutsceneTalking = cutscene.active && cutscene.phase === 'talking';
      if (isDialogueActive || isModalActive || isCutsceneTalking) {
        player.isMoving = false;
        player.animFrame = 0;
        onInteractPrompt(null);
        prevERef.current = keysRef.current.e;
      } else {
        // Merge physical keys and virtual keys
        const moveUp = keysRef.current.w || externalKeys.up;
        const moveDown = keysRef.current.s || externalKeys.down;
        const moveLeft = keysRef.current.a || externalKeys.left;
        const moveRight = keysRef.current.d || externalKeys.right;

        let dx = 0;
        let dy = 0;
        if (moveUp) dy -= player.speed;
        if (moveDown) dy += player.speed;
        if (moveLeft) dx -= player.speed;
        if (moveRight) dx += player.speed;

        player.isMoving = dx !== 0 || dy !== 0;

        if (player.isMoving) {
          // Normalize diagonal
          if (dx !== 0 && dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx = (dx / len) * player.speed;
            dy = (dy / len) * player.speed;
          }

          // Determine orientation
          if (Math.abs(dx) > Math.abs(dy)) {
            player.dir = dx > 0 ? 'right' : 'left';
          } else {
            player.dir = dy > 0 ? 'down' : 'up';
          }

          // Sliding collision movement with feet hitbox
          if (!checkCollision(player.x + dx, player.y)) {
            player.x += dx;
          }
          if (!checkCollision(player.x, player.y + dy)) {
            player.y += dy;
          }

          // Step sound & animation timer
          player.stepTimer++;
          if (player.stepTimer % 18 === 0) {
            audio.play('step');
          }
          player.animFrame = Math.floor(player.stepTimer / 9) % 3;
        } else {
          player.animFrame = 0;
        }

        // Check interactable focus with edge-to-edge distance for wall-to-wall doors
        let closestDist = 75;

        for (const obj of room.objects) {
          // Nearest point on object rectangle to player center
          const nearestX = Math.max(obj.x, Math.min(obj.x + obj.w, pxCenter));
          const nearestY = Math.max(obj.y, Math.min(obj.y + obj.h, pyCenter));
          const edgeDist = Math.sqrt(Math.pow(pxCenter - nearestX, 2) + Math.pow(pyCenter - nearestY, 2));

          if (edgeDist < closestDist) {
            closestDist = edgeDist;
            closestObj = obj;
          }
        }

        onInteractPrompt(closestObj);

        // Trigger interaction on E or Space with post-dialogue cooldown
        const ePressed = keysRef.current.e;
        const cooldownPassed = Date.now() - lastDialogueCloseTimeRef.current > 350;
        if (ePressed && !prevERef.current && cooldownPassed && closestObj && closestObj.interact) {
          closestObj.interact(context);
        }
        prevERef.current = ePressed;
      }

      // Update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) particlesRef.current.splice(i, 1);
      }

      // Update dust motes
      for (const m of dustMotesRef.current) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < 0) {
          m.y = SCREEN_H;
          m.x = Math.random() * SCREEN_W;
        }
        if (m.x < 0) m.x = SCREEN_W;
        if (m.x > SCREEN_W) m.x = 0;
      }

      // Smooth Camera Follow:
      // Allow camera to show ~80-100px of atmospheric black outside the room walls so the entire house silhouette is framed
      const targetCamX = player.x + player.width / 2;
      const targetCamY = player.y + player.height / 2;
      cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.12;
      cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.12;

      // Soft clamp bounds revealing exterior black void outside each room
      const minCamX = 260;
      const maxCamX = 540;
      const minCamY = 210;
      const maxCamY = 390;
      const clampedCamX = Math.max(minCamX, Math.min(maxCamX, cameraRef.current.x));
      const clampedCamY = Math.max(minCamY, Math.min(maxCamY, cameraRef.current.y));

      // --- RENDERING ---
      ctx.imageSmoothingEnabled = false;

      // Base canvas background (pure black)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

      // Apply Zoomed Camera Transformation centered on player
      ctx.save();
      ctx.translate(SCREEN_W / 2, SCREEN_H / 2);
      ctx.scale(CAMERA_ZOOM, CAMERA_ZOOM);
      ctx.translate(-clampedCamX, -clampedCamY);

      // 0. Exterior deep void around the house
      ctx.fillStyle = '#000000';
      ctx.fillRect(-300, -300, SCREEN_W + 600, SCREEN_H + 600);

      // 1. Floor Background (ONLY drawn inside floorBounds, leaving pure black outside!)
      const floorBounds = room.floorBounds || [{ x: 100, y: 70, w: 600, h: 460 }];

      for (const bounds of floorBounds) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(bounds.x, bounds.y, bounds.w, bounds.h);
        ctx.clip();

        // Base floor color
        ctx.fillStyle = room.floorColor;
        ctx.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);

        if (room.floorType === 'cobblestone') {
          // Cobblestone river stone pattern matching kitchen and cellar
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
          for (let y = bounds.y - 20; y < bounds.y + bounds.h + 20; y += 24) {
            const shift = (Math.floor(y / 24) % 2) * 16;
            for (let x = bounds.x - 20 + shift; x < bounds.x + bounds.w + 20; x += 32) {
              ctx.beginPath();
              ctx.strokeRect(x + 2, y + 2, 28, 20);
              ctx.fillRect(x + 2, y + 2, 28, 20);
            }
          }
        } else {
          // Polished timber planks matching parlor and chambers
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.32)';
          ctx.lineWidth = 1.5;
          for (let x = bounds.x - 20; x < bounds.x + bounds.w + 20; x += 26) {
            ctx.beginPath();
            ctx.moveTo(x, bounds.y);
            ctx.lineTo(x, bounds.y + bounds.h);
            ctx.stroke();

            // Subtle staggered wood plank end seams
            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            for (let y = bounds.y + 30 + ((x * 11) % 75); y < bounds.y + bounds.h; y += 120) {
              ctx.fillRect(x - 2, y, 4, 2);
            }
          }
        }
        ctx.restore();
      }

      // 2. Room Objects (Furniture, Decorations, and Solid Wall-to-Wall Doors)
      for (const obj of room.objects) {
        if (obj.sprite === 'doorV') {
          // Solid Wall-to-Wall Vertical Timber Door with Iron Bracing
          ctx.fillStyle = '#2b1b11';
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

          // Wood grain vertical planks
          ctx.strokeStyle = '#180e09';
          ctx.lineWidth = 2;
          ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

          const plankW = obj.w / 2;
          ctx.beginPath();
          ctx.moveTo(obj.x + plankW, obj.y);
          ctx.lineTo(obj.x + plankW, obj.y + obj.h);
          ctx.stroke();

          // Heavy iron hinges top and bottom
          ctx.fillStyle = '#4f555c';
          ctx.fillRect(obj.x + 2, obj.y + 16, obj.w - 4, 10);
          ctx.fillRect(obj.x + 2, obj.y + obj.h - 26, obj.w - 4, 10);

          // Iron door pull ring / latch
          ctx.fillStyle = '#c49a62';
          ctx.beginPath();
          ctx.arc(obj.x + obj.w / 2, obj.y + obj.h / 2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#1e140d';
          ctx.beginPath();
          ctx.arc(obj.x + obj.w / 2, obj.y + obj.h / 2, 3, 0, Math.PI * 2);
          ctx.fill();

          // Lintel frame trims
          ctx.fillStyle = '#4a3020';
          ctx.fillRect(obj.x, obj.y, obj.w, 8);
          ctx.fillRect(obj.x, obj.y + obj.h - 8, obj.w, 8);
        } else if (obj.sprite === 'doorH' || obj.sprite === 'exitDoor') {
          // Solid Wall-to-Wall Horizontal Timber Door or Reinforced Storm Door
          ctx.fillStyle = obj.sprite === 'exitDoor' ? '#381612' : '#2b1b11';
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

          // Sturdy outer frame
          ctx.strokeStyle = '#140c08';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

          // Center door dividing seam
          const midX = obj.x + obj.w / 2;
          ctx.beginPath();
          ctx.moveTo(midX, obj.y);
          ctx.lineTo(midX, obj.y + obj.h);
          ctx.stroke();

          // Iron crossbars / diagonal braces
          ctx.strokeStyle = obj.sprite === 'exitDoor' ? '#78261e' : '#422c1d';
          ctx.lineWidth = 2;
          ctx.strokeRect(obj.x + 8, obj.y + 6, midX - obj.x - 12, obj.h - 12);
          ctx.strokeRect(midX + 4, obj.y + 6, obj.x + obj.w - midX - 12, obj.h - 12);

          // Heavy iron handles / brass deadbolt
          ctx.fillStyle = obj.sprite === 'exitDoor' ? '#e8a938' : '#c49a62';
          ctx.fillRect(midX - 12, obj.y + obj.h / 2 - 4, 8, 8);
          ctx.fillRect(midX + 4, obj.y + obj.h / 2 - 4, 8, 8);

          // Exit door reinforced iron corner studs
          if (obj.sprite === 'exitDoor') {
            ctx.fillStyle = '#6b7280';
            for (let bx = obj.x + 16; bx < obj.x + obj.w - 16; bx += 24) {
              ctx.fillRect(bx, obj.y + 4, 4, 4);
              ctx.fillRect(bx, obj.y + obj.h - 8, 4, 4);
            }
          }
        } else if (obj.sprite === 'hatch') {
          // Cellar Basement Heavy Trapdoor Hatch
          ctx.fillStyle = '#2b1b11';
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.strokeStyle = '#140a06';
          ctx.lineWidth = 2;
          ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

          // Iron corner braces
          ctx.fillStyle = '#596169';
          ctx.fillRect(obj.x, obj.y, 14, 14);
          ctx.fillRect(obj.x + obj.w - 14, obj.y, 14, 14);
          ctx.fillRect(obj.x, obj.y + obj.h - 14, 14, 14);
          ctx.fillRect(obj.x + obj.w - 14, obj.y + obj.h - 14, 14, 14);

          // Center iron pull ring
          ctx.strokeStyle = '#8f98a3';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(obj.x + obj.w / 2, obj.y + obj.h / 2, 8, 0, Math.PI * 2);
          ctx.stroke();
        } else if (obj.sprite === 'stairs_down') {
          // Stone cellar steps spanning the passage
          ctx.fillStyle = '#211812';
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.strokeStyle = '#3e281b';
          ctx.lineWidth = 2;
          ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

          const steps = 4;
          const stepH = obj.h / steps;
          for (let s = 0; s < steps; s++) {
            ctx.fillStyle = s % 2 === 0 ? '#382519' : '#281a11';
            ctx.fillRect(obj.x, obj.y + s * stepH, obj.w, stepH);
            ctx.strokeRect(obj.x, obj.y + s * stepH, obj.w, stepH);
          }
        } else if (obj.id === 'grandpa') {
          // Grandpa idle bobbing and periodic eye blinking
          const isGrandpaBlinking = (Math.floor(timeOffsetRef.current * 16) % 65) < 4;
          const idleGrandpaBob = obj.state === 'alive' ? Math.sin(timeOffsetRef.current * 2.5) * 1.2 : 0;
          let gpSprite = obj.sprite || 'grandpa';
          if (obj.state === 'alive' && gpSprite === 'grandpa' && isGrandpaBlinking) {
            gpSprite = 'grandpa_blink';
          }
          const gpImg = renderSprite(gpSprite, 4);
          if (gpImg) {
            ctx.drawImage(gpImg, obj.x, obj.y + idleGrandpaBob);
          }
        } else if (obj.sprite) {
          const spriteImg = renderSprite(obj.sprite, 4);
          if (spriteImg) {
            ctx.drawImage(spriteImg, obj.x, obj.y);
          }
        }

        // Glowing Talisman Ward Seal on locked objects
        if (obj.locked) {
          const wave = Math.sin(timeOffsetRef.current * 2) * 4;
          const wardImg = renderSprite('ward', 4);
          if (wardImg) {
            ctx.save();
            ctx.globalAlpha = 0.85 + Math.sin(timeOffsetRef.current * 3) * 0.15;
            ctx.drawImage(wardImg, obj.x + obj.w / 2 - 20, obj.y - 28 + wave);
            ctx.restore();
          }
        }

        // Bubbling steam particles from the cooking pot in the kitchen
        if (obj.id === 'pot') {
          if (Math.random() < 0.25) {
            particlesRef.current.push({
              x: obj.x + 28 + (Math.random() - 0.5) * 16,
              y: obj.y + 12,
              vx: (Math.random() - 0.5) * 0.4,
              vy: -0.8 - Math.random() * 0.5,
              life: 1.0,
              maxLife: 1.0,
              color: '#ded7c5',
              size: Math.random() * 3 + 2
            });
          }
        }
      }

      // Cutscene Grandpa rendering in StudyRoom
      if (cutscene.active && context.gameState.currentRoom === 'studyRoom') {
        const gpWalkFrame = Math.floor(cutscene.stepTimer / 10) % 2;
        const gpSprite = cutscene.phase === 'talking' ? 'grandpa' : (gpWalkFrame === 0 ? 'grandpa_walk_0' : 'grandpa_walk_1');
        const gpImg = renderSprite(gpSprite, 4);
        if (gpImg) {
          ctx.drawImage(gpImg, cutscene.x, cutscene.y);
        }
      }

      // 3. Player Sprite (Kira) with Idle Bobbing and Periodic Blinking
      const isPlayerBlinking = (Math.floor(timeOffsetRef.current * 18) % 65) < 4;
      const idleBobY = !player.isMoving ? Math.sin(timeOffsetRef.current * 3) * 1.5 : 0;

      let spriteKey = 'player_down_0';
      if (player.dir === 'down') {
        if (player.isMoving) {
          spriteKey = player.animFrame === 1 ? 'player_down_1' : player.animFrame === 2 ? 'player_down_2' : 'player_down_0';
        } else {
          spriteKey = isPlayerBlinking ? 'player_down_blink' : 'player_down_0';
        }
      } else if (player.dir === 'up') {
        spriteKey = player.animFrame === 1 ? 'player_up_1' : player.animFrame === 2 ? 'player_up_2' : 'player_up_0';
      } else if (player.dir === 'left') {
        spriteKey = player.animFrame > 0 ? 'player_left_1' : 'player_left_0';
      } else if (player.dir === 'right') {
        spriteKey = player.animFrame > 0 ? 'player_right_1' : 'player_right_0';
      }

      const playerImg = renderSprite(spriteKey, 4);
      if (playerImg) {
        ctx.drawImage(playerImg, player.x, player.y + idleBobY);
      }

      // 4. Particles
      for (const p of particlesRef.current) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1.0;

      // 5. Walls (Dark Wooden Log Cabin Timbers with log-end profiles)
      for (const wall of room.walls) {
        ctx.fillStyle = '#1e130c';
        ctx.fillRect(wall.x, wall.y, wall.w, wall.h);

        // Exterior timber shadow
        ctx.strokeStyle = '#090503';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);

        // Horizontal log grooves
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1;
        for (let ly = wall.y + 8; ly < wall.y + wall.h; ly += 10) {
          ctx.beginPath();
          ctx.moveTo(wall.x, ly);
          ctx.lineTo(wall.x + wall.w, ly);
          ctx.stroke();
        }
      }

      // 6. Dust Motes
      for (const m of dustMotesRef.current) {
        ctx.fillStyle = `rgba(224, 213, 193, ${m.alpha})`;
        ctx.fillRect(m.x, m.y, m.size, m.size);
      }

      // 7. Dynamic Centered Lantern & Hearth Lighting Vignette
      const lightCanvas = lightCanvasRef.current;
      if (lightCanvas) {
        const lCtx = lightCanvas.getContext('2d');
        if (lCtx) {
          // Offscreen canvas covers world range [-150, -150] to [950, 750]
          const LIGHT_OFFSET_X = 150;
          const LIGHT_OFFSET_Y = 150;
          const lx = pxCenter + LIGHT_OFFSET_X;
          const ly = pyCenter + LIGHT_OFFSET_Y;

          lCtx.globalCompositeOperation = 'source-over';
          lCtx.fillStyle = context.gameState.currentRoom === 'void'
            ? 'rgba(0, 0, 0, 0.98)'
            : 'rgba(4, 3, 2, 0.88)';
          lCtx.fillRect(0, 0, lightCanvas.width, lightCanvas.height);

          lCtx.globalCompositeOperation = 'destination-out';

          // Player lantern cut-out (flicker)
          const lightFlicker = Math.sin(timeOffsetRef.current * 4) * 5 + Math.cos(timeOffsetRef.current * 7) * 3;
          const radius = context.gameState.currentRoom === 'void'
            ? 120 + lightFlicker
            : 240 + lightFlicker;

          const grad = lCtx.createRadialGradient(lx, ly, radius * 0.15, lx, ly, radius);
          grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
          grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.75)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          lCtx.fillStyle = grad;
          lCtx.beginPath();
          lCtx.arc(lx, ly, radius, 0, Math.PI * 2);
          lCtx.fill();

          // Ambient Hearth Lighting in Living Room (Fireplace)
          if (context.gameState.currentRoom === 'livingRoom') {
            const hx = 400 + LIGHT_OFFSET_X;
            const hy = 85 + LIGHT_OFFSET_Y;
            const hGrad = lCtx.createRadialGradient(hx, hy, 15, hx, hy, 140);
            hGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
            hGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            lCtx.fillStyle = hGrad;
            lCtx.beginPath();
            lCtx.arc(hx, hy, 140, 0, Math.PI * 2);
            lCtx.fill();
          }

          // Ambient Hearth Lighting in Kitchen (Cobblestone Hearth Oven)
          if (context.gameState.currentRoom === 'kitchen') {
            const ox = 175 + LIGHT_OFFSET_X;
            const oy = 120 + LIGHT_OFFSET_Y;
            const oGrad = lCtx.createRadialGradient(ox, oy, 15, ox, oy, 150);
            oGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
            oGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            lCtx.fillStyle = oGrad;
            lCtx.beginPath();
            lCtx.arc(ox, oy, 150, 0, Math.PI * 2);
            lCtx.fill();
          }

          // Draw lighting mask onto world
          ctx.drawImage(lightCanvas, -LIGHT_OFFSET_X, -LIGHT_OFFSET_Y);
        }
      }

      // 8. Interaction Prompt above player head
      if (closestObj && !isDialogueActive && !isModalActive && !isCutsceneTalking) {
        ctx.fillStyle = '#f5eedb';
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 6;
        ctx.fillText(`[E] ${closestObj.label}`, pxCenter, player.y - 12);
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [context, externalKeys, isDialogueActive, isModalActive, onInteractPrompt, onGrandpaCutsceneFinish]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        width={SCREEN_W}
        height={SCREEN_H}
        className="w-full h-full max-w-[800px] max-h-[600px] object-contain shadow-2xl border border-[#2d251d]"
      />
    </div>
  );
};
