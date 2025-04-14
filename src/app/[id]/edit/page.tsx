'use client';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/datepicker';
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PRIORITY_LABELS } from '@/constants/label';
import { TaskFormData, taskFormSchema } from '@/Types/Schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: number;
  isCompleted: boolean;
};

export default function EditTaskPage() {
  const { id } = useParams() as { id: string };
  // const { setValue } = useForm<TaskFormData>();
  const taskId = parseInt(id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: task, isLoading } = useQuery<Task>({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const res = await fetch(`/api/tasks/${taskId}`);
      if (!res.ok) throw new Error('Failed to fetch task');
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: TaskFormData) => {
      await fetch('/api/tasks/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          dueDate: format(values.dueDate, 'yyyy-MM-dd'),
          id: taskId,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      router.push('/');
      router.refresh();
    },
  });

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      dueDate: task?.dueDate ? new Date(task?.dueDate) : new Date(),
      priority: (task?.priority.toString() as '0' | '1' | '2') ?? '0',
      isCompleted: task?.isCompleted ?? false,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description,
        dueDate: new Date(task.dueDate),
        priority: task.priority.toString() as '0' | '1' | '2',
        isCompleted: task.isCompleted,
      });
    }
  }, [task, form]);

  if (isLoading) return <div className="p-6">Loading task...</div>;
  if (!task) return <div className="p-6 text-red-600">Task not found</div>;

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-xl font-bold">Edit Task</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4">
          <Controller
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Finish project" {...field} />
                </FormControl>
                <FormDescription>This is the task title.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="What do you need to do?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <p>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </p>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="priority"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? '0'}
                      defaultValue="0">
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">{PRIORITY_LABELS[0]}</SelectItem>
                        <SelectItem value="1">{PRIORITY_LABELS[1]}</SelectItem>
                        <SelectItem value="2">{PRIORITY_LABELS[2]}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Set the urgency level.</FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Controller
            control={form.control}
            name="isCompleted"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  Completed
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending} className="bg-green-500 text-white">
            {mutation.isPending ? 'Updating...' : 'Update'}
          </Button>
          <Button className="ml-2" onClick={() => router.back()}>
            Cancel
          </Button>
        </form>
      </Form>
    </div>
  );
}
