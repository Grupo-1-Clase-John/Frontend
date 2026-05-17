// Procesa el envío del formulario de búsqueda de usuario.
import {
    clearAllErrors,
    hideUserMessage,
    validateUserSearch,
    normalizeId,
    findUserByDocument,
    showUserCard,
    enableTaskForm,
    loadUserTasks,
    hideUserCard,
    disableTaskForm,
    clearTasksTable,
    showUserMessage
} from '../index.js'

const handleUserSearch = async (event) => {
    event.preventDefault();
    clearAllErrors();
    hideUserMessage();

    if (!validateUserSearch()) {
        return;
    }

    const documentValue = normalizeId(userDocumentInput.value);
    const user = findUserByDocument(documentValue);

    if (user) {
        currentUserId = normalizeId(user.id);
        userNameDisplay.textContent = user.name;
        userDocumentDisplay.textContent = user.id;
        userEmailDisplay.textContent = user.email;

        hideUserMessage();
        showUserCard();
        enableTaskForm();
        loadUserTasks(currentUserId);
    } else {
        currentUserId = null;
        hideUserCard();
        disableTaskForm();
        clearTasksTable();
        showUserMessage("Usuario no encontrado en el sistema", true);
    }
}

export { handleUserSearch };