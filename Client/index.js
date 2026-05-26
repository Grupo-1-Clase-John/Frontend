export {
    apiUrl,
    FALLBACK_USERS,
    FALLBACK_TASKS,
    dom,
    state
} from './code/appContext.js';
export {
    showError,
    clearError,
    clearAllErrors,
    showUserMessage,
    hideUserMessage,
    showUserCard,
    hideUserCard,
    enableTaskForm,
    disableTaskForm,
    handleInputChange,
    setTaskFormEditMode,
    setTaskFormCreateMode
} from './code/ui.js';
export {
    getStatusClass,
    getStatusText,
    escapeHtml,
    normalizeId
} from './code/helpers.js';
export {
    validateUserSearch,
    validateTaskForm
} from './code/validation.js';
export {
    findUserByDocument,
    saveTaskToBackend,
    updateTaskInBackend,
    loadLocalData
} from './code/data.js';
export {
    addTaskToTable,
    clearTasksTable,
    loadUserTasks
} from './code/tasks.js';
export {
    handleUserSearch,
    handleTaskSubmit,
    handleTaskEdit,
    handleTaskDelete
} from './code/handlers.js';
