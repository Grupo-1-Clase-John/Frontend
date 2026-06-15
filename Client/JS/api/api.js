// api.js - Define constantes y estado global para la aplicación

import {
    IP_adress,
    PORT
} from "./IP.js";

// URL base para las solicitudes al backend
export const apiUrl = `http://${IP_adress}:${PORT}/`;

// Exporta el DOM y el estado global para su uso en otros módulos
export const dom = {
    userSearchForm: document.getElementById("userSearchForm"),
    userDocumentInput: document.getElementById("userDocument"),
    userDocumentError: document.getElementById("userDocumentError"),
    userCard: document.getElementById("userCard"),
    userNameDisplay: document.getElementById("userNameDisplay"),
    userDocumentDisplay: document.getElementById("userDocumentDisplay"),
    userEmailDisplay: document.getElementById("userEmailDisplay"),
    userSearchMessage: document.getElementById("userSearchMessage"),
    taskForm: document.getElementById("taskForm"),
    taskFormFieldset: document.getElementById("taskFormFieldset"),
    taskTitleInput: document.getElementById("taskTitle"),
    taskDescriptionInput: document.getElementById("taskDescription"),
    taskStatusSelect: document.getElementById("taskStatus"),
    submitTaskBtn: document.getElementById("submitTaskBtn"),
    taskTitleError: document.getElementById("taskTitleError"),
    taskDescriptionError: document.getElementById("taskDescriptionError"),
    taskStatusError: document.getElementById("taskStatusError"),
    tasksTableBody: document.getElementById("tasksTableBody"),
    tasksEmptyState: document.getElementById("tasksEmptyState"),
    exportTasksBtn: document.getElementById("exportTasksBtn"),
    sortTasksSelect: document.getElementById("sortTasks"),
    statusFilterSelect: document.getElementById("statusFilter"),
    filterStatus: document.getElementById("filterStatus"),
    filterUser: document.getElementById("filterUser"),
};


// Estado global de la aplicación
export const state = {
    currentUserId: null,
    editingTaskId: null, 
    dbUsers: [],
    dbTasks: [],
    sortCriteria: '',
    statusFilter: '',
};
