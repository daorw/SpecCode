import { NextResponse } from 'next/server';
import { getAllProjects, createProject, deleteProject } from '@/lib/db/projects-dao';

export async function GET() {
  const projects = getAllProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, path, description } = body;

  if (!name || !path) {
    return NextResponse.json({ error: 'name and path are required' }, { status: 400 });
  }

  try {
    const project = createProject({ name, path, description });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 409 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  deleteProject(id);
  return NextResponse.json({ ok: true });
}
