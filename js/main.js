/**
 * main.js — Entry point
 *
 * Wires up event listeners that replace inline onclick handlers
 * from the original HTML, and kicks off the app.
 */

document.addEventListener('DOMContentLoaded', () => {
    /* ── D-pad direction buttons ── */
    $('dp-up').addEventListener('click', () => addCmd('up'));
    $('dp-left').addEventListener('click', () => addCmd('left'));
    $('dp-right').addEventListener('click', () => addCmd('right'));
    $('dp-down').addEventListener('click', () => addCmd('down'));

    /* ── Sequence controls ── */
    const hintBtn = document.querySelector('.btn-hint');
    if (hintBtn) hintBtn.addEventListener('click', showHint);

    const clrBtn = document.querySelector('.btn-clr');
    if (clrBtn) clrBtn.addEventListener('click', clearSeq);

    /* ── Run button ── */
    $('btn-run').addEventListener('click', runProgram);

    /* ── Top bar: map button ── */
    const mapBtn = $('btn-map-topbar');
    if (mapBtn) mapBtn.addEventListener('click', goToMap);

    /* ── Profiles: add new ── */
    $('btn-add-profile').addEventListener('click', showNewProfile);

    /* ── New profile: confirm / back ── */
    $('btn-confirm-profile').addEventListener('click', confirmNewProfile);
    $('profile-name-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') confirmNewProfile();
    });

    $('btn-back-profiles').addEventListener('click', showProfiles);

    /* ── World map: switch player ── */
    const switchBtn = $('btn-switch-player');
    if (switchBtn) switchBtn.addEventListener('click', showProfiles);

    /* ── Win screen ── */
    $('wnext').addEventListener('click', nextLevel);
    $('wmap').addEventListener('click', goToMap);

    /* ── Intro overlays ── */
    $('btn-close-intro-loop').addEventListener('click', closeIntro);
    $('btn-close-intro-if').addEventListener('click', () => {
        $('intro-if').classList.add('off');
    });
    $('btn-close-intro-func').addEventListener('click', () => {
        $('intro-func').classList.add('off');
    });

    /* ── Resize handler ── */
    window.addEventListener('resize', () => {
        if (!G.running) {
            buildGrid();
            placeHero(false);
        }
    });

    /* ── Firebase analytics ── */
    initFirebase();
    window.addEventListener('beforeunload', trackSessionEnd);

    /* ── Start the app ── */
    showProfiles();
});
