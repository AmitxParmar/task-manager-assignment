import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CreateTaskDialog } from "../create-task-dialog"

interface PostTaskButtonProps {
    mobile?: boolean
}

export function PostTaskButton({ mobile }: PostTaskButtonProps) {
    return (
        <CreateTaskDialog>
            <Button className={cn("gap-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all", mobile ? "h-10 w-10 p-0" : "w-full")}>
                <Plus className="h-5 w-5" />
                <span className={cn(mobile ? "hidden" : "hidden lg:inline")}>Post a Task</span>
            </Button>
        </CreateTaskDialog>
    )
}
