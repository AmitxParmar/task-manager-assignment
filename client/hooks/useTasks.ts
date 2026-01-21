import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { taskService } from '@/services/task.service'

import type { CreateTaskDto, UpdateTaskDto, TaskQueryDto, Task } from '@/types/task'

/**
 * Query keys for task-related data fetching and caching.
 */
export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (filters?: TaskQueryDto) => [...taskKeys.lists(), filters] as const,
    details: () => [...taskKeys.all, 'detail'] as const,
    detail: (id: string) => [...taskKeys.details(), id] as const,
}

/**
 * Hook to create a new task.
 * Automatically invalidates task lists in the cache upon successful creation.
 * 
 * @returns A mutation object for creating a task.
 */
export function useCreateTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateTaskDto) => taskService.create(data),
        onSuccess: (newTask) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
            console.log('Task created successfully:', newTask)
        },
        onError: (error: any) => {
            console.error('Failed to create task:', error.response?.data || error.message)
        },
    })
}

/**
 * Hook to retrieve a list of tasks with optional filtering.
 * 
 * @param filters - Optional criteria to filter the tasks (e.g., status, search term).
 * @param options - Additional query options such as `enabled`.
 * @returns A query object containing the tasks data and loading state.
 */
export function useGetTasks(filters?: TaskQueryDto, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: taskKeys.list(filters),
        queryFn: () => taskService.getAll(filters),
        staleTime: 30 * 1000, // 30 seconds
        enabled: options?.enabled
    })
}

/**
 * Hook to retrieve a single task by its unique identifier.
 * 
 * @param id - The unique ID of the task to fetch.
 * @returns A query object containing the task data and loading state.
 */
export function useGetTask(id: string) {
    return useQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => taskService.getById(id),
        enabled: !!id,
        staleTime: 30 * 1000,
    })
}

/**
 * Hook to update an existing task.
 * Implements optimistic updates for the task detail view and invalidates lists on success.
 * 
 * @returns A mutation object for updating a task, including optimistic rollback logic.
 */
export function useUpdateTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
            taskService.update(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) })

            const previousTask = queryClient.getQueryData<Task>(taskKeys.detail(id))

            if (previousTask) {
                queryClient.setQueryData<Task>(taskKeys.detail(id), {
                    ...previousTask,
                    ...data,
                })
            }

            return { previousTask }
        },
        onError: (error: any, { id }, context) => {
            if (context?.previousTask) {
                queryClient.setQueryData(taskKeys.detail(id), context.previousTask)
            }
            console.error('Failed to update task:', error.response?.data || error.message)
        },
        onSuccess: (updatedTask, { id }) => {
            queryClient.setQueryData(taskKeys.detail(id), updatedTask)
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
            console.log('Task updated successfully:', updatedTask)
        },
    })
}

/**
 * Hook to delete a task.
 * Removes the task from the cache and invalidates task lists upon successful deletion.
 * 
 * @returns A mutation object for deleting a task.
 */
export function useDeleteTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => taskService.delete(id),
        onSuccess: (_, id) => {
            queryClient.removeQueries({ queryKey: taskKeys.detail(id) })
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
            console.log('Task deleted successfully')
        },
        onError: (error: any) => {
            console.error('Failed to delete task:', error.response?.data || error.message)
        },
    })
}
