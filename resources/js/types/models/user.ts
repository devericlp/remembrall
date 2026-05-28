export type User = {
    id: number
    name: string
    email: string
    created_at: string
    updated_at: string
    receive_notifications: boolean
    notify_overdue: boolean
    notify_due_soon: boolean
}