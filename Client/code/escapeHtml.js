// Escapa texto para evitar inyección de HTML en la tabla.
const escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

export { escapeHtml };