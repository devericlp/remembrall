export type TaskRecurrence = {
    id: number
    task_id: number
    title: string
    description: string | null
    category: string | null
    priority: string | null
    start_date: string
    end_date: string
    reminder_at: string | null
    completed_at: string | null
}