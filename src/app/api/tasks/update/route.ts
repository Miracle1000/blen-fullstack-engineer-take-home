import { db } from '@/db/client';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const { id, title, description, dueDate, isCompleted, priority } = await req.json();
  const result = await db
    .update(tasks)
    .set({ title, description, dueDate, isCompleted, priority })
    .where(eq(tasks.id, id));
  revalidatePath('/');
  return Response.json(result);
}
