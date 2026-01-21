import api from '@/lib/api'
import type {
    Task,
    CreateTaskDto,
    UpdateTaskDto,
    TaskQueryDto,
} from '@/types/task'

interface ApiResponse<T> {
    message: string
    data: T
}

/**
 * Task Service - All task API calls
 * Routes match backend: /tasks/*
 * All routes require authentication
 */
export const taskService = {
    /**
     * POST /tasks
     * Create a new task
     */
    create: async (data: CreateTaskDto): Promise<Task> => {
        const response = await api.post<ApiResponse<Task>>('/tasks', data)
        return response.data.data
    },

    /**
     * GET /tasks
     * Get all tasks with optional filtering
     */
    getAll: async (filters?: TaskQueryDto): Promise<Task[]> => {
        const response = await api.get<ApiResponse<Task[]>>('/tasks', {
            params: filters,
        })
        return response.data.data
    },

    /**
     * GET /tasks/:id
     * Get a task by ID
     */
    getById: async (id: string): Promise<Task> => {
        const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`)
        return response.data.data
    },

    /**
     * PUT /tasks/:id
     * Update a task
     */
    update: async (id: string, data: UpdateTaskDto): Promise<Task> => {
        const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data)
        return response.data.data
    },

    /**
     * DELETE /tasks/:id
     * Delete a task
     */
    delete: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`)
    },
}
