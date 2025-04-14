'use server';

import { db } from '@/db/client';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function createTask(formData: FormData) {
  const title = formData.get('title')?.toString() ?? '';
  const description = formData.get('description')?.toString() ?? '';
  const dueDate = formData.get('dueDate')?.toString() ?? '';

  if (!title || !dueDate || !description) {
    throw new Error('All fields are required');
  }

  await db
    .insert(tasks)
    .values({ title, description, dueDate });
  redirect('/');
}

export async function updateTask(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const title = formData.get('title')?.toString() || '';
  const description = formData.get('description')?.toString() || '';
  const dueDate = formData.get('dueDate')?.toString() || '';
  const isCompleted = formData.get('isCompleted') === 'on';

  await db
    .update(tasks)
    .set({ title, description, dueDate, isCompleted })
    .where(eq(tasks.id, id));

  redirect(`/${id}`);
}

export async function deleteTask(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  await db.delete(tasks).where(eq(tasks.id, id));
  redirect('/');
}
