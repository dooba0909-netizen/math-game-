export const PALETTE: Record<string, string | null> = {
  '0': null,                  // Transparent
  '1': '#090909',             // Near black outline
  '2': '#261b16',             // Very dark wood
  '3': '#422c22',             // Dark brown wood
  '4': '#6d4c3d',             // Medium brown wood
  '5': '#966d5b',             // Light wood / Skin tone shadow
  '6': '#cbb09d',             // Skin tone highlight / Pale flesh
  '7': '#7c1313',             // Blood red / Seal glow
  '8': '#b82323',             // Bright scarlet blood
  '9': '#e0d5c1',             // Parchment / Old bone / White paper
  'A': '#454a4f',             // Dark slate / Cold metal
  'B': '#7b838a',             // Light metal / Steel safe
  'C': '#2b382d',             // Chalkboard green
  'D': '#e8a938',             // Amber lantern / Candle fire
  'E': '#f5d47a',             // Warm yellow flame highlight
  'F': '#18241b',             // Very dark moss / Hearth soot
  'G': '#42586b',             // Deep slate blue quilt
  'H': '#9e3424',             // Crimson rug / plaid red
  'I': '#615c56',             // Cobblestone stone grey
  'J': '#362013',             // Bear fur dark brown
  'K': '#e8b835',             // Kira golden yellow sweater & flower
  'L': '#1c1817',             // Kira black pinafore jumper dress
  'M': '#7d5036',             // Kira wavy brown hair
  'N': '#9e6747',             // Kira hair highlight
  'P': '#262e3b',             // Grandpa slate cap
  'Q': '#2d4263',             // Grandpa blue trousers
  'R': '#68717d'              // Grandpa grey wool coat
};

export const SPRITE_MATRICES: Record<string, string[]> = {
  bear_rug: [
    "      1111      ",
    "     1JJJJ1     ",
    "    1JJ33JJ1    ",
    " 1111JJJJJJ1111 ",
    "1JJJJJJJJJJJJJJ1",
    "133JJJJJJJJJJ331",
    " 11JJJJJJJJJJ11 ",
    "  1JJJJJJJJJJ1  ",
    "  1JJJJJJJJJJ1  ",
    "  1JJJJJJJJJJ1  ",
    " 11JJJJJJJJJJ11 ",
    "1JJJJJJJJJJJJJJ1",
    "133JJJ1111JJJ331",
    " 11111    11111 "
  ],

  fireplace: [
    "   1111111111   ",
    "  19B911119B91  ",
    "  1B9B1441B9B1  ",
    " 11111111111111 ",
    "1444444444444441",
    "1IIIIIIIIIIIIII1",
    "1II1111111111II1",
    "1II1111111111II1",
    "1II111EEDD111II1",
    "1II111DDEE111II1",
    "1IIIIIIIIIIIIII1",
    "1111111111111111"
  ],

  bench_v: [
    "111111",
    "144441",
    "143341",
    "143341",
    "143341",
    "143341",
    "143341",
    "143341",
    "143341",
    "143341",
    "144441",
    "12  21",
    "11  11"
  ],

  stone_oven: [
    "     111111     ",
    "   11AAAAAA11   ",
    "   1AABAAAAA1   ",
    "  11AAAAAAAA11  ",
    " 1AAAAAAAAAAAA1 ",
    "1IIIIIIIIIIIIII1",
    "1IIIIIIIIIIIIII1",
    "1II1111111111II1",
    "1II111EEDD111II1",
    "1II111DDEE111II1",
    "1IIIIIIIIIIIIII1",
    "1111111111111111"
  ],

  counter_stools: [
    "11111111",
    "19999991",
    "19999991",
    "14444441",
    "14333341",
    "14444441",
    "11111111",
    " 1DDDD1 ",
    " 144441 ",
    " 12  21 "
  ],

  crates_stack: [
    "  111111111111  ",
    "  144444444441  ",
    "  143144441341  ",
    "  144411114441  ",
    "  143144441341  ",
    "  111111111111  ",
    "1111111111111111",
    "144444411DDDDDD1",
    "143113411DDDDDD1",
    "144114411DDDDDD1",
    "143113411DDDDDD1",
    "1111111111111111"
  ],

  hatch: [
    "1111111111111111",
    "1333333333333331",
    "1333333BB3333331",
    "133333B11B333331",
    "133333B11B333331",
    "1333333BB3333331",
    "1333333333333331",
    "1111111111111111"
  ],

  stairs_down: [
    "1111111111111111",
    "1444444444444441",
    "1111111111111111",
    "1333333333333331",
    "1111111111111111",
    "1222222222222221",
    "1111111111111111"
  ],

  plant_pot: [
    "  1111  ",
    " 1CCCC1 ",
    "1CCCCCC1",
    "1CCCCCC1",
    " 111111 ",
    " 144441 ",
    " 144441 ",
    "  1111  "
  ],
  player_down_0: [
    "   111111   ",
    "  1MMMMMM1  ",
    " 1MMK66MMM1 ",
    " 1MK619619M1",
    " 1MM66666M1 ",
    "  11KKKK11  ",
    " 1LLKKKKLL1 ",
    " 1LLLLLLLL1 ",
    " 1LLLLLLLL1 ",
    " 1KKKKKKKK1 ",
    "  166  1661 ",
    "  1KK  1KK1 ",
    "  122  1221 "
  ],
  player_down_blink: [
    "   111111   ",
    "  1MMMMMM1  ",
    " 1MMK66MMM1 ",
    " 1MK611611M1",
    " 1MM66666M1 ",
    "  11KKKK11  ",
    " 1LLKKKKLL1 ",
    " 1LLLLLLLL1 ",
    " 1LLLLLLLL1 ",
    " 1KKKKKKKK1 ",
    "  166  1661 ",
    "  1KK  1KK1 ",
    "  122  1221 "
  ],
  player_down_1: [
    "   111111   ",
    "  1MMMMMM1  ",
    " 1MMK66MMM1 ",
    " 1MK619619M1",
    " 1MM66666M1 ",
    "  11KKKK11  ",
    " 1LLKKKKLL1 ",
    " 1LLLLLLLL1 ",
    " 1LLLLLLLL1 ",
    " 1KKKKKKKK1 ",
    " 1661  1661 ",
    " 1KK1  1KK1 ",
    " 1221  1221 "
  ],
  player_down_2: [
    "   111111   ",
    "  1MMMMMM1  ",
    " 1MMK66MMM1 ",
    " 1MK619619M1",
    " 1MM66666M1 ",
    "  11KKKK11  ",
    " 1LLKKKKLL1 ",
    " 1LLLLLLLL1 ",
    " 1LLLLLLLL1 ",
    " 1KKKKKKKK1 ",
    "  1661 1661 ",
    "  1KK1 1KK1 ",
    "  1221 1221 "
  ],

  player_up_0: [
    "   111111   ",
    "  1MMMMMM1  ",
    " 1MMMMMMMM1 ",
    " 1MMMMMMMM1 ",
    " 1MMMMMMMM1 ",
    "  11KKKK11  ",
    " 1LLKKKKLL1 ",
    " 1LLLLLLLL1 ",
    " 1LLLLLLLL1 ",
    " 1KKKKKKKK1 ",
    "  166  1661 ",
    "  1KK  1KK1 ",
    "  122  1221 "
  ],
  player_up_1: [
    "   111111   ",
    "  1MMMMMM1  ",
    " 1MMMMMMMM1 ",
    " 1MMMMMMMM1 ",
    " 1MMMMMMMM1 ",
    "  11KKKK11  ",
    " 1LLKKKKLL1 ",
    " 1LLLLLLLL1 ",
    " 1LLLLLLLL1 ",
    " 1KKKKKKKK1 ",
    " 1661  1661 ",
    " 1KK1  1KK1 ",
    " 1221  1221 "
  ],
  player_up_2: [
    "   111111   ",
    "  1MMMMMM1  ",
    " 1MMMMMMMM1 ",
    " 1MMMMMMMM1 ",
    " 1MMMMMMMM1 ",
    "  11KKKK11  ",
    " 1LLKKKKLL1 ",
    " 1LLLLLLLL1 ",
    " 1LLLLLLLL1 ",
    " 1KKKKKKKK1 ",
    "  1661 1661 ",
    "  1KK1 1KK1 ",
    "  1221 1221 "
  ],

  player_left_0: [
    "   111111   ",
    "  1MMMMMM1  ",
    " 1MMM666M1  ",
    " 1MMM196M1  ",
    " 1MM6666M1  ",
    "  11KKKK1   ",
    "  1LLKKLL1  ",
    "  1LLLLLL1  ",
    "  1LLLLLL1  ",
    "  1KKKKKK1  ",
    "   166  161 ",
    "   1KK  1K1 ",
    "   122  121 "
  ],
  player_left_1: [
    "   111111   ",
    "  1MMMMMM1  ",
    " 1MMM666M1  ",
    " 1MMM196M1  ",
    " 1MM6666M1  ",
    "  11KKKK1   ",
    "  1LLKKLL1  ",
    "  1LLLLLL1  ",
    "  1LLLLLL1  ",
    "  1KKKKKK1  ",
    "  1661 1661 ",
    "  1KK1 1KK1 ",
    "  1221 1221 "
  ],

  player_right_0: [
    "   111111   ",
    "  1MMMMMM1  ",
    "  1MK666MM1 ",
    "  1MK196MM1 ",
    "  1MK666MM1 ",
    "   1KKKK11  ",
    "  1LLKKLL1  ",
    "  1LLLLLL1  ",
    "  1LLLLLL1  ",
    "  1KKKKKK1  ",
    " 161  1661  ",
    " 1K1  1KK1  ",
    " 121  1221  "
  ],
  player_right_1: [
    "   111111   ",
    "  1MMMMMM1  ",
    "  1MK666MM1 ",
    "  1MK196MM1 ",
    "  1MK666MM1 ",
    "   1KKKK11  ",
    "  1LLKKLL1  ",
    "  1LLLLLL1  ",
    "  1LLLLLL1  ",
    "  1KKKKKK1  ",
    "  1661 1661 ",
    "  1KK1 1KK1 ",
    "  1221 1221 "
  ],

  grandpa: [
    "    11PPPP11    ",
    "   1PPPPPPPP1   ",
    "  199666666991  ",
    "  199196619991  ",
    "  199661166991  ",
    "   1966666691   ",
    "  11RRRRRRRR11  ",
    " 1RRR11RR11RRR1 ",
    " 1RRR11RR11RRR1B",
    " 1RRRRRRRRRRRR1B",
    " 111QQQQQQ11111B",
    "  11QQQQQQ11  1B",
    "  1QQQQQQQQ1  1B",
    "  1221  1221 1BB1"
  ],

  grandpa_blink: [
    "    11PPPP11    ",
    "   1PPPPPPPP1   ",
    "  199666666991  ",
    "  199116611991  ",
    "  199661166991  ",
    "   1966666691   ",
    "  11RRRRRRRR11  ",
    " 1RRR11RR11RRR1 ",
    " 1RRR11RR11RRR1B",
    " 1RRRRRRRRRRRR1B",
    " 111QQQQQQ11111B",
    "  11QQQQQQ11  1B",
    "  1QQQQQQQQ1  1B",
    "  1221  1221 1BB1"
  ],

  grandpa_walk_0: [
    "    11PPPP11    ",
    "   1PPPPPPPP1   ",
    "  199666666991  ",
    "  199196619991  ",
    "  199661166991  ",
    "   1966666691   ",
    "  11RRRRRRRR11  ",
    " 1RRR11RR11RRR1 ",
    " 1RRR11RR11RRR1B",
    " 1RRRRRRRRRRRR1B",
    " 111QQQQQQ11111B",
    "  11QQQQQQ11  1B",
    "  1QQQQQQQQ1  1B",
    "  1221  1221 1BB1"
  ],

  grandpa_walk_1: [
    "    11PPPP11    ",
    "   1PPPPPPPP1   ",
    "  199666666991  ",
    "  199196619991  ",
    "  199661166991  ",
    "   1966666691   ",
    "  11RRRRRRRR11  ",
    " 1RRR11RR11RRR1 ",
    " 1RRR11RR11RRR1 ",
    " 1RRRRRRRRRRRR1B",
    " 111QQ1QQQ11111B",
    "  11Q1QQQQ11  1B",
    "  1221 1221   1B",
    "             1BB1"
  ],

  grandpa_dead: [
    "    11PPPP11    ",
    "   1PPPPPPPP1   ",
    "  199666666991  ",
    "  199116611991  ",
    "  199661166991  ",
    "   1966666691   ",
    "  11RRRRRRRR11  ",
    " 1RRR11RR11RRR1 ",
    " 1RRR11RR11RRR1 ",
    " 1RRRRRRRRRRRR1 ",
    " 111QQQQQQ11111 ",
    "  11QQQQQQ11    ",
    " 1EEDD1  111    ",
    " 1DDDE1  1BB1   "
  ],

  portrait_table: [
    "                ",
    "    11111111    ",
    "   1499999941   ",
    "   1491771941   ",
    "   1497117941   ",
    "   1499999941   ",
    "    11111111    ",
    "1111111111111111",
    "1444444444444441",
    "1333333333333331",
    "1222222222222221",
    "121          121",
    "121          121",
    "111          111"
  ],

  cabinet: [
    "1111111111111111",
    "1444444444444441",
    "1433331111333341",
    "1433331111333341",
    "1433331111333341",
    "1111111111111111",
    "1444444444444441",
    "1433331111333341",
    "1433BB1111BB3341",
    "1433331111333341",
    "1433331111333341",
    "1111111111111111",
    "121          121",
    "111          111"
  ],

  pot: [
    "                ",
    "     11  11     ",
    "    1DD11DD1    ",
    "    1EE11EE1    ",
    "    11111111    ",
    "   1AAAAAAAA1   ",
    "  1AAAAAAAAAA1  ",
    " 1AAAAAAAAAAAA1 ",
    " 1AAAAAAAAAAAA1 ",
    " 1AAAAAAAAAAAA1 ",
    "  1AAAAAAAAAA1  ",
    "   1111111111   ",
    "   1DD1  1DD1   ",
    "  1EEDD11EEDD1  "
  ],

  chest: [
    "                ",
    "                ",
    "   1111111111   ",
    "  144444444441  ",
    " 14BB444444BB41 ",
    "144BB444444BB441",
    "1111111111111111",
    "144BB41BB14BB441",
    "144BB41BB14BB441",
    "1444441111444441",
    "1333333333333331",
    "1111111111111111"
  ],

  safe: [
    "1111111111111111",
    "1AAAAAAAAAAAAAA1",
    "1ABBBAAAAAABBBA1",
    "1ABBAAA11AAABBA1",
    "1AAAAA1111AAAAA1",
    "1AAAA11BB11AAAA1",
    "1AAAA11BB11AAAA1",
    "1AAAAA1111AAAAA1",
    "1ABBAAA11AAABBA1",
    "1ABBBAAAAAABBBA1",
    "1AAAAAAAAAAAAAA1",
    "1111111111111111"
  ],

  doorV: [
    "1111",
    "1331",
    "1331",
    "1331",
    "1331",
    "13B1",
    "1331",
    "1331",
    "1331",
    "1331",
    "1331",
    "1331",
    "1331",
    "1331",
    "1331",
    "1111"
  ],

  doorH: [
    "1111111111111111",
    "1333333333333331",
    "13333333B3333331",
    "1111111111111111"
  ],

  exitDoor: [
    "1111111111111111",
    "1AAA11AAAA11AAA1",
    "1AAB11A77A11BAA1",
    "1AAB11A77A11BAA1",
    "1111111111111111",
    "1AAA11AAAA11AAA1",
    "1AAB111BB111BAA1",
    "1AAA111BB111AAA1",
    "1111111111111111"
  ],

  ward: [
    "    17788771    ",
    "   1788  8871   ",
    "  178  88  871  ",
    " 178 887788 871 ",
    " 18 87888878 81 ",
    " 18 87888878 81 ",
    " 178 887788 871 ",
    "  178  88  871  ",
    "   1788  8871   ",
    "    17788771    "
  ],

  blackboard: [
    "11111111111111111111",
    "14444444444444444441",
    "14CCCCCCCCCCCCCCCC41",
    "14C999C999C9999CCC41",
    "14C9CCC9C9C9CCCCCC41",
    "14C999C999C999CCCC41",
    "14CCCC9999CCCCCCCC41",
    "14CCC9CCCC9CCCCCCC41",
    "14CC9CCCCCC9CCCCCC41",
    "14CCC9CCCC9CCCCCCC41",
    "14CCCC9999CCCCCCCC41",
    "14CCCCCCCCCCCCCCCC41",
    "14444444444444444441",
    "11111111111111111111"
  ],

  desk: [
    "1111111111111111",
    "1444444444444441",
    "14994441ED144441",
    "1499444111144441",
    "1333333333333331",
    "13BB33333333BB31",
    "1333333333333331",
    "121          121",
    "121          121",
    "111          111"
  ],

  bookshelf: [
    "1111111111111111",
    "1444444444444441",
    "1479837983798341",
    "1479837983798341",
    "1111111111111111",
    "1444444444444441",
    "1439783978397841",
    "1439783978397841",
    "1111111111111111",
    "1444444444444441",
    "1487398739873941",
    "1487398739873941",
    "1111111111111111",
    "121          121",
    "111          111"
  ],

  bed: [
    "1111111111111111",
    "1B999999999999B1",
    "1B999999999999B1",
    "1B777777777777B1",
    "1B777777777777B1",
    "1B777777777777B1",
    "1B777777777777B1",
    "1B777777777777B1",
    "1B777777777777B1",
    "1B777777777777B1",
    "1B1          1B1",
    "111          111"
  ],

  mirror: [
    "  111111111111  ",
    " 14444444444441 ",
    "14AAAAAAAAAAAA41",
    "14A99AAAAAAAAA41",
    "14AA99AAAAAAAA41",
    "14AAA99AAAAAAA41",
    "14AAAA99AAAAAA41",
    "14AAAAA99AAAAA41",
    "14AAAAAA99AAAA41",
    "14AAAAAAA99AAA41",
    "14AAAAAAAA99AA41",
    "14AAAAAAAAA99A41",
    "14AAAAAAAAAAAA41",
    " 14444444444441 ",
    " 131        131 ",
    " 111        111 "
  ],

  recipe: [
    "  111111  ",
    " 19999991 ",
    " 19111991 ",
    " 19999991 ",
    " 19111191 ",
    " 19999991 ",
    "  111111  "
  ],

  diary: [
    "  111111  ",
    " 19999991 ",
    " 19881991 ",
    " 19888991 ",
    " 19111191 ",
    " 19999991 ",
    "  111111  "
  ],

  clock: [
    "  111111  ",
    " 14444441 ",
    " 14999941 ",
    " 14911941 ",
    " 14999941 ",
    " 14444441 ",
    " 133DD331 ",
    " 13333331 ",
    " 133DD331 ",
    " 13333331 ",
    " 11111111 "
  ]
};

const spriteCache: Record<string, HTMLCanvasElement> = {};

export function renderSprite(name: string, pixelSize: number = 4): HTMLCanvasElement | null {
  const cacheKey = `${name}_${pixelSize}`;
  if (spriteCache[cacheKey]) {
    return spriteCache[cacheKey];
  }

  const matrix = SPRITE_MATRICES[name];
  if (!matrix) return null;

  const rows = matrix.length;
  const cols = matrix[0].length;
  const canvas = document.createElement('canvas');
  canvas.width = cols * pixelSize;
  canvas.height = rows * pixelSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const code = matrix[y][x];
      const color = PALETTE[code];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }
  }

  spriteCache[cacheKey] = canvas;
  return canvas;
}

export function initSpriteCache() {
  Object.keys(SPRITE_MATRICES).forEach((key) => {
    renderSprite(key, 3);
    renderSprite(key, 4);
    renderSprite(key, 5);
  });
}
