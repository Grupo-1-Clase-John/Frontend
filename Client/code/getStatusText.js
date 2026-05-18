// Devuelve el texto legible para cada estado de la tarea.
const getStatusText = (status) => {
    switch (status) {
        case "pendiente":
            return "Pendiente";
        case "en-proceso":
            return "En Proceso";
        case "completada":
            return "Completada";
        default:
            return status;
    }
}

export { getStatusText };