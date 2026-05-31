/**
 * screens.js — Screen transitions and profile management screens
 */

/** Tracks the previously shown screen for transition direction */
let _prevScreen = null;

/**
 * Show a screen overlay or the game view.
 * Handles slide transitions between screens.
 * @param {string|null} id - Screen element ID, or null to show game view
 */
function showScreen(id) {
    const screens = ['screen-profiles', 'screen-new-profile', 'screen-worldmap'];
    const order = { 'screen-profiles': 0, 'screen-new-profile': 1, 'screen-worldmap': 2, null: 3 };
    const fromIdx = order[_prevScreen] ?? 0;
    const toIdx = order[id] ?? 3;
    const dir = toIdx >= fromIdx ? 1 : -1;

    screens.forEach((s) => {
        const el = $(s);
        const isTarget = s === id;

        if (isTarget) {
            el.style.transition = 'none';
            el.style.transform = `translateX(${dir * 40}px)`;
            el.style.opacity = '0';
            el.classList.remove('off');
            void el.offsetWidth; // force reflow
            el.style.transition = 'opacity .3s cubic-bezier(.4,0,.2,1), transform .3s cubic-bezier(.4,0,.2,1), visibility .3s';
            el.style.transform = 'translateX(0)';
            el.style.opacity = '1';
        } else {
            el.classList.add('off');
            el.style.transform = '';
            el.style.opacity = '';
        }
    });

    const playing = id === null;
    $('topbar').style.display = playing ? '' : 'none';
    $('game-area').style.display = playing ? '' : 'none';
    _prevScreen = id;
}

/* ── Profile Select Screen ── */

/** Currently selected avatar for new profile */
let newProfileAvatar = AVATARS[0];

/**
 * Show the profile selection screen.
 * Renders all saved profiles as cards.
 */
function showProfiles() {
    showScreen('screen-profiles');
    const profiles = loadProfiles();
    const grid = $('profile-grid');
    grid.innerHTML = '';

    profiles.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'profile-card';
        const lvReached = Math.min((p.lv || 0) + 1, LEVELS.length);
        const totalStars = Object.values(p.stars || {}).reduce((a, b) => a + b, 0);

        card.innerHTML = `
      <span class="profile-del" data-profile-id="${p.id}">✕</span>
      <div class="profile-avatar">${p.avatar}</div>
      <div class="profile-name">${p.name}</div>
      <div class="profile-progress">שלב ${lvReached}/${LEVELS.length}</div>
      <div class="profile-progress">⭐ ${totalStars}</div>`;

        card.style.animation = `wcardIn .35s cubic-bezier(.34,1.56,.64,1) ${grid.children.length * 0.07}s both`;
        card.addEventListener('click', () => selectProfile(p.id));

        // Wire up delete button
        const delBtn = card.querySelector('.profile-del');
        delBtn.addEventListener('click', (e) => deleteProfile(e, p.id));

        grid.appendChild(card);
    });

    $('btn-add-profile').style.display = profiles.length >= 4 ? 'none' : '';
}

/**
 * Select a profile and navigate to the world map.
 * @param {string} id - Profile ID
 */
function selectProfile(id) {
    localStorage.setItem('cq_active', id);
    const p = loadProfiles().find((p) => p.id === id);
    G.profileId = id;
    G.coins = p.coins || 0;
    G.avatar = p.avatar || '🧙‍♂️';
    // Update the in-game hero face to match the chosen character
    const hface = document.querySelector('#hero .hface');
    if (hface) hface.textContent = G.avatar;

    // Analytics: sync player data and start session
    syncPlayerStats();
    trackSessionStart();

    showWorldMap();
}

/**
 * Delete a profile after stopping event propagation.
 * @param {Event} e - Click event
 * @param {string} id - Profile ID to delete
 */
function deleteProfile(e, id) {
    e.stopPropagation();
    const profiles = loadProfiles().filter((p) => p.id !== id);
    saveProfiles(profiles);
    showProfiles();
}

/**
 * Show the new profile creation screen.
 * Builds the avatar picker.
 */
function showNewProfile() {
    newProfileAvatar = AVATARS[0];
    $('profile-name-input').value = '';
    showScreen('screen-new-profile');

    const picker = $('avatar-picker');
    picker.innerHTML = '';

    AVATARS.forEach((av) => {
        const btn = document.createElement('button');
        btn.textContent = av;
        btn.style.cssText = `
      font-size:32px; background:var(--panel2);
      border:2px solid var(--border);
      border-radius:14px; width:56px; height:56px;
      cursor:pointer; transition:transform .12s, border-color .12s;`;

        btn.addEventListener('click', () => {
            newProfileAvatar = av;
            picker.querySelectorAll('button').forEach((b) => {
                b.style.borderColor = 'var(--border)';
            });
            btn.style.borderColor = 'var(--gold)';
            btn.style.transform = 'scale(1.15)';
        });

        if (av === newProfileAvatar) {
            btn.style.borderColor = 'var(--gold)';
        }
        picker.appendChild(btn);
    });

    setTimeout(() => $('profile-name-input').focus(), 100);
}

/**
 * Confirm and save a new profile, then navigate to world map.
 */
function confirmNewProfile() {
    const name = $('profile-name-input').value.trim();
    if (!name) {
        $('profile-name-input').style.borderColor = 'var(--red)';
        return;
    }

    const profiles = loadProfiles();
    const p = {
        id: Date.now().toString(),
        name,
        avatar: newProfileAvatar,
        lv: 0,
        coins: 0,
        stars: {},
    };
    profiles.push(p);
    saveProfiles(profiles);

    // Analytics: create player doc in Firestore
    createPlayerDoc(p);

    selectProfile(p.id);
}
