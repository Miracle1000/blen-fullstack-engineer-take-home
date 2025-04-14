import AddTaskButton from '@/components/AddTaskButton';
import { ListItem } from '@/components/ListItem';
import { db } from '@/db/client';
import { tasks } from '@/db/schema';
import Link from 'next/link';

export default async function TaskListPage() {
  const allTasks = await db.select().from(tasks).orderBy(tasks.dueDate);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Task List</h1>
      <AddTaskButton />
      <ul className="mt-4 space-y-4">
        {allTasks.map((task) => (
          <li key={task.id}>
            <Link href={`/${task.id}`}>
              <ListItem
                title={task.title}
                description={task.description}
                dueDate={new Date(task.dueDate)}
                priority={task.priority.toString() as '0' | '1' | '2'}
                isCompleted={task.isCompleted}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
