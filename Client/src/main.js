
import {
    dom,
    state,
    loadLocalData,
    handleUserSearch,
    handleTaskSubmit,
    handleInputChange,
    handleTaskEdit,
    handleTaskDelete,
    exportTasks,
    populateUserFilter,
    renderFilteredTasks,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    usersDom,
    renderUsersTable,
    showUserForm,
    hideUserForm,
    setUserFormError,
    normalizeId
} from './index.js';

const {
    userSearchForm,
    userDocumentInput,
    taskForm,
    taskTitleInput,
    taskDescriptionInput,
    taskStatusSelect,
    tasksTableBody,
    exportTasksBtn
} = dom;

userSearchForm.addEventListener('submit', handleUserSearch);
taskForm.addEventListener('submit', handleTaskSubmit);

document.addEventListener('task:edit', (event) => {
    handleTaskEdit(event.detail.taskId);
});

dom.tasksTableBody.addEventListener('click', handleTaskDelete);

dom.exportTasksBtn.addEventListener('click', exportTasks);

userDocumentInput.addEventListener('input', handleInputChange);
taskTitleInput.addEventListener('input', handleInputChange);
taskDescriptionInput.addEventListener('input', handleInputChange);
taskStatusSelect.addEventListener('change', handleInputChange);

// --- User Admin ---

usersDom.addUserBtn.addEventListener('click', () => showUserForm());

usersDom.cancelUserBtn.addEventListener('click', hideUserForm);

usersDom.userForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const doc = usersDom.userDocInput.value.trim();
    const name = usersDom.userNameInput.value.trim();
    const email = usersDom.userEmailInput.value.trim();
    let valid = true;

    if (!doc) { setUserFormError('document', 'El documento es obligatorio'); valid = false; }
    else { setUserFormError('document', ''); }
    if (!name) { setUserFormError('name', 'El nombre es obligatorio'); valid = false; }
    else { setUserFormError('name', ''); }
    if (!email) { setUserFormError('email', 'El email es obligatorio'); valid = false; }
    else { setUserFormError('email', ''); }
    if (!valid) return;

    const editId = usersDom.userForm.dataset.editId;

    if (editId) {
        await updateUser(editId, { name, email });
    } else {
        await createUser({ id: doc, name, email });
    }

    hideUserForm();
    renderUsersTable();
});

document.addEventListener('user:edit', (event) => {
    const userId = event.detail.userId;
    const user = state.dbUsers.find(u => normalizeId(u.id) === normalizeId(userId));
    if (user) showUserForm(user);
});

document.addEventListener('user:delete', async (event) => {
    const userId = event.detail.userId;
    await deleteUser(userId);
    renderUsersTable();
});

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM completamente cargado');
    await loadLocalData();
    await loadUsers();
    populateUserFilter();
    renderFilteredTasks();
    renderUsersTable();
    console.log('Aplicación de gestión de tareas iniciada');
});
