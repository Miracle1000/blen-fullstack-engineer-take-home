'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AddTaskButton() {
  return (
    <Button asChild>
      <Link href="/add">+ Add Task</Link>
    </Button>
  );
}
