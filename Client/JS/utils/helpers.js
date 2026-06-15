//Hola helpers.js - Módulo creado para romper la dependencia circular:
//   tareasService.js -> tareasUi.js -> TaskTableUi.js -> tareasService.js
//
// Esta dependencia circular provocaba que, en ciertos contextos,
// los bindings de export const quedaran en Temporal Dead Zone (TDZ),
// impidiendo que handleUserSearch se registrara como event listener
// y causando que el formulario de búsqueda recargara la página
// al no ejecutarse event.preventDefault().
//
// Se extrajeron aquí las funciones compartidas que TaskTableUi.js
// y validaciones.js necesitaban desde tareasService.js, rompiendo
// así el ciclo de dependencias.

import { state } from '../api/api.js';

export const normalizeId = (value) => {
    return String(value || '').trim();
};

export const isValidInput = (value) => {
    return String(value || '').trim().length > 0;
};

export const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

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

export const filterTasks = ({ status, userId } = {}) => {
    let tasks = state.dbTasks;

    if (status) {
        tasks = tasks.filter(task => task.status === status);
    }

    if (userId) {
        const normId = normalizeId(userId);
        tasks = tasks.filter(task =>
            normalizeId(task.userId) === normId ||
            normalizeId(task.user_id) === normId ||
            normalizeId(task.id_usuario) === normId
        );
    }

    return tasks;
};
