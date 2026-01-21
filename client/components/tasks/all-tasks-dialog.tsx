import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useGetTasks } from "@/hooks/useTasks"
import { TaskList } from "./task-list"
import { Loader2, ArrowUpDown, X } from "lucide-react"
import { useState } from "react"
import { Status, Priority } from "@/types/task"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface AllTasksDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AllTasksDialog({ open, onOpenChange }: AllTasksDialogProps) {
    const [status, setStatus] = useState<Status | undefined>()
    const [priority, setPriority] = useState<Priority | undefined>()
    const [sortByDueDate, setSortByDueDate] = useState<'asc' | 'desc' | undefined>()

    // Enable query only when dialog is open
    const { data: tasks, isLoading, isError } = useGetTasks(
        { status, priority, sortByDueDate },
        { enabled: open }
    )

    const handleClearFilters = () => {
        setStatus(undefined)
        setPriority(undefined)
        setSortByDueDate(undefined)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent className="w-screen h-dvh md:w-[90vw] md:min-w-full md:h-[90vh] flex flex-col p-0 gap-0 rounded-none md:rounded-lg">

                <DialogHeader className="p-4 md:p-6 pb-3 md:pb-4 border-b shrink-0">
                    <div className="flex flex-col gap-3">
                        <DialogTitle className="text-xl md:text-2xl font-bold">All Tasks</DialogTitle>

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
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {isLoading && (
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {isError && (
                        <div className="flex h-full items-center justify-center text-red-500">
                            Failed to load tasks. Please try again.
                        </div>
                    )}

                    {tasks && (
                        <div className="pb-4 xl:max-w-4/5 md:mx-auto">
                            <TaskList tasks={tasks} view="grid" />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
