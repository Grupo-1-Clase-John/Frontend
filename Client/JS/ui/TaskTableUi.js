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
import {
    getStatusClass, // 'pendiente' - 'en-proceso' - 'completada' = clase CSS modificadora.
    getStatusText,  // 'pendiente' - 'en-proceso' - 'completada' = texto legible.
    escapeHtml,     //  inserción segura en textContent.
    normalizeId     // Normaliza IDs (string trimmed) para comparaciones.
} from '../services/tareasService.js';

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
 * Carga en la tabla las tareas filtradas por usuario y/o estado.
 * @param {Object} filters Opciones de filtrado.
 * @param {string|number} [filters.userId] Identificador del usuario.
 * @param {string} [filters.status] Estado de la tarea ('pendiente', 'en-proceso', 'completada').
 * @returns {void}
 */
export const loadFilteredTasks = ({ userId = '', status = '' } = {}) => {
    clearTasksTable();

    const filteredTasks = state.dbTasks.filter(task => {
        const matchesUser = !userId ||
            normalizeId(task.userId) === normalizeId(userId) ||
            normalizeId(task.user_id) === normalizeId(userId) ||
            normalizeId(task.id_usuario) === normalizeId(userId);

        const matchesStatus = !status || normalizeId(task.status) === normalizeId(status);

        return matchesUser && matchesStatus;
    });

    if (filteredTasks.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();
    filteredTasks.forEach(task => addTaskToTable(task));
};

/**
 * Carga en la tabla las tareas asociadas al usuario indicado.
 * Acepta variantes del nombre de la propiedad de relación (userId, user_id, id_usuario)
 * @param {string|number} userId Identificador del usuario para las tareas que se quieran mostrar.
 * @param {string} [status] Estado de la tarea para combinar filtros.
 * @returns {void}
 */
export const loadUserTasks = (userId, status = '') => {
    loadFilteredTasks({ userId, status });
};
