/**
 * worldmap.js — World map rendering and level launching
 */

/**
 * Show the world map screen with profile info, stats, and level buttons.
 */
function showWorldMap() {
    showScreen('screen-worldmap');
    const p = loadProfiles().find((p) => p.id === G.profileId);
    if (!p) return showProfiles();

    // Header
    $('wm-profile-info').innerHTML = `
    <div class="wm-avatar">${p.avatar}</div>
    <div>
      <div class="wm-name">${p.name}</div>
      <div class="wm-coins">🪙 ${(p.coins || 0).toLocaleString()} מטבעות</div>
    </div>`;

    // Stats
    const totalStars = Object.values(p.stars || {}).reduce((a, b) => a + b, 0);
    const maxStars = LEVELS.length * 3;
    const lvReached = Math.min((p.lv || 0) + 1, LEVELS.length);
    const doneCount = Object.keys(p.stars || {}).length;

    $('wm-stats').innerHTML = `
    <div class="wm-stat"><div class="wm-stat-n">${lvReached}</div><div class="wm-stat-l">שלב נוכחי</div></div>
    <div class="wm-stat"><div class="wm-stat-n">⭐ ${totalStars}/${maxStars}</div><div class="wm-stat-l">כוכבים</div></div>
    <div class="wm-stat"><div class="wm-stat-n">${doneCount}/${LEVELS.length}</div><div class="wm-stat-l">שלבים הושלמו</div></div>`;

    // Worlds
    const container = $('wm-worlds');
    container.innerHTML = '';
    const unlockedUpTo = p.lv || 0;

    WORLDS.forEach((world, wi) => {
        const doneLvs = world.lvs.filter((i) => p.stars && p.stars[String(i)]);
        const allDone = doneLvs.length === world.lvs.length;
        const isLocked = world.lvs.every((i) => i > unlockedUpTo);
        const progressClass = allDone ? 'done-all' : isLocked ? 'locked' : 'in-progress';
        const progressTxt = allDone
            ? '✅ הושלם!'
            : isLocked
                ? '🔒 נעול עדיין'
                : `${doneLvs.length}/${world.lvs.length} שלבים`;

        const div = document.createElement('div');
        div.className = 'wm-world';
        div.style.cssText = `background:${world.bg}; animation-delay:${wi * 0.07}s`;
        div.style.borderColor = isLocked
            ? 'rgba(255,255,255,.06)'
            : world.accent.replace(')', ', .4)').replace('rgb', 'rgba');
        div.style.boxShadow = isLocked
            ? '0 4px 16px rgba(0,0,0,.3)'
            : `0 6px 24px ${world.shadow}`;

        div.innerHTML = `
      <div class="wm-world-header" data-emoji="${world.emoji}"
           style="background:${isLocked ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.15)'}">
        <div class="wm-world-icon">${world.emoji}</div>
        <div class="wm-world-name" style="color:${isLocked ? 'rgba(255,255,255,.35)' : world.accent}">${world.name}</div>
        <div class="wm-world-progress ${progressClass}">${progressTxt}</div>
      </div>
      <div class="wm-levels"></div>`;

        container.appendChild(div);

        const lvContainer = div.querySelector('.wm-levels');
        world.lvs.forEach((i, li) => {
            const ldata = LEVELS[i];
            const isLvLocked = i > unlockedUpTo;
            const isDone = !!(p.stars && p.stars[String(i)]);
            const isCurrent = i === unlockedUpTo && !isDone;
            const stars = p.stars?.[String(i)] || 0;

            const btn = document.createElement('div');
            btn.className = 'wm-level ' + (isLvLocked ? 'locked' : isDone ? 'done' : isCurrent ? 'current' : 'available');
            btn.style.animationDelay = `${wi * 0.07 + li * 0.06}s`;

            if (isDone || isCurrent) {
                btn.style.borderColor = world.accent.replace(')', ', .6)').replace('rgb', 'rgba');
                if (isCurrent) {
                    btn.style.background = `linear-gradient(145deg,${world.accent}88,${world.accent}44)`;
                }
            }

            btn.innerHTML = isLvLocked
                ? '<div class="wm-level-lock">🔒</div>'
                : `<div class="wm-level-n">${ldata.id}</div>
           <div class="wm-level-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>`;

            if (!isLvLocked) {
                btn.addEventListener('click', () => startLevel(i));
            }
            lvContainer.appendChild(btn);
        });
    });
}

/**
 * Start a level: hide screens and load the level.
 * @param {number} idx - Index in LEVELS array
 */
function startLevel(idx) {
    showScreen(null);
    G.lv = idx;
    G.coins = loadProfiles().find((p) => p.id === G.profileId)?.coins || 0;

    // Animate game UI entrance
    const els = [$('topbar'), $('game-area')];
    els.forEach((el, i) => {
        if (!el) return;
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = `gameElIn .4s cubic-bezier(.34,1.56,.64,1) ${i * 0.07}s both`;
    });

    loadLevel(idx);
}
