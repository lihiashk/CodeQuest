/**
 * builders.js — Loop, Function, and IF command builder UX
 *
 * Loop UX (3 steps):
 *   1. Click 🔁 → panel: "Which direction?" (d-pad layout)
 *   2. Choose direction → panel: "How many times?"
 *   3. Choose count → loop created and added to sequence
 *
 * Function UX:
 *   - First time: opens builder to define body (d-pad layout, up to 5 commands)
 *   - After defined: clicking adds a call to the sequence
 *
 * IF UX:
 *   - Pick a direction via d-pad. Runtime checks if free → move; if blocked → skip.
 */

/* ── Builder state ── */
let loopBuilderKey = null;
let loopBuilderBody = null;
let loopBuilderCount = 0;
let _funcKeys = [];

/* ══════════════════════════════════════════
   SHARED: D-PAD HTML GENERATOR
   Same PlayStation joystick layout as the main game screen
══════════════════════════════════════════ */

/**
 * Generate a d-pad HTML block for builder modals.
 * Uses the same circular cross layout as the main game d-pad.
 * @param {string[]} dirs - Available direction keys (e.g. ['up','down','left','right'])
 * @param {string} dataAttr - Data attribute name for the buttons (e.g. 'dir', 'key', 'fkey')
 * @returns {string} HTML string
 */
function _buildDpadHtml(dirs, dataAttr) {
    const posMap = {
        up: 'dp-ps-up',
        down: 'dp-ps-down',
        left: 'dp-ps-left',
        right: 'dp-ps-right',
    };

    const btns = dirs.filter((k) => DIR_KEYS.includes(k)).map((k) => {
        const d = CMD[k];
        const posClass = posMap[k] || '';
        return `<button class="dp-btn builder-dp-btn ${posClass}" data-${dataAttr}="${k}">
            ${d.e}
        </button>`;
    }).join('');

    return `<div class="builder-dpad-wrap">
        <div class="builder-dpad">
            ${btns}
            <div class="dp-ps-mid"></div>
        </div>
    </div>`;
}

/**
 * Attach click listeners to d-pad buttons inside a container.
 * @param {HTMLElement} container - Parent element containing the buttons
 * @param {string} dataAttr - Data attribute to read from the button
 * @param {function} callback - Function to call with the direction value
 */
function _attachDpadListeners(container, dataAttr, callback) {
    container.querySelectorAll('.builder-dp-btn').forEach((btn) => {
        btn.addEventListener('click', () => callback(btn.dataset[dataAttr]));
    });
}

/* ══════════════════════════════════════════
   IF BUILDER
══════════════════════════════════════════ */

/**
 * Open the IF condition builder.
 * Shows d-pad; picking a direction adds {type:'if', dir} to seq.
 */
function openIfBuilder() {
    if (G.running) return;
    closeLoopBuilder();

    const overlay = _makeOverlay('loop-builder');
    const dirs = lv().cmds.filter((k) => DIR_KEYS.includes(k));

    overlay.innerHTML = _boxHtml(
        '❓', 'IF — בחרו כיוון לבדיקה',
        'אם הכיוון פנוי → הגיבור יזוז לשם. אם לא → ידלג.',
        _buildDpadHtml(dirs, 'dir'),
        'ביטול', 'closeLoopBuilder()'
    );
    document.body.appendChild(overlay);

    _attachDpadListeners(overlay, 'dir', addIfCmd);
}

/**
 * Add an IF command to the sequence.
 * @param {string} dir - Direction key
 */
function addIfCmd(dir) {
    closeLoopBuilder();
    G.seq.push({ type: 'if', dir });
    renderSeq();
}

/* ══════════════════════════════════════════
   LOOP BUILDER
══════════════════════════════════════════ */

/** Step 1: Choose direction for the loop body. */
function openLoopStep1() {
    closeLoopBuilder();

    const overlay = _makeOverlay('loop-builder');
    const dirCmds = lv().cmds.filter((k) => DIR_KEYS.includes(k));

    overlay.innerHTML = _boxHtml(
        '🔁', 'לולאה — בחרו כיוון', 'איזו פקודה תרצו לחזור עליה?',
        _buildDpadHtml(dirCmds, 'key'),
        'ביטול', 'closeLoopBuilder()'
    );
    document.body.appendChild(overlay);

    _attachDpadListeners(overlay, 'key', loopPickDir);
}

/**
 * Step 2: Choose how many times to repeat.
 * @param {string} key - Direction key chosen in step 1
 */
function loopPickDir(key) {
    loopBuilderKey = key;
    const isIf = key.startsWith('if:');
    const baseKey = isIf ? key.slice(3) : key;
    const d = CMD[baseKey];
    const label = isIf ? `IF ${d.label}` : d.label;
    const icon = isIf ? `❓${d.e}` : d.e;

    closeLoopBuilder();
    const overlay = _makeOverlay('loop-builder');

    const numHtml = [2, 3, 4, 5, 6].map((n) =>
        `<button class="loop-count-btn" data-n="${n}">${n}</button>`
    ).join('');

    overlay.innerHTML = _boxHtml(
        icon, `${label} — כמה פעמים?`, 'בחרו מספר חזרות:',
        `<div style="display:flex;justify-content:center;gap:10px;margin-bottom:20px">${numHtml}</div>`,
        '← חזור', 'openLoopStep1()'
    );
    document.body.appendChild(overlay);

    // Prevent phantom hover — disable pointer events briefly
    const countBtns = overlay.querySelectorAll('.loop-count-btn');
    countBtns.forEach((b) => {
        b.style.pointerEvents = 'none';
        b.addEventListener('mouseenter', () => b.classList.add('hov'));
        b.addEventListener('mouseleave', () => b.classList.remove('hov'));
        b.addEventListener('click', () => loopConfirm(parseInt(b.dataset.n)));
    });
    setTimeout(() => {
        countBtns.forEach((b) => { b.style.pointerEvents = ''; });
    }, 200);
}

/**
 * Step 3: Finalize the loop. If level has IF, offer second body command.
 * @param {number} count - Number of repetitions
 */
function loopConfirm(count) {
    const key = loopBuilderKey;
    loopBuilderKey = null;
    closeLoopBuilder();
    if (!key) return;

    const hasIf = lv().cmds.includes('if');
    if (hasIf) {
        loopBuilderBody = [key];
        loopBuilderCount = count;
        openLoopStep3(count, key);
    } else {
        G.seq.push({ type: 'loop', count, body: [key] });
        renderSeq();
    }
}

/**
 * Optional step 3: offer to add a second command to the loop body.
 * @param {number} count - Loop count
 * @param {string} firstKey - First body command
 */
function openLoopStep3(count, firstKey) {
    closeLoopBuilder();

    const overlay = _makeOverlay('loop-builder');
    const isIf = firstKey.startsWith('if:');
    const baseKey = isIf ? firstKey.slice(3) : firstKey;
    const d = CMD[baseKey];
    const firstLabel = isIf ? `IF ${d.label}` : d.label;
    const firstIcon = isIf ? `❓${d.e}` : d.e;

    const dirs = lv().cmds.filter((k) => DIR_KEYS.includes(k));
    const extraBtns = [
        `<button class="loop-count-btn" data-second="" style="width:auto;padding:0 16px;font-size:14px">רק ${firstLabel}</button>`,
        ...dirs.map((k) => {
            const dk = CMD[k];
            return `<button class="loop-dir-btn" data-second="${k}" style="width:56px;height:56px">
        <span class="ldb-arrow">${dk.e}</span>
        <span class="ldb-label">${dk.label}</span>
      </button>`;
        }),
        ...dirs.map((k) => {
            const dk = CMD[k];
            return `<button class="loop-dir-btn" data-second="if:${k}" style="width:56px;height:56px;background:radial-gradient(circle at 38% 32%,#5a4a00,#2e2400);border-color:rgba(255,210,60,.5)">
        <span class="ldb-arrow" style="font-size:18px">❓${dk.e}</span>
        <span class="ldb-label">IF ${dk.label}</span>
      </button>`;
        }),
    ].join('');

    overlay.innerHTML = _boxHtml(
        firstIcon,
        `×${count} ${firstLabel} — ועוד פקודה?`,
        'הוסיפו פקודה שנייה לכל חזרה (אופציונלי)',
        `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:20px">${extraBtns}</div>`,
        '← חזור', 'openLoopStep1()'
    );
    document.body.appendChild(overlay);

    overlay.querySelectorAll('[data-second]').forEach((btn) => {
        btn.addEventListener('mouseenter', () => btn.classList.add('hov'));
        btn.addEventListener('mouseleave', () => btn.classList.remove('hov'));
        btn.addEventListener('click', () => {
            const val = btn.dataset.second;
            loopFinalize(val || null);
        });
    });
}

/**
 * Finalize loop with optional second body command.
 * @param {string|null} secondKey - Second command key, or null
 */
function loopFinalize(secondKey) {
    const body = [...(loopBuilderBody || [])];
    if (secondKey) body.push(secondKey);
    const count = loopBuilderCount;
    loopBuilderBody = null;
    loopBuilderCount = 0;
    closeLoopBuilder();
    G.seq.push({ type: 'loop', count, body });
    renderSeq();
}

/* ══════════════════════════════════════════
   FUNCTION BUILDER
══════════════════════════════════════════ */

/**
 * Open the function builder, or if already defined, insert a call.
 */
function openFuncBuilder() {
    if (G.funcDef && G.funcDef.length > 0) {
        if (G.seq.length < 20) {
            G.seq.push({ type: 'func' });
            renderSeq();
        }
        return;
    }

    closeFuncBuilder();
    _funcKeys = [];
    const ov = _makeOverlay('func-builder');
    ov.innerHTML = _funcBoxHtml();
    document.body.appendChild(ov);
    _funcAttachListeners(ov);
}

/** Generate the function builder HTML — uses d-pad layout. */
function _funcBoxHtml() {
    const dirCmds = lv().cmds.filter((k) => DIR_KEYS.includes(k));

    const dpadHtml = _buildDpadHtml(dirCmds, 'fkey');

    const bodyHtml = _funcKeys.length === 0
        ? '<div style="color:rgba(255,180,150,.65);font-size:14px;padding:14px">👆 לחצו על חץ למעלה</div>'
        : '<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;padding:8px">'
        + _funcKeys.map((k, i) =>
            `<div class="func-body-item" data-fdel="${i}" title="הסר" style="background:#ff6464;color:#fff;border-radius:9px;padding:6px 11px;font-size:17px;cursor:pointer">${CMD[k].e}</div>`
        ).join('')
        + '</div>';

    const canSave = _funcKeys.length > 0;

    return `<div style="background:linear-gradient(160deg,#3a1010,#200808);border:3px solid #ff6464;border-radius:24px;padding:28px 30px;text-align:center;max-width:420px;width:92%;box-shadow:0 0 60px rgba(255,100,100,.22);">
    <div style="font-size:42px;margin-bottom:6px">🪄</div>
    <div style="font-size:20px;font-weight:900;color:#ffb0b0;margin-bottom:6px">🪄 הגדרת פונקציה</div>
    <div style="color:rgba(255,220,210,.7);font-size:14px;margin-bottom:16px">בחרו פקודות להוסיף לפונקציה (עד 5)</div>
    ${dpadHtml}
    <div style="background:rgba(255,100,100,.08);border:1px dashed rgba(255,100,100,.3);border-radius:11px;min-height:48px;margin-bottom:14px">${bodyHtml}</div>
    ${canSave
            ? '<button class="func-save-btn" style="background:#ff6464;color:#fff;font-family:var(--font);font-size:15px;font-weight:900;border:none;border-radius:13px;padding:11px 26px;cursor:pointer;margin-bottom:10px;width:100%">✓ שמור וקרא לה</button>'
            : '<button disabled style="background:rgba(255,100,100,.15);color:rgba(255,180,180,.4);font-family:var(--font);font-size:15px;font-weight:900;border:none;border-radius:13px;padding:11px 26px;width:100%;margin-bottom:10px">הוסיפו פקודה תחילה</button>'}
    <button class="func-cancel-btn" style="background:transparent;color:rgba(255,200,200,.35);font-family:var(--font);font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.09);border-radius:11px;padding:8px 20px;cursor:pointer">ביטול</button>
  </div>`;
}

/** Attach event listeners to the function builder overlay. */
function _funcAttachListeners(ov) {
    if (!ov) ov = $('func-builder');
    if (!ov) return;

    _attachDpadListeners(ov, 'fkey', funcKey);

    ov.querySelectorAll('.func-body-item').forEach((b) => {
        b.addEventListener('click', () => funcDel(parseInt(b.dataset.fdel)));
    });

    const saveBtn = ov.querySelector('.func-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', funcSave);

    const cancelBtn = ov.querySelector('.func-cancel-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', closeFuncBuilder);
}

/**
 * Add a direction key to the function body.
 * @param {string} k - Direction key
 */
function funcKey(k) {
    if (_funcKeys.length >= 5) return;
    _funcKeys.push(k);
    const ov = $('func-builder');
    if (ov) {
        ov.innerHTML = _funcBoxHtml();
        _funcAttachListeners(ov);
    }
}

/**
 * Remove a key from the function body by index.
 * @param {number} i - Index to remove
 */
function funcDel(i) {
    _funcKeys.splice(i, 1);
    const ov = $('func-builder');
    if (ov) {
        ov.innerHTML = _funcBoxHtml();
        _funcAttachListeners(ov);
    }
}

/** Save the function definition and insert a call. */
function funcSave() {
    if (!_funcKeys.length) return;
    G.funcDef = [..._funcKeys];
    _funcKeys = [];
    closeFuncBuilder();
    if (G.seq.length < 20) {
        G.seq.push({ type: 'func' });
    }
    renderSeq();
}

/** Close and remove the function builder overlay. */
function closeFuncBuilder() {
    const b = $('func-builder');
    if (b) b.remove();
    _funcKeys = [];
}

/** Reset the function definition and remove all func calls from sequence. */
function resetFuncDef() {
    G.funcDef = [];
    G.seq = G.seq.filter((it) => it.type !== 'func');
    renderSeq();
}

/* ══════════════════════════════════════════
   SHARED HELPERS
══════════════════════════════════════════ */

/**
 * Create a fullscreen overlay element.
 * @param {string} id - Element ID
 * @returns {HTMLDivElement}
 */
function _makeOverlay(id) {
    const el = document.createElement('div');
    el.id = id;
    el.style.cssText = `
    position:fixed; inset:0; z-index:75;
    background:rgba(8,10,26,.92);
    backdrop-filter:blur(6px);
    -webkit-backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    direction:rtl;
    animation:fadeIn .2s ease;`;
    return el;
}

/**
 * Generate styled box HTML for builder overlays.
 * @param {string} icon - Large emoji icon
 * @param {string} title - Box title
 * @param {string} sub - Subtitle text
 * @param {string} body - Inner HTML content
 * @param {string} cancelLabel - Cancel button text
 * @param {string} cancelAction - Cancel onclick action (function name)
 * @returns {string} HTML string
 */
function _boxHtml(icon, title, sub, body, cancelLabel, cancelAction) {
    return `<div style="
      background:linear-gradient(160deg,#1e2a5e,#141a3e);
      border:3px solid #b87dff; border-radius:24px;
      padding:30px 34px; text-align:center; max-width:420px; width:92%;
      box-shadow:0 0 60px rgba(184,125,255,.25);">
    <div style="font-size:50px;margin-bottom:8px">${icon}</div>
    <div style="font-size:20px;font-weight:900;color:#d3aaff;margin-bottom:4px">${title}</div>
    <div style="color:rgba(238,242,255,.45);font-size:13px;margin-bottom:18px">${sub}</div>
    ${body}
    <button onclick="${cancelAction}" style="
      background:transparent; color:rgba(238,242,255,.35);
      font-family:var(--font); font-size:13px; font-weight:700;
      border:1px solid rgba(255,255,255,.09); border-radius:12px;
      padding:9px 22px; cursor:pointer;">
      ${cancelLabel}
    </button>
  </div>`;
}

/** Close and remove the loop builder overlay. */
function closeLoopBuilder() {
    const b = $('loop-builder');
    if (b) b.remove();
}
