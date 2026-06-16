// NotificationsUi.js - Modulo independiente de notificaciones tipo toast.

const NOTIFICATION_DURATION = 4000;
const FADE_OUT_CLASS = 'notification--fade-out';

const getContainer = () => {
    let container = document.getElementById('notifications-container');

    if (!container) {
        container = document.createElement('div');
        container.id = 'notifications-container';
        container.className = 'notifications-container';
        document.body.appendChild(container);
    }

    return container;
};

const createCloseButton = (onClose) => {
    const button = document.createElement('button');     
    button.className = 'notification__close';
    button.textContent = '\u00D7';                        // Caracter 'x'.
    button.setAttribute('aria-label', 'Cerrar notificacion');
    button.addEventListener('click', onClose);           
    return button;
};

const dismissNotification = (notification) => {
    if (!notification || notification.classList.contains(FADE_OUT_CLASS)) {
        return;                                           // Evita eliminar dos veces.
    }

    notification.classList.add(FADE_OUT_CLASS);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
};

export const showNotification = (message, type = 'info') => {
    show(message, type);
};

// ============================================================
// SECCIÓN NOTIFICACIONES.JS (integrada desde notifications.js)
// ============================================================
const CONFIG = {
    containerClass: 'ntf-container',
    toastClass: 'ntf-toast',
    duration: 4500,
    animationDuration: 350
};

let toastContainer = null;

function getToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = CONFIG.containerClass;
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

function createToast(message, type = 'info', duration = CONFIG.duration) {
    const toast = document.createElement('div');
    toast.className = `${CONFIG.toastClass} ntf-${type}`;

    const icon = document.createElement('span');
    icon.className = 'ntf-icon';
    toast.appendChild(icon);

    const text = document.createElement('span');
    text.textContent = message;
    toast.appendChild(text);

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'background:none;border:none;color:#94a3b8;font-size:1.25rem;cursor:pointer;padding:0 0 0 0.5rem;line-height:1;flex-shrink:0;';
    closeBtn.setAttribute('aria-label', 'Cerrar');
    closeBtn.addEventListener('click', () => dismiss(toast));
    toast.appendChild(closeBtn);

    return toast;
}

function dismiss(toast) {
    toast.classList.remove('ntf-visible');
    toast.classList.add('ntf-exit');
    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, CONFIG.animationDuration);
}

export function show(message, type = 'info', duration = CONFIG.duration) {
    const toast = createToast(message, type, duration);
    getToastContainer().appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add('ntf-visible');
        });
    });

    if (duration > 0) {
        setTimeout(() => dismiss(toast), duration);
    }

    return toast;
}

export const success = (msg, duration) => show(msg, 'success', duration);
export const error = (msg, duration) => show(msg, 'error', duration);
export const info = (msg, duration) => show(msg, 'info', duration);
export const warning = (msg, duration) => show(msg, 'warning', duration);

// Señal para formGuard.js: los módulos ES cargaron correctamente
document.dispatchEvent(new CustomEvent('modulesReady'));
