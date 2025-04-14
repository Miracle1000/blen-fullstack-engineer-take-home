'use client';

import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type Props = {
  id: number;
};

export default function DeleteButton({ id }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/tasks/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete task');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      router.push('/');
      router.refresh();
    },
  });

  return (
    <Button
      onClick={() => mutation.mutate()}
      className="bg-red-600 text-white"
      disabled={mutation.isPending}>
      {mutation.isPending ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
