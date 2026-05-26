import {
    dom,
    state
} from './appContext.js';
import {
    clearAllErrors,
    hideUserMessage,
    showUserCard,
    enableTaskForm,
    hideUserCard,
    disableTaskForm,
    showUserMessage,
    showError,
    setTaskFormEditMode,
    setTaskFormCreateMode
} from './ui.js';
import {
    validateUserSearch,
    validateTaskForm
} from './validation.js';
import { normalizeId } from './helpers.js';
import {
    findUserByDocument,
    saveTaskToBackend,
    updateTaskInBackend
} from './data.js';
import {
    addTaskToTable,
    clearTasksTable,
    loadUserTasks
} from './tasks.js';

// Maneja la búsqueda de usuario, mostrando datos y habilitando el formulario si se encuentra el usuario.
export const handleUserSearch = async (event) => {
    event.preventDefault();
    clearAllErrors();
    hideUserMessage();
    state.editingTaskId = null;
    setTaskFormCreateMode();

    if (!validateUserSearch()) {
        return;
    }

    const documentValue = normalizeId(dom.userDocumentInput.value);
    const user = findUserByDocument(documentValue);

    if (user) {
        state.currentUserId = normalizeId(user.id);
        dom.userNameDisplay.textContent = user.name;
        dom.userDocumentDisplay.textContent = user.id;
        dom.userEmailDisplay.textContent = user.email;

        hideUserMessage();
        showUserCard();
        enableTaskForm();
        loadUserTasks(state.currentUserId);
    } else {
        state.currentUserId = null;
        hideUserCard();
        disableTaskForm();
        clearTasksTable();
        showUserMessage('Usuario no encontrado en el sistema', true);
    }
};

// Procesa el envío del formulario de tarea o la actualizacion y guarda la tarea en el backend.
export const handleTaskSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearAllErrors();

    if (!state.currentUserId) {
        showError(dom.taskStatusError, 'Debe buscar un usuario primero');
        dom.taskStatusSelect.classList.add('error');
        return;
    }

    if (!validateTaskForm()) {
        return;
    }

    if (state.editingTaskId) {
    const updatedFields = {
        title: dom.taskTitleInput.value.trim(),
        description: dom.taskDescriptionInput.value.trim(),
        status: dom.taskStatusSelect.value
       };

       const updatedTask = await updateTaskInBackend(state.editingTaskId, updatedFields);

       if (!updatedTask) {
           return;
        }

       state.dbTasks = state.dbTasks.map(task =>
           normalizeId(task.id) === normalizeId(updatedTask.id)
               ? {
                   ...task,
                   ...updatedTask,
                   userId: normalizeId(updatedTask.userId || task.userId)
                }
                : task
                );

       loadUserTasks(state.currentUserId);
       state.editingTaskId = null;
       dom.taskForm.reset();
       dom.taskStatusSelect.value = '';
       setTaskFormCreateMode();
       return;
          }

    const newTask = {
        id: String(Date.now()),
        userId: state.currentUserId,
        title: dom.taskTitleInput.value.trim(),
        description: dom.taskDescriptionInput.value.trim(),
        status: dom.taskStatusSelect.value,
        createdAt: new Date().toISOString()
    };

    const savedTask = await saveTaskToBackend(newTask);
    if (!savedTask) {
        return;
    }

    state.dbTasks.push(savedTask);
    addTaskToTable(savedTask);
    dom.taskForm.reset();
    dom.taskStatusSelect.value = '';
    state.editingTaskId = null;
    setTaskFormCreateMode();
};

// Carga los datos de una tarea en el formulario para editarla.
export const handleTaskEdit = (taskId) => {
    const task = state.dbTasks.find(item => normalizeId(item.id) === normalizeId(taskId));

    if (!task) {
        showUserMessage('No se encontró la tarea para editar.', true);
        return;
    }

    state.editingTaskId = normalizeId(task.id);

    dom.taskTitleInput.value = task.title;
    dom.taskDescriptionInput.value = task.description;
    dom.taskStatusSelect.value = task.status;

    clearAllErrors();
    hideUserMessage();
    enableTaskForm();
    setTaskFormEditMode();

    dom.taskTitleInput.focus();
};