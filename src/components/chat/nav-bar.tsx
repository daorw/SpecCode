'use client';

import { useState, useEffect, useCallback } from 'react';
import { SettingsDialog, ProvidersModelsTab, ProxyTab, ApiKeysTab } from '@mariozechner/pi-web-ui';
import type { Project } from '@/lib/db/schema';

interface NavBarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onAddProject: (name: string, path: string, description: string) => Promise<void>;
  onDeleteProject: (id: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(/[\s\-_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('');
}

export function NavBar({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onDeleteProject,
}: NavBarProps) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPath, setNewPath] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const openSettings = useCallback(() => {
    SettingsDialog.open([
      new ProvidersModelsTab(),
      new ApiKeysTab(),
      new ProxyTab(),
    ]);
  }, []);

  const handleAdd = async () => {
    if (!newName.trim() || !newPath.trim()) return;
    await onAddProject(newName.trim(), newPath.trim(), newDesc.trim());
    setNewName('');
    setNewPath('');
    setNewDesc('');
    setAdding(false);
  };

  const handleDelete = (id: string) => {
    onDeleteProject(id);
    setConfirmDelete(null);
  };

  return (
    <div className="w-12 bg-gray-100 border-l border-gray-200 flex flex-col h-full shrink-0">
      <div className="flex-1 overflow-y-auto py-2 space-y-1 px-1">
        {projects.map((p) => (
          <div key={p.id} className="relative group">
            <button
              onClick={() => onSelectProject(p.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setConfirmDelete(confirmDelete === p.id ? null : p.id);
              }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-colors
                ${p.id === activeProjectId
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              title={`${p.name}\n${p.path}${p.description ? `\n${p.description}` : ''}`}
            >
              {getInitials(p.name)}
            </button>

            {confirmDelete === p.id && (
              <div className="absolute left-12 top-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-2 whitespace-nowrap">
                <p className="text-xs text-gray-600 mb-2">Remove &quot;{p.name}&quot; from speccode?</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-gray-200 space-y-1 relative">
        {adding ? (
          <div className="absolute left-[-236px] bottom-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 space-y-2 w-56">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Name"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              autoFocus
            />
            <input
              type="text"
              value={newPath}
              onChange={e => setNewPath(e.target.value)}
              placeholder="/path/to/project"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded font-mono"
            />
            <input
              type="text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            />
            <div className="flex gap-1">
              <button
                onClick={handleAdd}
                disabled={!newName.trim() || !newPath.trim()}
                className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setAdding(false)}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white border border-dashed border-gray-300 text-lg transition-colors"
            title="Add project"
          >
            +
          </button>
        )}
      </div>

      <div className="p-2 border-t border-gray-200">
        <button
          onClick={openSettings}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white border border-gray-300 transition-colors"
          title="LLM Provider Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
