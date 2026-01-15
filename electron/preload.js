const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    createProject: (name, description, due_date, status) =>
        ipcRenderer.invoke('project:create', { name, description, due_date, status }),

    updateProject: (project_id, name, description, due_date, status) =>
        ipcRenderer.invoke('project:update', { project_id, name, description, due_date, status }),

    addProjectDetail: (project_id, key, value, is_completed) =>
        ipcRenderer.invoke('project:addDetail', { project_id, key, value, is_completed }),

    getProjectWithDetails: (project_id) =>
        ipcRenderer.invoke('project:getWithDetails', project_id),

    updateProjectDetail: (project_detail_id, key, value, is_completed) =>
        ipcRenderer.invoke('project:updateDetail', { project_detail_id, key, value, is_completed }),

    deleteProject: (project_id) =>
        ipcRenderer.invoke('project:delete', project_id),

    getAllProjects: () =>
        ipcRenderer.invoke('project:getAll'),

    deleteProjectDetail: (project_detail_id) =>
        ipcRenderer.invoke('project:deleteDetail', project_detail_id),
});