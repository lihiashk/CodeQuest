/**
 * shelf.js — Command shelf (d-pad + special cards), sequence rendering
 */

/**
 * Build the command shelf: show/hide d-pad directions
 * and populate special command cards (loop, func, if).
 */
function buildShelf() {
    const cmds = lv().cmds;

    // D-PAD: show/hide direction buttons based on available cmds
    ['up', 'down', 'left', 'right'].forEach((k) => {
        const btn = $('dp-' + k);
        if (btn) btn.classList.toggle('hidden', !cmds.includes(k));
    });

    // SPECIAL SHELF: loop, func, if
    const special = $('special-shelf');
    special.innerHTML = '';
    const specialKeys = cmds.filter((k) => !DIR_KEYS.includes(k));

    // Label the special shelf
    if (special) {
        special.setAttribute('data-label', specialKeys.length ? 'פקודות מיוחדות' : '');
    }

    specialKeys.forEach((key) => {
        const d = CMD[key];
        const card = document.createElement('div');
        card.className = 'card'
            + (key === 'loop' ? ' loop-card' : '')
            + (key === 'func' ? ' func-card' : '');
        card.draggable = true;
        card.dataset.cmd = key;
        card.innerHTML = `<span class="ce">${d.e}</span><span class="cl">${d.label}</span>`;

        if (key === 'func' && G.funcDef && G.funcDef.length > 0) {
            card.title = '🪄 הפונקציה שלי: ' + G.funcDef.map((k) => CMD[k].e).join(' ');
        }

        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('cmd', key);
            card.classList.add('drag-src');
        });
        card.addEventListener('dragend', () => card.classList.remove('drag-src'));
        card.addEventListener('click', () => {
            if (key === 'if') openIfBuilder();
            else addCmd(key);
        });

        special.appendChild(card);
    });

    // Dropzone — replace node to clear old listeners
    const oldDz = $('dropzone');
    const dz = oldDz.cloneNode(true);
    oldDz.parentNode.replaceChild(dz, oldDz);

    dz.addEventListener('dragover', (e) => {
        e.preventDefault();
        dz.classList.add('over');
    });
    dz.addEventListener('dragleave', () => dz.classList.remove('over'));
    dz.addEventListener('drop', (e) => {
        e.preventDefault();
        dz.classList.remove('over');
        const k = e.dataTransfer.getData('cmd');
        if (k) addCmd(k);
    });
}

/**
 * Add a command to the sequence.
 * Delegates to builders for loop/func commands.
 * @param {string} key - Command key
 */
function addCmd(key) {
    if (G.running) return;
    if (key === 'loop') { openLoopStep1(); return; }
    if (key === 'func') { openFuncBuilder(); return; }
    if (G.seq.length >= 20) return;
    G.seq.push({ type: 'cmd', key });
    renderSeq();
}

/**
 * Remove a sequence item by index.
 * @param {number} i - Index to remove
 */
function removeSeqItem(i) {
    if (G.running) return;
    G.seq.splice(i, 1);
    renderSeq();
}

/** Clear the entire sequence and close any open builders. */
function clearSeq() {
    if (G.running) return;
    G.seq = [];
    closeLoopBuilder();
    renderSeq();
}

/**
 * Render the current sequence into the dropzone.
 * Handles cmd, loop, func, and if item types.
 */
function renderSeq() {
    const dz = $('dropzone');
    const hint = $('dz-hint');
    dz.querySelectorAll('.dcard, .loop-wrap').forEach((d) => d.remove());

    if (G.seq.length === 0) {
        hint.style.display = '';
        hint.textContent = 'לחצו על פקודה למעלה כדי להוסיף אותה לכאן';
        hint.style.color = '';
        hint.style.position = '';
        hint.style.transform = '';
    } else {
        hint.style.display = 'none';
    }

    G.seq.forEach((item, i) => {
        if (item.type === 'cmd') {
            const d = CMD[item.key];
            const dc = document.createElement('div');
            dc.className = 'dcard';
            dc.innerHTML = `<span class="de">${d.e}</span><span>${d.label}</span>
                       <span class="dx" data-seq-idx="${i}">✕</span>`;
            dc.querySelector('.dx').addEventListener('click', () => removeSeqItem(i));
            dz.appendChild(dc);

        } else if (item.type === 'loop') {
            const d = CMD[item.body[0]];
            const lw = document.createElement('div');
            lw.className = 'loop-wrap';
            lw.innerHTML = `
        <div class="loop-label">🔁 ×${item.count}</div>
        <div class="dcard loop-body-card" style="width:46px;height:46px;cursor:default">
          <span class="de" style="font-size:18px">${d.e}</span>
          <span>${d.label}</span>
        </div>
        <span class="loop-dx" data-seq-idx="${i}">✕</span>`;
            lw.querySelector('.loop-dx').addEventListener('click', () => removeSeqItem(i));
            dz.appendChild(lw);

        } else if (item.type === 'func') {
            const fw = document.createElement('div');
            fw.className = 'loop-wrap';
            fw.style.cssText = 'border-color:rgba(255,100,100,.5); background:rgba(255,80,80,.08)';
            const icons = (G.funcDef || []).map((k) => CMD[k].e).join('');
            fw.innerHTML = `<div class="loop-label" style="color:#ff9090">🪄 פונקציה</div>
        <div style="font-size:17px;padding:2px 8px;letter-spacing:2px">${icons || '?'}</div>
        <span class="loop-dx" data-seq-idx="${i}">✕</span>`;
            fw.querySelector('.loop-dx').addEventListener('click', () => removeSeqItem(i));
            dz.appendChild(fw);

        } else if (item.type === 'if') {
            const d = CMD[item.dir];
            const dc = document.createElement('div');
            dc.className = 'dcard if-dcard';
            dc.innerHTML = `<span class="de">❓${d.e}</span>
        <span style="font-size:9px;font-weight:900;color:#ffe080;letter-spacing:.2px">אם ${d.label}</span>
        <span class="dx" data-seq-idx="${i}">✕</span>`;
            dc.querySelector('.dx').addEventListener('click', () => removeSeqItem(i));
            dz.appendChild(dc);
        }
    });

    // Function definition bar
    const hasFuncItem = G.seq.some((it) => it.type === 'func');
    let fb = dz.parentNode ? dz.parentNode.querySelector('.func-def-bar') : null;

    if (hasFuncItem && G.funcDef && G.funcDef.length > 0) {
        if (!fb) {
            fb = document.createElement('div');
            fb.className = 'func-def-bar';
            fb.style.cssText = 'background:rgba(255,100,100,.1); border:1px solid rgba(255,100,100,.3); border-radius:10px; padding:5px 12px; font-size:12px; color:#ff9090; text-align:center; margin-bottom:6px; direction:rtl;';
            if (dz.parentNode) dz.parentNode.insertBefore(fb, dz);
        }
        fb.innerHTML = '🪄 הפונקציה שלי: ' + (G.funcDef || []).map((k) => CMD[k].e).join(' ');
        const delBtn = document.createElement('button');
        delBtn.textContent = '✕ מחק';
        delBtn.style.cssText = 'background:transparent; color:rgba(255,150,150,.55); border:none; cursor:pointer; font-size:11px; font-family:var(--font); margin-right:6px;';
        delBtn.addEventListener('click', resetFuncDef);
        fb.appendChild(delBtn);
    } else if (fb) {
        fb.remove();
    }
}
