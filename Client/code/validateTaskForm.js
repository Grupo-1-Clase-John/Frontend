// Valida los campos del formulario de tarea y marca los errores correspondientes.
import {
    isValidInput,
    showError,
    clearError
} from '../index.js'

const validateTaskForm = () => {
    let isValid = true;

    if (!isValidInput(taskTitleInput.value)) {
        showError(taskTitleError, "El título es obligatorio");
        taskTitleInput.classList.add("error");
        isValid = false;
    } else {
        clearError(taskTitleError);
        taskTitleInput.classList.remove("error");
    }

    if (!isValidInput(taskDescriptionInput.value)) {
        showError(taskDescriptionError, "La descripción es obligatoria");
        taskDescriptionInput.classList.add("error");
        isValid = false;
    } else {
        clearError(taskDescriptionError);
        taskDescriptionInput.classList.remove("error");
    }

    if (!isValidInput(taskStatusSelect.value)) {
        showError(taskStatusError, "Selecciona un estado");
        taskStatusSelect.classList.add("error");
        isValid = false;
    } else {
        clearError(taskStatusError);
        taskStatusSelect.classList.remove("error");
    }

    return isValid;
}

export { validateTaskForm };