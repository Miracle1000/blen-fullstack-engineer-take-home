// GET all tasks
import { db } from '@/db/client';
import { tasks } from '@/db/schema';

export async function GET() {
  const allTasks = await db.select().from(tasks);
  return Response.json(allTasks);
}
