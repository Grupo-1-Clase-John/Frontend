import { dom } from '../api/api.js';

export const showExportTasksButton = (tasks) => {
    if (tasks.length > 0) {
        dom.exportTasksBtn.classList.remove('hidden');
    } else {
        dom.exportTasksBtn.classList.add('hidden');
    }
};