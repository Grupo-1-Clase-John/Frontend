import { apiUrl, state, FALLBACK_USERS, FALLBACK_TASKS } from './appContext.js';
import { normalizeId } from './helpers.js';
import { showUserMessage } from './ui.js';

// Carga datos de respaldo desde el archivo db.json cuando el backend no está disponible.
export const loadFallbackData = async () => {
    try {
        const response = await fetch('../Server/db.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const fallbackUsers = Array.isArray(data.users) ? data.users : [];
        const fallbackTasks = Array.isArray(data.tasks) ? data.tasks : [];

        state.dbUsers = fallbackUsers.map(user => ({
            ...user,
            id: normalizeId(user.id)
        }));

        state.dbTasks = fallbackTasks.map(task => ({
            ...task,
            id: normalizeId(task.id),
            userId: normalizeId(task.userId)
        }));

        return true;
    } catch (error) {
        console.warn('No se pudo cargar datos desde Server/db.json', error);
        return false;
    }
};

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
                userId: normalizeId(task.userId)
            }));
    } catch (error) {
        console.warn('No se pudo cargar datos desde el backend, intentando cargar datos locales de repo', error);
        const loadedFromRepo = await loadFallbackData();

        if (!loadedFromRepo) {
            state.dbUsers = [...FALLBACK_USERS];
            state.dbTasks = [...FALLBACK_TASKS];
        }
    }
};

// Busca un usuario en el estado actual por su documento normalizado.
export const findUserByDocument = (documentValue) => {
    const normalizedDocument = normalizeId(documentValue);
    return state.dbUsers.find(user => normalizeId(user.id) === normalizedDocument);
};

// Filtra las tareas del estado actual que pertenecen al usuario indicado.
export const getUserTasks = (userId) => {
    const normalizedUserId = normalizeId(userId);
    return state.dbTasks.filter(task =>
        normalizeId(task.userId) === normalizedUserId ||
        normalizeId(task.user_id) === normalizedUserId ||
        normalizeId(task.id_usuario) === normalizedUserId
    );
};

// Guarda una tarea directamente en el archivo db.json como fallback.
export const saveTaskToDbJson = async (task) => {
    const dbUrl = `${apiUrl}Server/db.json`;
    const response = await fetch(dbUrl);
    if (!response.ok) {
        throw new Error(`No se pudo leer db.json: HTTP ${response.status}`);
    }

    const data = await response.json();
    const newTask = {
        ...task,
        userId: Number(task.userId) || task.userId
    };

    const updatedData = {
        ...data,
        tasks: Array.isArray(data.tasks) ? [...data.tasks, newTask] : [newTask]
    };

    const putResponse = await fetch(dbUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData, null, 2)
    });

    if (!putResponse.ok) {
        throw new Error(`No se pudo guardar en db.json: HTTP ${putResponse.status}`);
    }

    return newTask;
};

// Intenta guardar la tarea en el backend y usa db.json solo si la petición falla.
export const saveTaskToBackend = async (task) => {
    const payload = {
        ...task,
        userId: Number(task.userId) || task.userId
    };

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
        showUserMessage('Tarea guardada en el backend.');
        return {
            ...task,
            id: normalizeId(saved.id || task.id),
            userId: normalizeId(saved.userId || payload.userId)
        };
    } catch (error) {
        console.warn('POST /tasks falló, intentando guardar directamente en db.json:', error);
        const fallbackTask = await saveTaskToDbJson(payload).catch(fallbackError => {
            console.warn('Guardado directo en db.json falló:', fallbackError);
            return null;
        });

        if (fallbackTask) {
            showUserMessage('Tarea guardada directamente en db.json.');
            return fallbackTask;
        }

        showUserMessage(`Error al guardar: ${error.message}.`, true);
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
        showUserMessage('Tarea actualizada correctamente.');
        return {
            ...updatedTask,
            id: normalizeId(updatedTask.id),
            userId: normalizeId(updatedTask.userId)
        };
    } catch (error) {
        console.warn('PATCH /tasks falló:', error);
        showUserMessage(`Error al actualizar: ${error.message}.`, true);
        return null;
    }
};
// Elimina una tarea del estado actual y del backend o db.json según corresponda.
export const deleteTask = async (taskId) => {
    const normalizedTaskId = normalizeId(taskId);
    
    const taskIndex = state.dbTasks.findIndex(task => normalizeId(task.id) === normalizedTaskId);
    
    if (taskIndex === -1) {
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
    
        showUserMessage('Tarea eliminada del backend.');
    
        return true;
    } catch (error) {
        console.warn('DELETE /tasks falló, intentando eliminar directamente de db.json:', error);
    
        const dbUrl = `${apiUrl}Server/db.json`;
    
        const response = await fetch(dbUrl);
    
        if (!response.ok) {
            console.warn('No se pudo leer db.json para eliminar:', response.status);
            showUserMessage(`Error al eliminar: ${error.message}.`, true);
            return false;
        }
    
        const data = await response.json();
    
        const updatedTasks = (Array.isArray(data.tasks) ? data.tasks : data.tasks || [])
            .filter(task => normalizeId(task.id) !== normalizedTaskId);
    
        const updatedData = {
            ...data,
            tasks: updatedTasks
        };
    
        const putResponse = await fetch(dbUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData, null, 2)
        });
    
        if (!putResponse.ok) {
            console.warn('No se pudo actualizar db.json para eliminar:', putResponse.status);
    
            showUserMessage(`Error al eliminar: ${error.message}.`, true);
    
            return false;
        }
    
        state.dbTasks.splice(taskIndex, 1);
    
        showUserMessage('Tarea eliminada directamente de db.json.');
    
        return true;
    }
};