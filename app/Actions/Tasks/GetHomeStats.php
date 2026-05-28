<?php

namespace App\Actions\Tasks;

use Illuminate\Support\Facades\DB;

class GetHomeStats
{
    /**
     * Returns overdue, today's pending and due-soon (< 5 h) counts in a single query.
     *
     * @return array{overdue_count: int, total_pending: int, due_soon_count: int}
     */
    public function handle(int $user_id): array
    {
        $result = DB::selectOne(
            "
            SELECT
                SUM(CASE WHEN r.end_date < datetime('now')                                                              THEN 1 ELSE 0 END) AS overdue_count,
                SUM(CASE WHEN date(r.start_date) = date('now')                                                          THEN 1 ELSE 0 END) AS total_pending,
                SUM(CASE WHEN date(r.start_date) = date('now')
                          AND r.end_date > datetime('now')
                          AND r.end_date <= datetime('now', '+5 hours')                                                  THEN 1 ELSE 0 END) AS due_soon_count
            FROM recurrences r
            INNER JOIN tasks t ON t.id = r.task_id
            WHERE t.user_id = :user_id
              AND r.completed_at IS NULL
            ",
            ['user_id' => $user_id]
        );

        return [
            'overdue_count' => (int) ($result->overdue_count ?? 0),
            'total_pending' => (int) ($result->total_pending ?? 0),
            'due_soon_count' => (int) ($result->due_soon_count ?? 0),
        ];
    }
}