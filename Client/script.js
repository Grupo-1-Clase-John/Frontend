/**
 * ============================================
 * EJERCICIO DE MANIPULACIÓN DEL DOM
 * GESTIÓN DE TAREAS POR USUARIO
 * ============================================
 *
 * Objetivo: Aplicar conceptos del DOM para buscar usuarios
 * y registrar tareas asociadas sin recargar la página.
 *
 * Autor 1: [Miguel Flórez]
 * Autor 2: [Óscar Solano]
 * Fecha: [12/05/2026]
 * ============================================
 */

// ============================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ============================================
// Aquí se guardan las referencias a los elementos del HTML que se usan
// durante toda la aplicación: formularios, mensajes, tabla de tareas, etc.

const STORAGE_KEYS = {
    TASKS: "taskManagerTasks"
};

const apiUrl = 'http://192.168.0.13:3000/';

const userSearchForm = document.getElementById("userSearchForm");
const userDocumentInput = document.getElementById("userDocument");
const userDocumentError = document.getElementById("userDocumentError");

const userCard = document.getElementById("userCard");
const userNameDisplay = document.getElementById("userNameDisplay");
const userDocumentDisplay = document.getElementById("userDocumentDisplay");
const userEmailDisplay = document.getElementById("userEmailDisplay");

const userSearchMessage = document.getElementById("userSearchMessage");

const taskForm = document.getElementById("taskForm");
const taskFormFieldset = document.getElementById("taskFormFieldset");

const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskStatusSelect = document.getElementById("taskStatus");

const taskTitleError = document.getElementById("taskTitleError");
const taskDescriptionError = document.getElementById("taskDescriptionError");
const taskStatusError = document.getElementById("taskStatusError");

const tasksTableBody = document.getElementById("tasksTableBody");
const tasksEmptyState = document.getElementById("tasksEmptyState");

// Usuarios y tareas de respaldo cuando el backend no está disponible.
const FALLBACK_USERS = [];

const FALLBACK_TASKS = [];

let currentUserId = null; // Guarda el ID del usuario actualmente seleccionado.
let dbUsers = []; // Lista de usuarios cargados del backend o de respaldo.
let dbTasks = []; // Lista de tareas cargadas del backend o localmente.

import {
    /**
     * Normaliza un valor de ID a cadena sin espacios extra.
     */
    normalizeId,

    /**
     * Carga datos de usuarios y tareas desde el backend. Si falla, usa datos de respaldo.
     * También combina las tareas guardadas en localStorage con las tareas cargadas.
     */
    loadLocalData,

    loadFallbackData,

    /**
     * Determina si un valor de entrada no está vacío.
     */
    isValidInput,

    /**
     * Muestra mensaje de error junto a un campo.
     */
    showError,

    /**
     * Limpia el texto de error de un campo.
     */
    clearError,

    /**
     * Elimina todos los mensajes de error visibles en la página.
     */
    clearAllErrors,

    /**
     * Muestra la tarjeta de usuario con la información del usuario encontrado.
     */
    showUserCard,

    /**
     * Oculta la tarjeta de usuario cuando no hay ningún usuario seleccionado.
     */
    hideUserCard,

    /**
     * Muestra un mensaje de información o error debajo del formulario de búsqueda.
     */
    showUserMessage,

    /**
     * Oculta el mensaje de búsqueda de usuario.
     */
    hideUserMessage,

    /**
     * Activa el formulario de tareas para permitir el registro de nuevas tareas.
     */
    enableTaskForm,

    /**
     * Desactiva el formulario de tareas cuando no hay usuario seleccionado.
     */
    disableTaskForm,

    /**
     * Oculta el estado de tabla vacía.
     */
    hideEmptyState,

    /**
     * Muestra el indicador de tabla vacía cuando no hay tareas para el usuario.
     */
    showEmptyState,

    /**
     * Valida el formulario de búsqueda de usuario.
     */
    validateUserSearch,

    /**
     * Valida los campos del formulario de tarea y marca los errores correspondientes.
     */
    validateTaskForm,

    /**
     * Busca un usuario en la lista cargada mediante su documento/inID.
     */
    findUserByDocument,

    /**
     * Devuelve las tareas asociadas a un usuario específico.
     * Considera nombres de campo comunes de distintas fuentes de datos.
     */
    getUserTasks,

    /**
     * Procesa el envío del formulario de búsqueda de usuario.
     */
    handleUserSearch,

    /**
     * Procesa el envío del formulario de nueva tarea.
     */
    handleTaskSubmit,

    /**
     * Guarda todas las tareas en localStorage para persistencia local.
     */
    saveTasksToStorage,

    /**
     * Intenta guardar la tarea en el backend remoto y devuelve la tarea guardada.
     * Si falla, intenta escribirla en Server/db.json directamente.
     */
    saveTaskToBackend
} from "./index.js";

async function saveTaskToDbJson(task) {
    const dbUrl = `${apiUrl}Server/db.json`;
    const response = await fetch(dbUrl);
    if (!response.ok) {
        throw new Error(`No se pudo leer db.json: HTTP ${response.status}`);
    }

    const data = await response.json();
    const newTask = {
        ...task,
        userId: Number(task.userId) || task.userId
    };

    const updatedData = {
        ...data,
        tasks: Array.isArray(data.tasks) ? [...data.tasks, newTask] : [newTask]
    };

    const putResponse = await fetch(dbUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData, null, 2)
    });

    if (!putResponse.ok) {
        throw new Error(`No se pudo guardar en db.json: HTTP ${putResponse.status}`);
    }

    return newTask;
}

// Lee las tareas almacenadas en localStorage.
function loadSavedTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.warn("No se pudo leer localStorage", error);
        return [];
    }
}

// Carga las tareas del usuario actual en la tabla de tareas.
function loadUserTasks(userId) {
    clearTasksTable();
    const userTasks = getUserTasks(userId);

    if (userTasks.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();
    userTasks.forEach(task => addTaskToTable(task));
}

// Inserta una fila nueva en la tabla de tareas con los datos de la tarea.
function addTaskToTable(task) {
    if (tasksTableBody.children.length === 0) {
        hideEmptyState();
    }

    const row = document.createElement("tr");
    row.classList.add("tasks__row");

    const statusClass = getStatusClass(task.status);
    const user = dbUsers.find(u => normalizeId(u.id) === normalizeId(task.userId));
    const userName = user ? user.name : `Usuario ${normalizeId(task.userId)}`;

    const titleCell = document.createElement("td");
    titleCell.classList.add("tasks__cell");
    titleCell.textContent = task.title;

    const descriptionCell = document.createElement("td");
    descriptionCell.classList.add("tasks__cell");
    descriptionCell.textContent = task.description;

    const statusCell = document.createElement("td");
    statusCell.classList.add("tasks__cell");
    const statusBadge = document.createElement("span");
    statusBadge.classList.add("task-status", `task-status--${statusClass}`);
    statusBadge.textContent = getStatusText(task.status);
    statusCell.appendChild(statusBadge);

    const userCell = document.createElement("td");
    userCell.classList.add("tasks__cell");
    userCell.textContent = userName;

    row.appendChild(titleCell);
    row.appendChild(descriptionCell);
    row.appendChild(statusCell);
    row.appendChild(userCell);

    tasksTableBody.appendChild(row);
}

// Escapa texto para evitar inyección de HTML en la tabla.
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Devuelve la clase CSS correspondiente al estado de la tarea.
function getStatusClass(status) {
    switch (status) {
        case "pendiente":
            return "pending";
        case "en-proceso":
            return "in-progress";
        case "completada":
            return "completed";
        default:
            return "pending";
    }
}

// Devuelve el texto legible para cada estado de la tarea.
function getStatusText(status) {
    switch (status) {
        case "pendiente":
            return "Pendiente";
        case "en-proceso":
            return "En Proceso";
        case "completada":
            return "Completada";
        default:
            return status;
    }
}

// Maneja la edición de los campos de entrada para eliminar mensajes de error.
function handleInputChange(event) {
    const inputField = event.target;
    const errorElement = inputField.nextElementSibling;
    if (errorElement && errorElement.classList.contains("form__error")) {
        clearError(errorElement);
        inputField.classList.remove("error");
    }
}

// Limpia todas las filas de la tabla de tareas y muestra estado vacío.
function clearTasksTable() {
    tasksTableBody.innerHTML = "";
    showEmptyState();
}

// ============================================
// 5. REGISTRO DE EVENTOS
// ============================================

userSearchForm.addEventListener("submit", handleUserSearch);
taskForm.addEventListener("submit", handleTaskSubmit);

userDocumentInput.addEventListener("input", handleInputChange);
taskTitleInput.addEventListener("input", handleInputChange);
taskDescriptionInput.addEventListener("input", handleInputChange);
taskStatusSelect.addEventListener("change", handleInputChange);

// ============================================
// 6. INICIALIZACIÓN
// ============================================

document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM completamente cargado");
    await loadLocalData();
    console.log("Aplicación de gestión de tareas iniciada");
});