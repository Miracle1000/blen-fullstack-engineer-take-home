'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/datepicker';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
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
import { format } from 'date-fns';
import Link from 'next/link';

export default function AddTaskForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: undefined,
      priority: '0',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      const res = await fetch('/api/tasks/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error('Failed to create task');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      router.push('/');
      router.refresh();
    },
  });

  const onSubmit = (values: TaskFormData) => {
    const formattedValues = {
      ...values,
      dueDate: format(values.dueDate, 'yyyy-MM-dd'), // 💾 Format before saving
    };

    mutation.mutate(formattedValues);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold">Add New Task</h1>
        <Button>
          <Link href="/">Back Home</Link>
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-xl space-y-6 p-6">
          <FormField
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

          <FormField
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

          <FormField
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

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            )}
          />

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'Create Task'}
          </Button>

          {mutation.isError && (
            <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
          )}
        </form>
      </Form>
    </div>
  );
}
