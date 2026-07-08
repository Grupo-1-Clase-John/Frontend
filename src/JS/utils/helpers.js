// helpers.js - Funciones auxiliares compartidas
// Extraídas para romper dependencia circular entre tareasService.js y validaciones.js

export const normalizeId = (value) => {
    return String(value || '').trim();
};

export const isValidInput = (value) => {
    return String(value || '').trim().length > 0;
};
