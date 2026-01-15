import React, { useState } from 'react';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <main className="flex-1 relative z-10 overflow-hidden">
        {selectedProjectId ? (
          <ProjectDetails
            projectId={selectedProjectId}
            onBack={() => setSelectedProjectId(null)}
          />
        ) : (
          <ProjectList
            onSelectProject={(id) => setSelectedProjectId(id)}
          />
        )}
      </main>

      <footer className="h-8 border-t border-border bg-card/50 backdrop-blur-sm px-4 flex items-center justify-between text-[10px] text-muted-foreground z-20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
            Mvntech Connected
          </span>
        </div>
        <div>
          Project Manager v1.0.0
        </div>
      </footer>
    </div>
  );
}

export default App;
