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
    showError
} from './ui.js';
import {
    validateUserSearch,
    validateTaskForm
} from './validation.js';
import {
    normalizeId,
    getStatusText
} from './helpers.js';
import {
    findUserByDocument,
    saveTaskToBackend,
    deleteTask
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

// Procesa el envío del formulario de tarea y guarda la tarea en el backend.
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
};

// Elimina una tarea tanto del backend como de la visualización, cuando se ejecuta el evento asociado
export const handleTaskDelete = async (event) => {
    event.preventDefault();

    event.stopPropagation();

    if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Eliminar') {
        const row = event.target.closest('.tasks__row');
    
        const titleCell = row.querySelector('td:first-child');
    
        const descriptionCell = row.querySelector('td:nth-child(2)');
    
        const statusCell = row.querySelector('td:nth-child(3) .task-status');
    
        const userCell = row.querySelector('td:nth-child(5)');
    
        const taskTitle = titleCell.textContent;
    
        const taskDescription = descriptionCell.textContent;
    
        const taskStatus = statusCell.textContent;
    
        const userName = userCell.textContent;
    
        const taskToDelete = state.dbTasks.find(task =>
            task.title === taskTitle &&
    
            task.description === taskDescription &&
    
            getStatusText(task.status) === taskStatus &&
    
            state.dbUsers.find(u => normalizeId(u.id) === normalizeId(task.userId))?.name === userName
        );
    
        if (taskToDelete) {
            const success = await deleteTask(taskToDelete.id);
    
            if (success) {
                row.remove();
    
                showUserMessage('Tarea eliminada correctamente.');
    
                if (dom.tasksTableBody.children.length === 0) {
                    showEmptyState();
                }
            } else {
                showUserMessage('Error al eliminar la tarea.', true);
            }
        } else {
            showUserMessage('No se pudo encontrar la tarea para eliminar.', true);
        }
    }
};