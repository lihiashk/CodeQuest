/**
 * levels.js — All 27 level definitions across 5 worlds
 *
 * Grid cell codes:
 *   g = grass (impassable)
 *   p = path (walkable)
 *   W = wall (blocked)
 *   X = goal
 *
 * col 0 = LEFT side of screen (LTR grid, no RTL flip).
 * Commands move in pure screen directions.
 *
 * Level properties:
 *   id       — display number (1-27)
 *   land     — world name with emoji
 *   concept  — programming concept taught
 *   mission  — mission description (Hebrew)
 *   hint     — hint text (Hebrew) — progressive, gentle hint
 *   intro    — optional, triggers intro overlay ('loop'|'if'|'func')
 *   grid     — 2D array of cell codes
 *   start    — {r, c} starting position
 *   goal     — {r, c} goal position
 *   collect  — optional required collectible {r, c, e}
 *   bonus    — optional bonus item {r, c, e}
 *   tiles    — optional trigger tiles [{r, c, e, cmd}]
 *   cmds     — available command keys for this level
 *   ideal    — number of commands for 3-star rating
 *   coins    — base coin reward
 *   decos    — decorative emojis [{r, c, e}]
 */

const LEVELS = [

    /* ══════════════════════════════════════════
       World 1: 🌲 יער הקסם — Sequences (1-5)
    ══════════════════════════════════════════ */
    {
        id: 1, land: '🌲 יער הקסם', concept: 'רצף',
        mission: 'הגיעו אל היהלום! 💎',
        hint: 'נסו ללכת לאורך השביל — קודם למטה, אחר כך הצידה 🛤️',
        grid: [
            ['g', 'p', 'g', 'g', 'g'],
            ['g', 'p', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'p', 'g'],
            ['g', 'g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 4, c: 3 },
        cmds: ['up', 'down', 'right', 'left'],
        ideal: 6, coins: 30,
        decos: [{ r: 0, c: 3, e: '🌳' }, { r: 2, c: 4, e: '🦋' }, { r: 4, c: 0, e: '🍄' }],
    },
    {
        id: 2, land: '🌲 יער הקסם', concept: 'רצף',
        mission: 'אספו את המפתח 🗝️ והגיעו לשער!',
        hint: 'קודם הגיעו למפתח, ואז חזרו בדרך אחרת ליעד 🔑',
        grid: [
            ['g', 'p', 'p', 'p', 'p'],
            ['g', 'g', 'g', 'g', 'p'],
            ['g', 'g', 'g', 'g', 'p'],
            ['g', 'p', 'p', 'p', 'p'],
            ['g', 'X', 'g', 'g', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 4, c: 1 },
        collect: { r: 0, c: 4, e: '🗝️' },
        cmds: ['up', 'down', 'right', 'left'],
        ideal: 8, coins: 35,
        decos: [{ r: 1, c: 0, e: '🌸' }, { r: 2, c: 1, e: '🌳' }, { r: 3, c: 0, e: '🍀' }],
    },
    {
        id: 3, land: '🌲 יער הקסם', concept: 'רצף',
        mission: 'יש קירות בדרך — עקפו אותם! 🧱',
        hint: 'הקיר חוסם — נסו לרדת ולהקיף מסביב 🔄',
        grid: [
            ['g', 'p', 'W', 'g', 'g', 'g'],
            ['g', 'p', 'W', 'g', 'g', 'g'],
            ['g', 'p', 'W', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'g', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 5, c: 4 },
        cmds: ['up', 'down', 'right', 'left'],
        ideal: 9, coins: 40,
        decos: [{ r: 0, c: 4, e: '🌲' }, { r: 2, c: 5, e: '🦅' }, { r: 5, c: 0, e: '🍄' }],
    },
    {
        id: 4, land: '🌲 יער הקסם', concept: 'רצף',
        mission: 'מבוך בין העצים — מצאו את הדרך! 🌿',
        hint: 'עקבו אחרי השביל — הוא מתפתל דרך המבוך 🌲',
        grid: [
            ['g', 'p', 'W', 'g', 'g', 'g'],
            ['g', 'p', 'W', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'p', 'W', 'g'],
            ['g', 'g', 'g', 'p', 'W', 'g'],
            ['g', 'g', 'g', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 5, c: 4 },
        bonus: { r: 2, c: 2, e: '🍎' },
        cmds: ['up', 'down', 'right', 'left'],
        ideal: 8, coins: 42,
        decos: [{ r: 0, c: 4, e: '🌳' }, { r: 1, c: 5, e: '🦋' }, { r: 5, c: 0, e: '🍄' }],
    },
    {
        id: 5, land: '🌲 יער הקסם', concept: 'רצף',
        mission: 'אספו את הכוכב 🌟 בדרך ליעד!',
        hint: 'המסלול מתפתל — אל תשכחו לעבור דרך הכוכב! ⭐',
        grid: [
            ['g', 'p', 'p', 'W', 'g', 'g'],
            ['g', 'g', 'p', 'W', 'g', 'g'],
            ['g', 'g', 'p', 'p', 'p', 'g'],
            ['g', 'g', 'W', 'g', 'p', 'g'],
            ['g', 'g', 'W', 'g', 'p', 'p'],
            ['g', 'g', 'g', 'g', 'g', 'X'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 5, c: 5 },
        collect: { r: 2, c: 3, e: '🌟' },
        cmds: ['up', 'down', 'right', 'left'],
        ideal: 9, coins: 45,
        decos: [{ r: 0, c: 4, e: '🦅' }, { r: 3, c: 0, e: '🌲' }, { r: 5, c: 0, e: '🍀' }],
    },

    /* ══════════════════════════════════════════
       World 2: ⛰️ הר הלולאות — Loops (6-10)
    ══════════════════════════════════════════ */
    {
        id: 6, land: '⛰️ הר הלולאות', concept: 'לולאה',
        mission: 'פקודה חדשה: לולאה! כמה פעמים תרצו? 🔁',
        hint: 'במקום ללחוץ שוב ושוב — נסו לולאה על כיוון אחד! 🔄',
        intro: 'loop',
        grid: [
            ['g', 'p', 'g', 'g'],
            ['g', 'p', 'g', 'g'],
            ['g', 'p', 'g', 'g'],
            ['g', 'p', 'g', 'g'],
            ['g', 'X', 'g', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 4, c: 1 },
        cmds: ['up', 'down', 'right', 'left', 'loop'],
        ideal: 2, coins: 48,
        decos: [{ r: 0, c: 3, e: '☁️' }, { r: 2, c: 2, e: '🦅' }, { r: 4, c: 3, e: '⛰️' }],
    },
    {
        id: 7, land: '⛰️ הר הלולאות', concept: 'לולאה',
        mission: 'לולאה אחת למטה, לולאה אחת ימינה! 🔁',
        hint: 'צריך שתי לולאות — אחת לכל כיוון. כמה צעדים בכל כיוון? ספרו! 🧮',
        grid: [
            ['g', 'p', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'p', 'p', 'p'],
            ['g', 'g', 'g', 'g', 'g', 'X'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 4, c: 5 },
        cmds: ['up', 'down', 'right', 'left', 'loop'],
        ideal: 3, coins: 50,
        decos: [{ r: 0, c: 4, e: '☁️' }, { r: 2, c: 5, e: '🦅' }, { r: 3, c: 0, e: '🪨' }],
    },
    {
        id: 8, land: '⛰️ הר הלולאות', concept: 'לולאה',
        mission: 'אספו את הנוצה 🪶 ואחר כך הגיעו ליעד!',
        hint: 'קודם הגיעו לנוצה! אחר כך מצאו דרך ליעד. איפה אפשר להשתמש בלולאה? 🤔',
        grid: [
            ['g', 'p', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'p', 'g'],
            ['g', 'g', 'g', 'p', 'g'],
            ['g', 'g', 'g', 'p', 'g'],
            ['g', 'X', 'p', 'p', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 4, c: 1 },
        collect: { r: 0, c: 3, e: '🪶' },
        cmds: ['up', 'down', 'right', 'left', 'loop'],
        ideal: 5, coins: 52,
        decos: [{ r: 1, c: 0, e: '🪨' }, { r: 3, c: 4, e: '⛰️' }],
    },
    {
        id: 9, land: '⛰️ הר הלולאות', concept: 'לולאה',
        mission: 'לולאות גדולות — ואספו את המטבע 🪙 בדרך!',
        hint: 'ספרו כמה צעדים בכל כיוון ישר — שם תשתמשו בלולאה 📐',
        grid: [
            ['g', 'p', 'p', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'g', 'g', 'p', 'g', 'g'],
            ['g', 'g', 'g', 'g', 'p', 'g', 'g'],
            ['g', 'g', 'g', 'g', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 4, c: 5 },
        collect: { r: 3, c: 5, e: '🪙' },
        cmds: ['up', 'down', 'right', 'left', 'loop'],
        ideal: 5, coins: 54,
        decos: [{ r: 0, c: 6, e: '☁️' }, { r: 2, c: 6, e: '🦅' }, { r: 4, c: 0, e: '🪨' }],
    },
    {
        id: 10, land: '⛰️ הר הלולאות', concept: 'לולאה',
        mission: 'סלעים חוסמים — תכנן לולאות חכמות! 🪨',
        hint: 'הקיר מפריד — צריך ללכת מסביב. חפשו קטעים ישרים ללולאות 🔁',
        grid: [
            ['g', 'p', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'W', 'W', 'g', 'g'],
            ['g', 'p', 'p', 'p', 'p', 'g'],
            ['g', 'g', 'W', 'g', 'p', 'g'],
            ['g', 'g', 'W', 'g', 'p', 'g'],
            ['g', 'g', 'g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 5, c: 4 },
        cmds: ['up', 'down', 'right', 'left', 'loop'],
        ideal: 3, coins: 56,
        decos: [{ r: 0, c: 5, e: '⛰️' }, { r: 2, c: 5, e: '☁️' }, { r: 5, c: 0, e: '🪨' }],
    },

    /* ══════════════════════════════════════════
       World 3: 🏰 מבצר הקסמים — Magic Tiles (11-15)
    ══════════════════════════════════════════ */
    {
        id: 11, land: '🏰 מבצר הקסמים', concept: 'אריחי קסם',
        mission: 'האריח 🗝️ יפנה אתכם ימינה — פשוט לכו עליו!',
        hint: 'פשוט לכו ישר למטה — האריח הזוהר יעשה את הפנייה בשבילכם ✨',
        intro: 'if',
        grid: [
            ['g', 'p', 'g', 'g'],
            ['g', 'p', 'g', 'g'],
            ['g', 'p', 'p', 'g'],
            ['g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 3, c: 2 },
        tiles: [{ r: 2, c: 1, e: '🗝️', cmd: 'right' }],
        cmds: ['up', 'down', 'right', 'left'],
        ideal: 3, coins: 58,
        decos: [{ r: 0, c: 2, e: '🕯️' }, { r: 0, c: 3, e: '🛡️' }, { r: 3, c: 0, e: '⚔️' }],
    },
    {
        id: 12, land: '🏰 מבצר הקסמים', concept: 'אריחי קסם',
        mission: 'שני אריחי קסם בדרך — תכנן את הסדר! 🧩',
        hint: 'תסתכלו על האריחים — לאן כל אחד דוחף? תתקדמו אליהם בזהירות 🔮',
        grid: [
            ['g', 'p', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'p', 'g'],
            ['g', 'g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 4, c: 3 },
        tiles: [{ r: 1, c: 2, e: '🗝️', cmd: 'down' }, { r: 2, c: 3, e: '⭐', cmd: 'down' }],
        cmds: ['up', 'down', 'right', 'left'],
        ideal: 4, coins: 60,
        decos: [{ r: 0, c: 3, e: '🕯️' }, { r: 4, c: 0, e: '⚔️' }, { r: 0, c: 4, e: '🛡️' }],
    },
    {
        id: 13, land: '🏰 מבצר הקסמים', concept: 'אריחי קסם',
        mission: '🔑 דוחף ימינה, ⭐ דוחף למטה — שניהם יחד! 🎯',
        hint: 'דרכו על אריח אחד — הוא ידחוף אתכם לשני! שרשרת ✨',
        grid: [
            ['g', 'p', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'p', 'g'],
            ['g', 'g', 'g', 'p', 'p'],
            ['g', 'g', 'g', 'g', 'X'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 4, c: 4 },
        tiles: [{ r: 1, c: 2, e: '🔑', cmd: 'right' }, { r: 1, c: 3, e: '⭐', cmd: 'down' }],
        cmds: ['up', 'down', 'right', 'left'],
        ideal: 4, coins: 62,
        decos: [{ r: 0, c: 4, e: '🕯️' }, { r: 2, c: 0, e: '🛡️' }, { r: 3, c: 0, e: '⚔️' }],
    },
    {
        id: 14, land: '🏰 מבצר הקסמים', concept: 'אריחי קסם',
        mission: 'שרשרת קסם: אריח אחד מוביל לשני! ⛓️',
        hint: 'האריח הראשון ידחוף אתכם — ושם מחכה עוד אריח! 🧲',
        grid: [
            ['g', 'p', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'p', 'p'],
            ['g', 'g', 'g', 'g', 'X'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 4, c: 4 },
        tiles: [{ r: 1, c: 2, e: '🗝️', cmd: 'down' }, { r: 2, c: 2, e: '🪙', cmd: 'right' }],
        cmds: ['up', 'down', 'right', 'left'],
        ideal: 4, coins: 64,
        decos: [{ r: 0, c: 4, e: '🕯️' }, { r: 1, c: 4, e: '⚔️' }, { r: 4, c: 0, e: '🛡️' }],
    },
    {
        id: 15, land: '🏰 מבצר הקסמים', concept: 'אריחי קסם',
        mission: 'שלושה אריחי קסם — שרשרת ארוכה! 🔗🔗',
        hint: 'שלושה אריחים בשרשרת. רק תגיעו לראשון ותנו לקסם לעבוד! 🪄',
        grid: [
            ['g', 'p', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'g', 'g', 'g'],
            ['g', 'g', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'g', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 4, c: 4 },
        tiles: [
            { r: 1, c: 2, e: '🗝️', cmd: 'down' },
            { r: 2, c: 3, e: '⭐', cmd: 'down' },
            { r: 3, c: 3, e: '🔮', cmd: 'right' },
        ],
        cmds: ['up', 'down', 'right', 'left'],
        ideal: 4, coins: 66,
        decos: [{ r: 0, c: 5, e: '🕯️' }, { r: 2, c: 5, e: '🛡️' }, { r: 4, c: 0, e: '⚔️' }],
    },

    /* ══════════════════════════════════════════
       World 4: 🌋 הר הגעש — Functions (16-21)
    ══════════════════════════════════════════ */
    {
        // Level 16: intro to functions — diagonal staircase, func = right+down ×3
        id: 16, land: '🌋 הר הגעש', concept: 'פונקציה',
        mission: 'פקודה חדשה: פונקציה! הגדירו אותה וקראו לה! 📣',
        hint: 'הגדירו פונקציה עם שתי פקודות ואז קראו לה כמה פעמים 🪄',
        intro: 'func',
        grid: [
            ['g', 'p', 'g', 'g', 'g'],
            ['g', 'g', 'p', 'g', 'g'],
            ['g', 'g', 'g', 'p', 'g'],
            ['g', 'g', 'g', 'g', 'X'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 3, c: 4 },
        cmds: ['up', 'down', 'right', 'left', 'loop', 'func'],
        ideal: 3, coins: 68,
        decos: [{ r: 0, c: 4, e: '🌋' }, { r: 2, c: 0, e: '🔥' }, { r: 3, c: 0, e: '🪨' }],
    },
    {
        // Level 17: FIXED — diagonal staircase requires func = down+right,
        // called 5 times. Can't be done efficiently without a function.
        id: 17, land: '🌋 הר הגעש', concept: 'פונקציה',
        mission: 'מדרגות ארוכות — הפונקציה תחסוך לכם עבודה! 💪',
        hint: 'שימו לב לדפוס החוזר — כל מדרגה היא אותו צעד! 👀',
        grid: [
            ['g', 'p', 'g', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'g', 'g', 'g', 'g'],
            ['g', 'g', 'p', 'g', 'g', 'g', 'g'],
            ['g', 'g', 'p', 'p', 'g', 'g', 'g'],
            ['g', 'g', 'g', 'p', 'g', 'g', 'g'],
            ['g', 'g', 'g', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'g', 'g', 'X', 'g', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 6, c: 4 },
        cmds: ['up', 'down', 'right', 'left', 'func'],
        ideal: 4, coins: 70,
        decos: [{ r: 0, c: 5, e: '🌋' }, { r: 3, c: 6, e: '🔥' }, { r: 6, c: 0, e: '🪨' }],
    },
    {
        // Level 18: FIXED — zigzag requires func = down+down+right,
        // called 3 times. Needs function for efficiency.
        id: 18, land: '🌋 הר הגעש', concept: 'פונקציה',
        mission: 'אספו את הפנס 🔦 — הפונקציה תעזור!',
        hint: 'חפשו דפוס שחוזר יותר מפעם אחת — הגדירו אותו כפונקציה! 🔍',
        grid: [
            ['g', 'p', 'g', 'g', 'g'],
            ['g', 'p', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'p', 'g', 'g'],
            ['g', 'g', 'p', 'g', 'g'],
            ['g', 'g', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 6, c: 3 },
        collect: { r: 2, c: 2, e: '🔦' },
        cmds: ['up', 'down', 'right', 'left', 'func'],
        ideal: 4, coins: 72,
        decos: [{ r: 0, c: 4, e: '🌋' }, { r: 4, c: 0, e: '🔥' }, { r: 6, c: 0, e: '🪨' }],
    },
    {
        id: 19, land: '🌋 הר הגעש', concept: 'פונקציה',
        mission: 'הגדירו צעד אלכסוני וקראו לו כמה פעמים! 🔥',
        hint: 'כל מדרגה זהה — מהי הפקודה שחוזרת? הגדירו אותה! 🪜',
        grid: [
            ['g', 'p', 'p', 'W', 'g', 'g'],
            ['g', 'W', 'p', 'p', 'W', 'g'],
            ['g', 'g', 'W', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'W', 'p', 'p'],
            ['g', 'g', 'g', 'g', 'W', 'X'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 4, c: 5 },
        bonus: { r: 2, c: 4, e: '💎' },
        cmds: ['up', 'down', 'right', 'left', 'loop', 'func'],
        ideal: 4, coins: 75,
        decos: [{ r: 0, c: 5, e: '🌋' }, { r: 4, c: 0, e: '🔥' }],
    },
    {
        id: 20, land: '🌋 הר הגעש', concept: 'פונקציה',
        mission: 'הפונקציה תוביל אתכם ישר אל הכתר 👑!',
        hint: 'הדפוס חוזר — איך עושים "מדרגה"? הגדירו וקראו! 🏗️',
        grid: [
            ['g', 'p', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'p', 'p'],
            ['g', 'g', 'g', 'g', 'X'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 4, c: 4 },
        collect: { r: 2, c: 3, e: '👑' },
        cmds: ['up', 'down', 'right', 'left', 'loop', 'func'],
        ideal: 4, coins: 78,
        decos: [{ r: 0, c: 4, e: '🌋' }, { r: 4, c: 0, e: '🔥' }, { r: 2, c: 0, e: '🪨' }],
    },
    {
        // Level 21: FIXED — mission now says "twice" to match the grid.
        // Path: down,down,right, down,down,right = func(down,down,right)×2
        id: 21, land: '🌋 הר הגעש', concept: 'פונקציה',
        mission: 'בנו פונקציית מדרגות וקראו לה פעמיים! 🪜',
        hint: 'כל "מדרגה" כאן יותר גדולה — כמה צעדים למטה לפני הפנייה? 🤔',
        grid: [
            ['g', 'p', 'g', 'g', 'g'],
            ['g', 'p', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'p', 'g', 'g'],
            ['g', 'g', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 5, c: 3 },
        collect: { r: 2, c: 2, e: '🔋' },
        cmds: ['up', 'down', 'right', 'left', 'loop', 'func'],
        ideal: 3, coins: 80,
        decos: [{ r: 0, c: 4, e: '🌋' }, { r: 3, c: 4, e: '🔥' }, { r: 5, c: 0, e: '🪨' }],
    },

    /* ══════════════════════════════════════════
       World 5: 🚀 חלל הקוד — Combined (22-27)
    ══════════════════════════════════════════ */
    {
        // Level 22: FIXED hint — path is down×3, right×2, down×3, right×3, down×1
        id: 22, land: '🚀 חלל הקוד', concept: 'שילוב',
        mission: 'חצו את שדה המכשולים בחלל! 🌌',
        hint: 'עקבו אחרי השביל — חפשו קטעים ישרים שאפשר לעשות עליהם לולאה 🔭',
        grid: [
            ['g', 'p', 'g', 'g', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'W', 'W', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'g', 'g', 'g', 'W', 'W', 'g'],
            ['g', 'p', 'p', 'p', 'g', 'g', 'g', 'g'],
            ['g', 'g', 'g', 'p', 'W', 'W', 'g', 'g'],
            ['g', 'g', 'g', 'p', 'g', 'g', 'g', 'g'],
            ['g', 'g', 'g', 'p', 'p', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'g', 'g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 7, c: 6 },
        collect: { r: 3, c: 2, e: '🔋' },
        bonus: { r: 6, c: 5, e: '🌟' },
        cmds: ['up', 'down', 'right', 'left', 'loop', 'func'],
        ideal: 9, coins: 85,
        decos: [{ r: 0, c: 7, e: '🪐' }, { r: 4, c: 7, e: '⭐' }, { r: 7, c: 0, e: '🛸' }],
    },
    {
        id: 23, land: '🚀 חלל הקוד', concept: 'שילוב',
        mission: 'שלבו פונקציה, לולאה ואיסוף — בהצלחה! 🏆',
        hint: 'תכננו את המסלול קודם — איפה המפתח? איפה היעד? מה חוזר? 🗺️',
        grid: [
            ['g', 'p', 'g', 'g', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'W', 'W', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'g', 'g', 'g', 'W', 'g', 'g'],
            ['g', 'p', 'p', 'p', 'g', 'W', 'g', 'g'],
            ['g', 'g', 'g', 'p', 'W', 'g', 'g', 'g'],
            ['g', 'W', 'g', 'p', 'g', 'g', 'W', 'g'],
            ['g', 'g', 'g', 'p', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'W', 'g', 'g', 'p', 'W', 'g'],
            ['g', 'g', 'g', 'g', 'g', 'X', 'g', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 8, c: 5 },
        collect: { r: 3, c: 2, e: '🔑' },
        bonus: { r: 6, c: 4, e: '👑' },
        cmds: ['up', 'down', 'right', 'left', 'loop', 'func'],
        ideal: 12, coins: 88,
        decos: [{ r: 0, c: 7, e: '🌟' }, { r: 4, c: 7, e: '🪐' }, { r: 8, c: 0, e: '🛸' }],
    },
    {
        id: 24, land: '🚀 חלל הקוד', concept: 'שילוב',
        mission: 'מדרגות ענק — פונקציה תעזור לטפס! 🌋🚀',
        hint: 'כל מדרגה אותו דבר — מה הדפוס? הגדירו פונקציה! 🧱',
        grid: [
            ['g', 'p', 'g', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'W', 'W', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'g', 'g', 'g', 'g'],
            ['g', 'g', 'p', 'W', 'W', 'g', 'g'],
            ['g', 'g', 'p', 'p', 'g', 'g', 'g'],
            ['g', 'g', 'g', 'p', 'W', 'W', 'g'],
            ['g', 'g', 'g', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'g', 'g', 'p', 'W', 'g'],
            ['g', 'g', 'g', 'g', 'X', 'g', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 8, c: 4 },
        collect: { r: 2, c: 2, e: '🧲' },
        bonus: { r: 4, c: 3, e: '🌠' },
        cmds: ['up', 'down', 'right', 'left', 'loop', 'func'],
        ideal: 4, coins: 90,
        decos: [{ r: 0, c: 6, e: '🪐' }, { r: 4, c: 6, e: '⭐' }, { r: 8, c: 0, e: '🛸' }],
    },
    {
        id: 25, land: '🚀 חלל הקוד', concept: 'שילוב',
        mission: 'נווטו בין המכשולים ואספו את הכוכבים! ⭐',
        hint: 'חלקו את המסלול לקטעים — בכל קטע ישר השתמשו בלולאה 📏',
        grid: [
            ['g', 'p', 'g', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'W', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'g', 'g', 'p', 'W', 'g'],
            ['g', 'g', 'g', 'g', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'W', 'g', 'p', 'g'],
            ['g', 'g', 'g', 'g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 6, c: 5 },
        collect: { r: 2, c: 3, e: '🌙' },
        bonus: { r: 4, c: 5, e: '💫' },
        cmds: ['up', 'down', 'right', 'left', 'loop', 'func'],
        ideal: 10, coins: 92,
        decos: [{ r: 0, c: 6, e: '🪐' }, { r: 3, c: 6, e: '🌟' }, { r: 6, c: 0, e: '🛸' }],
    },
    {
        id: 26, land: '🚀 חלל הקוד', concept: 'שילוב',
        mission: 'המבוך הגדול — תכנון מדויק נדרש! 🔭',
        hint: 'מבוך ארוך — חלקו אותו לחלקים. חפשו דפוסים חוזרים 🧩',
        grid: [
            ['g', 'p', 'g', 'g', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'W', 'W', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'g', 'W', 'g', 'g', 'g'],
            ['g', 'g', 'p', 'p', 'p', 'g', 'g', 'g'],
            ['g', 'g', 'W', 'W', 'p', 'g', 'g', 'g'],
            ['g', 'g', 'g', 'g', 'p', 'p', 'p', 'g'],
            ['g', 'g', 'g', 'g', 'W', 'W', 'p', 'g'],
            ['g', 'g', 'g', 'g', 'g', 'g', 'p', 'g'],
            ['g', 'g', 'g', 'g', 'g', 'g', 'X', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 8, c: 6 },
        collect: { r: 3, c: 3, e: '🔭' },
        bonus: { r: 5, c: 5, e: '🌠' },
        cmds: ['up', 'down', 'right', 'left', 'loop', 'func'],
        ideal: 13, coins: 95,
        decos: [{ r: 0, c: 7, e: '🪐' }, { r: 4, c: 7, e: '⭐' }, { r: 8, c: 0, e: '🛸' }],
    },
    {
        id: 27, land: '🚀 חלל הקוד', concept: 'שילוב',
        mission: 'שלב הסיום — הפכו לקוד-מאסטר! 🏆✨',
        hint: 'השלב האחרון! תכננו היטב — חפשו את הדרך הקצרה ביותר 🏁',
        grid: [
            ['g', 'p', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'W', 'W', 'g', 'g', 'g', 'g', 'g'],
            ['g', 'p', 'p', 'g', 'W', 'g', 'g', 'g', 'g'],
            ['g', 'g', 'p', 'p', 'p', 'W', 'g', 'g', 'g'],
            ['g', 'g', 'W', 'W', 'p', 'g', 'g', 'g', 'g'],
            ['g', 'g', 'g', 'g', 'p', 'p', 'p', 'g', 'g'],
            ['g', 'g', 'g', 'g', 'W', 'W', 'p', 'W', 'g'],
            ['g', 'g', 'g', 'g', 'g', 'g', 'p', 'W', 'g'],
            ['g', 'g', 'g', 'g', 'g', 'g', 'X', 'g', 'g'],
        ],
        start: { r: 0, c: 1 }, goal: { r: 8, c: 6 },
        collect: { r: 3, c: 4, e: '🔑' },
        bonus: { r: 5, c: 5, e: '👑' },
        cmds: ['up', 'down', 'right', 'left', 'loop', 'func'],
        ideal: 13, coins: 100,
        decos: [{ r: 0, c: 8, e: '🌟' }, { r: 4, c: 8, e: '🪐' }, { r: 8, c: 0, e: '🛸' }],
    },
];
