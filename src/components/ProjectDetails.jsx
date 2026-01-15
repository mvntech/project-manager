import React, { useState, useEffect } from 'react';

const ProjectDetails = ({ projectId, onBack }) => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddProperty, setShowAddProperty] = useState(false);
    const [editingPropertyId, setEditingPropertyId] = useState(null);
    const [newProperty, setNewProperty] = useState({ key: '', value: '', is_completed: 0 });

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const data = await window.api.getProjectWithDetails(projectId);
            setProject(data);
        } catch (error) {
            console.error('Failed to fetch project details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) fetchProjectDetails();
    }, [projectId]);

    const handleAddOrUpdateProperty = async (e) => {
        e.preventDefault();
        try {
            if (editingPropertyId) {
                await window.api.updateProjectDetail(
                    editingPropertyId,
                    newProperty.key,
                    newProperty.value,
                    newProperty.is_completed
                );
            } else {
                await window.api.addProjectDetail(
                    projectId,
                    newProperty.key,
                    newProperty.value,
                    newProperty.is_completed || 0
                );
            }
            setNewProperty({ key: '', value: '', is_completed: 0 });
            setShowAddProperty(false);
            setEditingPropertyId(null);
            await fetchProjectDetails();
        } catch (error) {
            console.error('Failed to save property:', error);
        }
    };

    const handleEditProperty = (prop) => {
        setNewProperty({
            key: prop.key,
            value: prop.value,
            is_completed: prop.is_completed
        });
        setEditingPropertyId(prop.id);
        setShowAddProperty(true);
    };

    const handleDeleteProperty = async (propId) => {
        if (window.confirm('Delete this property?')) {
            try {
                await window.api.deleteProjectDetail(propId);
                await fetchProjectDetails();
            } catch (error) {
                console.error('Failed to delete property:', error);
            }
        }
    };

    const togglePropertyCompletion = async (prop) => {
        try {
            await window.api.updateProjectDetail(
                prop.id,
                prop.key,
                prop.value,
                prop.is_completed ? 0 : 1
            );
            await fetchProjectDetails();
        } catch (error) {
            console.error('Failed to toggle completion:', error);
        }
    };

    if (loading) return (
        <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    if (!project) return <div>Project not found.</div>;

    return (
        <div className="flex flex-col h-full bg-background p-6 overflow-hidden text-foreground">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-accent rounded-full border border-border transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
                    </div>
                    <p className="text-muted-foreground text-sm">{project.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <p className="text-lg font-semibold capitalize">{project.status}</p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Due Date</p>
                    <p className="text-lg font-semibold">{project.due_date ? new Date(project.due_date).toLocaleDateString() : 'None'}</p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Created At</p>
                    <p className="text-lg font-semibold">{new Date(project.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted">
                    <h2 className="text-lg font-bold">Project Properties</h2>
                    <button
                        onClick={() => {
                            setNewProperty({ key: '', value: '', is_completed: 0 });
                            setEditingPropertyId(null);
                            setShowAddProperty(true);
                        }}
                        className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-1.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                        Add Property
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {project.details?.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground italic">
                            No properties added yet. Click "Add Property" to begin.
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {project.details.map((prop) => (
                                <div key={prop.id} className="flex items-center justify-between p-4 group">
                                    <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-1 flex justify-start">
                                            <button
                                                onClick={() => togglePropertyCompletion(prop)}
                                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${prop.is_completed === 1
                                                    ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.3)]'
                                                    : 'bg-transparent border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                {prop.is_completed === 1 && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                                )}
                                            </button>
                                        </div>
                                        <div className="col-span-4">
                                            <p className={`font-semibold text-sm ${prop.is_completed ? 'line-through text-muted-foreground' : ''}`}>{prop.key}</p>
                                        </div>
                                        <div className="col-span-7">
                                            <p className={`text-sm ${prop.is_completed ? 'line-through text-muted-foreground' : ''}`}>{prop.value}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pl-4">
                                        <button
                                            onClick={() => handleEditProperty(prop)}
                                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                                            title="Edit Property">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProperty(prop.id)}
                                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                            title="Delete Property">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showAddProperty && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border w-full max-w-md rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4">{editingPropertyId ? 'Edit Property' : 'Add New Property'}</h2>
                        <form onSubmit={handleAddOrUpdateProperty} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium mb-1.5">Key</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProperty.key}
                                        onChange={(e) => setNewProperty({ ...newProperty, key: e.target.value })}
                                        className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
                                        placeholder="e.g. Name"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium mb-1.5">Value</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProperty.value}
                                        onChange={(e) => setNewProperty({ ...newProperty, value: e.target.value })}
                                        className="w-full border border-border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
                                        placeholder="e.g. My Project"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddProperty(false)}
                                    className="flex-1 px-4 py-2 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all"
                                >
                                    {editingPropertyId ? 'Save Changes' : 'Add Property'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
