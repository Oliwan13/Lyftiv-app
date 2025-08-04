/**
 * Manages Progressive Web App (PWA) installation logic.
 */
import { dom } from '../dom.js';
import { state } from '../state.js';
import { showNotification } from '../components/notifications.js';

export function initPwa() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        state.deferredPwaPrompt = e;
        if (localStorage.getItem('pwaPromptDismissed') !== 'true') {
            dom.pwaInstallPrompt.classList.remove('hidden');
            setTimeout(() => dom.pwaInstallPrompt.classList.add('show'), 10);
        }
    });

    dom.installPwaBtn.addEventListener('click', async () => {
        if (state.deferredPwaPrompt) {
            state.deferredPwaPrompt.prompt();
            const { outcome } = await state.deferredPwaPrompt.userChoice;
            if (outcome === 'accepted') {
                showNotification('Lyftiv a été ajouté à votre écran d\'accueil!', 'success', 5000);
            }
            state.deferredPwaPrompt = null;
            hidePwaPrompt();
        }
    });

    dom.closePwaPrompt.addEventListener('click', () => {
        hidePwaPrompt();
        localStorage.setItem('pwaPromptDismissed', 'true');
    });
}

function hidePwaPrompt() {
    dom.pwaInstallPrompt.classList.remove('show');
    dom.pwaInstallPrompt.addEventListener('transitionend', () => dom.pwaInstallPrompt.classList.add('hidden'), { once: true });
}
