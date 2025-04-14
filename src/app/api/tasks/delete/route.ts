import { db } from '@/db/client';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const { id } = await req.json();
  await db.delete(tasks).where(eq(tasks.id, id));
  return new Response(null, { status: 200 });
}
