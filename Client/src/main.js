
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
