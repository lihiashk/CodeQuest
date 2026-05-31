/**
 * ui.js — Hints, confetti, intro overlay helpers
 */

/** Show the hint toast for the current level. */
function showHint() {
    const t = $('hint-toast');
    t.textContent = '💡 ' + lv().hint;
    t.classList.remove('off');

    // Analytics: track hint usage
    G.hintUsedThisLevel = true;
    trackHintUsed(lv().id);
}

/** Close the loop intro overlay. */
function closeIntro() {
    $('intro-overlay').classList.add('off');
}

/**
 * Spawn confetti particles that fall and fade out.
 * @param {number} [n=52] - Number of confetti pieces
 */
function confetti(n = 52) {
    for (let i = 0; i < n; i++) {
        const el = document.createElement('div');
        el.className = 'conf';
        el.style.cssText = `
      left:${Math.random() * 100}vw; top:0;
      background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};
      width:${6 + Math.random() * 8}px;
      height:${6 + Math.random() * 8}px;
      border-radius:${Math.random() > .5 ? '50%' : '2px'};
      animation-duration:${1.5 + Math.random() * 1.8}s;
      animation-delay:${Math.random() * .4}s;`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3500);
    }
}
