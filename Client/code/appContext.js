export const apiUrl = 'http://192.168.0.13:3000/';

export const FALLBACK_USERS = [];
export const FALLBACK_TASKS = [];

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
    taskTitleError: document.getElementById("taskTitleError"),
    taskDescriptionError: document.getElementById("taskDescriptionError"),
    taskStatusError: document.getElementById("taskStatusError"),
    tasksTableBody: document.getElementById("tasksTableBody"),
    tasksEmptyState: document.getElementById("tasksEmptyState")
};

export const state = {
    currentUserId: null,
    dbUsers: [],
    dbTasks: []
};
