// Desactiva el formulario de tareas cuando no hay usuario seleccionado.
const disableTaskForm = () => {
    taskFormFieldset.disabled = true;
}

export { disableTaskForm };