// Guarda todas las tareas en localStorage para persistencia local.
const saveTasksToStorage = () => {
    try {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(dbTasks));
    } catch (error) {
        console.warn("No se pudo guardar en localStorage", error);
    }
}

export { saveTasksToStorage };