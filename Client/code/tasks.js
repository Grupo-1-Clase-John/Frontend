import { dom, state } from './appContext.js';
import { hideEmptyState, showEmptyState } from './ui.js';
import { getStatusClass, getStatusText, escapeHtml, normalizeId } from './helpers.js';


// Añade una fila a la tabla de tareas con la información de una tarea.
export const addTaskToTable = (task) => {
    if (dom.tasksTableBody.children.length === 0) {
        hideEmptyState();
    }

    const row = document.createElement('tr');
    row.classList.add('tasks__row');

    const statusClass = getStatusClass(task.status);
    const user = state.dbUsers.find(u => normalizeId(u.id) === normalizeId(task.userId));
    const userName = user ? user.name : `Usuario ${normalizeId(task.userId)}`;

    const titleCell = document.createElement('td');
    titleCell.classList.add('tasks__cell');
    titleCell.textContent = escapeHtml(task.title);

    const descriptionCell = document.createElement('td');
    descriptionCell.classList.add('tasks__cell');
    descriptionCell.textContent = escapeHtml(task.description);

    const statusCell = document.createElement('td');
    statusCell.classList.add('tasks__cell');
    const statusBadge = document.createElement('span');
    statusBadge.classList.add('task-status', `task-status--${statusClass}`);
    statusBadge.textContent = getStatusText(task.status);
    statusCell.appendChild(statusBadge);

    const userCell = document.createElement('td');
    userCell.classList.add('tasks__cell');
    userCell.textContent = userName;

    const actionsCell = document.createElement('td');
    actionsCell.classList.add('tasks__cell');
    
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.classList.add('btn', 'btn--primary', 'btn--small');
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('task:edit', {
        detail: {
            taskId: task.id
        }
    }));
    });
  

    actionsCell.appendChild(editButton);

    row.appendChild(titleCell);
    row.appendChild(descriptionCell);
    row.appendChild(statusCell);
    row.appendChild(userCell);
    row.appendChild(actionsCell);

    dom.tasksTableBody.appendChild(row);
};

// Limpia la tabla de tareas y muestra el estado vacío.
export const clearTasksTable = () => {
    dom.tasksTableBody.innerHTML = '';
    showEmptyState();
};

// Carga y muestra las tareas asociadas al usuario actual.
export const loadUserTasks = (userId) => {
    clearTasksTable();
    const userTasks = state.dbTasks.filter(task =>
        normalizeId(task.userId) === normalizeId(userId) ||
        normalizeId(task.user_id) === normalizeId(userId) ||
        normalizeId(task.id_usuario) === normalizeId(userId)
    );

    if (userTasks.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();
    userTasks.forEach(task => addTaskToTable(task));
};
