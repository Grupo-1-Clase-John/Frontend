// Inserta una fila nueva en la tabla de tareas con los datos de la tarea.
import {
    hideEmptyState,
    normalizeId,
    getStatusClass,
    getStatusText
} from "../index.js";

const addTaskToTable = (task) => {
    if (tasksTableBody.children.length === 0) {
        hideEmptyState();
    }

    const row = document.createElement("tr");
    row.classList.add("tasks__row");

    const statusClass = getStatusClass(task.status);
    const user = dbUsers.find(u => normalizeId(u.id) === normalizeId(task.userId));
    const userName = user ? user.name : `Usuario ${normalizeId(task.userId)}`;

    const titleCell = document.createElement("td");
    titleCell.classList.add("tasks__cell");
    titleCell.textContent = task.title;

    const descriptionCell = document.createElement("td");
    descriptionCell.classList.add("tasks__cell");
    descriptionCell.textContent = task.description;

    const statusCell = document.createElement("td");
    statusCell.classList.add("tasks__cell");
    const statusBadge = document.createElement("span");
    statusBadge.classList.add("task-status", `task-status--${statusClass}`);
    statusBadge.textContent = getStatusText(task.status);
    statusCell.appendChild(statusBadge);

    const userCell = document.createElement("td");
    userCell.classList.add("tasks__cell");
    userCell.textContent = userName;

    row.appendChild(titleCell);
    row.appendChild(descriptionCell);
    row.appendChild(statusCell);
    row.appendChild(userCell);

    tasksTableBody.appendChild(row);
}

export { addTaskToTable };