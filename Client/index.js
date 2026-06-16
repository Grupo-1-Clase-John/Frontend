export {
    apiUrl,
    dom,
    state
} from './JS/api/api.js';

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
    setTaskFormCreateMode,
    showNotification,
    addTaskToTable,
    clearTasksTable,
    loadUserTasks,
    populateUserFilter,
    renderFilteredTasks
} from './JS/ui/tareasUi.js';

export {
    getStatusClass,
    getStatusText,
    escapeHtml,
    normalizeId,
    filterTasks,
    findUserByDocument,
    saveTaskToBackend,
    updateTaskInBackend,
    loadLocalData,
    handleUserSearch,
    handleTaskSubmit,
    handleTaskEdit,
    handleTaskDelete
} from './JS/services/tareasService.js';

export {
    showExportTasksButton
} from './JS/ui/exportTasksUi.js';

export {
    exportTasks
} from './JS/services/exportTasks.js';

export {
    validateUserSearch,
    validateTaskForm
} from './JS/utils/validaciones.js';

export {
    findUserByDocument,
    saveTaskToBackend,
    updateTaskInBackend,
    loadLocalData
} from './JS/services/tareasService.js';

export {
    success,
    error,
    info,
    warning
} from './JS/ui/notificationsUi.js';