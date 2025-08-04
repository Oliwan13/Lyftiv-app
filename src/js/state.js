/**
 * This module contains the application's global state and default data.
 */

// Default session data, used if no other data is loaded.
export const defaultSessions = [
  {
    name: "Haut du corps (force)",
    isDefault: true,
    exercises: [
      { name: "Développé couché barre", rest: "2 min", series: [] },
      { name: "Machine élévations latérales debout", rest: "", series: [] },
      { name: "Tractions", rest: "1.5 min", series: [] },
      { name: "Développé incliné haltères", rest: "", series: [] },
      { name: "Rowing T-barre appuyé", rest: "1.5 min", series: [] },
      { name: "Pec deck", rest: "", series: [] },
      { name: "Bayesian cable curl", rest: "1.25 min", series: [] },
      { name: "Extension triceps à la poulie haute", rest: "", series: [] },
      { name: "Tractions scapulaires", rest: "1 min", series: [] }
    ]
  },
  {
    name: "Bas du corps (force)",
    isDefault: true,
    exercises: [
      { name: "Fentes bulgares", rest: "1.5 min", series: [] },
      { name: "Hack squat", rest: "3 min", series: [] },
      { name: "Hip thrust", rest: "2 min", series: [] },
      { name: "Soulevé de terre roumain", rest: "2 min", series: [] },
      { name: "Mollets debout", rest: "1 min", series: [] }
    ]
  },
  {
    name: "Haut du corps (hypertrophie)",
    isDefault: true,
    exercises: [
      { name: "Dips", rest: "1.5 min", series: [] },
      { name: "Tirage vertical prise large", rest: "", series: [] },
      { name: "Développé convergent", rest: "1.25 min", series: [] },
      { name: "Curl pupitre", rest: "1.25 min", series: [] },
      { name: "Extension triceps overhead", rest: "", series: [] },
      { name: "Élévations latérales à la poulie", rest: "1 min", series: [] },
      { name: "Flexions poignets supination", rest: "1 min", series: [] },
      { name: "Extensions de poignets pronation", rest: "", series: [] },
      { name: "Farmer’s walk", rest: "1.5 min", series: [] },
      { name: "Planche", rest: "", series: [] },
      { name: "Face pull", rest: "", series: [] }
    ]
  },
  {
    name: "Bas du corps (hypertrophie)",
    isDefault: true,
    exercises: [
      { name: "Pendulum squat", rest: "1.5 min", series: [] },
      { name: "Hip thrust", rest: "1.5 min", series: [] },
      { name: "Leg curl assis", rest: "1.25 min", series: [] },
      { name: "Mollets assis", rest: "1 min", series: [] },
      { name: "Glute ham raise", rest: "", series: [] },
      { name: "Circuit abdos (relevé de jambe, crunches, planche)", rest: "1.5 min", series: [] }
    ]
  },
  {
    name: "Spécialisation trapèzes & mobilité",
    isDefault: true,
    exercises: [
      { name: "Barbell shrugs", rest: "1 min", series: [] },
      { name: "Face pull", rest: "1 min", series: [] },
      { name: "Cable y-raise", rest: "1 min", series: [] },
      { name: "Dead hang", rest: "1 min", series: [] }
    ]
  },
  {
    name: "Routine de mobilité",
    isDefault: true,
    exercises: [
      { name: "Pass-throughs avec élastique", rest: "", series: ["2 x 15"] },
      { name: "Wall slides (glissements au mur)", rest: "", series: ["2 x 12"] },
      { name: "Cercles de tête lents", rest: "", series: ["1 x 5 dans chaque sens"] },
      { name: "Rétraction du menton", rest: "", series: ["2 x 10"] },
      { name: "90/90 stretch", rest: "", series: ["2 x 30s par côté"] },
      { name: "Étirement du canapé (couch stretch)", rest: "", series: ["2 x 30s par côté"] },
      { name: "Maintien en squat profond", rest: "", series: ["2 x 45-60s"] }
    ]
  }
];

// The main, mutable state object for the application.
export let state = {
    sessions: [], 
    currentSessionIndex: 0,
    timers: {}, // For individual exercise rest timers
    
    // Main Workout Timer State
    workoutStartTime: null, // Timestamp (ms) when the session started
    totalWorkoutTimeInterval: null, // Holds the setInterval ID for UI updates
    isWorkoutTimerPaused: true, // Timer starts in a paused state
    totalPausedDuration: 0, // Accumulated time in ms the timer was paused
    pauseStartTime: 0, // Timestamp when the current pause began
    
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
