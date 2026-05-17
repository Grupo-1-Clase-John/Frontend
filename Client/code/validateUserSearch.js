// Valida el formulario de búsqueda de usuario.
import {
    normalizeId,
    isValidInput,
    showError,
    clearError
} from '../index.js'

const validateUserSearch = () => {
    const documentValue = normalizeId(userDocumentInput.value);
    if (!isValidInput(documentValue)) {
        showError(userDocumentError, "El documento es obligatorio");
        return false;
    }
    clearError(userDocumentError);
    return true;
}

export { validateUserSearch };