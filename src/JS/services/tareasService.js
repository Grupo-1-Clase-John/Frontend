import { apiUrl, dom, state } from '../api/api.js';

import {
    validateUserSearch,
    validateTaskForm
} from '../utils/validaciones.js';

import {
    clearAllErrors,
    hideUserMessage,
    showUserCard,
    enableTaskForm,
    hideUserCard,
    disableTaskForm,
    showUserMessage,
    showEmptyState,
    showError,
    setTaskFormEditMode,
    setTaskFormCreateMode,
    addTaskToTable,
    clearTasksTable,
    loadUserTasks,
    showNotification,
    renderFilteredTasks,
    populateUserFilter
} from '../ui/tareasUi.js';

import {
    showExportTasksButton
} from '../ui/exportTasksUi.js';


//DATA

// Descarga usuarios y tareas desde el backend y los guarda en el estado de la aplicación.
export const loadLocalData = async () => {
    try {
        const [usersResponse, tasksResponse] = await Promise.all([
            fetch(`${apiUrl}users`),
            fetch(`${apiUrl}tasks`)
        ]);

        if (!usersResponse.ok || !tasksResponse.ok) {
            throw new Error('No se pudo cargar datos del backend');
        }

        const [usersData, tasksData] = await Promise.all([
            usersResponse.json(),
            tasksResponse.json()
        ]);

        state.dbUsers = (Array.isArray(usersData) ? usersData : usersData.users || [])
            .map(user => ({
                ...user,
                id: normalizeId(user.id)
            }));

        state.dbTasks = (Array.isArray(tasksData) ? tasksData : tasksData.tasks || [])
            .map(task => ({
                ...task,
                id: normalizeId(task.id),
                userIds: (task.userIds || (task.userId ? [String(task.userId)] : [])).map(normalizeId)
            }));
    } catch (error) {
        console.warn('No se pudo cargar datos desde el backend:', error);
        state.dbUsers = [];
        state.dbTasks = [];
        showNotification('No se pudo conectar con el servidor. Verifica que el backend este activo.', 'error');
        showUserMessage('No se pudo conectar con el servidor. Verifica que el backend este activo e intenta nuevamente.', true);
    }
};

// Busca un usuario en el estado actual por su documento normalizado.
export const findUserByDocument = (documentValue) => {
    const normalizedDocument = normalizeId(documentValue);
    return state.dbUsers.find(user => normalizeId(user.id) === normalizedDocument);
};

// Filtra las tareas del estado actual combinando estado, usuario y orden por fecha.
export const filterTasks = ({ status, userId, dateOrder } = {}) => {
    let tasks = state.dbTasks;

    if (status) {
        var priority = [];
        var rest = [];
        tasks.forEach(function(t) {
            if (t.status === status) { priority.push(t); }
            else { rest.push(t); }
        });
        tasks = priority.concat(rest);
    }

    if (userId) {
        const normId = normalizeId(userId);
        tasks = tasks.filter(task =>
            (task.userIds || []).some(id => normalizeId(id) === normId)
        );
    }

    if (dateOrder) {
        tasks.sort((a, b) => {
            const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateOrder === 'asc' ? da - db : db - da;
        });
    }

    return tasks;
};

// Filtra las tareas del estado actual que pertenecen al usuario indicado.
export const getUserTasks = (userId) => {
    return filterTasks({ userId });
};

// Guarda la tarea en el backend.
export const saveTaskToBackend = async (task) => {
    const payload = { ...task };

    try {
        const response = await fetch(`${apiUrl}tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const saved = await response.json();
        showNotification('Tarea guardada correctamente.', 'success');
        showUserMessage('Tarea guardada en el backend.');
        return {
            ...saved,
            id: normalizeId(saved.id),
            userIds: (saved.userIds || []).map(normalizeId)
        };
    } catch (error) {
        console.warn('POST /tasks falló:', error);
        showNotification('No se pudo guardar la tarea. Verifica la conexion con el servidor.', 'error');
        showUserMessage(`No se pudo guardar la tarea. Verifica la conexion con el servidor e intenta nuevamente. Detalle: ${error.message}.`, true);
        return null;
    }
};


// Actualiza una tarea existente en el backend usando PATCH.
export const updateTaskInBackend = async (taskId, updatedFields) => {
    try {
        const response = await fetch(`${apiUrl}tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFields)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const updatedTask = await response.json();
        showNotification('Tarea actualizada correctamente.', 'success');
        showUserMessage('Tarea actualizada correctamente.');
        return {
            ...updatedTask,
            id: normalizeId(updatedTask.id),
            userIds: (updatedTask.userIds || []).map(normalizeId)
        };
    } catch (error) {
        console.warn('PATCH /tasks falló:', error);
        showNotification('No se pudo actualizar la tarea. Verifica que el servidor este disponible.', 'error');
        showUserMessage(`No se pudo actualizar la tarea. Verifica que el servidor este disponible e intenta nuevamente. Detalle: ${error.message}.`, true);
        return null;
    }
};
// Elimina una tarea del estado actual y del backend.
export const deleteTask = async (taskId) => {
    const normalizedTaskId = normalizeId(taskId);
    
    const taskIndex = state.dbTasks.findIndex(task => normalizeId(task.id) === normalizedTaskId);
    
    if (taskIndex === -1) {
        showNotification('Tarea no encontrada para eliminar.', 'error');
        showUserMessage('Tarea no encontrada para eliminar.', true);
        return false;
    }
    
    const taskToDelete = state.dbTasks[taskIndex];

    try {
        const response = await fetch(`${apiUrl}tasks/${taskToDelete.id}`, {
            method: 'DELETE'
        });
    
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
    
        state.dbTasks.splice(taskIndex, 1);
    
        showNotification('Tarea eliminada correctamente.', 'success');
        showUserMessage('Tarea eliminada del backend.');
    
        return true;
    } catch (error) {
        console.warn('DELETE /tasks falló:', error);
        showNotification('No se pudo eliminar la tarea. Verifica que el servidor este disponible.', 'error');
        showUserMessage(`No se pudo eliminar la tarea. Verifica que el servidor este disponible e intenta nuevamente. Detalle: ${error.message}.`, true);
        return false;
    }
};

//HANDLERS

// Maneja la búsqueda de usuario, mostrando datos y filtrando tareas.
export const handleUserSearch = async (event) => {
    event.preventDefault();
    clearAllErrors();
    hideUserMessage();

    if (!validateUserSearch()) {
        hideUserCard();
        dom.filterUser.value = '';
        renderFilteredTasks();
        return;
    }

    const documentValue = normalizeId(dom.userDocumentInput.value);
    const user = findUserByDocument(documentValue);

    if (user) {
        state.currentUserId = normalizeId(user.id);
        state.currentUserRole = String(user.role || 'user').toLowerCase();
        dom.userNameDisplay.textContent = user.name;
        dom.userDocumentDisplay.textContent = user.id;
        dom.userEmailDisplay.textContent = user.email;

        dom.userSearchPanel.classList.add('hidden');
        dom.tasksPanel.classList.remove('hidden');

        if (state.currentUserRole === 'admin') {
            dom.taskRegisterPanel.classList.remove('hidden');
            dom.usersAdminPanel.classList.remove('hidden');
            dom.tasksTable?.classList.remove('no-actions');
            dom.filterUser.disabled = false;
            dom.filterUserGroup?.classList.remove('hidden');
            dom.filterUser.value = '';
        } else {
            dom.taskRegisterPanel.classList.add('hidden');
            dom.usersAdminPanel.classList.add('hidden');
            dom.tasksTable?.classList.add('no-actions');
            dom.filterUser.disabled = true;
            dom.filterUserGroup?.classList.add('hidden');
            dom.filterUser.value = state.currentUserId;
        }

        hideUserMessage();
        showUserCard();
        renderFilteredTasks();
        showExportTasksButton(getUserTasks(state.currentUserId));
        showNotification(`Usuario ${user.name} encontrado.`, 'success');
    } else {
        state.currentUserId = null;
        hideUserCard();
        clearTasksTable();
        showNotification('Usuario no encontrado en el sistema', 'error');
        showUserMessage('Usuario no encontrado en el sistema', true);
    }
};

// Procesa el envío del formulario de tarea o la actualizacion y guarda la tarea en el backend.
export const handleTaskSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearAllErrors();

    if (!validateTaskForm()) {
        return;
    }

    const selectedUserIds = Array.from(dom.taskUsers.selectedOptions).map(o => normalizeId(o.value));
    if (selectedUserIds.length === 0) {
        showError(dom.taskUsersError, 'Seleccione al menos un usuario');
        return;
    }

    if (state.editingTaskId) {
    const updatedFields = {
        title: dom.taskTitleInput.value.trim(),
        description: dom.taskDescriptionInput.value.trim(),
        status: dom.taskStatusSelect.value,
        userIds: selectedUserIds
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
                userIds: (updatedTask.userIds || []).map(normalizeId)
                }
                : task
                );

    renderFilteredTasks();
    state.editingTaskId = null;
    dom.taskForm.reset();
    dom.taskStatusSelect.value = '';
    setTaskFormCreateMode();
    return;
        }

    const newTask = {
        userIds: selectedUserIds,
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
    renderFilteredTasks();
    dom.taskForm.reset();
    dom.taskStatusSelect.value = '';
    state.editingTaskId = null;
    setTaskFormCreateMode();
};

// Carga los datos de una tarea en el formulario para editarla.
export const handleTaskEdit = (taskId) => {
    const task = state.dbTasks.find(item => normalizeId(item.id) === normalizeId(taskId));

    if (!task) {
        showNotification('No se encontró la tarea para editar.', 'error');
        showUserMessage('No se encontró la tarea para editar.', true);
        return;
    }

    state.editingTaskId = normalizeId(task.id);
    showNotification('Modo edición activado. Modifica los campos y actualiza.', 'info');

    dom.taskTitleInput.value = task.title;
    dom.taskDescriptionInput.value = task.description;
    dom.taskStatusSelect.value = task.status;

    const taskUserIds = (task.userIds || []).map(normalizeId);
    Array.from(dom.taskUsers.options).forEach(opt => {
        opt.selected = taskUserIds.includes(normalizeId(opt.value));
    });

    clearAllErrors();
    hideUserMessage();
    enableTaskForm();
    setTaskFormEditMode();

    dom.taskTitleInput.focus();
};
// Elimina una tarea tanto del backend como de la visualización, cuando se ejecuta el evento asociado
export const handleTaskDelete = async (event) => {
    event.preventDefault();

    event.stopPropagation();

    if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Eliminar') {
        const row = event.target.closest('.tasks__row');

        if (row && row.dataset.taskId) {
            const success = await deleteTask(row.dataset.taskId);
    
            if (success) {
                row.remove();
    
                showNotification('Tarea eliminada correctamente.', 'success');
                renderFilteredTasks();
                showUserMessage('Tarea eliminada correctamente.');
            } else {
                showNotification('Error al eliminar la tarea.', 'error');
                showUserMessage('Error al eliminar la tarea.', true);
            }
        } else {
            showNotification('No se pudo encontrar la tarea para eliminar.', 'error');
            showUserMessage('No se pudo encontrar la tarea para eliminar.', true);
        }
    }
};

//HELPERS

// Normaliza un valor a una cadena minúscula sin espacios exteriores.
export const normalizeId = (value) => {
    return String(value || '').trim();
};

// Verifica si el valor proporcionado es un texto no vacío.
export const isValidInput = (value) => {
    return String(value || '').trim().length > 0;
};

// Convierte texto en HTML seguro escapando caracteres especiales.
export const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Devuelve la clase CSS correspondiente al estado de la tarea.
export const getStatusClass = (status) => {
    switch (status) {
        case 'pendiente':
            return 'pending';
        case 'en-proceso':
            return 'in-progress';
        case 'completada':
            return 'completed';
        default:
            return 'pending';
    }
};

// Devuelve la etiqueta de texto mostrada para el estado de la tarea.
export const getStatusText = (status) => {
    switch (status) {
        case 'pendiente':
            return 'Pendiente';
        case 'en-proceso':
            return 'En Proceso';
        case 'completada':
            return 'Completada';
        default:
            return status;
    }
};
