import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Priority } from "@/types/task"
import { useUpdateTask } from "@/hooks/useTasks"
import { Loader2, AlertCircle } from "lucide-react"

interface ChangeTaskPriorityProps {
    taskId: string
    priority: Priority
}

export function ChangeTaskPriority({ taskId, priority }: ChangeTaskPriorityProps) {
    const { mutate: updateTask, isPending } = useUpdateTask()

    const handleValueChange = (value: string) => {
        updateTask({
            id: taskId,
            data: { priority: value as Priority }
        })
    }

    const priorityColors: Record<Priority, string> = {
        [Priority.LOW]: "text-blue-500",
        [Priority.MEDIUM]: "text-yellow-500",
        [Priority.HIGH]: "text-red-500",
        [Priority.URGENT]: "text-red-700 font-bold",
    }

    return (
        <Select
            value={priority}
            onValueChange={handleValueChange}
            disabled={isPending}
        >
            <SelectTrigger className={`w-[100px] h-8 text-xs font-medium border-0 bg-transparent focus:ring-0 px-2 ${priorityColors[priority]}`}>
                <div className="flex items-center gap-1.5">
                    {isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                        (priority === Priority.HIGH || priority === Priority.URGENT) && <AlertCircle className="h-3 w-3" />
                    )}
                    <SelectValue placeholder="Priority" />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={Priority.LOW} className="text-blue-500">Low</SelectItem>
                <SelectItem value={Priority.MEDIUM} className="text-yellow-500">Medium</SelectItem>
                <SelectItem value={Priority.HIGH} className="text-red-500">High</SelectItem>
                <SelectItem value={Priority.URGENT} className="text-red-700 font-bold">Urgent</SelectItem>
            </SelectContent>
        </Select>
    )
}
