'use client';

import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Requirement } from '@/lib/db/schema';

interface DocEditorProps {
  requirements: Requirement[];
  onSave: (id: string, section: string, status: string, content: string) => Promise<void>;
}

export function DocEditor({ requirements, onSave }: DocEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editSection, setEditSection] = useState('');
  const [editStatus, setEditStatus] = useState('draft');
  const [saving, setSaving] = useState(false);

  const startEdit = useCallback((req: Requirement) => {
    setEditingId(req.id);
    setEditSection(req.section);
    setEditContent(req.content);
    setEditStatus(req.status);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditContent('');
    setEditSection('');
    setEditStatus('draft');
  }, []);

  const handleSave = useCallback(async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await onSave(editingId, editSection, editStatus, editContent);
      setEditingId(null);
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  }, [editingId, editSection, editStatus, editContent, onSave]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'done': return 'text-blue-600 bg-blue-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'confirmed';
      case 'done': return 'done';
      default: return 'draft';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Requirements Document
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {requirements.filter(r => r.status === 'confirmed').length} confirmed / {requirements.filter(r => r.status === 'done').length} done / {requirements.length} total
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {requirements.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg">No requirements yet</p>
            <p className="text-sm mt-1">Start a Grill-me conversation to define requirements</p>
          </div>
        )}

        {requirements.map((req) => (
          <div key={req.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {editingId === req.id ? (
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  value={editSection}
                  onChange={e => setEditSection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Section title"
                />
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono min-h-[120px]"
                  placeholder="Requirement content (Markdown)"
                />
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="draft">draft</option>
                  <option value="confirmed">confirmed</option>
                  <option value="done">done</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => startEdit(req)}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{req.section}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(req.status)}`}>
                    {getStatusLabel(req.status)}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none text-gray-600">
                  <ReactMarkdown>{req.content || '(Empty)'}</ReactMarkdown>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
