/**
 * analytics.js — Fire-and-forget analytics layer over Firestore
 *
 * All functions are safe to call whether or not Firebase is initialized.
 * None of them block the game — all writes are async with no await.
 */

/* ── Session tracking ── */

/** Timestamp when the current session started */
let _sessionStart = null;

/** Start tracking a play session */
function trackSessionStart() {
    _sessionStart = Date.now();
    trackEvent('session_start', null, {});
}

/** End the session and update total play time */
function trackSessionEnd() {
    if (!_sessionStart) return;
    const durationSec = Math.round((Date.now() - _sessionStart) / 1000);
    trackEvent('session_end', null, { durationSec });
    _sessionStart = null;
}

/* ── Level tracking state ── */

/** Per-level start timestamp for measuring time spent */
let _levelStartTime = null;

/** Record when a level starts (for time tracking) */
function trackLevelStart(levelId) {
    _levelStartTime = Date.now();
    trackEvent('level_start', levelId, {});
}

/**
 * Record a level completion — syncs both the event and the player/level stats.
 * @param {number} levelId - Level number (1-based)
 * @param {number} stars - Stars earned (1-3)
 * @param {number} moves - Number of commands used
 * @param {boolean} hintUsed - Whether hint was shown during this level
 */
function trackLevelComplete(levelId, stars, moves, hintUsed) {
    const timeSec = _levelStartTime
        ? Math.round((Date.now() - _levelStartTime) / 1000)
        : 0;

    trackEvent('level_complete', levelId, { stars, moves, timeSec, hintUsed });

    // Sync per-level stats subcollection
    syncLevelStats(G.profileId, levelId, {
        stars,
        bestMoves: moves,
        totalTime: timeSec,
        hintUsed,
    });

    // Sync top-level player doc
    syncPlayerStats();

    _levelStartTime = null;
}

/**
 * Record a failed attempt.
 * @param {number} levelId - Level number
 * @param {number} moves - Commands used
 * @param {string} reason - 'wall' | 'missed_collect'
 */
function trackLevelFail(levelId, moves, reason) {
    trackEvent('level_fail', levelId, { moves, reason });
}

/** Record when the player asks for a hint */
function trackHintUsed(levelId) {
    trackEvent('hint_used', levelId, {});
}

/* ── Firestore write helpers ── */

/**
 * Write a timestamped event to the `events` collection.
 * Fire-and-forget — never blocks the game.
 */
function trackEvent(type, levelId, meta) {
    if (!firebaseReady || !db) return;

    const doc = {
        playerId: G.profileId || 'unknown',
        playerName: _getPlayerName(),
        type,
        levelId,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        meta: meta || {},
    };

    db.collection('events').add(doc).catch((err) => {
        console.warn('[CQ Analytics] Event write failed:', err.message);
    });
}

/**
 * Upsert the player's top-level document with latest stats.
 */
function syncPlayerStats() {
    if (!firebaseReady || !db || !G.profileId) return;

    const p = loadProfiles().find((pr) => pr.id === G.profileId);
    if (!p) return;

    const totalStars = Object.values(p.stars || {}).reduce((a, b) => a + b, 0);

    const doc = {
        name: p.name,
        avatar: p.avatar,
        currentLevel: (p.lv || 0) + 1,
        totalCoins: p.coins || 0,
        totalStars,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
    };

    db.collection('players').doc(G.profileId).set(doc, { merge: true }).catch((err) => {
        console.warn('[CQ Analytics] Player sync failed:', err.message);
    });
}

/**
 * Upsert a player's per-level stats sub-document.
 * Merges smartly: keeps best stars, lowest moves, accumulates time & attempts.
 */
function syncLevelStats(playerId, levelId, data) {
    if (!firebaseReady || !db || !playerId) return;

    const ref = db.collection('players').doc(playerId)
        .collection('levels').doc(String(levelId));

    ref.get().then((snap) => {
        const existing = snap.exists ? snap.data() : {};
        const merged = {
            stars: Math.max(existing.stars || 0, data.stars || 0),
            attempts: (existing.attempts || 0) + 1,
            completed: true,
            firstCompletedAt: existing.firstCompletedAt || firebase.firestore.FieldValue.serverTimestamp(),
            bestMoves: Math.min(existing.bestMoves || 999, data.bestMoves || 999),
            totalTime: (existing.totalTime || 0) + (data.totalTime || 0),
            hintUsed: existing.hintUsed || data.hintUsed || false,
        };
        return ref.set(merged, { merge: true });
    }).catch((err) => {
        console.warn('[CQ Analytics] Level stats sync failed:', err.message);
    });
}

/**
 * Create a new player document in Firestore.
 * @param {Object} profile - Profile object with id, name, avatar
 */
function createPlayerDoc(profile) {
    if (!firebaseReady || !db) return;

    db.collection('players').doc(profile.id).set({
        name: profile.name,
        avatar: profile.avatar,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        currentLevel: 1,
        totalCoins: 0,
        totalStars: 0,
        totalPlayTime: 0,
    }).catch((err) => {
        console.warn('[CQ Analytics] Player create failed:', err.message);
    });
}

/** Helper: get current player name from localStorage */
function _getPlayerName() {
    const p = loadProfiles().find((pr) => pr.id === G.profileId);
    return p ? p.name : 'unknown';
}
