// Muestra el indicador de tabla vacía cuando no hay tareas para el usuario.
const showEmptyState = () => {
    tasksEmptyState.classList.remove("hidden");
}

export { showEmptyState };