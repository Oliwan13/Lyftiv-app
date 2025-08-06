// src/js/state.js
import { defaultSessions } from './utils/constants.js'; // You will need to create this file too

/**
 * Centralized application state.
 * This object is the single source of truth for the app's data.
 */
export let state = {
    sessions: [],
    currentSessionIndex: 0,
    timers: {}, // For individual exercise rest timers
    workoutStartTime: null,
    totalWorkoutTimeInterval: null,
    isWorkoutTimerPaused: true,
    totalPausedDuration: 0,
    pauseStartTime: 0,
    sessionToLoad: null,
    lastDeletedExercise: null,
    linkingState: { active: false, fromIndex: null },
    quickEditIndex: null,
    isMobileView: window.matchMedia("(max-width: 768px)").matches,
    isNotesSectionVisible: false,
    deferredPwaPrompt: null,
    isInitialized: false,
    pressTimer: null
};

/**
 * Loads the initial state from localStorage or sets defaults.
 */
export function loadInitialState() {
    const inProgress = JSON.parse(localStorage.getItem('inProgressWorkout'));
    if (inProgress) {
        // Your logic to load from 'inProgress' goes here
        // For example:
        state.sessions = Array.isArray(inProgress.customSessions) ? inProgress.customSessions : JSON.parse(JSON.stringify(defaultSessions));
        state.currentSessionIndex = inProgress.sessionIndex || 0;
        // ... and so on for the rest of the saved state properties
    } else {
        state.sessions = JSON.parse(JSON.stringify(defaultSessions));
        localStorage.removeItem('inProgressWorkout');
    }
}
