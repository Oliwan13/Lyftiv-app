/**
 * Manages interactions with localStorage for workout history.
 */
import { dom } from '../dom.js';
import { state } from '../state.js';
import { createTable } from '../ui.js';
import { showNotification } from '../components/notifications.js';
import { resetTotalWorkoutTimer, pauseTotalWorkoutTimer } from './workoutTimer.js';
import { calculate1RM } from '../utils/calculations.js';

export function getHistory() {
    return JSON.parse(localStorage.getItem('workoutHistory')) || [];
}

function saveHistory(history) {
    try {
        localStorage.setItem('workoutHistory', JSON.stringify(history));
    } catch (e) {
        console.error("Erreur lors de la sauvegarde de l'historique :", e);
        showNotification("Erreur de sauvegarde de l'historique.", "error");
    }
}

export function saveCurrentStateToLocalStorage() {
    const currentSession = state.sessions[state.currentSessionIndex];
    if (!currentSession) return;

    // This part is implicit in the input handlers, but we make sure series data is up-to-date
    currentSession.exercises.forEach((ex, idx) => {
        ex.series = Array.from(document.querySelectorAll(`[data-ex='${idx}'][data-serie]`)).reduce((acc, input) => {
            const serieIndex = parseInt(input.dataset.serie, 10);
            if (!acc[serieIndex]) acc[serieIndex] = {};
            if (input.classList.contains('weight')) acc[serieIndex].weight = input.value;
            else if (input.classList.contains('reps')) acc[serieIndex].reps = input.value;
            return acc;
        }, []).filter(s => s.weight !== undefined || s.reps !== undefined);
    });

    const data = {
        previousWeek: dom.previousWeekInput.value,
        sessionIndex: state.currentSessionIndex,
        customSessions: state.sessions,
        workoutStartTime: state.workoutStartTime,
        isWorkoutTimerPaused: state.isWorkoutTimerPaused,
        totalPausedDuration: state.totalPausedDuration,
        pauseStartTime: state.pauseStartTime,
        sessionNotes: dom.sessionNotesInput.value
    };
    try {
        localStorage.setItem('inProgressWorkout', JSON.stringify(data));
    } catch (e) {
        console.error("Erreur lors de la sauvegarde de la séance en cours :", e);
    }
}

export function finishAndSaveSession() {
    let currentSessionReps = 0;
    let currentSessionTonnage = 0;
    const currentSessionData = state.sessions[state.currentSessionIndex];

    const exercisesData = (currentSessionData?.exercises || []).flatMap(ex => {
        const exerciseSeries = [];
        let exerciseTonnage = 0;
        let exerciseReps = 0;

        ex.series.forEach(s => {
            const reps = parseFloat(String(s.reps).replace(',', '.')) || 0;
            const weight = parseFloat(String(s.weight).replace(',', '.')) || 0;
            if (reps > 0 || weight > 0) {
                exerciseSeries.push({ reps, weight });
                exerciseTonnage += reps * weight;
                exerciseReps += reps;
            }
        });

        if (exerciseSeries.length > 0) {
            currentSessionTonnage += exerciseTonnage;
            currentSessionReps += exerciseReps;
            return [{
                name: ex.name,
                rest: ex.rest || "1 min",
                series: exerciseSeries,
                exerciseKgRep: exerciseReps > 0 ? (exerciseTonnage / exerciseReps) : 0,
                exerciseReps,
            }];
        }
        return [];
    });

    if (currentSessionReps === 0) {
        showNotification("Aucune donnée à sauvegarder. La séance est vide.", "info");
        return; 
    }
    
    pauseTotalWorkoutTimer(); 

    const workoutData = {
        id: Date.now(),
        date: new Date().toISOString(),
        sessionName: dom.sessionSelect.selectedOptions[0].text,
        totalReps: currentSessionReps,
        totalKgRep: currentSessionReps > 0 ? (currentSessionTonnage / currentSessionReps).toFixed(2) : 0,
        duration: dom.totalTimeEl.textContent,
        notes: dom.sessionNotesInput.value,
        exercises: exercisesData
    };

    let history = getHistory();
    history.push(workoutData);
    saveHistory(history);
    showNotification("Séance sauvegardée dans l'historique !", "success");
    
    // Clear state for next session
    Object.values(state.timers).forEach(timer => {
        if (timer && timer.interval) clearInterval(timer.interval);
    });
    state.timers = {};
    
    resetTotalWorkoutTimer(false);
    localStorage.removeItem('inProgressWorkout');
    
    // Reset UI
    createTable(); 
    dom.totalKgRepEl.textContent = "0 kg/rep";
    dom.deltaEl.textContent = "0 kg";
    dom.previousWeekInput.value = "";
    dom.sessionNotesInput.value = "";
}
