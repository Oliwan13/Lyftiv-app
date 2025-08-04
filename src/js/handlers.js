/**
 * This module contains the primary event handler functions for the application.
 * These functions orchestrate state changes and UI updates in response to user actions.
 */
import { dom } from './dom.js';
import { state } from './state.js';
import { applyTheme } from './theme.js';
import { finishAndSaveSession } from './services/storage.js';
import { exportCSV, parseCsvAndImport } from './services/importerExporter.js';
import { createTable, populateDashboard, updateAllTotals } from './ui.js';
import { showNotification } from './components/notifications.js';
import { customConfirm, showHistoryModal, showNewSessionModal, showPlateCalculatorModal } from './components/modals.js';
import { resetTotalWorkoutTimer } from './services/workoutTimer.js';

export function handleThemeToggle() {
    const newTheme = dom.body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

export function handleHomeClick() {
    dom.dashboard.classList.remove('hidden');
    dom.appContainer.classList.add('hidden');
    sessionStorage.removeItem('dashboardShown'); 
    populateDashboard();
}

export async function handleSessionChange() {
    const lastSavedIndex = state.currentSessionIndex;
    if (localStorage.getItem('inProgressWorkout')) {
        const confirmed = await customConfirm("Changer de séance annulera la séance en cours. Toutes les données non sauvegardées seront perdues. Continuer ?");
        if (!confirmed) {
            dom.sessionSelect.value = lastSavedIndex;
            return;
        }
        for (const timerKey in state.timers) {
            if (state.timers[timerKey] && state.timers[timerKey].interval) {
                clearInterval(state.timers[timerKey].interval);
                localStorage.removeItem(`timer-${timerKey}`);
            }
        }
        state.timers = {};
        
        resetTotalWorkoutTimer(false);
        localStorage.removeItem('inProgressWorkout');

        dom.totalKgRepEl.textContent = "0 kg/rep";
        dom.deltaEl.textContent = "0 kg"; 
        dom.previousWeekInput.value = "";
        dom.sessionNotesInput.value = ""; 
    }
    state.currentSessionIndex = +dom.sessionSelect.value;
    createTable();
}

export function handleAddExercise() {
    const name = dom.customExerciseInput.value.trim();
    if (name) {
        const scrollY = window.scrollY;
        const currentSession = state.sessions[state.currentSessionIndex];
        if (!currentSession.exercises) {
            currentSession.exercises = [];
        }
        const fourSeries = Array(4).fill().map(() => ({ weight: '', reps: '' }));
        currentSession.exercises.push({ name, rest: "1 min", series: fourSeries, isDefault: false });
        
        createTable(); 
        window.scrollTo(0, scrollY);
        dom.customExerciseInput.value = '';
        showNotification(`Exercice "${name}" ajouté avec succès.`, "info");
    } else {
        showNotification("Veuillez entrer un nom d'exercice à ajouter.", "error");
    }
}

export function handleFinishSession() {
    finishAndSaveSession();
}

export function handleImportClick() {
    dom.importFileInput.click();
}

export function handleExportClick() {
    exportCSV();
}

export function handleFileInputChange(event) {
    parseCsvAndImport(event);
}

export function handleBottomNavClick(action) {
    switch (action) {
        case 'addExercise':
            dom.addExerciseSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => dom.customExerciseInput.focus(), 300);
            break;
        case 'notes':
            state.isNotesSectionVisible = !state.isNotesSectionVisible;
            if (state.isNotesSectionVisible) {
                dom.sessionNotesSection.classList.add('show-notes-section');
                dom.sessionNotesSection.classList.remove('hide-notes-section');
                dom.sessionNotesInput.focus();
                dom.sessionNotesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                dom.sessionNotesSection.classList.remove('show-notes-section');
                dom.sessionNotesSection.classList.add('hide-notes-section');
            }
            break;
        case 'scroll':
            const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2;
            window.scrollTo({ top: isAtBottom ? 0 : document.body.scrollHeight, behavior: 'smooth' });
            break;
        case 'history':
            showHistoryModal();
            break;
        case 'calculator':
            showPlateCalculatorModal();
            break;
    }
}
