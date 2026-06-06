/**
 * TaskFormUi.js
 * 
 * Funciones de UI del formulario de registro / edición de tareas:
 * manejo de errores por campo, habilitación del formulario, modo
 * de operación (crear / editar) y limpieza de errores al
 * cambiar el valor de un input.
 *
 * Dependencias:
 *   - DOM: referencia cacheada a los elementos del DOM 
 */

import { dom } from '../api/api.js';

/**
 * Muestra un mensaje de error en el elemento de error indicado.
 * @param {HTMLElement} errorElement Elemento <span> donde se renderiza el error.
 * @param {string} Error Message.
 * @returns {void}
 */
export const showError = (errorElement, message) => {
    errorElement.textContent = message; // Escribe el mensaje dentro del elemento de error.
};

/**
 * Limpia el contenido de un elemento de error.
 * @param {HTMLElement} errorElement Elemento <span> cuyo error se limpia.
 * @returns {void}
 */
export const clearError = (errorElement) => {
    errorElement.textContent = ''; // Vacía el contenido del elemento de error.
};

/**
 * Limpia los mensajes de error de todos los campos del formulario
 * (búsqueda de usuario y registro de tarea).
 * @returns {void}
 */
export const clearAllErrors = () => {
    clearError(dom.userDocumentError);    // Limpia error del campo de documento.
    clearError(dom.taskTitleError);       // Limpia error del campo TITULO.
    clearError(dom.taskDescriptionError); // Limpia el error del campo de descripción.
    clearError(dom.taskStatusError);      // Limpia error del campo de estado.
};

/**
 * Habilitación de los campos del formulario de tareas (FIELDSET)
 * Se utiliza después de encontrar un usuario válido.
 * @returns {void}
 */
export const enableTaskForm = () => {
    dom.taskFormFieldset.disabled = false; // Reactiva el fieldset para permitir la entrada de datos.
};

/**
 * Deshabilita los campos del formulario de tareas.
 * Se usa cuando no hay un usuario seleccionado.
 * @returns {void}
 */
export const disableTaskForm = () => {
    dom.taskFormFieldset.disabled = true; // Bloquea el FIELDSET para impedir entradas.
};

/**
 * Limpia el error de un INPUT cuando el usuario escribe o editar.
 * Se vincula a INPUT y CHANGE de los campos del formulario.
 * @param {Event} Evento de cambio disparado por un INPUT/SELECT/TEXTAREA
 * @returns {void}
 */
export const handleInputChange = (event) => {
    const inputField = event.target;                            // Campo que disparó el evento.
    const errorElement = inputField.nextElementSibling;         // Elemento donde se renderiza el error.
    if (errorElement && errorElement.classList.contains('form__error')) { 
        clearError(errorElement);                               // Limpia el error Message
        inputField.classList.remove('error');                   // Quita el borde rojo del INPUT
    }
};

/**
 * Cambia el texto del botón principal al modo "Actualizar tarea"
 * @returns {void}
 */
export const setTaskFormEditMode = () => {
    dom.submitTaskBtn.textContent = 'Actualizar tarea'; // Cambia la etiqueta del botón SUBMIT.
};

/**
 * Cambia el texto del botón principal al modo "Registrar tarea" (por defecto).
 * @returns {void}
 */
export const setTaskFormCreateMode = () => {
    dom.submitTaskBtn.textContent = 'Registrar tarea'; // Cambia la etiqueta del botón
};
