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
                userId: normalizeId(task.userId)
            }));
    } catch (error) {
        console.warn('No se pudo cargar datos desde el backend:', error);
        state.dbUsers = [];
        state.dbTasks = [];
        showUserMessage('No se pudo conectar con el servidor. Verifica que el backend este activo e intenta nuevamente.', true);
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

// Guarda la tarea en el backend.
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
        console.warn('POST /tasks falló:', error);
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
        showUserMessage('Tarea actualizada correctamente.');
        return {
            ...updatedTask,
            id: normalizeId(updatedTask.id),
            userId: normalizeId(updatedTask.userId)
        };
    } catch (error) {
        console.warn('PATCH /tasks falló:', error);
        showUserMessage(`No se pudo actualizar la tarea. Verifica que el servidor este disponible e intenta nuevamente. Detalle: ${error.message}.`, true);
        return null;
    }
};
// Elimina una tarea del estado actual y del backend.
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
        console.warn('DELETE /tasks falló:', error);
        showUserMessage(`No se pudo eliminar la tarea. Verifica que el servidor este disponible e intenta nuevamente. Detalle: ${error.message}.`, true);
        return false;
    }
};



