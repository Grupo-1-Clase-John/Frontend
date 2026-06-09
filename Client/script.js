
import {
    dom,
    state,
    loadLocalData,
    handleUserSearch,
    handleTaskSubmit,
    handleInputChange,
    handleTaskEdit,
    handleTaskDelete,
    exportTasks,
    loadFilteredTasks
} from './index.js';

const {
    userSearchForm,
    userDocumentInput,
    taskForm,
    taskTitleInput,
    taskDescriptionInput,
    taskStatusSelect,
    tasksTableBody,
    exportTasksBtn,
    taskFilterUserSelect,
    taskFilterStatusSelect
} = dom;

const getCurrentTaskFilters = () => ({
    userId: taskFilterUserSelect.value,
    status: taskFilterStatusSelect.value
});

const populateTaskFilterOptions = () => {
    taskFilterUserSelect.innerHTML = '<option value="">Todos los usuarios</option>';
    state.dbUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        taskFilterUserSelect.appendChild(option);
    });
};

const applyTaskFilters = () => {
    loadFilteredTasks(getCurrentTaskFilters());
};

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

taskFilterUserSelect.addEventListener('change', applyTaskFilters);
taskFilterStatusSelect.addEventListener('change', applyTaskFilters);

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM completamente cargado');
    await loadLocalData();
    populateTaskFilterOptions();
    applyTaskFilters();
    console.log('Aplicación de gestión de tareas iniciada');
});
