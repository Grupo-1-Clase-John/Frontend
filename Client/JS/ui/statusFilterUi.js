/**
 * StatusFilterUi.js
 *
 * Funciones de UI para el filtro por estado de tareas:
 * mostrar/ocultar el control de filtro y lectura/escritura del select.
 */

import { dom } from '../api/api.js';

/**
 * Muestra el contenedor del filtro por estado.
 * @returns {void}
 */
export const showFilterControl = () => {
    const container = document.getElementById('statusFilterContainer');
    if (container) {
        container.classList.remove('hidden');
    }
};

/**
 * Oculta el contenedor del filtro por estado y resetea su valor.
 * @returns {void}
 */
export const hideFilterControl = () => {
    const container = document.getElementById('statusFilterContainer');
    if (container) {
        container.classList.add('hidden');
        dom.statusFilterSelect.value = '';
    }
};

/**
 * Obtiene el valor actual del select de filtro por estado.
 * @returns {string} El estado seleccionado o cadena vacía si es "Todas".
 */
export const getFilterValue = () => {
    return dom.statusFilterSelect.value;
};

/**
 * Asigna el valor del select de filtro por estado de forma programática.
 * @param {string} value El valor del estado a seleccionar.
 * @returns {void}
 */
export const setFilterValue = (value) => {
    dom.statusFilterSelect.value = value;
};
