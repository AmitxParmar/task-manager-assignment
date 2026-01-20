
import { createFileRoute } from '@tanstack/react-router'
import { TaskList } from '@/components/tasks/task-list'
import { useGetTasks } from '@/hooks/useTasks'
import { Loader2, ListTodo, ArrowUpDown, X } from 'lucide-react'
import { useState } from 'react'
import { Status, Priority } from "@/types/task"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute('/dashboard/tasks/')({
  component: MyTasksPage,
})

function MyTasksPage() {
  const [status, setStatus] = useState<Status | undefined>()
  const [priority, setPriority] = useState<Priority | undefined>()
  const [sortByDueDate, setSortByDueDate] = useState<'asc' | 'desc' | undefined>()

  const { data: tasks, isLoading, isError } = useGetTasks({
    assignedToMe: 'true',
    status,
    priority,
    sortByDueDate
  })

  const handleClearFilters = () => {
    setStatus(undefined)
    setPriority(undefined)
    setSortByDueDate(undefined)
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center text-destructive">
        Error loading tasks. Please try again.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Tasks</h2>
          <p className="text-muted-foreground">
            Here's a list of tasks assigned to you across all projects.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={status || "ALL"}
              onValueChange={(val) => setStatus(val === "ALL" ? undefined : val as Status)}
            >
              <SelectTrigger className="flex-1 sm:w-[140px] h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.values(Status).map((s) => (
                  <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={priority || "ALL"}
              onValueChange={(val) => setPriority(val === "ALL" ? undefined : val as Priority)}
            >
              <SelectTrigger className="flex-1 sm:w-[140px] h-9 text-sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                {Object.values(Priority).map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortByDueDate(curr => curr === 'asc' ? 'desc' : 'asc')}
              title="Sort by Due Date"
              className="flex-1 sm:flex-none h-9 px-3"
            >
              <ArrowUpDown className={`h-4 w-4 mr-2 ${sortByDueDate ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-sm">Sort</span>
            </Button>

            <Button
              variant={status || priority || sortByDueDate ? "secondary" : "ghost"}
              size="sm"
              onClick={handleClearFilters}
              className="flex-1 sm:flex-none h-9 text-sm"
              disabled={!status && !priority && !sortByDueDate}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {tasks?.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/40 p-8 text-center text-muted-foreground">
          <ListTodo className="mb-4 h-12 w-12 opacity-50" />
          <h3 className="mb-2 text-lg font-semibold">No tasks found</h3>
          <p className="text-sm">
            {(status || priority)
              ? "Try clearing your filters to see more tasks."
              : "You don't have any tasks assigned to you right now."}
          </p>
          {(status || priority) && (
            <Button
              variant="link"
              onClick={handleClearFilters}
              className="mt-2"
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <TaskList tasks={tasks || []} />
      )}
    </div>
  )
}
