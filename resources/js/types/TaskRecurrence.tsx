export type TaskRecurrence = {
    id: number
    task_id: number
    title: string
    description: string | null
    category: string | null
    category_icon?: string
    category_color?: string
    priority: string | null
    recurrence_type?: string | null
    start_date: string
    end_date: string
    reminder_at: string | null
    completed_at: string | null
    checklist_total_count: number
    checklist_completed_count: number
    checklist_items: { id: number; description: string; completed: boolean }[]
}