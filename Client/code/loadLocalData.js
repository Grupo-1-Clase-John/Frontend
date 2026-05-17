// Carga datos de usuarios y tareas desde el backend. Si falla, usa datos de respaldo.
// También combina las tareas guardadas en localStorage con las tareas cargadas.
import {
    loadSavedTasks,
    normalizeId,
    loadFallbackData
} from '../index.js';

const loadLocalData = async () => {
    try {
        const [usersResponse, tasksResponse] = await Promise.all([
            fetch(`${apiUrl}users`),
            fetch(`${apiUrl}tasks`)
        ]);

        if (!usersResponse.ok || !tasksResponse.ok) {
            throw new Error("No se pudo cargar datos del backend");
        }

        const [usersData, tasksData] = await Promise.all([
            usersResponse.json(),
            tasksResponse.json()
        ]);

        dbUsers = (Array.isArray(usersData) ? usersData : usersData.users || [])
            .map(user => ({
                ...user,
                id: normalizeId(user.id)
            }));

        dbTasks = (Array.isArray(tasksData) ? tasksData : tasksData.tasks || [])
            .map(task => ({
                ...task,
                id: normalizeId(task.id),
                userId: normalizeId(task.userId)
            }));
    } catch (error) {
        console.warn("No se pudo cargar datos desde el backend, intentando cargar datos locales de repo", error);
        const loadedFromRepo = await loadFallbackData();

        if (!loadedFromRepo) {
            dbUsers = [...FALLBACK_USERS];
            dbTasks = [...FALLBACK_TASKS];
        }
    }

    const storedTasks = loadSavedTasks();
    if (storedTasks.length > 0) {
        dbTasks = [
            ...dbTasks,
            ...storedTasks.filter(task => !dbTasks.some(local => normalizeId(local.id) === normalizeId(task.id)))
        ];
    }
}

export { loadLocalData };