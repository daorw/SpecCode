'use client';

import { useState, useEffect, useCallback } from 'react';
import { createAgent } from '@/lib/agent/create-agent';
import { ChatPanelWrapper } from '@/components/chat/chat-panel';
import { DocEditor } from '@/components/doc/doc-editor';
import { VersionBar } from '@/components/doc/version-bar';
import type { Agent } from '@mariozechner/pi-agent-core';
import type { Requirement, VersionRecord } from '@/lib/db/schema';

export default function Home() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [version, setVersion] = useState('1.0.0');
  const [versions, setVersions] = useState<VersionRecord[]>([]);
  const [docContent, setDocContent] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      const a = createAgent();
      setAgent(a);

      try {
        const res = await fetch('/api/doc');
        const data = await res.json();
        setRequirements(data.requirements || []);
      } catch {
        // No requirements yet
      }

      try {
        const vRes = await fetch('/api/version');
        const vData = await vRes.json();
        setVersions(vData.versions || []);
        if (vData.versions?.length > 0) {
          setVersion(vData.versions[0].version);
        }
      } catch {
        // No versions yet
      }

      try {
        const mRes = await fetch('/api/doc?format=markdown');
        const md = await mRes.text();
        setDocContent(md);
      } catch {
        // No doc yet
      }

      setLoaded(true);
    };

    init();
  }, []);

  const handleSave = useCallback(async (id: string, section: string, status: string, content: string) => {
    const res = await fetch('/api/doc', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, section, status, content }),
    });
    const data = await res.json();

    setRequirements(prev => {
      const idx = prev.findIndex(r => r.id === id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = data.requirement;
        return next;
      }
      return [...prev, data.requirement];
    });

    const mRes = await fetch('/api/doc?format=markdown');
    const md = await mRes.text();
    setDocContent(md);
  }, []);

  if (!loaded || !agent) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">speccode</h1>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 min-w-0 border-r border-gray-200 flex flex-col">
          <DocEditor
            requirements={requirements}
            onSave={handleSave}
          />
          <VersionBar
            version={version}
            versions={versions}
            onVersionSelect={setVersion}
          />
        </div>

        <div className="w-1/2 min-w-0 flex flex-col">
          <div className="flex-1">
            <ChatPanelWrapper agent={agent} />
          </div>
        </div>
      </div>
    </div>
  );
}
