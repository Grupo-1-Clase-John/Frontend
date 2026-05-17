// Elimina todos los mensajes de error visibles en la página.
import { clearError } from '../index.js';

const clearAllErrors = () => {
    clearError(userDocumentError);
    clearError(taskTitleError);
    clearError(taskDescriptionError);
    clearError(taskStatusError);
}

export { clearAllErrors };