import {
    dom
} from '../api/api.js';

import {
    normalizeId,
    isValidInput
} from './helpers.js';

import {
    showError,
    clearError
} from '../ui/tareasUi.js';

// Valida que el campo de documento de usuario tenga un valor adecuado.
export const validateUserSearch = () => {
    const documentValue = normalizeId(dom.userDocumentInput.value);
    if (!isValidInput(documentValue)) {
        showError(dom.userDocumentError, 'El documento es obligatorio');
        return false;
    }

    clearError(dom.userDocumentError);
    return true;
};

// Comprueba que todos los campos del formulario de tarea estén completos y válidos.
export const validateTaskForm = () => {
    let isValid = true;

    if (!isValidInput(dom.taskTitleInput.value)) {
        showError(dom.taskTitleError, 'El título es obligatorio');
        dom.taskTitleInput.classList.add('error');
        isValid = false;
    } else {
        clearError(dom.taskTitleError);
        dom.taskTitleInput.classList.remove('error');
    }

    if (!isValidInput(dom.taskDescriptionInput.value)) {
        showError(dom.taskDescriptionError, 'La descripción es obligatoria');
        dom.taskDescriptionInput.classList.add('error');
        isValid = false;
    } else {
        clearError(dom.taskDescriptionError);
        dom.taskDescriptionInput.classList.remove('error');
    }

    if (!isValidInput(dom.taskStatusSelect.value)) {
        showError(dom.taskStatusError, 'Selecciona un estado');
        dom.taskStatusSelect.classList.add('error');
        isValid = false;
    } else {
        clearError(dom.taskStatusError);
        dom.taskStatusSelect.classList.remove('error');
    }

    if (dom.taskUsers.selectedOptions.length === 0) {
        showError(dom.taskUsersError, 'Seleccione al menos un usuario');
        isValid = false;
    } else {
        clearError(dom.taskUsersError);
    }

    return isValid;
};
