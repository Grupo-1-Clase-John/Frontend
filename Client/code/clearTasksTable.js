// Limpia todas las filas de la tabla de tareas y muestra estado vacío.
import {
    showEmptyState
} from "../index.js";

const clearTasksTable = () => {
    tasksTableBody.innerHTML = "";
    showEmptyState();
}

export { clearTasksTable };