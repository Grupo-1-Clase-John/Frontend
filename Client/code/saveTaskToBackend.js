// Intenta guardar la tarea en el backend remoto y devuelve la tarea guardada.
// Si falla, intenta escribirla en Server/db.json directamente.
import {
    showUserMessage,
    normalizeId,
    saveTaskToDbJson
} from '../index.js'

const saveTaskToBackend = async (task) => {
    const payload = {
        ...task,
        userId: Number(task.userId) || task.userId
    };

    try {
        const response = await fetch(`${apiUrl}tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const saved = await response.json();
        showUserMessage("Tarea guardada en el backend.");
        return {
            ...task,
            id: normalizeId(saved.id || task.id),
            userId: normalizeId(saved.userId || payload.userId)
        };
    } catch (error) {
        console.warn("POST /tasks falló, intentando guardar directamente en db.json:", error);
        const fallbackTask = await saveTaskToDbJson(payload).catch(fallbackError => {
            console.warn("Guardado directo en db.json falló:", fallbackError);
            return null;
        });

        if (fallbackTask) {
            showUserMessage("Tarea guardada directamente en db.json.");
            return fallbackTask;
        }

        showUserMessage(`Error al guardar: ${error.message}. La tarea se guardó localmente.`, true);
        return task;
    }
}

export { saveTaskToBackend };