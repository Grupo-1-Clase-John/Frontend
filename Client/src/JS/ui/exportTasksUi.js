// exportTasksUi.js - Archivo para manejar la interfaz de usuario de exportación de tareas, mostrando un botón para exportar tareas y manejando la interacción del usuario

// Función para mostrar el botón de exportar tareas si hay tareas registradas
export const showExportTasksButton = (tasks) => {
    const exportTasksBtn = document.getElementById('exportTasksBtn');
    if (tasks.length > 0) {
        exportTasksBtn.classList.remove('hidden');
    } else {
        exportTasksBtn.classList.add('hidden');
    }
};