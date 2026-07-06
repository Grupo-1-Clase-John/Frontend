import { dom, state } from '../api/api.js';
import { escapeHtml, normalizeId } from '../services/tareasService.js';

export const usersDom = {
  userForm: document.getElementById('userForm'),
  userDocInput: document.getElementById('userDocInput'),
  userNameInput: document.getElementById('userNameInput'),
  userEmailInput: document.getElementById('userEmailInput'),
  userDocError: document.getElementById('userDocError'),
  userNameError: document.getElementById('userNameError'),
  userEmailError: document.getElementById('userEmailError'),
  submitUserBtn: document.getElementById('submitUserBtn'),
  cancelUserBtn: document.getElementById('cancelUserBtn'),
  usersTableBody: document.getElementById('usersTableBody'),
  usersEmptyState: document.getElementById('usersEmptyState'),
  addUserBtn: document.getElementById('addUserBtn')
};

export const showUsersEmptyState = () => {
  usersDom.usersEmptyState.classList.remove('hidden');
};

export const hideUsersEmptyState = () => {
  usersDom.usersEmptyState.classList.add('hidden');
};

export const addUserToTable = (user) => {
  if (usersDom.usersTableBody.children.length === 0) {
    hideUsersEmptyState();
  }

  const row = document.createElement('tr');
  row.classList.add('tasks__row');
  row.dataset.userId = user.id;

  const idCell = document.createElement('td');
  idCell.classList.add('tasks__cell');
  idCell.textContent = escapeHtml(user.id);

  const nameCell = document.createElement('td');
  nameCell.classList.add('tasks__cell');
  nameCell.textContent = escapeHtml(user.name);

  const emailCell = document.createElement('td');
  emailCell.classList.add('tasks__cell');
  emailCell.textContent = escapeHtml(user.email);

  const actionsCell = document.createElement('td');
  actionsCell.classList.add('tasks__cell');

  const editButton = document.createElement('button');
  editButton.classList.add('btn', 'btn--primary', 'btn--small');
  editButton.textContent = 'Editar';
  editButton.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('user:edit', { detail: { userId: user.id } }));
  });
  actionsCell.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn--primary', 'btn--small');
  deleteButton.textContent = 'Eliminar';
  deleteButton.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('user:delete', { detail: { userId: user.id } }));
  });
  actionsCell.appendChild(deleteButton);

  row.appendChild(idCell);
  row.appendChild(nameCell);
  row.appendChild(emailCell);
  row.appendChild(actionsCell);

  usersDom.usersTableBody.appendChild(row);
};

export const clearUsersTable = () => {
  usersDom.usersTableBody.innerHTML = '';
  showUsersEmptyState();
};

export const renderUsersTable = () => {
  clearUsersTable();
  if (state.dbUsers.length === 0) return;

  hideUsersEmptyState();
  state.dbUsers.forEach(user => addUserToTable(user));
};

export const showUserForm = (user) => {
  usersDom.userForm.classList.remove('hidden');
  usersDom.userDocError.textContent = '';
  usersDom.userNameError.textContent = '';
  usersDom.userEmailError.textContent = '';

  if (user) {
    usersDom.userDocInput.value = user.id;
    usersDom.userNameInput.value = user.name;
    usersDom.userEmailInput.value = user.email;
    usersDom.submitUserBtn.textContent = 'Actualizar Usuario';
    usersDom.userForm.dataset.editId = user.id;
  } else {
    usersDom.userDocInput.value = '';
    usersDom.userNameInput.value = '';
    usersDom.userEmailInput.value = '';
    usersDom.submitUserBtn.textContent = 'Guardar Usuario';
    delete usersDom.userForm.dataset.editId;
  }
};

export const hideUserForm = () => {
  usersDom.userForm.classList.add('hidden');
  usersDom.userDocInput.value = '';
  usersDom.userNameInput.value = '';
  usersDom.userEmailInput.value = '';
  usersDom.userDocError.textContent = '';
  usersDom.userNameError.textContent = '';
  usersDom.userEmailError.textContent = '';
  delete usersDom.userForm.dataset.editId;
  usersDom.submitUserBtn.textContent = 'Guardar Usuario';
};

export const setUserFormError = (field, message) => {
  const errorMap = {
    document: usersDom.userDocError,
    name: usersDom.userNameError,
    email: usersDom.userEmailError
  };
  if (errorMap[field]) {
    errorMap[field].textContent = message;
  }
};
