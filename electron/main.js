const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db.js');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../public/favicon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
            devTools: process.env.VITE_DEV_SERVER_URL ? true : false,
            defaultFontFamily: {
                standard: 'Arial',
                serif: 'Times New Roman',
                sansSerif: 'Arial',
                monospace: 'Courier New'
            }
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() => {
    ipcMain.handle('project:getAll', async (event) => {
        return db.getAllProjects();
    });

    ipcMain.handle('project:create', async (event, { name, description, due_date, status }) => {
        if (!name || typeof name !== 'string') throw new Error('Valid project name is required');
        return db.createProject(name, description, due_date, status);
    });

    ipcMain.handle('project:update', async (event, { project_id, name, description, due_date, status }) => {
        if (!project_id || typeof project_id !== 'number') throw new Error('Valid project ID is required');
        return db.updateProject(project_id, name, description, due_date, status);
    });

    ipcMain.handle('project:addDetail', async (event, { project_id, key, value, is_completed }) => {
        if (!project_id || typeof project_id !== 'number') throw new Error('Valid project ID is required');
        return db.addProjectDetail(project_id, key, value, is_completed);
    });

    ipcMain.handle('project:getWithDetails', async (event, project_id) => {
        if (!project_id || typeof project_id !== 'number') throw new Error('Valid project ID is required');
        return db.getProjectWithDetails(project_id);
    });

    ipcMain.handle('project:updateDetail', async (event, { project_detail_id, key, value, is_completed }) => {
        if (!project_detail_id || typeof project_detail_id !== 'number') throw new Error('Valid project detail ID is required');
        return db.updateProjectDetail(project_detail_id, key, value, is_completed);
    });

    ipcMain.handle('project:delete', async (event, project_id) => {
        if (!project_id || typeof project_id !== 'number') throw new Error('Valid project ID is required');
        return db.deleteProject(project_id);
    });

    ipcMain.handle('project:deleteDetail', async (event, project_detail_id) => {
        if (!project_detail_id || typeof project_detail_id !== 'number') throw new Error('Valid project detail ID is required');
        return db.deleteProjectDetail(project_detail_id);
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

app.on('will-quit', () => {
    db.closeDatabase();
});
