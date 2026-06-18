// exportTasks.js - Servicio para exportar tareas en un json

import {
    apiUrl,
    state
} from '../api/api.js';

// Al hacer clic en el botón de exportar tareas, se descarga un archivo JSON con las tareas del usuario actual
export const exportTasks = async (event) => {
    event.preventDefault();

    if (!state.currentUserId) {
        alert('No hay un usuario seleccionado para exportar tareas.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}users/${state.currentUserId}/tasks`);

        if (!response.ok) {
            throw new Error('Error al obtener las tareas para exportar');
        }

        const tasks = await response.json();

        // Crear un enlace de descarga para el archivo JSON
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));

        // Crear un elemento de anclaje para descargar el archivo
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `tareas_usuario_${state.currentUserId}.json`);

        // Agregar el enlace al DOM, hacer clic en él para iniciar la descarga y luego eliminarlo
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    } catch (error) {
        console.error('Error al exportar tareas:', error);
        alert('Ocurrió un error al exportar las tareas. Por favor, inténtalo de nuevo.');
    }
};