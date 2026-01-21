import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Status } from "@/types/task"
import { useUpdateTask } from "@/hooks/useTasks"
import { Loader2 } from "lucide-react"

interface ChangeTaskStatusProps {
    taskId: string
    status: Status
}

export function ChangeTaskStatus({ taskId, status }: ChangeTaskStatusProps) {
    const { mutate: updateTask, isPending } = useUpdateTask()

    const handleValueChange = (value: string) => {
        updateTask({
            id: taskId,
            data: { status: value as Status }
        })
    }

    const statusColors: Record<Status, string> = {
        [Status.TODO]: "text-slate-500",
        [Status.IN_PROGRESS]: "text-blue-600",
        [Status.REVIEW]: "text-orange-600",
        [Status.COMPLETED]: "text-green-600",
    }

    return (
        <Select
            value={status}
            onValueChange={handleValueChange}
            disabled={isPending}
        >
            <SelectTrigger className={`w-[130px] h-8 text-xs font-medium border-0 bg-transparent focus:ring-0 px-2 ${statusColors[status]}`}>
                <div className="flex items-center gap-2">
                    {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                    <SelectValue placeholder="Status" />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={Status.TODO}>To Do</SelectItem>
                <SelectItem value={Status.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={Status.REVIEW}>In Review</SelectItem>
                <SelectItem value={Status.COMPLETED}>Completed</SelectItem>
            </SelectContent>
        </Select>
    )
}
