/**
 * SortTasksUi.js
 *
 * Funciones de UI para el ordenamiento de tareas:
 * mostrar/ocultar el control de orden y lectura/escritura del select.
 */

import { dom } from '../api/api.js';

/**
 * Muestra el contenedor del control de ordenamiento.
 * @returns {void}
 */
export const showSortControl = () => {
    const container = document.getElementById('tasksSortContainer');
    if (container) {
        container.classList.remove('hidden');
    }
};

/**
 * Oculta el contenedor del control de ordenamiento y resetea su valor.
 * @returns {void}
 */
export const hideSortControl = () => {
    const container = document.getElementById('tasksSortContainer');
    if (container) {
        container.classList.add('hidden');
        dom.sortTasksSelect.value = '';
    }
};

/**
 * Obtiene el valor actual del select de ordenamiento.
 * @returns {string} El valor del criterio de orden seleccionado.
 */
export const getSortValue = () => {
    return dom.sortTasksSelect.value;
};

/**
 * Asigna el valor del select de ordenamiento de forma programática.
 * @param {string} value El valor del criterio a seleccionar.
 * @returns {void}
 */
export const setSortValue = (value) => {
    dom.sortTasksSelect.value = value;
};
