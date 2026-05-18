// Lee las tareas almacenadas en localStorage.
const loadSavedTasks = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.warn("No se pudo leer localStorage", error);
        return [];
    }
}

export { loadSavedTasks };