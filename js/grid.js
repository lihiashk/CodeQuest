/**
 * grid.js — Grid rendering, hero placement, speech bubble
 */

/**
 * Build the game grid from the current level data.
 * Inserts row elements before the hero so it stays on top.
 * Also places collectibles, bonus items, tiles, and decorations.
 */
function buildGrid() {
    const grid = $('grid');
    const hero = $('hero');
    const mapW = $('map-wrap');

    // Remove old rows, keep hero
    Array.from(grid.children).forEach((ch) => {
        if (ch !== hero) ch.remove();
    });

    const ROWS = lv().grid.length;
    const COLS = lv().grid[0].length;

    // Compute cell size to fill ~92% of map area
    G.CS = Math.min(
        Math.floor(mapW.clientWidth * 0.92 / COLS),
        Math.floor(mapW.clientHeight * 0.92 / ROWS),
        120
    );
    const CS = G.CS;

    grid.style.width = (COLS * CS) + 'px';
    grid.style.height = (ROWS * CS) + 'px';

    // Hero size matches cell
    hero.style.width = CS + 'px';
    hero.style.height = CS + 'px';
    hero.querySelector('.hface').style.fontSize = Math.floor(CS * 0.54) + 'px';

    for (let r = 0; r < ROWS; r++) {
        const rowEl = document.createElement('div');
        rowEl.className = 'grow';

        for (let c = 0; c < COLS; c++) {
            const raw = lv().grid[r][c];
            const cell = document.createElement('div');
            cell.className = 'cell ' + (CELL_TYPES[raw] || 'grass');
            cell.style.width = CS + 'px';
            cell.style.height = CS + 'px';

            const iconSz = Math.floor(CS * 0.50) + 'px';

            // Goal gem
            if (raw === 'X') {
                const gem = document.createElement('span');
                gem.className = 'cdeco';
                gem.textContent = '💎';
                gem.style.fontSize = Math.floor(CS * 0.54) + 'px';
                cell.appendChild(gem);
            }

            // Collectible (required)
            if (lv().collect && lv().collect.r === r && lv().collect.c === c) {
                cell.classList.add('has-collect');
                const arrow = document.createElement('span');
                arrow.className = 'collect-arrow';
                arrow.textContent = '⬇️';
                arrow.id = 'coll-arrow';
                cell.appendChild(arrow);

                const d = document.createElement('span');
                d.className = 'cdeco';
                d.id = 'coll';
                d.textContent = lv().collect.e;
                d.style.fontSize = iconSz;
                cell.appendChild(d);
            }

            // Trigger tiles
            if (lv().tiles) {
                const tileData = lv().tiles.find((t) => t.r === r && t.c === c);
                if (tileData) {
                    cell.classList.add('has-tile');
                    const te = document.createElement('span');
                    te.className = 'cdeco tile-icon';
                    te.dataset.tileId = r + ',' + c;
                    te.textContent = tileData.e;
                    te.style.fontSize = iconSz;
                    cell.appendChild(te);
                }
            }

            // Bonus item (optional)
            if (lv().bonus && lv().bonus.r === r && lv().bonus.c === c) {
                const d = document.createElement('span');
                d.className = 'cdeco';
                d.id = 'bonus-item';
                d.textContent = lv().bonus.e;
                d.style.fontSize = iconSz;
                d.style.filter = 'drop-shadow(0 0 6px gold)';
                cell.appendChild(d);
            }

            // Scenery decorations
            if (lv().decos) {
                const fd = lv().decos.find((d) => d.r === r && d.c === c);
                if (fd) {
                    const d = document.createElement('span');
                    d.className = 'cdeco';
                    d.textContent = fd.e;
                    d.style.fontSize = iconSz;
                    cell.appendChild(d);
                }
            }

            rowEl.appendChild(cell);
        }

        // Insert row BEFORE hero so hero stays on top
        grid.insertBefore(rowEl, hero);
    }
}

/**
 * Position the hero on the grid using CSS top/left.
 * @param {boolean} animate - Whether to use CSS transition
 */
function placeHero(animate) {
    const hero = $('hero');
    const CS = G.CS;

    hero.style.transition = animate
        ? 'top .34s cubic-bezier(.4,0,.2,1), left .34s cubic-bezier(.4,0,.2,1)'
        : 'none';

    hero.style.top = (G.row * CS) + 'px';
    hero.style.left = (G.col * CS) + 'px';
}

/**
 * Trigger a CSS animation on the hero face.
 * @param {string} name - Animation keyframe name
 * @param {number} dur - Duration in ms
 */
function heroAnim(name, dur) {
    const face = $('hero').querySelector('.hface');
    face.style.animation = 'none';
    void face.offsetWidth;
    face.style.animation = `${name} ${dur}ms ease`;
    setTimeout(() => { face.style.animation = ''; }, dur);
}

/**
 * Show a speech bubble above the hero (fixed positioning).
 * @param {string} txt - Text to display
 * @param {number} [dur=2200] - Display duration in ms
 */
let bubbleTimer;
function say(txt, dur = 2200) {
    const b = $('bubble');
    const grid = $('grid');
    const CS = G.CS;

    b.textContent = txt;
    b.classList.remove('off');

    // Use fixed positioning via getBoundingClientRect
    const gridRect = grid.getBoundingClientRect();
    const heroLeft = gridRect.left + G.col * CS + CS / 2;
    const heroTop = gridRect.top + G.row * CS;

    // Temporarily show to measure width
    b.style.visibility = 'hidden';
    b.style.left = '0px';
    b.style.top = '0px';

    requestAnimationFrame(() => {
        const bw = b.offsetWidth;
        let bx = heroLeft - bw / 2;
        bx = Math.max(8, Math.min(bx, window.innerWidth - bw - 8));
        let by = heroTop - b.offsetHeight - 14;
        if (by < 8) by = heroTop + CS + 6; // flip below if too high
        b.style.left = bx + 'px';
        b.style.top = by + 'px';
        b.style.visibility = '';
    });

    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => b.classList.add('off'), dur);
}
