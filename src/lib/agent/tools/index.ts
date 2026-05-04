import { type AgentTool } from '@mariozechner/pi-agent-core';
import { Type } from 'typebox';

async function callTool(tool: string, params: unknown) {
  const res = await fetch('/api/agent/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool, params }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Tool execution failed: ${res.status}`);
  }
  return res.json();
}

export const readRequirementsTool: AgentTool = {
  name: 'read_requirements',
  label: 'Read Requirements',
  description: 'Read the current state of the requirements document from the database',
  parameters: Type.Object({}),
  execute: async (_toolCallId, _params, _signal) => {
    return callTool('read_requirements', {});
  },
};

const updateReqParams = Type.Object({
  section: Type.String({ description: 'Section title for this requirement (e.g., "User Authentication")' }),
  content: Type.String({ description: 'The requirement description and details in Markdown' }),
  status: Type.String({ description: 'Status: draft, confirmed, or done' }),
  id: Type.Optional(Type.String({ description: 'Unique ID for this requirement' })),
});

export const updateRequirementsTool: AgentTool<typeof updateReqParams> = {
  name: 'update_requirements',
  label: 'Update Requirements',
  description: 'Write or update a requirement section in the database. Use this after every confirmation from the user.',
  parameters: updateReqParams,
  execute: async (_toolCallId, params, _signal) => {
    return callTool('update_requirements', params);
  },
};

const generateCodeParams = Type.Object({
  targetDir: Type.String({ description: 'The directory where the generated project code should be placed' }),
  projectName: Type.String({ description: 'Name of the project' }),
  projectDescription: Type.Optional(Type.String({ description: 'Brief project description' })),
});

export const generateCodeTool: AgentTool<typeof generateCodeParams> = {
  name: 'generate_code',
  label: 'Generate Code',
  description: 'Trigger code generation for all confirmed requirements.',
  parameters: generateCodeParams,
  execute: async (_toolCallId, params, _signal) => {
    return callTool('generate_code', params);
  },
};

const versionControlParams = Type.Object({
  action: Type.String({ description: 'Action: create_branch, diff, merge, tag, get_version' }),
  repoPath: Type.String({ description: 'Path to the git repository' }),
  version: Type.Optional(Type.String({ description: 'Version number (e.g., 1.0.1)' })),
  oldVersion: Type.Optional(Type.String({ description: 'Old version for diff comparison' })),
});

export const versionControlTool: AgentTool<typeof versionControlParams> = {
  name: 'version_control',
  label: 'Version Control',
  description: 'Manage Git operations for version iteration: create branch, diff, merge, tag',
  parameters: versionControlParams,
  execute: async (_toolCallId, params, _signal) => {
    return callTool('version_control', params);
  },
};

export const allTools: AgentTool[] = [
  readRequirementsTool,
  updateRequirementsTool,
  generateCodeTool,
  versionControlTool,
];
