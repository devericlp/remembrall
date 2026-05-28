// Generic paginated type for API responses
export type Paginated<T> = {
    data: T[];
    total: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
    [key: string]: any;
};
