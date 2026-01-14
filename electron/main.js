const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db.js');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() => {
    ipcMain.handle('project:create', async (event, { name, description, due_date }) => {
        if (!name) throw new Error('Project name is required');
        return db.createProject(name, description, due_date);
    });

    ipcMain.handle('project:addDetail', async (event, { project_id, key, value, status, priority }) => {
        if (!project_id) throw new Error('Project ID is required');
        return db.addProjectDetail(project_id, key, value, status, priority);
    });

    ipcMain.handle('project:getWithDetails', async (event, project_id) => {
        if (!project_id) throw new Error('Project ID is required');
        return db.getProjectWithDetails(project_id);
    });

    ipcMain.handle('project:updateDetail', async (event, { project_detail_id, key, value, status, priority }) => {
        if (!project_detail_id) throw new Error('Project detail ID is required');
        return db.updateProjectDetail(project_detail_id, key, value, status, priority);
    });

    ipcMain.handle('project:delete', async (event, project_id) => {
        if (!project_id) throw new Error('Project ID is required');
        return db.deleteProject(project_id);
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
