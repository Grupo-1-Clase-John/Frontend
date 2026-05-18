// Devuelve la clase CSS correspondiente al estado de la tarea.
const getStatusClass = (status) => {
    switch (status) {
        case "pendiente":
            return "pending";
        case "en-proceso":
            return "in-progress";
        case "completada":
            return "completed";
        default:
            return "pending";
    }
}

export { getStatusClass };