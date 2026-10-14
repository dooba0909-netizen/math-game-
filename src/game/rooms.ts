import { GameObject, RoomId, Wall, InventoryItem, GameContext } from './types';

export interface RoomDefinition {
  id: RoomId;
  name: string;
  bg: string;
  floorColor: string;
  floorType: 'wood' | 'cobblestone';
  floorBounds: { x: number; y: number; w: number; h: number }[];
  walls: Wall[];
  objects: GameObject[];
}

export const ITEMS: Record<string, InventoryItem> = {
  potato: {
    id: 'potato',
    name: 'Harvest Potato',
    description: 'A firm root vegetable stored in the kitchen spice cabinet.',
    icon: '🥔',
    lore: 'Freshly harvested from the garden behind the cabin.'
  },
  carrot: {
    id: 'carrot',
    name: 'Sweet Carrot',
    description: 'A crisp orange carrot kept inside the cellar storage crate.',
    icon: '🥕',
    lore: 'Rich in earth aroma, essential for Grandpa\'s restorative soup.'
  },
  broth: {
    id: 'broth',
    name: 'Golden Broth',
    description: 'A sealed glass jar of savory vegetable stock in the cellar chest.',
    icon: '🫙',
    lore: 'Simmered with thyme and mountain herbs.'
  },
  essence: {
    id: 'essence',
    name: 'Midnight Elixir',
    description: 'A delicate glass vial containing shimmering dark extract from the safe.',
    icon: '🧪',
    lore: 'An old family herbal tincture used to induce peaceful, dreamless sleep.'
  },
  key: {
    id: 'key',
    name: 'Grandpa\'s Iron Key',
    description: 'A heavy antique key engraved with a spiral conic motif.',
    icon: '🗝️',
    lore: 'Unlocks the heavy southern storm door leading out of the cabin.'
  }
};

export const OBJECTIVES_LIST: string[] = [
  "Go to the Master Study (North door) to review the talisman equations.",
  "Prepare warm restorative soup for Grandpa in the Kitchen.",
  "Examine the family portrait upon the parlor table.",
  "Find the restorative soup recipe in the Kitchen.",
  "Solve the mathematical seals to gather the ingredients.",
  "Investigate the East Archive for the slumber elixir.",
  "Prepare the restorative brew in the Kitchen kettle.",
  "Serve the warm soup to Grandpa.",
  "Take Grandpa's Iron Key as he sleeps.",
  "Unlock the Front Storm Exit (South) to step outside."
];

export const ROOMS: Record<RoomId, RoomDefinition> = {
  livingRoom: {
    id: 'livingRoom',
    name: 'Grand Parlor',
    bg: '#050403',
    floorColor: '#362114',
    floorType: 'wood',
    // Non-box T-shaped layout with fireplace alcove and porch vestibule
    floorBounds: [
      { x: 110, y: 70, w: 580, h: 420 },
      { x: 330, y: 50, w: 140, h: 30 },
      { x: 320, y: 485, w: 160, h: 50 },
      { x: 70, y: 220, w: 40, h: 160 },
      { x: 690, y: 220, w: 40, h: 160 },
      { x: 550, y: 40, w: 120, h: 40 }
    ],
    walls: [
      { x: 70, y: 40, w: 260, h: 40 },
      { x: 330, y: 20, w: 140, h: 40 },
      { x: 470, y: 40, w: 80, h: 40 },
      // gap 550-670 is door to Master Study (North door)
      { x: 670, y: 40, w: 60, h: 40 },
      { x: 70, y: 40, w: 40, h: 180 },
      { x: 70, y: 380, w: 40, h: 120 },
      { x: 690, y: 40, w: 40, h: 180 },
      { x: 690, y: 380, w: 40, h: 120 },
      { x: 70, y: 490, w: 240, h: 40 },
      { x: 490, y: 490, w: 240, h: 40 },
      { x: 300, y: 490, w: 20, h: 80 },
      { x: 480, y: 490, w: 20, h: 80 }
    ],
    objects: [
      {
        id: 'fireplace',
        x: 365,
        y: 55,
        w: 70,
        h: 60,
        sprite: 'fireplace',
        label: 'Stone Hearth Fireplace',
        isSolid: true,
        interact: (ctx) => {
          ctx.showDialogue("Stone Hearth", [
            "A sturdy stone fireplace crackling with warm golden embers.",
            "Crossed woodsman axes are mounted above the hearth mantle.",
            "Grandpa rests beside the hearth to soothe his aching joints."
          ]);
        }
      },
      {
        id: 'grandpa',
        x: 465,
        y: 80,
        w: 64,
        h: 60,
        sprite: 'grandpa',
        label: 'Grandpa',
        state: 'alive',
        isSolid: true,
        interact: (ctx) => {
          if (ctx.gameState.objectiveStep >= 9) {
            ctx.showDialogue("Protagonist", [
              "Grandpa is sleeping peacefully by the hearth.",
              "I have his iron key. The front storm exit is unlocked."
            ]);
          } else if (ctx.gameState.objectiveStep === 8) {
            if (!ctx.hasItem('key')) {
              ctx.addItem(ITEMS.key);
              ctx.advanceObjective(9);
              ctx.playSfx('objective');
              ctx.showDialogue("Kira", [
                "Grandpa has fallen into a deep, peaceful slumber.",
                "The antique iron key has slipped onto the floor beside his armchair.",
                "I pick it up with trembling hands. The South storm door can now be unlocked."
              ]);
            } else {
              ctx.showDialogue("Kira", [
                "Grandpa is resting calmly. The storm door south is unlocked."
              ]);
            }
          } else if (ctx.gameState.objectiveStep === 7) {
            ctx.showDialogue("Grandpa", [
              "Ah... the restorative soup. The scent brings back sweet memories.",
              "Thank you, Kira. You have cared for me so well.",
              "...",
              "My eyes feel so heavy now... Perhaps... the shadows were never outside after all..."
            ], () => {
              ctx.gameState.flags.soupCooked = true;
              ctx.advanceObjective(8);
              ctx.playSfx('heavy');
              const gObj = ROOMS.livingRoom.objects.find(o => o.id === 'grandpa');
              if (gObj) gObj.sprite = 'grandpa_dead';
            });
          } else if (ctx.gameState.objectiveStep === 0) {
            ctx.showDialogue("Grandpa", [
              "Good morning, Kira.",
              "Before we begin our chores, go to the Master Study through the north door.",
              "Review the talisman geometry on the chalkboard. We must keep our minds disciplined.",
              "I will check in on you shortly."
            ]);
          } else if (ctx.gameState.objectiveStep === 1) {
            ctx.showDialogue("Grandpa", [
              "The cold wind is creeping in, child.",
              "Please check the recipe in the kitchen and brew the restorative soup for my weary bones.",
              "I will wait right here by the fireplace."
            ]);
          } else if (ctx.gameState.objectiveStep === 2) {
            ctx.showDialogue("Grandpa", [
              "Look at the family portrait on the center table.",
              "Never forget who we are before gathering the soup ingredients."
            ]);
          } else {
            ctx.showDialogue("Grandpa", [
              "Hurry with the restorative soup, child.",
              "Solve the talisman locks in the kitchen and archive to gather the ingredients."
            ]);
          }
        }
      },
      {
        id: 'portrait',
        x: 368,
        y: 180,
        w: 64,
        h: 56,
        sprite: 'portrait_table',
        label: 'Family Portrait Table',
        isSolid: true,
        interact: (ctx) => {
          ctx.playSfx('blip');
          if (ctx.showFamilyPortrait) {
            ctx.showFamilyPortrait();
          }
          if (ctx.gameState.objectiveStep === 2) {
            ctx.advanceObjective(3);
            ctx.playSfx('objective');
          }
        }
      },
      {
        id: 'bear_rug',
        x: 355,
        y: 280,
        w: 90,
        h: 70,
        sprite: 'bear_rug',
        label: 'Bear Fur Rug',
        isSolid: false
      },
      {
        id: 'bench_left',
        x: 270,
        y: 280,
        w: 36,
        h: 60,
        sprite: 'bench_v',
        label: 'Wooden Settee',
        isSolid: true
      },
      {
        id: 'bench_right',
        x: 494,
        y: 280,
        w: 36,
        h: 60,
        sprite: 'bench_v',
        label: 'Wooden Settee',
        isSolid: true
      },
      {
        id: 'clock',
        x: 250,
        y: 75,
        w: 44,
        h: 70,
        sprite: 'clock',
        label: 'Grandfather Clock',
        isSolid: true,
        interact: (ctx) => {
          ctx.showDialogue("Grandfather Clock", [
            "A towering pendulum clock carved from mahogany.",
            "Its rhythmic tick-tock fills the quiet room.",
            "The brass face displays conic ellipses charting celestial orbits."
          ]);
        }
      },
      // Non-interactive decorations in Living Room
      {
        id: 'candelabra_side',
        x: 130,
        y: 75,
        w: 40,
        h: 50,
        sprite: 'plant_pot',
        label: 'Candelabra Table',
        isSolid: true
      },
      // Door to Master Study (Accessible from the get-go!)
      {
        id: 'doorToStudy',
        x: 550,
        y: 40,
        w: 120,
        h: 40,
        sprite: 'doorH',
        label: 'Master Study (North)',
        isSolid: true,
        interact: (ctx) => {
          ctx.playSfx('door');
          ctx.changeRoom('studyRoom', 530, 440);
        }
      },
      // Door to Kitchen (West)
      {
        id: 'doorToKitchen',
        x: 70,
        y: 220,
        w: 40,
        h: 160,
        sprite: 'doorV',
        label: 'Kitchen Door (West)',
        isSolid: true,
        interact: (ctx) => {
          if (ctx.gameState.objectiveStep === 0) {
            ctx.playSfx('locked');
            ctx.showToast("Grandpa asked me to review the math talismans in the Master Study first.");
            return;
          }
          ctx.playSfx('door');
          ctx.changeRoom('kitchen', 630, 300);
        }
      },
      // Door to East Archive (East)
      {
        id: 'doorToBackRoom',
        x: 690,
        y: 220,
        w: 40,
        h: 160,
        sprite: 'doorV',
        label: 'East Archive Door (East)',
        isSolid: true,
        interact: (ctx) => {
          const hasVeggies = ctx.hasItem('potato') && ctx.hasItem('carrot') && ctx.hasItem('broth');
          if (ctx.gameState.objectiveStep < 5 && !hasVeggies) {
            ctx.playSfx('locked');
            ctx.showToast("The archive door is locked. Check the kitchen recipe and gather ingredients first.");
            return;
          }
          if (hasVeggies && ctx.gameState.objectiveStep < 5) {
            ctx.advanceObjective(5);
          }
          ctx.playSfx('door');
          ctx.changeRoom('backRoom', 160, 300);
        }
      },
      // Front Storm Exit (South)
      {
        id: 'exitDoor',
        x: 320,
        y: 530,
        w: 160,
        h: 40,
        sprite: 'exitDoor',
        label: 'Front Storm Exit (South)',
        isSolid: true,
        interact: (ctx) => {
          if (ctx.gameState.objectiveStep < 9) {
            ctx.playSfx('locked');
            ctx.showToast("The heavy storm door is deadbolted shut. It requires Grandpa's key.");
            return;
          }
          if (ctx.hasItem('key')) {
            ctx.playSfx('success');
            ctx.showDialogue("Storm Exit", [
              "The iron key glides into the heavy brass lock.",
              "A series of deep mechanical bolts click back one by one.",
              "A cold, refreshing wind drafts in from beyond the threshold."
            ], () => {
              ctx.changeRoom('void', 400, 480);
            });
          } else {
            ctx.playSfx('locked');
            ctx.showToast("I need Grandpa's Iron Key to turn this lock.");
          }
        }
      }
    ]
  },

  studyRoom: {
    id: 'studyRoom',
    name: 'Master Study & Quarters',
    bg: '#050403',
    floorColor: '#362114',
    floorType: 'wood',
    // Non-box shape: Scholar nook on west + sleeping alcove on east
    floorBounds: [
      { x: 110, y: 70, w: 580, h: 440 },
      { x: 440, y: 510, w: 200, h: 45 }
    ],
    walls: [
      { x: 70, y: 40, w: 660, h: 40 },
      { x: 70, y: 510, w: 370, h: 40 },
      { x: 640, y: 510, w: 90, h: 40 },
      { x: 70, y: 40, w: 40, h: 480 },
      { x: 690, y: 40, w: 40, h: 480 }
    ],
    objects: [
      {
        id: 'master_bed',
        x: 520,
        y: 80,
        w: 80,
        h: 90,
        sprite: 'bed',
        label: 'Master Bed with Plaid Quilt',
        isSolid: true,
        interact: (ctx) => {
          ctx.showDialogue("Master Bed", [
            "A sturdy log bed layered with handwoven wool blankets.",
            "A celestial world chart hangs on the wall above."
          ]);
        }
      },
      {
        id: 'study_blackboard',
        x: 230,
        y: 65,
        w: 160,
        h: 70,
        sprite: 'blackboard',
        label: 'Geometry Blackboard: Talisman Study',
        isSolid: true,
        interact: (ctx) => {
          if (ctx.openStudyQuiz) {
            ctx.openStudyQuiz();
          }
        }
      },
      {
        id: 'study_desk',
        x: 130,
        y: 200,
        w: 70,
        h: 80,
        sprite: 'desk',
        label: 'Scholar\'s Manuscript Desk',
        isSolid: true,
        interact: (ctx) => {
          if (ctx.openStudyQuiz) {
            ctx.openStudyQuiz();
          }
        }
      },
      {
        id: 'study_bookshelf',
        x: 130,
        y: 75,
        w: 70,
        h: 110,
        sprite: 'bookshelf',
        label: 'Ancient Geometry Folios',
        isSolid: true,
        interact: (ctx) => {
          ctx.showDialogue("Geometry Library", [
            "Volumes bound in worn leather:",
            "'Treatise on Conics by Apollonius of Perga'",
            "'Analytical Geometry & Coordinate Transforms'",
            "'Grandfather\'s handwritten annotations fill the margins.'"
          ]);
        }
      },
      // Non-interactive decor in Study
      {
        id: 'nightstand',
        x: 610,
        y: 95,
        w: 40,
        h: 40,
        sprite: 'cabinet',
        label: 'Bedside Nightstand',
        isSolid: true
      },
      // Door leading directly back to Grand Parlor (South)
      {
        id: 'doorToLiving',
        x: 440,
        y: 510,
        w: 200,
        h: 40,
        sprite: 'doorH',
        label: 'Back to Grand Parlor (South)',
        isSolid: true,
        interact: (ctx) => {
          ctx.playSfx('door');
          ctx.changeRoom('livingRoom', 610, 130);
        }
      }
    ]
  },

  kitchen: {
    id: 'kitchen',
    name: 'Manor Kitchen',
    bg: '#050403',
    floorColor: '#47433f',
    floorType: 'cobblestone',
    floorBounds: [
      { x: 110, y: 70, w: 580, h: 440 },
      { x: 690, y: 220, w: 40, h: 160 }
    ],
    walls: [
      { x: 70, y: 40, w: 660, h: 40 },
      { x: 70, y: 510, w: 660, h: 40 },
      { x: 70, y: 40, w: 40, h: 480 },
      { x: 690, y: 40, w: 40, h: 180 },
      { x: 690, y: 380, w: 40, h: 140 }
    ],
    objects: [
      {
        id: 'stone_oven',
        x: 130,
        y: 80,
        w: 90,
        h: 80,
        sprite: 'stone_oven',
        label: 'Cobblestone Hearth Oven',
        isSolid: true,
        interact: (ctx) => {
          ctx.showDialogue("Cobblestone Hearth Oven", [
            "A curved stone oven with a heavy steel chimney pipe rising through the roof.",
            "Warm glowing embers burn within."
          ]);
        }
      },
      {
        id: 'pot',
        x: 160,
        y: 125,
        w: 64,
        h: 60,
        sprite: 'pot',
        label: 'Simmering Cooking Kettle',
        isSolid: true,
        interact: (ctx) => {
          if (ctx.gameState.objectiveStep < 6) {
            ctx.showToast("The kettle needs all four ingredients: Potato, Carrot, Broth, and the Midnight Elixir.");
            return;
          }
          if (ctx.gameState.objectiveStep === 6) {
            ctx.playSfx('objective');
            ctx.showDialogue("Cooking Pot", [
              "I add the sliced potatoes, sweet carrots, and rich golden broth.",
              "As it simmers over the hearth fire, I gently pour in the Midnight Elixir.",
              "A sweet, comforting herbal steam rises into the air.",
              "The restorative brew is complete! I should carry it to Grandpa."
            ], () => {
              ctx.advanceObjective(7);
            });
          } else {
            ctx.showToast("The soup is prepared and piping hot in the kettle.");
          }
        }
      },
      {
        id: 'cab1',
        x: 270,
        y: 75,
        w: 64,
        h: 56,
        sprite: 'cabinet',
        label: 'Warded Spice Cabinet',
        locked: true,
        puzzleId: 'p1',
        isSolid: true,
        interact: function(ctx) {
          if (this.locked) {
            ctx.triggerPuzzle('p1', this);
          } else if (!ctx.hasItem('potato')) {
            ctx.addItem(ITEMS.potato);
            ctx.playSfx('objective');
            ctx.showToast("Obtained Harvest Potato!");
            checkIngredientCount(ctx);
          } else {
            ctx.showToast("The spice cabinet is now empty.");
          }
        }
      },
      {
        id: 'recipe',
        x: 370,
        y: 170,
        w: 36,
        h: 36,
        sprite: 'recipe',
        label: 'Restorative Recipe Note',
        isSolid: false,
        interact: (ctx) => {
          ctx.showDialogue("Restorative Recipe", [
            "Ingredients required for Grandfather's restorative soup:",
            "• Harvest Potatoes (from the kitchen spice cabinet)",
            "• Sweet Carrots (from the cellar basement storage)",
            "• Golden Broth (from the cellar basement chest)",
            "• Midnight Slumber Elixir (locked in the study safe)",
            "Note: The containers are protected by algebraic conic wards."
          ], () => {
            if (ctx.gameState.objectiveStep < 4) {
              ctx.advanceObjective(4);
              ctx.playSfx('objective');
            }
          });
        }
      },
      {
        id: 'counter_stools',
        x: 510,
        y: 220,
        w: 48,
        h: 80,
        sprite: 'counter_stools',
        label: 'Kitchen Counter & Stools',
        isSolid: true
      },
      {
        id: 'kitchen_crates',
        x: 125,
        y: 260,
        w: 64,
        h: 48,
        sprite: 'crates_stack',
        label: 'Harvest Sacks & Crates',
        isSolid: true
      },
      {
        id: 'doorToPantry',
        x: 130,
        y: 410,
        w: 70,
        h: 60,
        sprite: 'hatch',
        label: 'Cellar Basement Hatch',
        isSolid: true,
        interact: (ctx) => {
          ctx.playSfx('door');
          ctx.changeRoom('pantry', 400, 450);
        }
      },
      {
        id: 'doorToLiving',
        x: 690,
        y: 220,
        w: 40,
        h: 160,
        sprite: 'doorV',
        label: 'Door to Grand Parlor (East)',
        isSolid: true,
        interact: (ctx) => {
          ctx.playSfx('door');
          ctx.changeRoom('livingRoom', 160, 300);
        }
      }
    ]
  },

  pantry: {
    id: 'pantry',
    name: 'Cellar Basement',
    bg: '#050403',
    floorColor: '#282422',
    floorType: 'cobblestone',
    floorBounds: [
      { x: 110, y: 70, w: 580, h: 440 },
      { x: 280, y: 510, w: 240, h: 45 }
    ],
    walls: [
      { x: 70, y: 40, w: 660, h: 40 },
      { x: 70, y: 510, w: 210, h: 40 },
      { x: 520, y: 510, w: 210, h: 40 },
      { x: 70, y: 40, w: 40, h: 480 },
      { x: 690, y: 40, w: 40, h: 480 }
    ],
    objects: [
      {
        id: 'chest',
        x: 370,
        y: 150,
        w: 64,
        h: 48,
        sprite: 'chest',
        label: 'Iron-Banded Cellar Chest',
        locked: true,
        puzzleId: 'p4',
        isSolid: true,
        interact: function(ctx) {
          if (this.locked) {
            ctx.triggerPuzzle('p4', this);
          } else if (!ctx.hasItem('broth')) {
            ctx.addItem(ITEMS.broth);
            ctx.playSfx('objective');
            ctx.showToast("Obtained Golden Broth!");
            checkIngredientCount(ctx);
          } else {
            ctx.showToast("The iron chest is empty.");
          }
        }
      },
      {
        id: 'crate',
        x: 200,
        y: 270,
        w: 64,
        h: 56,
        sprite: 'cabinet',
        label: 'Vegetable Storage Box',
        locked: true,
        puzzleId: 'p7',
        isSolid: true,
        interact: function(ctx) {
          if (this.locked) {
            ctx.triggerPuzzle('p7', this);
          } else if (!ctx.hasItem('carrot')) {
            ctx.addItem(ITEMS.carrot);
            ctx.playSfx('objective');
            ctx.showToast("Obtained Sweet Carrot!");
            checkIngredientCount(ctx);
          } else {
            ctx.showToast("The vegetable box is empty.");
          }
        }
      },
      {
        id: 'cellar_barrels',
        x: 540,
        y: 270,
        w: 64,
        h: 48,
        sprite: 'crates_stack',
        label: 'Cellar Barrels & Provisions',
        isSolid: true
      },
      {
        id: 'doorToKitchen',
        x: 280,
        y: 510,
        w: 240,
        h: 40,
        sprite: 'stairs_down',
        label: 'Stairs up to Kitchen',
        isSolid: true,
        interact: (ctx) => {
          ctx.playSfx('door');
          ctx.changeRoom('kitchen', 230, 430);
        }
      }
    ]
  },

  backRoom: {
    id: 'backRoom',
    name: 'East Archive Hall',
    bg: '#050403',
    floorColor: '#362114',
    floorType: 'wood',
    floorBounds: [
      { x: 110, y: 70, w: 580, h: 440 },
      { x: 70, y: 220, w: 40, h: 160 }
    ],
    walls: [
      { x: 70, y: 40, w: 660, h: 40 },
      { x: 70, y: 510, w: 660, h: 40 },
      { x: 70, y: 40, w: 40, h: 180 },
      { x: 70, y: 380, w: 40, h: 140 },
      { x: 690, y: 40, w: 40, h: 480 }
    ],
    objects: [
      {
        id: 'bear_rug_alcove',
        x: 490,
        y: 110,
        w: 90,
        h: 70,
        sprite: 'bear_rug',
        label: 'Alcove Bear Rug',
        isSolid: false
      },
      {
        id: 'safe',
        x: 615,
        y: 140,
        w: 64,
        h: 56,
        sprite: 'safe',
        label: 'Steel Archives Safe',
        locked: true,
        puzzleId: 'p9',
        isSolid: true,
        interact: function(ctx) {
          if (this.locked) {
            ctx.triggerPuzzle('p9', this);
          } else if (!ctx.hasItem('essence')) {
            ctx.addItem(ITEMS.essence);
            ctx.playSfx('objective');
            ctx.showDialogue("Midnight Elixir", [
              "You retrieve the Midnight Elixir from the cushioned velvet case.",
              "It glows with faint sapphire luminescence.",
              "This is the final ingredient for the restorative sleep brew.",
              "I can now return to the kitchen to prepare the soup!"
            ], () => {
              if (ctx.gameState.objectiveStep === 5) {
                ctx.advanceObjective(6);
              }
            });
          } else {
            ctx.showToast("The safe is empty.");
          }
        }
      },
      {
        id: 'wall_portrait',
        x: 320,
        y: 65,
        w: 50,
        h: 70,
        sprite: 'portrait_table',
        label: 'Framed Rose Crest',
        isSolid: true
      },
      {
        id: 'archive_crates',
        x: 560,
        y: 410,
        w: 70,
        h: 50,
        sprite: 'crates_stack',
        label: 'Archive Trunks & Crates',
        isSolid: true
      },
      {
        id: 'diary',
        x: 320,
        y: 330,
        w: 36,
        h: 36,
        sprite: 'diary',
        label: 'Torn Journal Page',
        isSolid: false,
        interact: (ctx) => {
          ctx.showDialogue("Journal Excerpt", [
            "November 14th - An excerpt in Mother's handwriting:",
            "'We locked ourselves in this house out of sorrow and grief.'",
            "'There were no monsters in the woods. Only our reluctance to face change.'",
            "'The geometric wards were Grandpa's way of giving us order amidst chaos.'",
            "'Someday, my child will understand and unlock the front doors.'"
          ]);
        }
      },
      {
        id: 'doorToLiving',
        x: 70,
        y: 220,
        w: 40,
        h: 160,
        sprite: 'doorV',
        label: 'Door to Grand Parlor (West)',
        isSolid: true,
        interact: (ctx) => {
          ctx.playSfx('door');
          ctx.changeRoom('livingRoom', 640, 300);
        }
      }
    ]
  },

  void: {
    id: 'void',
    name: 'The Path Beyond',
    bg: '#000000',
    floorColor: '#0a0a0f',
    floorType: 'wood',
    floorBounds: [
      { x: 310, y: 0, w: 180, h: 600 }
    ],
    walls: [
      { x: 0, y: 0, w: 310, h: 600 },
      { x: 490, y: 0, w: 310, h: 600 }
    ],
    objects: [
      {
        id: 'mirror',
        x: 360,
        y: 150,
        w: 80,
        h: 120,
        sprite: 'mirror',
        label: 'Antique Standing Mirror',
        isSolid: true,
        interact: (ctx) => {
          ctx.playSfx('heartbeat');
          ctx.showDialogue("The Mirror", [
            "You gaze deep into the silvered glass.",
            "The mist warps... An eerie distortion ripples across your reflection.",
            "The face in the mirror is smiling..."
          ], () => {
            ctx.gameState.status = 'ENDING';
          });
        }
      }
    ]
  }
};

function checkIngredientCount(ctx: GameContext) {
  const hasPotato = ctx.hasItem('potato');
  const hasCarrot = ctx.hasItem('carrot');
  const hasBroth = ctx.hasItem('broth');

  if (hasPotato && hasCarrot && hasBroth) {
    if (ctx.gameState.objectiveStep <= 4) {
      ctx.advanceObjective(5);
      ctx.playSfx('objective');
      ctx.showDialogue("Kira", [
        "I have gathered the potatoes, carrots, and golden broth!",
        "Now I must search the East Archive Hall for the final ingredient: the Midnight Slumber Elixir."
      ]);
    }
  }
}
