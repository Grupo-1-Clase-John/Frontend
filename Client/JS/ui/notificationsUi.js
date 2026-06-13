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
    const container = getContainer();

    const notification = document.createElement('div');   
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    const closeButton = createCloseButton(() => {          
        dismissNotification(notification);                // Cierre manual con la 'x'.
    });

    notification.appendChild(closeButton);
    container.appendChild(notification);

    setTimeout(() => {
        dismissNotification(notification);                // Cierre automatico.
    }, NOTIFICATION_DURATION);
};
