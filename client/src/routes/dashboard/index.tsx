import { useState } from "react"
import { createFileRoute } from '@tanstack/react-router'
import { StatCard } from "@/components/dashboard/stat-card"
import { TaskList } from "@/components/tasks/task-list"
import { CheckCircle2, Clock, ListTodo, TrendingUp } from "lucide-react"
import { useGetTasks } from '@/hooks/useTasks'
import { Status } from '@/types/task'
import { AllTasksDialog } from "@/components/tasks/all-tasks-dialog"

// Note: Trailing slash is important for index route of a layout
export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: tasks, isLoading, isError } = useGetTasks()
  const [isAllTasksOpen, setIsAllTasksOpen] = useState(false)

  // Calculate real stats
  const totalTasks = tasks?.length || 0
  const inProgressTasks = tasks?.filter(t => t.status === Status.IN_PROGRESS).length || 0
  const completedTasks = tasks?.filter(t => t.status === Status.COMPLETED).length || 0

  // Calculate completion rate (productivity)
  const completionRate = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks.toString(),
      icon: ListTodo,
      description: "Total tasks in all projects",
      trend: "neutral" as const,
      trendValue: ""
    },
    {
      title: "In Progress",
      value: inProgressTasks.toString(),
      icon: Clock,
      description: "Currently active tasks",
      trend: "neutral" as const,
      trendValue: ""
    },
    {
      title: "Completed",
      value: completedTasks.toString(),
      icon: CheckCircle2,
      description: "All completed tasks",
      trend: "up" as const,
      trendValue: ""
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      description: "Overall completion rate",
      trend: completionRate > 50 ? "up" as const : "neutral" as const,
      trendValue: ""
    }
  ]

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center min-h-[50vh] text-red-500">
        Error loading dashboard data. Please try again.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700 ease-in-out">
      <div className="mb-6 md:mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-md">
          <span>Last updated: just now</span>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
            className={`delay-[${index * 100}ms] animate-in fade-in zoom-in-95 duration-500 fill-mode-backwards`}
          />
        ))}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-semibold tracking-tight">Recent Tasks</h3>
          <button
            onClick={() => setIsAllTasksOpen(true)}
            className="text-sm font-medium hover:underline cursor-pointer bg-blue-100/50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-md transition-colors"
          >
            View All
          </button>
        </div>
        <TaskList tasks={tasks?.slice(0, 4) || []} />
      </div>

      <AllTasksDialog
        open={isAllTasksOpen}
        onOpenChange={setIsAllTasksOpen}
      />
    </div>
  )
}
