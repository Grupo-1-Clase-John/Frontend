
import {
    dom,
    loadLocalData,
    handleUserSearch,
    handleTaskSubmit,
    handleInputChange,
    handleTaskEdit,
    handleTaskDelete,
    exportTasks,
    populateUserFilter,
    renderFilteredTasks
} from './index.js';

import {
    success,
    error,
    info,
    warning
} from './index.js';

const {
    userSearchForm,
    userDocumentInput,
    taskForm,
    taskTitleInput,
    taskDescriptionInput,
    taskStatusSelect,
    tasksTableBody,
    exportTasksBtn
} = dom;

userSearchForm.addEventListener('submit', handleUserSearch);
taskForm.addEventListener('submit', handleTaskSubmit);

document.addEventListener('task:edit', (event) => {
    handleTaskEdit(event.detail.taskId);
});

dom.tasksTableBody.addEventListener('click', handleTaskDelete);

dom.exportTasksBtn.addEventListener('click', exportTasks);

userDocumentInput.addEventListener('input', handleInputChange);
taskTitleInput.addEventListener('input', handleInputChange);
taskDescriptionInput.addEventListener('input', handleInputChange);
taskStatusSelect.addEventListener('change', handleInputChange);

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM completamente cargado');
    await loadLocalData();
    populateUserFilter();
    renderFilteredTasks();
    console.log('Aplicación de gestión de tareas iniciada');
});

const observer = new MutationObserver(() => {
    const el = dom.userSearchMessage;
    if (el.classList.contains('hidden')) return;
    const text = el.textContent;
    if (!text || text.length < 5) return;
    if (text.includes('No se pudo conectar') || text.includes('Verifica que el servidor')) {
        error(text);
    } else if (text.includes('no encontrado') || text.includes('Error') || text.includes('error')) {
        warning(text);
    } else if (text.includes('guardada') || text.includes('actualizada') || text.includes('eliminada') || text.includes('correctamente')) {
        success(text);
    }
});
observer.observe(dom.userSearchMessage, {
    attributes: true,
    attributeFilter: ['class'],
    childList: true,
    characterData: true,
    subtree: true
});
