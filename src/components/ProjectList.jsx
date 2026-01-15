import React, { useState, useEffect } from 'react';

const ProjectList = ({ onSelectProject }) => {
    const [projects, setProjects] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectForm, setProjectForm] = useState({
        name: '',
        description: '',
        due_date: '',
        status: 'Pending'
    });
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await window.api.getAllProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSaveProject = async (e) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await window.api.updateProject(
                    editingProject.id,
                    projectForm.name,
                    projectForm.description,
                    projectForm.due_date,
                    projectForm.status
                );
            } else {
                await window.api.createProject(
                    projectForm.name,
                    projectForm.description,
                    projectForm.due_date,
                    projectForm.status
                );
            }
            setProjectForm({ name: '', description: '', due_date: '', status: 'Pending' });
            setEditingProject(null);
            setShowAddModal(false);
            await fetchProjects();
        } catch (error) {
            console.error('Failed to save project:', error);
            alert('Error saving project. Check console for details.');
        }
    };

    const handleOpenAddModal = () => {
        setEditingProject(null);
        setProjectForm({ name: '', description: '', due_date: '', status: 'Pending' });
        setShowAddModal(true);
    };

    const handleOpenEditModal = (project, e) => {
        e.stopPropagation();
        setEditingProject(project);
        setProjectForm({
            name: project.name,
            description: project.description || '',
            due_date: project.due_date || '',
            status: project.status
        });
        setShowAddModal(true);
    };

    const handleDeleteProject = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await window.api.deleteProject(id);
                await fetchProjects();
            } catch (error) {
                console.error('Failed to delete project:', error);
            }
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div className="flex flex-col h-full bg-background p-6 overflow-hidden text-foreground">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-3xl font-bold tracking-tight">Hi, Muntaha!</h1>
                        <img src={"./icon.png"} className="w-8 h-8 object-contain" alt="logo" />
                    </div>
                    <p className="text-muted-foreground">Manage and track your project progress.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all shadow-sm flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    New Project
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
                        <p className="text-muted-foreground">No projects found. Create your first project to get started.</p>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => onSelectProject(project.id)}
                            className="group bg-card hover:bg-accent/50 border border-border p-5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mt-1">
                                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                            {project.name}
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{project.description}</p>

                                    <div className="flex items-center gap-4 mt-4">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            Due: {formatDate(project.due_date)}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            Status: {project.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSelectProject(project.id); }}
                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" /><circle cx="12" cy="12" r="3" /></svg>
                                    </button>
                                    <button
                                        onClick={(e) => handleOpenEditModal(project, e)}
                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Edit Project"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteProject(project.id, e)}
                                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                        title="Delete Project">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border w-full max-w-md rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4">{editingProject ? 'Edit Project' : 'Create New Project'}</h2>
                        <form onSubmit={handleSaveProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    value={projectForm.name}
                                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                    className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
                                    placeholder="e.g. My Project"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Description</label>
                                <textarea
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                    className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all min-h-[100px] text-foreground"
                                    placeholder="Describe the project goals..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Due Date</label>
                                <input
                                    type="date"
                                    value={projectForm.due_date}
                                    onChange={(e) => setProjectForm({ ...projectForm, due_date: e.target.value })}
                                    className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
                                />
                            </div>
                            <div className="flex justify-center gap-4">
                                <div className="w-full">
                                    <label className="block text-sm font-medium mb-1.5">Status</label>
                                    <select
                                        value={projectForm.status}
                                        onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                                        className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground bg-background"
                                    >
                                        <option>Pending</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                        <option>Blocked</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all"
                                >
                                    {editingProject ? 'Update Project' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div >
                </div >
            )}
        </div >
    );
};

export default ProjectList;
