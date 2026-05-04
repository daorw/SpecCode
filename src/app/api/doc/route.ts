import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/connection';
import { getAllRequirements, upsertRequirement, getRequirementsMarkdown } from '@/lib/db/requirements-dao';
import { createVersionRecord, getLatestVersion, getAllVersions } from '@/lib/db/versions-dao';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';
  const status = searchParams.get('status');

  if (format === 'markdown') {
    const markdown = getRequirementsMarkdown();
    const latest = getLatestVersion();
    const header = `# speccode 需求文档 V${latest?.version || '1.0.0'}\n\n`;
    return new NextResponse(header + markdown, {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }

  let requirements;
  if (status) {
    const { getRequirementsByStatus } = await import('@/lib/db/requirements-dao');
    requirements = getRequirementsByStatus(status);
  } else {
    requirements = getAllRequirements();
  }

  return NextResponse.json({ requirements });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, section, status, content } = body;

  if (!section || !status || !content) {
    return NextResponse.json({ error: 'section, status, and content are required' }, { status: 400 });
  }

  const req = upsertRequirement({
    id: id || section.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    section,
    status,
    content,
  });

  return NextResponse.json({ requirement: req });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, version, gitTag, gitCommit, docPath } = body;

  switch (action) {
    case 'create_version': {
      if (!version || !gitTag || !gitCommit || !docPath) {
        return NextResponse.json({ error: 'version, gitTag, gitCommit, docPath required' }, { status: 400 });
      }
      const record = createVersionRecord({ version, git_tag: gitTag, git_commit: gitCommit, doc_path: docPath });
      return NextResponse.json({ version: record });
    }

    case 'get_latest': {
      const latest = getLatestVersion();
      return NextResponse.json({ version: latest || null });
    }

    case 'get_all': {
      const versions = getAllVersions();
      return NextResponse.json({ versions });
    }

    default:
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }
}
