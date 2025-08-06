/**
 * =====================================================================================
 * Main Application Entry Point
 * =====================================================================================
 * This file initializes the application. It imports necessary modules,
 * sets up the initial state, and attaches the primary event listeners.
 *
 * @module main
 * =====================================================================================
 */

import { dom } from './dom.js';
import { state, loadInitialState, saveCurrentState } from './state.js';
import { setupEventListeners } from './events.js'; // We'll create this file
import { applyTheme } from './ui/theme.js'; // We'll create this file
import { populateDashboard } from './ui/dashboard.js';
import { createTable } from './ui/exerciseTable.js';
import { loadPersistentIndividualTimers } from './features/timers.js';
import { exportCSV } from './features/data.js';


/**
 * Initializes the entire application.
 * This function is called once the DOM is fully loaded.
 */
function init() {
    // Set the theme based on user preference or localStorage
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

    // Load the initial state of the application from localStorage
    loadInitialState();

    // Show dashboard or main app view
    if (sessionStorage.getItem('dashboardShown')) {
        dom.dashboard.classList.add('visually-hidden');
        dom.appContainer.classList.remove('hidden');
    } else {
        dom.appContainer.classList.add('hidden');
        dom.dashboard.classList.remove('visually-hidden');
        populateDashboard();
    }
    
    // Initial UI setup
    updateSessionSelectOptions(); // You'll move this function
    dom.sessionSelect.value = state.currentSessionIndex;
    createTable();
    setupEventListeners();
    loadPersistentIndividualTimers();

    // Handle window resizing for responsive view changes
    window.addEventListener('resize', () => {
        const newIsMobileView = window.matchMedia("(max-width: 768px)").matches;
        if (newIsMobileView !== state.isMobileView) {
            state.isMobileView = newIsMobileView;
            createTable(); // Re-render the table for the new view
            // Add logic to show/hide notes section if needed
        }
    });

    state.isInitialized = true;
    console.log("Lyftiv App Initialized!");
}

// Start the application once the DOM is ready
window.addEventListener('load', init);

