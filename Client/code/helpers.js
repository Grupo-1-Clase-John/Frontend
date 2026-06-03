//HELPERS

// Normaliza un valor a una cadena minúscula sin espacios exteriores.
export const normalizeId = (value) => {
    return String(value || '').trim();
};

// Verifica si el valor proporcionado es un texto no vacío.
export const isValidInput = (value) => {
    return String(value || '').trim().length > 0;
};

// Convierte texto en HTML seguro escapando caracteres especiales.
export const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Devuelve la clase CSS correspondiente al estado de la tarea.
export const getStatusClass = (status) => {
    switch (status) {
        case 'pendiente':
            return 'pending';
        case 'en-proceso':
            return 'in-progress';
        case 'completada':
            return 'completed';
        default:
            return 'pending';
    }
};

// Devuelve la etiqueta de texto mostrada para el estado de la tarea.
export const getStatusText = (status) => {
    switch (status) {
        case 'pendiente':
            return 'Pendiente';
        case 'en-proceso':
            return 'En Proceso';
        case 'completada':
            return 'Completada';
        default:
            return status;
    }
};
