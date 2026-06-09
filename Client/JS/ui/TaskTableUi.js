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

    // parte Sara - Celda de Fecha de creación
    const dateCell = document.createElement('td');
    dateCell.classList.add('tasks__cell');
    dateCell.textContent = formatDate(task.createdAt);

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
    row.appendChild(dateCell);          // parte Sara
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
    clearTasksTable(); // Limpia la tabla antes de cargar.
    const userTasks = state.dbTasks.filter(task =>      // Filtra por cualquiera de los nombres del campo:
        normalizeId(task.userId) === normalizeId(userId) ||
        normalizeId(task.user_id) === normalizeId(userId) ||
        normalizeId(task.id_usuario) === normalizeId(userId)
    );

    // parte Sara - Aplica ordenamiento antes de renderizar
    const sortedTasks = sortTasks(userTasks);

    if (sortedTasks.length === 0) { // Si el usuario no tiene tareas muestra vacío y termina.
        showEmptyState();       
    }

    hideEmptyState();                                // Hay tareas: oculta el mensaje vacío.
    sortedTasks.forEach(task => addTaskToTable(task));  
};

// ============================================================
// Sistema de ordenamiento de tareas
// ============================================================


let sortField = null;    // Campo activo para ordenar
let sortOrder = 'asc';   // Dirección del orden: asc - desc


//Orden por Fecha de creación


const formatDate = (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};


// Orden por Estado


const sortTasks = (tasks) => {
    if (!sortField) return tasks;
    return [...tasks].sort((a, b) => {
        let valA, valB;

        // Orden por Fecha de creación
        if (sortField === 'createdAt') {
            valA = new Date(a.createdAt || 0).getTime();
            valB = new Date(b.createdAt || 0).getTime();

        // Orden por Nombre de la tarea
        } else if (sortField === 'title') {
            valA = (a.title || '').toLowerCase();
            valB = (b.title || '').toLowerCase();

        // Orden por Estado 
        } else if (sortField === 'status') {
            valA = (a.status || '').toLowerCase();
            valB = (b.status || '').toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
};

const handleSortClick = (field) => {
    if (sortField === field) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortOrder = 'asc';
    }
    updateSortIndicators();
    if (state.currentUserId) {
        loadUserTasks(state.currentUserId);
    }
};

const updateSortIndicators = () => {
    document.querySelectorAll('.sort-indicator').forEach(el => {
        el.textContent = '';
    });
    if (sortField) {
        const th = document.querySelector(`[data-sort="${sortField}"]`);
        if (th) {
            const indicator = th.querySelector('.sort-indicator');
            if (indicator) {
                indicator.textContent = sortOrder === 'asc' ? '▲' : '▼';
            }
        }
    }
};

const initSorting = () => {
    const headerRow = document.querySelector('.tasks__head tr');
    if (!headerRow) return;

    const sortMap = {
        'Título': 'title',   // Nombre de la tarea
        'Estado': 'status',  // Estado
    };

    // Fecha de creación
    const ths = headerRow.querySelectorAll('th');
    const estadoTh = Array.from(ths).find(th => th.textContent.trim() === 'Estado');
    if (estadoTh) {
        const dateTh = document.createElement('th');
        dateTh.className = 'tasks__column tasks__column--sortable';
        dateTh.setAttribute('data-sort', 'createdAt');
        dateTh.textContent = 'Fecha ';
        const indicator = document.createElement('span');
        indicator.className = 'sort-indicator';
        dateTh.appendChild(indicator);
        estadoTh.parentNode.insertBefore(dateTh, estadoTh.nextSibling);
    }

    // Hace ordenables de Título y Estado
    document.querySelectorAll('.tasks__head th').forEach(th => {
        const text = th.textContent.trim();
        const field = sortMap[text];
        if (field) {
            th.setAttribute('data-sort', field);
            th.classList.add('tasks__column--sortable');
            let indicator = th.querySelector('.sort-indicator');
            if (!indicator) {
                indicator = document.createElement('span');
                indicator.className = 'sort-indicator';
                th.appendChild(indicator);
            }
            th.addEventListener('click', () => handleSortClick(field));
        }
    });
};

// Inicializa el sistema de ordenamiento al cargar el módulo
initSorting();