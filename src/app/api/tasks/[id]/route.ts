import { db } from '@/db/client';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const result = await db.select().from(tasks).where(eq(tasks.id, id));
  if (!result[0]) return new Response('Not found', { status: 404 });

  return Response.json(result[0]);
}
