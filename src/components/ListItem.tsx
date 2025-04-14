import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PRIORITY_LABELS } from '@/constants/label';
import { TaskFormData } from '@/Types/Schema';

export function ListItem({ title, description, dueDate, priority, isCompleted }: TaskFormData) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">DueDate</p>
              <p className="text-sm text-muted-foreground">{dueDate.toString()}</p>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1">
              Priority:
              <Badge variant="destructive">{PRIORITY_LABELS[priority]}</Badge>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Completed {isCompleted ? '✅' : '❌'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
