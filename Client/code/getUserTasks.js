// Devuelve las tareas asociadas a un usuario específico.
// Considera nombres de campo comunes de distintas fuentes de datos.
import {
    normalizeId
} from '../index.js'

const getUserTasks = (userId) => {
    const normalizedUserId = normalizeId(userId);
    return dbTasks.filter(task =>
        normalizeId(task.userId) === normalizedUserId ||
        normalizeId(task.user_id) === normalizedUserId ||
        normalizeId(task.id_usuario) === normalizedUserId
    );
}

export { getUserTasks };