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
// SELECCIÓN DE ELEMENTOS DEL DOM
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
    saveTaskToBackend,

    saveTaskToDbJson,

    /**
     * Lee las tareas almacenadas en localStorage.
     */
    loadSavedTasks,

    /**
     * Carga las tareas del usuario actual en la tabla de tareas.
     */
    loadUserTasks,

    /**
     * Inserta una fila nueva en la tabla de tareas con los datos de la tarea.
     */
    addTaskToTable,

    /**
     * Escapa texto para evitar inyección de HTML en la tabla.
     */
    escapeHtml,

    /**
     * Devuelve la clase CSS correspondiente al estado de la tarea.
     */
    getStatusClass,

    /**
     * Devuelve el texto legible para cada estado de la tarea.
     */
    getStatusText,

    /**
     * Maneja la edición de los campos de entrada para eliminar mensajes de error.
     */
    handleInputChange,

    /**
     * Limpia todas las filas de la tabla de tareas y muestra estado vacío.
     */
    clearTasksTable
} from "./index.js";

// ============================================
// REGISTRO DE EVENTOS
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