/**
 * storage.js — Profile persistence via localStorage
 *
 * Stores profiles under 'cq_profiles' and active profile ID under 'cq_active'.
 * Profile shape: { id, name, avatar, lv, stars: {}, coins }
 */

/**
 * Load all profiles from localStorage.
 * @returns {Array<Object>} Array of profile objects
 */
function loadProfiles() {
    return JSON.parse(localStorage.getItem('cq_profiles') || '[]');
}

/**
 * Save profiles array to localStorage.
 * @param {Array<Object>} profiles
 */
function saveProfiles(profiles) {
    localStorage.setItem('cq_profiles', JSON.stringify(profiles));
}

/**
 * Get the currently active profile, or null if none set.
 * @returns {Object|null}
 */
function activeProfile() {
    const id = localStorage.getItem('cq_active');
    return loadProfiles().find((p) => p.id === id) || null;
}

/**
 * Save the current level and coins for the active profile.
 * Called periodically during gameplay.
 */
function saveProgress() {
    const profiles = loadProfiles();
    const idx = profiles.findIndex((p) => p.id === G.profileId);
    if (idx < 0) return;

    profiles[idx].lv = G.lv;
    profiles[idx].coins = G.coins;
    if (!profiles[idx].stars) profiles[idx].stars = {};

    saveProfiles(profiles);
}

/**
 * Save star rating for a specific level and unlock the next level.
 * Only overwrites if the new star count is higher than existing.
 * @param {number} lvIdx - Level index in LEVELS array
 * @param {number} stars - Stars earned (1-3)
 */
function saveLevelStars(lvIdx, stars) {
    const profiles = loadProfiles();
    const idx = profiles.findIndex((p) => p.id === G.profileId);
    if (idx < 0) return;

    if (!profiles[idx].stars) profiles[idx].stars = {};

    const key = String(lvIdx);
    profiles[idx].stars[key] = Math.max(profiles[idx].stars[key] || 0, stars);
    profiles[idx].lv = Math.max(profiles[idx].lv || 0, lvIdx + 1);
    profiles[idx].coins = G.coins;

    saveProfiles(profiles);
}
