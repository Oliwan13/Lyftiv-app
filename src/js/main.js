import '../styles/main.css';

import { dom } from './dom.js';
import { state, defaultSessions } from './state.js';
import { applyTheme } from './theme.js';
import { initPwa } from './services/pwa.js';
import { setupEventListeners } from './events.js';
import { createTable, populateDashboard, startSessionFromDashboard } from './ui.js';
import { loadPersistentIndividualTimers } from './services/timers.js';
import { startTotalWorkoutTimer, updateTotalTimeDisplay, updateTimerToggleButtonUI } from './services/workoutTimer.js';

/**
 * Initializes the entire application.
 */
function init() {
    // Set up the theme (dark/light mode)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        applyTheme(prefersDark.matches ? 'dark' : 'light');
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    // Load persisted workout state if it exists
    const inProgress = JSON.parse(localStorage.getItem('inProgressWorkout'));
    if (inProgress) {
        state.sessions = Array.isArray(inProgress.customSessions) ? inProgress.customSessions : JSON.parse(JSON.stringify(defaultSessions));
        state.currentSessionIndex = inProgress.sessionIndex || 0;
        if (state.currentSessionIndex >= state.sessions.length) {
            state.currentSessionIndex = 0;
        }

        if (inProgress.workoutStartTime) {
            state.workoutStartTime = inProgress.workoutStartTime;
            state.isWorkoutTimerPaused = inProgress.isWorkoutTimerPaused;
            state.totalPausedDuration = inProgress.totalPausedDuration || 0;

            if (!state.isWorkoutTimerPaused) {
                state.pauseStartTime = inProgress.pauseStartTime;
                startTotalWorkoutTimer();
            } else {
                state.pauseStartTime = inProgress.pauseStartTime || Date.now();
                updateTotalTimeDisplay();
                updateTimerToggleButtonUI(true);
            }
        }
    } else {
         state.sessions = JSON.parse(JSON.stringify(defaultSessions));
         localStorage.removeItem('inProgressWorkout');
    }
    
    // Handle mobile view specific UI adjustments
    if (state.isMobileView) {
        dom.sessionNotesSection.classList.add('hide-notes-section');
        state.isNotesSectionVisible = false;
    } else {
        dom.sessionNotesSection.classList.add('show-notes-section');
        state.isNotesSectionVisible = true;
    }

    // Show dashboard or main app view
    if (sessionStorage.getItem('dashboardShown')) {
        dom.dashboard.classList.add('hidden');
        dom.appContainer.classList.remove('hidden');
    } else {
        dom.appContainer.classList.add('hidden');
        dom.dashboard.classList.remove('hidden');
        populateDashboard();
    }

    createTable();
    setupEventListeners();
    loadPersistentIndividualTimers();
    initPwa();

    window.addEventListener('resize', () => {
        const newIsMobileView = window.matchMedia("(max-width: 768px)").matches;
        if (newIsMobileView !== state.isMobileView) {
            state.isMobileView = newIsMobileView;
            createTable(); // Re-render the table for the new view
            if (state.isMobileView && !state.isNotesSectionVisible) {
                dom.sessionNotesSection.classList.add('hide-notes-section');
            } else {
                dom.sessionNotesSection.classList.remove('hide-notes-section');
                dom.sessionNotesSection.classList.add('show-notes-section');
            }
        }
    });

    state.isInitialized = true;
}


// Start the application once the window has loaded
window.addEventListener('load', init);
