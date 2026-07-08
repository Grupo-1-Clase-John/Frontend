/**
 * UserSearchUi.js
 * 
 * Funciones de UI de la búsqueda de usuario:
 * tarjeta con los datos del usuario encontrado y mensajes
 * informativos o de error mostrados por el formulario de búsqueda.
 * 
 */

import { dom } from '../api/api.js';

/**
 * Muestra la tarjeta con los datos del usuario encontrado.
 * @returns {void}
 */
export const showUserCard = () => {
    dom.userCard.classList.remove('hidden'); // Quita la clase .hidden para hacer visible la tarjeta.
};

/**
 * @returns {void}
 */
export const hideUserCard = () => {
    dom.userCard.classList.add('hidden'); // Agrega la clase .hidden para ocultar la tarjeta.
};

/**
 * Muestra un mensaje informativo o de error en el área de búsqueda de usuario.
 * @param {string} 
 * @param {boolean} [isError=false] Si es true, se muestra con estilo de error.
 * @returns {void}
 */
export const showUserMessage = (message, isError = false) => {
    dom.userSearchMessage.textContent = message;            // Asigna el texto del mensaje al <span>.
    dom.userSearchMessage.classList.remove('hidden');      // Hace visible el contenedor del mensaje.
    if (isError) {                                       
        dom.userSearchMessage.classList.add('info-message--error');    
    } else {                                          
        dom.userSearchMessage.classList.remove('info-message--error'); 
    }
};

/**
 * Oculta el área de mensajes de búsqueda de usuario.
 * @returns {void}
 */
export const hideUserMessage = () => {
    dom.userSearchMessage.classList.add('hidden'); // Agrega la clase .hidden para ocultar el mensaje.
};
