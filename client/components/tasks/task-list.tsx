import { memo } from "react"
import { TaskCard } from "./task-card"
import { type Task } from "@/types/task"

interface TaskListProps {
    tasks: Task[]
    view?: "grid" | "list"
}

export const TaskList = memo(function TaskList({ tasks, view = "grid" }: TaskListProps) {
    if (view === "list") {
        return (
            <div className="space-y-3">
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-center p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <div>{task.title}</div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    )
})
