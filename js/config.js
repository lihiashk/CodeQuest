/**
 * config.js — Game constants and configuration
 *
 * Contains command definitions, avatar options, world themes,
 * and other static configuration that doesn't change at runtime.
 */

/** Direction keys used for filtering */
const DIR_KEYS = ['up', 'down', 'right', 'left'];

/**
 * Command definitions
 * Screen-relative — no "facing direction" state.
 * @type {Object.<string, {label: string, e: string, dr?: number, dc?: number}>}
 */
const CMD = {
  up:    { label: 'למעלה',   e: '⬆️', dr: -1, dc:  0 },
  down:  { label: 'למטה',    e: '⬇️', dr: +1, dc:  0 },
  right: { label: 'ימינה',   e: '➡️', dr:  0, dc: +1 },
  left:  { label: 'שמאלה',  e: '⬅️', dr:  0, dc: -1 },
  loop:  { label: 'לולאה',   e: '🔁' },
  func:  { label: 'פונקציה', e: '🪄' },
  if:    { label: 'אם...',   e: '❓' },
};

/** Available avatar emojis for profile creation */
const AVATARS = [
  '🧙‍♂️', '🧙‍♀️', '🦸', '🦸‍♀️', '🐱', '🐶',
  '🦊', '🐸', '🐼', '🦄', '🤖', '👾',
];

/**
 * World definitions for the world map.
 * Each world groups a set of level indices with visual theming.
 * @type {Array<{name: string, emoji: string, lvs: number[], bg: string, accent: string, shadow: string}>}
 */
const WORLDS = [
  {
    name: 'יער הקסם',
    emoji: '🌲',
    lvs: [0, 1, 2, 3, 4],
    bg: 'linear-gradient(160deg,#14421a,#0d2e12)',
    accent: '#4ecb71',
    shadow: 'rgba(78,203,113,.35)',
  },
  {
    name: 'הר הלולאות',
    emoji: '⛰️',
    lvs: [5, 6, 7, 8, 9],
    bg: 'linear-gradient(160deg,#2a2235,#1a1428)',
    accent: '#b87dff',
    shadow: 'rgba(184,125,255,.35)',
  },
  {
    name: 'מבצר הקסמים',
    emoji: '🏰',
    lvs: [10, 11, 12, 13, 14],
    bg: 'linear-gradient(160deg,#1a2a4a,#0e1830)',
    accent: '#4d96ff',
    shadow: 'rgba(77,150,255,.35)',
  },
  {
    name: 'הר הגעש',
    emoji: '🌋',
    lvs: [15, 16, 17, 18, 19, 20],
    bg: 'linear-gradient(160deg,#3d1500,#280d00)',
    accent: '#ff7c40',
    shadow: 'rgba(255,120,60,.35)',
  },
  {
    name: 'חלל הקוד',
    emoji: '🚀',
    lvs: [21, 22, 23, 24, 25, 26],
    bg: 'linear-gradient(160deg,#050520,#0a0a30)',
    accent: '#00e5ff',
    shadow: 'rgba(0,229,255,.35)',
  },
];

/**
 * Map background themes keyed by world emoji.
 * Used to set #map-wrap background and CSS class during gameplay.
 * @type {Object.<string, {bg: string, cls: string}>}
 */
const MAP_BACKGROUNDS = {
  '🌲': { bg: 'linear-gradient(180deg,#1c3a5c 0%,#2a5e2e 55%,#1d4a20 100%)', cls: 'world-forest' },
  '⛰️': { bg: 'linear-gradient(180deg,#2a2a3e 0%,#5a5060 40%,#8a7878 100%)', cls: 'world-mountain' },
  '🏰': { bg: 'linear-gradient(180deg,#1a1a2e 0%,#2a1a3e 50%,#1e1428 100%)', cls: 'world-castle' },
  '🌋': { bg: 'linear-gradient(180deg,#2e1000 0%,#6b2800 45%,#3a1500 100%)', cls: 'world-volcano' },
  '🚀': { bg: 'linear-gradient(180deg,#050520 0%,#0a1040 50%,#0d1a5e 100%)', cls: 'world-space' },
};

/**
 * Concept badge color schemes for the top bar.
 * @type {Object.<string, {bg: string, border: string, text: string}>}
 */
const CONCEPT_COLORS = {
  'לולאה':     { bg: 'rgba(184,125,255,.2)', border: 'rgba(184,125,255,.4)', text: '#d0a0ff' },
  'פונקציה':   { bg: 'rgba(255,100,100,.18)', border: 'rgba(255,100,100,.35)', text: '#ffaaaa' },
  'שילוב':     { bg: 'rgba(0,200,255,.15)', border: 'rgba(0,200,255,.3)', text: '#80e8ff' },
  'אריחי קסם': { bg: 'rgba(77,150,255,.18)', border: 'rgba(77,150,255,.4)', text: '#90c8ff' },
};

/**
 * Concept badge labels for the top bar.
 * @type {Object.<string, string>}
 */
const CONCEPT_LABELS = {
  'רצף':       '📋 רצף',
  'לולאה':     '🔁 לולאות!',
  'תנאי':      '🤔 תנאי',
  'פונקציה':   '🪄 פונקציות!',
  'שילוב':     '🚀 שילוב פקודות',
};

/** Direction label map for tile rules display */
const CMD_LABELS = {
  up:    'למעלה ⬆️',
  down:  'למטה ⬇️',
  right: 'ימינה ➡️',
  left:  'שמאלה ⬅️',
};

/** Grid cell type to CSS class mapping */
const CELL_TYPES = { g: 'grass', p: 'path', W: 'wall', X: 'goal' };

/** Confetti color palette */
const CONFETTI_COLORS = [
  '#FFD93D', '#4ecb71', '#4D96FF', '#FF6B6B', '#C77DFF',
  '#FF9A00', '#ff77b5', '#00e5ff', '#ffe066',
];

/** Win screen messages (randomly chosen) */
const WIN_MESSAGES = [
  'איזה כיף! הצלחת! 🧙‍♂️',
  'פתרת את השלב בהצלחה! 🎉',
  'עבודה מדהימה! ✨',
  'אלוף אמיתי! 🏆',
];

/** World class names for removal during theme switching */
const WORLD_CLASSES = [
  'world-forest', 'world-mountain', 'world-castle',
  'world-volcano', 'world-space',
];
