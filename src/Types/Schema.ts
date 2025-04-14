import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  dueDate: z.date({ required_error: 'Due date is required' }),
  priority: z.enum(['0', '1', '2']),
  isCompleted: z.boolean().default(false),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
