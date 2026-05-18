// Maneja la edición de los campos de entrada para eliminar mensajes de error.
import {
    clearError
} from '../index.js';

const handleInputChange = (event) => {
    const inputField = event.target;
    const errorElement = inputField.nextElementSibling;
    if (errorElement && errorElement.classList.contains("form__error")) {
        clearError(errorElement);
        inputField.classList.remove("error");
    }
}

export { handleInputChange };