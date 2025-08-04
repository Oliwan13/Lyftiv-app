import { dom } from './dom.js';
import { state } from './state.js';
import { handleThemeToggle, handleHomeClick, handleSessionChange, handleAddExercise, handleFinishSession, handleImportClick, handleExportClick, handleFileInputChange, handleBottomNavClick } from './handlers.js';
import { handleHistoryModal, handleNewSessionModal, handleLoadOptionsModal, handlePlateCalculatorModal, handleQuickEditModal } from './components/modals.js';
import { handleTableActions, handleTableInput, handleTableBlur, handleTableKeyDown, handleSeriesDelete } from './components/table.js';
import { handleTotalWorkoutTimer, handleVisibilityChange } from './services/workoutTimer.js';

/**
 * Central setup for all application event listeners.
 * This function connects DOM elements to their handler functions.
 */
export function setupEventListeners() {
    // Global and App-level controls
    dom.themeToggleBtn.addEventListener('click', handleThemeToggle);
    dom.homeBtn.addEventListener('click', handleHomeClick);
    dom.sessionSelect.addEventListener('change', handleSessionChange);
    
    // Main Action Buttons
    dom.addExerciseBtn.addEventListener('click', handleAddExercise);
    document.getElementById('finishSessionBtn').addEventListener('click', handleFinishSession);
    dom.importBtn.addEventListener('click', handleImportClick);
    dom.importFileInput.addEventListener('change', handleFileInputChange);
    dom.exportBtn.addEventListener('click', handleExportClick);

    // Exercise List (Table/Cards) Event Delegation
    dom.exerciseListContainer.addEventListener('click', handleTableActions);
    dom.exerciseListContainer.addEventListener('input', handleTableInput);
    dom.exerciseListContainer.addEventListener('blur', handleTableBlur, true);
    dom.exerciseListContainer.addEventListener('keydown', handleTableKeyDown);
    
    // Special handler for series deletion (press and hold / double click)
    handleSeriesDelete();

    // Modals
    handleHistoryModal();
    handleNewSessionModal();
    handleLoadOptionsModal();
    handlePlateCalculatorModal();
    handleQuickEditModal();

    // Total Workout Timer
    dom.toggleWorkoutTimerBtn.addEventListener('click', () => handleTotalWorkoutTimer('toggle'));
    dom.resetWorkoutTimerBtn.addEventListener('click', () => handleTotalWorkoutTimer('reset'));

    // Bottom Navigation for Mobile
    dom.bottomAddExerciseBtn.addEventListener('click', () => handleBottomNavClick('addExercise'));
    dom.bottomNotesBtn.addEventListener('click', () => handleBottomNavClick('notes'));
    dom.bottomScrollBtn.addEventListener('click', () => handleBottomNavClick('scroll'));
    dom.bottomViewHistoryBtn.addEventListener('click', () => handleBottomNavClick('history'));
    dom.bottomPlateCalculatorBtn.addEventListener('click', () => handleBottomNavClick('calculator'));
    
    // Browser/Document events
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) { 
            if (e.key === 's') { e.preventDefault(); handleFinishSession(); } 
            if (e.key === 'e') { e.preventDefault(); handleExportClick(); } 
        }
        if (e.key === 'Escape') { 
            // This is handled inside each modal's setup function for better encapsulation
        }
    });
}
