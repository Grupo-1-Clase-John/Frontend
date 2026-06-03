import { dom } from './appContext.js';

// Muestra un mensaje de error en el elemento de error entregado.
export const showError = (errorElement, message) => {
    errorElement.textContent = message;
};

// Limpia el contenido del elemento de error dado.
export const clearError = (errorElement) => {
    errorElement.textContent = '';
};

// Quita los mensajes de error en todos los campos del formulario.
export const clearAllErrors = () => {
    clearError(dom.userDocumentError);
    clearError(dom.taskTitleError);
    clearError(dom.taskDescriptionError);
    clearError(dom.taskStatusError);
};

// Muestra un mensaje de información en la interfaz, marcándolo como error si corresponde.
export const showUserMessage = (message, isError = false) => {
    dom.userSearchMessage.textContent = message;
    dom.userSearchMessage.classList.remove('hidden');
    if (isError) {
        dom.userSearchMessage.classList.add('info-message--error');
    } else {
        dom.userSearchMessage.classList.remove('info-message--error');
    }
};

// Oculta el área de mensajes de usuario.
export const hideUserMessage = () => {
    dom.userSearchMessage.classList.add('hidden');
};

// Hace visible la tarjeta del usuario en la interfaz.
export const showUserCard = () => {
    dom.userCard.classList.remove('hidden');
};

// Oculta la tarjeta del usuario.
export const hideUserCard = () => {
    dom.userCard.classList.add('hidden');
};

// Muestra el estado vacío cuando no hay tareas.
export const showEmptyState = () => {
    dom.tasksEmptyState.classList.remove('hidden');
};

// Oculta el mensaje de estado vacío de tareas.
export const hideEmptyState = () => {
    dom.tasksEmptyState.classList.add('hidden');
};

// Habilita el formulario para crear tareas.
export const enableTaskForm = () => {
    dom.taskFormFieldset.disabled = false;
};

// Deshabilita el formulario de tareas para evitar envíos.
export const disableTaskForm = () => {
    dom.taskFormFieldset.disabled = true;
};

// Borra el error asociado a un campo cuando cambia su valor.
export const handleInputChange = (event) => {
    const inputField = event.target;
    const errorElement = inputField.nextElementSibling;
    if (errorElement && errorElement.classList.contains('form__error')) {
        clearError(errorElement);
        inputField.classList.remove('error');
    }
};

// Cambia el formulario al modo de edición de tarea.
export const setTaskFormEditMode = () => {
    dom.submitTaskBtn.textContent = 'Actualizar tarea';
};

// Devuelve el formulario al modo normal de registro.
export const setTaskFormCreateMode = () => {
    dom.submitTaskBtn.textContent = 'Registrar tarea';
};
