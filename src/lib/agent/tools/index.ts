import { type AgentTool } from '@mariozechner/pi-agent-core';
import { Type } from 'typebox';
import { getAllRequirements, getRequirementsMarkdown } from '@/lib/db/requirements-dao';

export const readRequirementsTool: AgentTool = {
  name: 'read_requirements',
  label: 'Read Requirements',
  description: 'Read the current state of the requirements document from the database',
  parameters: Type.Object({}),
  execute: async (_toolCallId, _params, _signal) => {
    const markdown = getRequirementsMarkdown();
    const requirements = getAllRequirements();

    return {
      content: [{
        type: 'text' as const,
        text: markdown || '(No requirements defined yet)',
      }],
      details: {
        count: requirements.length,
        draftCount: requirements.filter(r => r.status === 'draft').length,
        confirmedCount: requirements.filter(r => r.status === 'confirmed').length,
        doneCount: requirements.filter(r => r.status === 'done').length,
      },
    };
  },
};

const updateReqParams = Type.Object({
  section: Type.String({ description: 'Section title for this requirement (e.g., "User Authentication")' }),
  content: Type.String({ description: 'The requirement description and details in Markdown' }),
  status: Type.String({ description: 'Status: draft, confirmed, or done' }),
  id: Type.Optional(Type.String({ description: 'Unique ID for this requirement' })),
});
type UpdateReqParams = { section: string; content: string; status: string; id?: string };

export const updateRequirementsTool: AgentTool<typeof updateReqParams, { id: string; status: string }> = {
  name: 'update_requirements',
  label: 'Update Requirements',
  description: 'Write or update a requirement section in the database. Use this after every confirmation from the user.',
  parameters: updateReqParams,
  execute: async (_toolCallId, params, _signal) => {
    const { upsertRequirement } = await import('@/lib/db/requirements-dao');

    const id = params.id || params.section.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const req = upsertRequirement({
      id,
      section: params.section,
      status: params.status as 'draft' | 'confirmed' | 'done',
      content: params.content,
    });

    return {
      content: [{
        type: 'text' as const,
        text: `Requirement "${params.section}" [${req.status}] updated successfully.`,
      }],
      details: { id: req.id, status: req.status },
    };
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
    const { getRequirementsMarkdown } = await import('@/lib/db/requirements-dao');

    const markdown = getRequirementsMarkdown();
    if (!markdown) {
      return {
        content: [{
          type: 'text' as const,
          text: 'No confirmed requirements found. Please complete the Grill-me process first.',
        }],
        details: { error: 'no_requirements' },
      };
    }

    return {
      content: [{
        type: 'text' as const,
        text: [
          `## Code Generation Request`,
          ``,
          `**Project**: ${params.projectName}`,
          `**Target Directory**: ${params.targetDir}`,
          `**Requirements Document**:`,
          ``,
          markdown,
          ``,
          `---`,
          ``,
          `Based on the requirements above, please generate the complete project code in **${params.targetDir}**.`,
          ``,
          `Instructions:`,
          `1. Create the project structure under ${params.targetDir}`,
          `2. Implement ALL confirmed requirements`,
          `3. Set up the tech stack as specified in the requirements`,
          `4. Include proper error handling and project structure`,
          `5. Do NOT include deployment scripts or CI/CD unless specified`,
        ].join('\n'),
      }],
      details: {
        projectName: params.projectName,
        targetDir: params.targetDir,
        requirementCount: markdown.split('\n').filter(l => l.includes('[confirmed]')).length,
      },
    };
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
    const { createVersionBranch, getDiff, mergeToMain, createTag, getTags, readRequirementsVersion } = await import('@/lib/git/git-ops');
    const { getRequirementsMarkdown } = await import('@/lib/db/requirements-dao');
    const fs = await import('fs/promises');
    const path = await import('path');

    const docPath = path.join(params.repoPath, 'REQUIREMENTS.md');

    switch (params.action) {
      case 'create_branch': {
        const version = params.version || '1.0.0';
        const branchName = await createVersionBranch(params.repoPath, version);
        return {
          content: [{ type: 'text' as const, text: `Created branch: ${branchName}` }],
          details: { branchName, version },
        };
      }

      case 'diff': {
        const markdown = getRequirementsMarkdown();
        const currentVersion = readRequirementsVersion(markdown);
        const diff = await getDiff(params.repoPath, 'REQUIREMENTS.md', params.oldVersion || currentVersion, params.version || currentVersion);
        return {
          content: [{ type: 'text' as const, text: diff || '(No changes detected)' }],
          details: { hasDiff: diff.length > 0 },
        };
      }

      case 'merge': {
        const version = params.version || '1.0.0';
        const branchName = `version/${version}`;
        await mergeToMain(params.repoPath, branchName, `Merge version ${version}`);
        return {
          content: [{ type: 'text' as const, text: `Merged branch ${branchName} to main` }],
          details: { branchName, version },
        };
      }

      case 'tag': {
        const version = params.version || '1.0.0';
        const tagName = await createTag(params.repoPath, version, `Release v${version}`);
        return {
          content: [{ type: 'text' as const, text: `Created tag: ${tagName}` }],
          details: { tagName, version },
        };
      }

      case 'get_version': {
        let version = '0.0.0';
        try {
          const content = await fs.readFile(docPath, 'utf-8');
          version = readRequirementsVersion(content);
        } catch {
          // doc doesn't exist yet
        }
        const tags = await getTags(params.repoPath);
        return {
          content: [{ type: 'text' as const, text: `Current version: ${version}\nTags: ${tags.join(', ') || '(none)'}` }],
          details: { version, tags },
        };
      }

      default:
        return {
          content: [{ type: 'text' as const, text: `Unknown action: ${params.action}` }],
          details: { error: 'unknown_action' },
        };
    }
  },
};

export const allTools: AgentTool[] = [
  readRequirementsTool,
  updateRequirementsTool,
  generateCodeTool,
  versionControlTool,
];
