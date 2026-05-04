'use client';

import type { VersionRecord } from '@/lib/db/schema';

interface VersionBarProps {
  version: string;
  versions: VersionRecord[];
  onVersionSelect?: (version: string) => void;
}

export function VersionBar({ version, versions, onVersionSelect }: VersionBarProps) {
  return (
    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Version:</span>
        <span className="font-mono font-medium text-gray-900">v{version}</span>
      </div>

      {versions.length > 0 && (
        <select
          onChange={(e) => onVersionSelect?.(e.target.value)}
          value={version}
          className="px-2 py-1 border border-gray-300 rounded text-xs font-mono bg-white"
        >
          {versions.map((v) => (
            <option key={v.id} value={v.version}>
              v{v.version} — {v.git_commit.substring(0, 7)} ({new Date(v.created_at).toLocaleDateString()})
            </option>
          ))}
        </select>
      )}

      {versions.length === 0 && (
        <span className="text-xs text-gray-400">No version history</span>
      )}
    </div>
  );
}
