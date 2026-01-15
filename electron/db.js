const Database = require('better-sqlite3');
const { app } = require('electron');
const path = require('path');

let db;

function initDatabase() {
    if (!app) {
        console.error('Electron app is missing. Ensure the app is running in Electron, not Node.');
        return;
    }

    const dbPath = path.join(app.getPath('userData'), 'projects.db');
    db = new Database(dbPath);

    db.pragma('foreign_keys = ON');

    db.prepare(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'Pending',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            due_date TEXT
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS project_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER,
            key TEXT,
            value TEXT,
            is_completed INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
        )
    `).run();
}

if (app.isReady()) {
    initDatabase();
} else {
    app.on('ready', () => {
        initDatabase();
    });
}

function createProject(name, description, due_date, status = 'Pending') {
    try {
        const stmt = db.prepare('INSERT INTO projects (name, description, due_date, status) VALUES (?, ?, ?, ?)');
        const info = stmt.run(name, description, due_date, status);
        return info.lastInsertRowid;
    } catch (error) {
        console.error('Database error in createProject:', error);
        throw error;
    }
}

function addProjectDetail(project_id, key, value, is_completed = 0) {
    try {
        const stmt = db.prepare(`
            INSERT INTO project_details (project_id, key, value, is_completed)
            VALUES (?, ?, ?, ?)
        `);
        const info = stmt.run(project_id, key, value, is_completed);
        return info.lastInsertRowid;
    } catch (error) {
        console.error('Database error in addProjectDetail:', error);
        throw error;
    }
}

function getProjectWithDetails(project_id) {
    try {
        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(project_id);
        if (!project) return null;
        const details = db.prepare('SELECT * FROM project_details WHERE project_id = ?').all(project_id);
        return {
            ...project,
            details
        };
    } catch (error) {
        console.error('Database error in getProjectWithDetails:', error);
        throw error;
    }
}

function updateProject(project_id, name, description, due_date, status) {
    try {
        const stmt = db.prepare(`
            UPDATE projects
            SET name = ?, description = ?, due_date = ?, status = ?
            WHERE id = ?
        `);
        const info = stmt.run(name, description, due_date, status, project_id);
        return info.changes > 0;
    } catch (error) {
        console.error('Database error in updateProject:', error);
        throw error;
    }
}

function updateProjectDetail(project_detail_id, key, value, is_completed) {
    try {
        const stmt = db.prepare(`
            UPDATE project_details
            SET key = ?, value = ?, is_completed = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        const info = stmt.run(key, value, is_completed, project_detail_id);
        return info.changes > 0;
    } catch (error) {
        console.error('Database error in updateProjectDetail:', error);
        throw error;
    }
}

function deleteProject(project_id) {
    try {
        const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
        const info = stmt.run(project_id);
        return info.changes > 0;
    } catch (error) {
        console.error('Database error in deleteProject:', error);
        throw error;
    }
}

function getAllProjects() {
    try {
        return db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    } catch (error) {
        console.error('Database error in getAllProjects:', error);
        throw error;
    }
}

function deleteProjectDetail(project_detail_id) {
    try {
        const stmt = db.prepare('DELETE FROM project_details WHERE id = ?');
        const info = stmt.run(project_detail_id);
        return info.changes > 0;
    } catch (error) {
        console.error('Database error in deleteProjectDetail:', error);
        throw error;
    }
}

function closeDatabase() {
    if (db) {
        db.close();
    }
}

module.exports = {
    createProject,
    updateProject,
    addProjectDetail,
    getProjectWithDetails,
    updateProjectDetail,
    deleteProject,
    getAllProjects,
    deleteProjectDetail,
    closeDatabase
};
