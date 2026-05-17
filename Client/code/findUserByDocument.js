// Busca un usuario en la lista cargada mediante su documento/inID.
import {
    normalizeId
} from '../index.js';

const findUserByDocument = (documentValue) => {
    const normalizedDocument = normalizeId(documentValue);
    return dbUsers.find(user => normalizeId(user.id) === normalizedDocument);
}

export { findUserByDocument };