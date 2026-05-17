// Muestra un mensaje de información o error debajo del formulario de búsqueda.
const showUserMessage = (message, isError = false) => {
    userSearchMessage.textContent = message;
    userSearchMessage.classList.remove("hidden");
    if (isError) {
        userSearchMessage.classList.add("info-message--error");
    } else {
        userSearchMessage.classList.remove("info-message--error");
    }
}

export { showUserMessage };