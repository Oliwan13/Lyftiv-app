import { dom } from './dom.js';

/**
 * Applies a color theme to the application.
 * @param {'light' | 'dark'} theme - The theme to apply.
 */
export function applyTheme(theme) {
    if (theme === 'dark') {
        dom.body.classList.add('dark-mode');
        dom.themeToggleBtn.innerHTML = '☀️';
        dom.themeToggleBtn.setAttribute('title', 'Passer au thème clair');
    } else {
        dom.body.classList.remove('dark-mode');
        dom.themeToggleBtn.innerHTML = '🌒';
        dom.themeToggleBtn.setAttribute('title', 'Passer au thème sombre');
    }
}
