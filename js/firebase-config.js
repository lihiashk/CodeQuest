/**
 * firebase-config.js — Firebase SDK initialization
 *
 * ⚠️  PASTE YOUR OWN FIREBASE CONFIG below.
 *     Get it from: Firebase Console → Project Settings → General → Your apps → Config
 *
 * The game works fine without Firebase — localStorage handles everything locally.
 * Firebase just adds cloud analytics on top.
 */

const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyBSQuAvmZ6kbnMlKX94hkMXQLbTGNDgkYs',
    authDomain: 'codequest-game-48e7e.firebaseapp.com',
    projectId: 'codequest-game-48e7e',
    storageBucket: 'codequest-game-48e7e.firebasestorage.app',
    messagingSenderId: '21931225791',
    appId: '1:21931225791:web:b7adff2b2fad18e41c8c0a',
};

/** Whether Firebase is successfully initialized */
let firebaseReady = false;

/** Firestore database reference */
let db = null;

/**
 * Initialize Firebase. Called once on page load.
 * If config is placeholder or SDK fails, the game continues without analytics.
 */
function initFirebase() {
    try {
        if (FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
            console.warn('[CQ Analytics] Firebase config not set — running in offline mode.');
            return;
        }
        if (typeof firebase === 'undefined') {
            console.warn('[CQ Analytics] Firebase SDK not loaded.');
            return;
        }

        firebase.initializeApp(FIREBASE_CONFIG);
        db = firebase.firestore();
        firebaseReady = true;
        console.log('[CQ Analytics] Firebase initialized ✓');
    } catch (err) {
        console.warn('[CQ Analytics] Firebase init failed:', err.message);
    }
}
