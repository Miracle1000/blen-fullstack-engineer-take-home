import DeleteButton from '@/components/DeleteButton';
import { ListItem } from '@/components/ListItem';
import { Button } from '@/components/ui/button';
import { db } from '@/db/client';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const taskId = parseInt(params.id);
  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));

  if (!task) return <div className="p-6 text-red-600">Task not found</div>;

  return (
    <div className="mx-auto max-w-xl p-6">
      <ListItem
        title={task.title}
        description={task.description}
        dueDate={task.dueDate}
        priority={task.priority.toString() as '0' | '1' | '2'}
        isCompleted={task.isCompleted}
      />
      <div className="mt-4 flex gap-4">
        <Button asChild className="bg-yellow-500 text-white">
          <Link href={`/${task.id}/edit`}>Edit</Link>
        </Button>

        <DeleteButton id={task.id} />

        <Button asChild>
          <Link href="/">Cancel</Link>
        </Button>
      </div>
    </div>
  );
}
