import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { tool, params } = body;

  if (!tool) {
    return NextResponse.json({ error: 'tool name is required' }, { status: 400 });
  }

  try {
    switch (tool) {
      case 'read_requirements': {
        const { getAllRequirements, getRequirementsMarkdown } = await import('@/lib/db/requirements-dao');
        const requirements = getAllRequirements();
        const markdown = getRequirementsMarkdown();
        return NextResponse.json({
          content: [{ type: 'text', text: markdown || '(No requirements defined)' }],
          details: {
            count: requirements.length,
            draftCount: requirements.filter(r => r.status === 'draft').length,
            confirmedCount: requirements.filter(r => r.status === 'confirmed').length,
            doneCount: requirements.filter(r => r.status === 'done').length,
          },
        });
      }

      case 'update_requirements': {
        const { upsertRequirement } = await import('@/lib/db/requirements-dao');
        if (!params?.section || !params?.content || !params?.status) {
          return NextResponse.json({ error: 'section, content, status required' }, { status: 400 });
        }
        const id = params.id || params.section.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const req = upsertRequirement({
          id,
          section: params.section,
          status: params.status,
          content: params.content,
        });
        return NextResponse.json({
          content: [{ type: 'text', text: `Updated: ${params.section} [${req.status}]` }],
          details: { id: req.id, status: req.status },
        });
      }

      case 'version_control': {
        const { createVersionBranch, getDiff, mergeToMain, createTag, getTags, readRequirementsVersion } = await import('@/lib/git/git-ops');
        const { getRequirementsMarkdown } = await import('@/lib/db/requirements-dao');
        const fs = await import('fs/promises');
        const path = await import('path');

        const repoPath = params?.repoPath || process.cwd();
        const action = params?.action;

        switch (action) {
          case 'create_branch': {
            const version = params?.version || '1.0.0';
            const branchName = await createVersionBranch(repoPath, version);
            return NextResponse.json({
              content: [{ type: 'text', text: `Created branch: ${branchName}` }],
              details: { branchName, version },
            });
          }
          case 'diff': {
            const markdown = getRequirementsMarkdown();
            const currentVersion = readRequirementsVersion(markdown);
            const diff = await getDiff(repoPath, 'REQUIREMENTS.md', params?.oldVersion || currentVersion, params?.version || currentVersion);
            return NextResponse.json({
              content: [{ type: 'text', text: diff || '(No changes detected)' }],
              details: { hasDiff: diff.length > 0 },
            });
          }
          case 'merge': {
            const version = params?.version || '1.0.0';
            await mergeToMain(repoPath, `version/${version}`, `Merge version ${version}`);
            return NextResponse.json({
              content: [{ type: 'text', text: `Merged version/${version} to main` }],
              details: { version },
            });
          }
          case 'tag': {
            const version = params?.version || '1.0.0';
            const tagName = await createTag(repoPath, version, `Release v${version}`);
            return NextResponse.json({
              content: [{ type: 'text', text: `Created tag: ${tagName}` }],
              details: { tagName, version },
            });
          }
          default:
            return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
        }
      }

      default:
        return NextResponse.json({ error: `Unknown tool: ${tool}` }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
