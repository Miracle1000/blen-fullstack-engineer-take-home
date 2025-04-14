import { db } from '@/db/client';
import { tasks } from '@/db/schema';

export async function POST(req: Request) {
  const { title, description, dueDate, priority } = await req.json();
  const result = await db.insert(tasks).values({ title, description, dueDate, priority });
  return Response.json(result);
}
