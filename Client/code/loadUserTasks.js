// Carga las tareas del usuario actual en la tabla de tareas.
import {
    clearTasksTable,
    getUserTasks,
    hideEmptyState,
    showEmptyState,
    addTaskToTable
} from "../index.js";

const loadUserTasks = (userId) => {
    clearTasksTable();
    const userTasks = getUserTasks(userId);

    if (userTasks.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();
    userTasks.forEach(task => addTaskToTable(task));
}

export { loadUserTasks };