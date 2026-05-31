/**
 * engine.js — Game execution engine, win/lose logic, level loading
 *
 * The main `runProgram()` function expands the sequence into flat steps
 * and executes them one by one with animations.
 */

/* ══════════════════════════════════════════
   LOAD LEVEL
══════════════════════════════════════════ */

/**
 * Load a level by index. Resets all state and builds the UI.
 * @param {number} idx - Index in LEVELS array
 */
function loadLevel(idx) {
    if (idx >= LEVELS.length) { endGame(); return; }

    G.lv = idx;
    G.seq = [];
    G.running = false;
    G.attempts = 0;
    G.collected = false;
    G.hintUsedThisLevel = false;
    G.bonusCollected = false;
    G.funcDef = [];
    G.row = lv().start.r;
    G.col = lv().start.c;
    G.resolvedGrid = null;
    loopBuilderKey = null;
    closeLoopBuilder();
    closeFuncBuilder();

    // Update top bar
    $('lv-num').textContent = lv().id;
    $('tb-land').textContent = lv().land;
    $('tb-mission').textContent = lv().mission;

    // Concept badge
    _updateConceptBadge();

    $('coins').textContent = G.coins;
    ['s1', 's2', 's3'].forEach((id) => $(id).classList.remove('on'));
    $('hint-toast').classList.add('off');
    $('btn-run').disabled = false;

    // Map background theme
    _applyWorldTheme();

    buildGrid();
    buildShelf();
    renderSeq();

    // Set hero face to the player's chosen avatar
    const hface = document.querySelector('#hero .hface');
    if (hface) hface.textContent = G.avatar;

    placeHero(false);
    say('בואו נלך! 🙌');

    // Tile rules panel
    _updateTileRules();

    // Collect indicator
    _updateCollectBar();

    // Intro overlays
    if (lv().intro === 'loop') $('intro-overlay').classList.remove('off');
    if (lv().intro === 'if') $('intro-if').classList.remove('off');
    if (lv().intro === 'func') $('intro-func').classList.remove('off');

    // Analytics: track level start
    trackLevelStart(lv().id);
}

/** Update the concept badge in the top bar. */
function _updateConceptBadge() {
    const conceptEl = $('tb-concept');
    if (!conceptEl) return;

    conceptEl.textContent = CONCEPT_LABELS[lv().concept] || lv().concept || '';
    conceptEl.style.display = lv().concept ? '' : 'none';

    const colors = CONCEPT_COLORS[lv().concept];
    if (colors) {
        conceptEl.style.background = colors.bg;
        conceptEl.style.borderColor = colors.border;
        conceptEl.style.color = colors.text;
    } else {
        conceptEl.style.background = '';
        conceptEl.style.borderColor = '';
        conceptEl.style.color = '';
    }
}

/** Apply the world's visual theme to #map-wrap. */
function _applyWorldTheme() {
    const worldEmoji = lv().land.slice(0, 2).trim();
    const worldTheme = MAP_BACKGROUNDS[worldEmoji] || MAP_BACKGROUNDS['🌲'];
    const mapEl = $('map-wrap');

    mapEl.style.transition = 'background 0.6s ease';
    mapEl.style.background = worldTheme.bg;
    mapEl.classList.remove(...WORLD_CLASSES);
    mapEl.classList.add(worldTheme.cls);
}

/** Update the tile rules panel for magic tile levels. */
function _updateTileRules() {
    const rulesEl = $('tile-rules');
    if (!rulesEl) return;

    if (lv().tiles && lv().tiles.length) {
        rulesEl.innerHTML = '<div style="font-size:10px;font-weight:900;color:rgba(160,200,255,.5);text-transform:uppercase;letter-spacing:.7px;margin-bottom:4px">✨ אריחי קסם:</div>'
            + lv().tiles.map((t) =>
                `<div class="tile-rule-row">
          <span class="tile-rule-icon">${t.e}</span>
          <span class="tile-rule-arrow">→</span>
          <span class="tile-rule-cmd">${CMD_LABELS[t.cmd] || t.cmd}</span>
        </div>`
            ).join('');
        rulesEl.classList.add('visible');
    } else {
        rulesEl.classList.remove('visible');
    }
}

/** Update the collect indicator bar in the sidebar. */
function _updateCollectBar() {
    const cbar = $('collect-bar');
    if (!cbar) return;

    if (lv().collect) {
        $('collect-bar-icon').textContent = lv().collect.e;
        $('collect-bar-text').textContent = 'אספו אותו לפני שמגיעים ליעד!';
        cbar.style.display = 'flex';
        cbar.classList.remove('collected');
    } else {
        cbar.style.display = 'none';
    }
}

/* ══════════════════════════════════════════
   RUNTIME HELPERS (deduplicated logic)
══════════════════════════════════════════ */

/**
 * Check if the hero is on a collectible and handle pickup.
 * @returns {Promise<void>}
 */
async function _checkCollect() {
    const col_data = lv().collect;
    if (!col_data || G.collected || G.row !== col_data.r || G.col !== col_data.c) return;

    G.collected = true;
    const collEl = $('coll');
    if (collEl) {
        collEl.style.transition = 'opacity .3s, transform .3s';
        collEl.style.opacity = '0';
        collEl.style.transform = 'scale(0) translateY(-14px)';
    }
    const collArrow = $('coll-arrow');
    if (collArrow) collArrow.style.opacity = '0';
    const collCell = collEl && collEl.closest('.cell');
    if (collCell) collCell.classList.remove('has-collect');

    say(`${lv().collect.e} נאסף! מצוין! ✨`, 1500);

    const cbar = $('collect-bar');
    if (cbar) {
        cbar.classList.add('collected');
        $('collect-bar-icon').textContent = '✅';
        $('collect-bar-text').textContent = lv().collect.e + ' נאסף!';
    }
    await sleep(300);
}

/**
 * Check if the hero is on a bonus item and handle pickup.
 * @returns {Promise<void>}
 */
async function _checkBonus() {
    const bon = lv().bonus;
    if (!bon || G.bonusCollected || G.row !== bon.r || G.col !== bon.c) return;

    G.bonusCollected = true;
    G.coins += 15;
    const bonEl = $('bonus-item');
    if (bonEl) {
        bonEl.style.transition = 'opacity .3s, transform .3s';
        bonEl.style.opacity = '0';
        bonEl.style.transform = 'scale(0) translateY(-14px)';
    }
    say(`${bon.e} בונוס! +15 מטבעות! 💰`, 1200);
    await sleep(300);
}

/**
 * Check if the hero reached the goal.
 * @returns {boolean|'need-collect'} true if won, 'need-collect' if missing collectible, false otherwise
 */
function _checkGoal() {
    if (G.row !== lv().goal.r || G.col !== lv().goal.c) return false;
    if (lv().collect && !G.collected) return 'need-collect';
    return true;
}

/* ══════════════════════════════════════════
   RUN PROGRAM
══════════════════════════════════════════ */

/**
 * Execute the player's command sequence.
 * Expands loops and functions into flat steps, then animates each.
 */
async function runProgram() {
    if (G.running || G.seq.length === 0) return;
    closeLoopBuilder();

    G.running = true;
    G.attempts++;
    $('btn-run').disabled = true;

    // Reset run state
    G.row = lv().start.r;
    G.col = lv().start.c;
    G.collected = false;
    G.bonusCollected = false;

    // Build resolved grid copy
    G.resolvedGrid = lv().grid.map((row) => [...row]);

    // Reset tile icons
    document.querySelectorAll('.tile-icon').forEach((el) => el.classList.remove('used'));

    // Reset collectible/bonus visibility
    const collEl = $('coll');
    const bonusEl = $('bonus-item');
    if (collEl) {
        collEl.style.transition = 'none';
        collEl.style.opacity = '1';
        collEl.style.transform = 'scale(1)';
    }
    if (bonusEl) {
        bonusEl.style.transition = 'none';
        bonusEl.style.opacity = '1';
        bonusEl.style.transform = 'scale(1)';
    }

    placeHero(false);
    await sleep(120);

    // Expand seq into flat steps
    const steps = [];
    G.seq.forEach((item, si) => {
        if (item.type === 'cmd') {
            steps.push({ type: 'move', key: item.key, seqIdx: si });
        } else if (item.type === 'loop') {
            for (let rep = 0; rep < item.count; rep++) {
                item.body.forEach((key) => {
                    if (key.startsWith('if:')) {
                        steps.push({ type: 'if', dir: key.slice(3), seqIdx: si });
                    } else {
                        steps.push({ type: 'move', key, seqIdx: si });
                    }
                });
            }
        } else if (item.type === 'func') {
            (G.funcDef || []).forEach((key) => {
                steps.push({ type: 'move', key, seqIdx: si });
            });
        } else if (item.type === 'if') {
            steps.push({ type: 'if', dir: item.dir, seqIdx: si });
        }
    });

    let won = false;

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const { seqIdx } = step;

        // Highlight the seq card being executed
        document.querySelectorAll('.dcard, .loop-wrap').forEach((el, j) => {
            el.classList.toggle('exec', j === seqIdx);
        });

        // ── IF conditional step ──
        if (step.type === 'if') {
            const d = CMD[step.dir];
            const checkRow = G.row + d.dr;
            const checkCol = G.col + d.dc;
            const grid_ = G.resolvedGrid || lv().grid;

            const passable =
                checkRow >= 0 && checkRow < grid_.length &&
                checkCol >= 0 && checkCol < grid_[0].length &&
                grid_[checkRow][checkCol] !== 'W' &&
                grid_[checkRow][checkCol] !== 'g';

            if (passable) {
                heroAnim('hbounce', 280);
                G.row = checkRow;
                G.col = checkCol;
                placeHero(true);
                say(`IF ${d.e} — פנוי! זזתי ✅`, 900);
                await sleep(500);

                await _checkCollect();
                await _checkBonus();

                const goalResult = _checkGoal();
                if (goalResult === 'need-collect') {
                    heroAnim('hshake', 380);
                    say(`קודם צריך לאסוף את ה${lv().collect.e}!`, 2400);
                    await sleep(800);
                    break;
                }
                if (goalResult === true) { won = true; break; }
            } else {
                say(`IF ${d.e} — קיר! דולג ❌`, 900);
                await sleep(500);
            }
            continue;
        }

        // ── Regular move step ──
        const { key } = step;
        const cmd = CMD[key];
        const newRow = G.row + cmd.dr;
        const newCol = G.col + cmd.dc;

        const grid_ = G.resolvedGrid || lv().grid;
        const blocked =
            newRow < 0 || newRow >= grid_.length ||
            newCol < 0 || newCol >= grid_[0].length ||
            grid_[newRow][newCol] === 'W';

        if (blocked) {
            heroAnim('hshake', 380);
            say('אוי! נתקלנו בקיר 🧱 — בואו ננסה שוב!', 2600);
            trackLevelFail(lv().id, G.seq.length, 'wall');
            await sleep(750);
            if (G.attempts >= 3) showHint();
            break;
        }

        G.row = newRow;
        G.col = newCol;
        heroAnim('hbounce', 280);
        placeHero(true);
        await sleep(380);

        // ── Tile trigger ──
        if (lv().tiles) {
            const tile = lv().tiles.find((t) => t.r === G.row && t.c === G.col);
            if (tile) {
                const tileIconEl = document.querySelector(`[data-tile-id="${tile.r},${tile.c}"]`);
                if (tileIconEl) tileIconEl.classList.add('used');

                const td = CMD[tile.cmd];
                const tr = G.row + td.dr;
                const tc = G.col + td.dc;
                const tBlocked =
                    tr < 0 || tr >= G.resolvedGrid.length ||
                    tc < 0 || tc >= G.resolvedGrid[0].length ||
                    G.resolvedGrid[tr][tc] === 'W';

                say(`${tile.e} → ${td.e} ${td.label}!`, 1200);
                await sleep(320);

                if (!tBlocked) {
                    G.row = tr;
                    G.col = tc;
                    heroAnim('hbounce', 250);
                    placeHero(true);
                    await sleep(380);

                    // Chain: check if landed on another tile
                    const tile2 = lv().tiles.find((t) => t.r === G.row && t.c === G.col);
                    if (tile2) {
                        const ti2 = document.querySelector(`[data-tile-id="${tile2.r},${tile2.c}"]`);
                        if (ti2) ti2.classList.add('used');

                        const td2 = CMD[tile2.cmd];
                        const tr2 = G.row + td2.dr;
                        const tc2 = G.col + td2.dc;
                        const tBlocked2 =
                            tr2 < 0 || tr2 >= G.resolvedGrid.length ||
                            tc2 < 0 || tc2 >= G.resolvedGrid[0].length ||
                            G.resolvedGrid[tr2][tc2] === 'W';

                        say(`${tile2.e} → ${td2.e} ${td2.label}! ⛓️`, 1200);
                        await sleep(320);

                        if (!tBlocked2) {
                            G.row = tr2;
                            G.col = tc2;
                            heroAnim('hbounce', 250);
                            placeHero(true);
                            await sleep(380);
                        }
                    }
                }
            }
        }

        // Check collectible / bonus / goal using shared helpers
        await _checkCollect();
        await _checkBonus();

        const goalResult = _checkGoal();
        if (goalResult === 'need-collect') {
            heroAnim('hshake', 380);
            say(`קודם צריך לאסוף את ה${lv().collect.e}!`, 2400);
            trackLevelFail(lv().id, G.seq.length, 'missed_collect');
            await sleep(800);
            break;
        }
        if (goalResult === true) { won = true; break; }

        await sleep(30);
    }

    // Clear execution highlights
    document.querySelectorAll('.dcard, .loop-wrap').forEach((el) => el.classList.remove('exec'));

    if (won) {
        heroAnim('hcheer', 700);
        say('הגעתי! 🎉 כל הכבוד!', 3000);
        await sleep(900);
        showWin();
    } else {
        // Track generic failure if not already tracked above
        say('ננסה שוב! 💪', 2500);
        G.running = false;
        $('btn-run').disabled = false;
    }
}

/* ══════════════════════════════════════════
   WIN / END
══════════════════════════════════════════ */

/** Show the win overlay with stars, coins, and confetti. */
function showWin() {
    const steps = G.seq.length;
    const stars = steps <= lv().ideal ? 3 : steps <= lv().ideal + 2 ? 2 : 1;
    const earned = lv().coins * stars;
    G.coins += earned;

    saveLevelStars(G.lv, stars);

    // Analytics: track completion
    trackLevelComplete(lv().id, stars, steps, G.hintUsedThisLevel || false);

    $('coins').textContent = G.coins;
    ['s1', 's2', 's3'].forEach((id, i) => {
        if (i < stars) setTimeout(() => $(id).classList.add('on'), i * 200);
    });

    const ws = $('wstars');
    ws.innerHTML = '';
    for (let i = 0; i < stars; i++) {
        const s = document.createElement('span');
        s.className = 'wstar';
        s.textContent = '⭐';
        ws.appendChild(s);
    }

    $('wt').textContent = stars === 3 ? '🌟' : '🏆';
    $('wh').textContent = stars === 3 ? 'מושלם! 🌟' : 'כל הכבוד! 🎉';
    $('wm').textContent = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
    $('wcoins').textContent = `+${earned} מטבעות 🪙`;

    const hasNext = G.lv + 1 < LEVELS.length;
    $('wnext').style.display = hasNext ? '' : 'none';
    $('wmap').style.display = '';

    $('win').classList.remove('off');
    confetti();

    G.running = false;
    $('btn-run').disabled = false;
}

/** Navigate to the next level. */
function nextLevel() {
    $('win').classList.add('off');
    startLevel(G.lv + 1);
}

/** Navigate back to the world map. */
function goToMap() {
    $('win').classList.add('off');
    showWorldMap();
}

/** Show the end-game screen when all levels are completed. */
function endGame() {
    $('win').classList.remove('off');
    $('wt').textContent = '👑';
    $('wh').textContent = 'סיימתם את כל השלבים!';
    $('wm').textContent = `אספתם ${G.coins} מטבעות — אתם אלופים! 🏆`;
    $('wcoins').textContent = '';
    $('wstars').innerHTML = '<span class="wstar">⭐</span><span class="wstar">⭐</span><span class="wstar">⭐</span>';
    $('wnext').style.display = 'none';
    $('wmap').style.display = '';
    confetti(70);
}
