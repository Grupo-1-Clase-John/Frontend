import { apiUrl, state } from '../api/api.js';
import { normalizeId } from './tareasService.js';
import { show } from '../ui/notificationsUi.js';

export const loadUsers = async () => {
  try {
    const response = await fetch(`${apiUrl}users`);
    if (!response.ok) throw new Error('Error al cargar usuarios');
    const data = await response.json();
    const users = Array.isArray(data) ? data : (data.users || []);
    state.dbUsers = users.map(u => ({ ...u, id: normalizeId(u.id) }));
  } catch (error) {
    console.warn('No se pudieron cargar usuarios:', error);
    show('No se pudieron cargar usuarios del servidor', 'error');
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${apiUrl}users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Error al crear usuario');
    const saved = await response.json();
    state.dbUsers.push({ ...saved, id: normalizeId(saved.id) });
    show('Usuario creado correctamente', 'success');
    return saved;
  } catch (error) {
    console.warn('POST /users falló:', error);
    show('No se pudo crear el usuario', 'error');
    return null;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`${apiUrl}users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Error al actualizar usuario');
    const updated = await response.json();
    const index = state.dbUsers.findIndex(u => normalizeId(u.id) === normalizeId(id));
    if (index !== -1) state.dbUsers[index] = { ...updated, id: normalizeId(updated.id) };
    show('Usuario actualizado correctamente', 'success');
    return updated;
  } catch (error) {
    console.warn('PATCH /users falló:', error);
    show('No se pudo actualizar el usuario', 'error');
    return null;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${apiUrl}users/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
    const index = state.dbUsers.findIndex(u => normalizeId(u.id) === normalizeId(id));
    if (index !== -1) state.dbUsers.splice(index, 1);
    show('Usuario eliminado correctamente', 'success');
    return true;
  } catch (error) {
    console.warn('DELETE /users falló:', error);
    show('No se pudo eliminar el usuario', 'error');
    return false;
  }
};
