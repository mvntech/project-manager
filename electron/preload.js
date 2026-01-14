const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    createProject: (name, description, due_date) =>
        ipcRenderer.invoke('project:create', { name, description, due_date }),

    addProjectDetail: (project_id, key, value, status, priority) =>
        ipcRenderer.invoke('project:addDetail', { project_id, key, value, status, priority }),

    getProjectWithDetails: (project_id) =>
        ipcRenderer.invoke('project:getWithDetails', project_id),

    updateProjectDetail: (project_detail_id, key, value, status, priority) =>
        ipcRenderer.invoke('project:updateDetail', { project_detail_id, key, value, status, priority }),

    deleteProject: (project_id) =>
        ipcRenderer.invoke('project:delete', project_id),
});