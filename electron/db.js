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
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            due_date TEXT
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS project_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER,
            key TEXT,
            value TEXT,
            status TEXT,
            priority TEXT,
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

function createProject(name, description, due_date) {
    const stmt = db.prepare('INSERT INTO projects (name, description, due_date) VALUES (?, ?, ?)');
    const info = stmt.run(name, description, due_date);
    return info.lastInsertRowid;
}

function addProjectDetail(project_id, key, value, status, priority) {
    const stmt = db.prepare(`
        INSERT INTO project_details (project_id, key, value, status, priority)
        VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(project_id, key, value, status, priority);
    return info.lastInsertRowid;
}

function getProjectWithDetails(project_id) {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(project_id);
    if (!project) return null;

    const details = db.prepare('SELECT * FROM project_details WHERE project_id = ?').all(project_id);
    return {
        ...project,
        details
    };
}

function updateProjectDetail(project_detail_id, key, value, status, priority) {
    const stmt = db.prepare(`
        UPDATE project_details
        SET key = ?, value = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `);
    const info = stmt.run(key, value, status, priority, project_detail_id);
    return info.changes > 0;
}

function deleteProject(project_id) {
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    const info = stmt.run(project_id);
    return info.changes > 0;
}

module.exports = {
    createProject,
    addProjectDetail,
    getProjectWithDetails,
    updateProjectDetail,
    deleteProject
};
