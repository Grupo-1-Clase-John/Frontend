// Procesa el envío del formulario de nueva tarea.
import {
    clearAllErrors,
    showError,
    validateTaskForm,
    saveTaskToBackend,
    saveTasksToStorage,
    addTaskToTable
} from '../index.js'

const handleTaskSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearAllErrors();

    if (!currentUserId) {
        showError(taskStatusError, "Debe buscar un usuario primero");
        taskStatusSelect.classList.add("error");
        return;
    }

    if (!validateTaskForm()) {
        return;
    }

    const newTask = {
        id: String(Date.now()),
        userId: currentUserId,
        title: taskTitleInput.value.trim(),
        description: taskDescriptionInput.value.trim(),
        status: taskStatusSelect.value,
        createdAt: new Date().toISOString()
    };

    const savedTask = await saveTaskToBackend(newTask);
    dbTasks.push(savedTask);
    saveTasksToStorage();
    addTaskToTable(savedTask);
    taskForm.reset();
    taskStatusSelect.value = "";
}

export { handleTaskSubmit };