// Normaliza un valor de ID a cadena sin espacios extra.
const normalizeId = (value) => {
    return String(value ?? "").trim();
}

export { normalizeId };