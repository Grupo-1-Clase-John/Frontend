/**
 * TasksTableUi.js
 * 
 * Funciones de UI para la tabla de tareas:
 * - Filas
 * - limpieza 
 * - carga filtrada por usuario
 * - manejo del estado vacío.
 *
 * Dependencias:
 *   DOM, state:
 *   - referencias cacheadas.
 *   getStatusClass:
 *   - estado 'pendiente', 'en-proceso', 'completado'
 *   getStatusText:        
 *   - estado 'pendiente', 'en-proceso', 'completada' - texto visible.
 *   escapeHtml:
 *   - escapa caracteres especiales para un textContent seguro.
 *   normalizeId:
 *   - convierte un valor a string trimmed (compara IDs)b.
 */

import { dom, state } from '../api/api.js';
//Dependencia circular:
//   tareasService.js - tareasUi.js - TaskTableUi.js - tareasService.js
// Ahora se importa desde helpers.js en vez de tareasService.js
import {
    getStatusClass,
    getStatusText,
    escapeHtml,
    normalizeId,
    filterTasks
} from '../utils/helpers.js';

import {
    showExportTasksButton
} from './exportTasksUi.js';

/**
 * Muestra el mensaje "Aún no hay tareas registradas".
 * @returns {void}
 */
export const showEmptyState = () => {
    dom.tasksEmptyState.classList.remove('hidden'); // Quita la clase .hidden para mostrar aviso.
};

/**
 * Ocultar mensaje de estado vacío de la tabla.
 * @returns {void}
 */
export const hideEmptyState = () => {
    dom.tasksEmptyState.classList.add('hidden'); // Agrega la clase .hidden para ocultar el aviso.
};

/**
 * Agrega una fila a la tabla de tareas con la información de task.
 * Crea un botón "Editar" y un botón
 * Eliminar
 * @param {Object} task Objeto { id, title, description, status, userId }.
 * @returns {void}
 */
export const addTaskToTable = (task) => {
    if (dom.tasksTableBody.children.length === 0) { // Si la tabla estaba vacía: Oculta el estado vacío antes de añadir la fila
        hideEmptyState();                            
    }

    const row = document.createElement('tr');        
    row.classList.add('tasks__row');                  
    row.dataset.taskId = task.id;                     // Guarda el id en data-attribute para delegación.

    const statusClass = getStatusClass(task.status);                                     
    const user = state.dbUsers.find(u => normalizeId(u.id) === normalizeId(task.userId)); // Busca el usuario dueño de la tarea.
    const userName = user ? user.name : `Usuario ${normalizeId(task.userId)}`;            // Fallback si el usuario no se encuentra.

    const titleCell = document.createElement('td');       
    titleCell.classList.add('tasks__cell');                  
    titleCell.textContent = escapeHtml(task.title);        

    const descriptionCell = document.createElement('td'); 
    descriptionCell.classList.add('tasks__cell');
    descriptionCell.textContent = escapeHtml(task.description);

    const statusCell = document.createElement('td');      
    statusCell.classList.add('tasks__cell');
    const statusBadge = document.createElement('span');     // Crea el badge (<span>).
    statusBadge.classList.add('task-status', `task-status--${statusClass}`); 
    statusBadge.textContent = getStatusText(task.status);  
    statusCell.appendChild(statusBadge);                   

    const userCell = document.createElement('td');
    userCell.textContent = userName;

    const actionsCell = document.createElement('td');
    actionsCell.classList.add('tasks__cell');

    const deleteButton = document.createElement('button');  // Botón "Eliminar" 
    deleteButton.classList.add('btn', 'btn--primary', 'btn--small');
    deleteButton.textContent = 'Eliminar';
    actionsCell.appendChild(deleteButton);

    const editButton = document.createElement('button');    // Botón "Editar" 
    editButton.type = 'button';                            
    editButton.classList.add('btn', 'btn--primary', 'btn--small');
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => {             // Al hacer clic emite el evento `task:edit`:
        document.dispatchEvent(new CustomEvent('task:edit', { 
            detail: { taskId: task.id }                      // Payload: id de la tarea a editar.
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

/**
 * Vacía la tabla de tareas y vuelve a mostrar el estado vacío.
 * @returns {void}
 */
export const clearTasksTable = () => {
    dom.tasksTableBody.innerHTML = ''; // Elimina todas las filas del <tbody>.
    showEmptyState();                  // Muestra el mensaje "Aún no hay tareas registradas".
};

/**
 * Carga en la tabla las tareas asociadas al usuario indicado.
 * Acepta variantes del nombre de la propiedad de relación (userId, user_id, id_usuario) 
 * @param {string|number} userId Identificador del usuario para las tareas que se quieran mostrar.
 * @returns {void}
 */
export const loadUserTasks = (userId) => {
    clearTasksTable();
    const userTasks = filterTasks({ userId });

    if (userTasks.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();
    userTasks.forEach(task => addTaskToTable(task));
};

export const populateUserFilter = () => {
    const select = dom.filterUser;
    select.innerHTML = '<option value="">Todos</option>';
    state.dbUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        select.appendChild(option);
    });

    dom.filterStatus.addEventListener('change', renderFilteredTasks);
    dom.filterUser.addEventListener('change', renderFilteredTasks);
};

export const renderFilteredTasks = () => {
    const status = dom.filterStatus.value;
    const userId = dom.filterUser.value;

    const tasks = filterTasks({ status, userId });

    clearTasksTable();
    if (tasks.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();
    tasks.forEach(task => addTaskToTable(task));

    if (state.currentUserId && dom.filterUser.value === state.currentUserId) {
        showExportTasksButton(filterTasks({ userId: state.currentUserId }));
    } else {
        showExportTasksButton([]);
    }
};
