import { NextResponse } from 'next/server';
import { getAllVersions, createVersionRecord } from '@/lib/db/versions-dao';

export async function GET() {
  const versions = getAllVersions();
  return NextResponse.json({ versions });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { version, gitTag, gitCommit, docPath } = body;

  if (!version || !gitTag || !gitCommit || !docPath) {
    return NextResponse.json({ error: 'version, gitTag, gitCommit, docPath required' }, { status: 400 });
  }

  const record = createVersionRecord({ version, git_tag: gitTag, git_commit: gitCommit, doc_path: docPath });
  return NextResponse.json({ version: record });
}
