/**
 * Manages the main workout timer for the entire session.
 */
import { dom } from '../dom.js';
import { state } from '../state.js';
import { formatTime } from '../utils/formatters.js';
import { showNotification } from '../components/notifications.js';
import { customConfirm } from '../components/modals.js';
import { saveCurrentStateToLocalStorage } from './storage.js';

export function updateTotalTimeDisplay() {
    if (!state.workoutStartTime) {
        dom.totalTimeEl.textContent = "00:00:00";
        return;
    }
    const elapsed = state.isWorkoutTimerPaused 
        ? state.pauseStartTime - state.workoutStartTime - state.totalPausedDuration 
        : Date.now() - state.workoutStartTime - state.totalPausedDuration;
    dom.totalTimeEl.textContent = formatTime(elapsed);
}

export function updateTimerToggleButtonUI(isPaused) {
    if (isPaused) {
        dom.timerPlayPauseIcon.className = 'fas fa-play';
        dom.timerPlayPauseText.textContent = state.workoutStartTime ? 'Reprendre' : 'Démarrer';
    } else {
        dom.timerPlayPauseIcon.className = 'fas fa-pause';
        dom.timerPlayPauseText.textContent = 'Pause';
    }
}

export function startTotalWorkoutTimer() {
    if (state.totalWorkoutTimeInterval) clearInterval(state.totalWorkoutTimeInterval);
    if (!state.workoutStartTime) {
        state.workoutStartTime = Date.now();
        state.totalPausedDuration = 0;
    }
    if (state.isWorkoutTimerPaused && state.pauseStartTime > 0) {
        state.totalPausedDuration += Date.now() - state.pauseStartTime;
    }
    state.isWorkoutTimerPaused = false;
    state.pauseStartTime = 0;
    updateTimerToggleButtonUI(false);
    state.totalWorkoutTimeInterval = setInterval(updateTotalTimeDisplay, 1000);
    updateTotalTimeDisplay(); 
    saveCurrentStateToLocalStorage();
}

export function pauseTotalWorkoutTimer() {
    if (state.workoutStartTime && !state.isWorkoutTimerPaused) {
        if (state.totalWorkoutTimeInterval) clearInterval(state.totalWorkoutTimeInterval);
        state.isWorkoutTimerPaused = true;
        state.pauseStartTime = Date.now();
        updateTimerToggleButtonUI(true);
        updateTotalTimeDisplay(); 
        saveCurrentStateToLocalStorage();
    }
}

export async function resetTotalWorkoutTimer(withConfirmation = true) {
    const confirmed = !withConfirmation || (state.workoutStartTime && await customConfirm("Réinitialiser le minuteur de la séance ?"));
    if (confirmed) {
        if (state.totalWorkoutTimeInterval) clearInterval(state.totalWorkoutTimeInterval);
        state.workoutStartTime = null;
        state.isWorkoutTimerPaused = true;
        state.totalPausedDuration = 0;
        state.pauseStartTime = 0;
        dom.totalTimeEl.textContent = "00:00:00";
        updateTimerToggleButtonUI(true); 
        saveCurrentStateToLocalStorage();
        if (withConfirmation) {
            showNotification("Minuteur de la séance réinitialisé.", "info");
        }
    }
}

export function handleTotalWorkoutTimer(action) {
    if (action === 'toggle') {
        state.isWorkoutTimerPaused ? startTotalWorkoutTimer() : pauseTotalWorkoutTimer();
    } else if (action === 'reset') {
        resetTotalWorkoutTimer(true);
    }
}

export function handleVisibilityChange() {
    // Logic to handle individual timers when tab visibility changes
}
