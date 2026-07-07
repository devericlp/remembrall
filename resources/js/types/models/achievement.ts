export type Achievement = {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    description: string | null;
    image: string;
    condition: { total: number };
    progress: number;
    earned_at: string | null;
    is_earned: boolean;
};
