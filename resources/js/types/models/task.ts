export type Task = {
    id: number
    title: string
    description: string | null
    priority: string
    category: string
    reminder: string | null
    created_at: string
    updated_at: string
}