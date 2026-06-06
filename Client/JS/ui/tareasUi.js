/**
 *TareasUi.js

 * Barrel de UI del módulo de tareas.
 * Re-exportación de todas las funciones de UI (desde los sub-módulos de la
 * carpeta .ui), manteniendo punto de importación para
 * tareasService.js, el barrel index.js y otros consumidores.
 *
 * Creación de archivos aparte dentro de .ui para mayor organización:
 * 
 * Estructura de la carpeta .ui:
 * 
 *   userSearchUi.js:
 *   - Para búsqueda de usuario y mensajes
 *   taskFormUi.js:
 *   - Para el estado y errores del formulario de tareas
 *   tasksTableUi.js:
 *   - Para renderizado de la tabla de tareas
 */

// Re-exportar UI de búsqueda de usuario (tarjeta de datos + mensajes).
export {
    showUserCard,    // Muestra tarjeta con los datos del usuario localizado.
    hideUserCard,    // Oculta la tarjeta del usuario.
    showUserMessage, // Mensaje informativo/error en el buscador.
    hideUserMessage  // Oculta mensaje del buscador.
} from './userSearchUi.js';

// Re-exporta UI del formulario de tareas (errores, estado, modo, cambio reactivo).
export {
    showError,            // Muestra un mensaje de error en un elemento
    clearError,           // Limpia el mensaje de error de un elemento.
    clearAllErrors,       // Limpia todos los mensajes de error.
    enableTaskForm,       // Habilita los campos del formulario de tareas
    disableTaskForm,      // Deshabilita los campos del formulario de tareas
    handleInputChange,    // Limpia el error de un INPUT al cambiar su valor.
    setTaskFormEditMode,  // Cambia el botón a "Actualizar tarea"
    setTaskFormCreateMode // Cambia el botón a "Registrar tarea"
} from './tasksFormUi.js';

// Re-exporta la UI de la tabla de tareas (estado vacío, filas, carga filtrada).
export {
    showEmptyState,  // Muestra el mensaje "Aún no hay tareas registradas".
    hideEmptyState,  // Oculta el mensaje de "estado vacío".
    addTaskToTable,  // Agrega una fila a la tabla con los datos de una tarea.
    clearTasksTable, // Vacía la tabla y muestra el estado vacío.
    loadUserTasks    // Filtra y muestra las tareas del usuario indicado.
} from './taskTableUi.js';
