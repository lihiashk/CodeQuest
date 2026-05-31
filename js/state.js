/**
 * state.js — Global game state and utility helpers
 */

/**
 * Global mutable game state.
 * All modules read/write this shared object.
 */
const G = {
    profileId: null,
    lv: 0,
    coins: 0,
    seq: [],
    running: false,
    row: 0,
    col: 0,
    collected: false,
    bonusCollected: false,
    attempts: 0,
    /** Cell size in pixels (computed dynamically) */
    CS: 70,
    /** Function definition body — array of direction keys */
    funcDef: [],
    /** Resolved grid state during execution (copy of level grid) */
    resolvedGrid: null,
    /** Player's chosen avatar emoji */
    avatar: '🧙‍♂️',
};

/* ── Utility helpers ── */

/**
 * Shorthand for document.getElementById.
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
const $ = (id) => document.getElementById(id);

/**
 * Returns the current level data from LEVELS.
 * @returns {Object} Current level object
 */
const lv = () => LEVELS[G.lv];

/**
 * Returns a promise that resolves after `ms` milliseconds.
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
