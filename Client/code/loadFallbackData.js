import { normalizeId } from '../index.js'

const loadFallbackData = async () => {
    try {
        const response = await fetch("../Server/db.json");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const fallbackUsers = Array.isArray(data.users) ? data.users : [];
        const fallbackTasks = Array.isArray(data.tasks) ? data.tasks : [];

        dbUsers = fallbackUsers.map(user => ({
            ...user,
            id: normalizeId(user.id)
        }));

        dbTasks = fallbackTasks.map(task => ({
            ...task,
            id: normalizeId(task.id),
            userId: normalizeId(task.userId)
        }));

        return true;
    } catch (error) {
        console.warn("No se pudo cargar datos desde Server/db.json", error);
        return false;
    }
}

export { loadFallbackData }