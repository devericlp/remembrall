<?php

namespace App\Actions\Tasks;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class GetOrbState
{
    public const CACHE_KEY = 'orb_state_';
    public const CACHE_TTL = 300; // 5 minutes

    /**
     * Returns overdue count and orb state, cached per user.
     *
     * @return array{overdue_count: int, orb_state: string}
     */
    public function handle(int $user_id): array
    {
        return Cache::remember(self::CACHE_KEY . $user_id, self::CACHE_TTL, function () use ($user_id) {
            $now = now()->toDateTimeString();
            $nowPlusFive = now()->addHours(5)->toDateTimeString();

            $result = DB::selectOne("
                SELECT
                    SUM(CASE WHEN r.end_date < :now1                                      THEN 1 ELSE 0 END) AS overdue_count,
                    SUM(CASE WHEN r.end_date > :now2 AND r.end_date <= :now3 THEN 1 ELSE 0 END) AS due_soon_count
                FROM recurrences r
                INNER JOIN tasks t ON t.id = r.task_id
                WHERE t.user_id = :user_id
                  AND r.completed_at IS NULL
            ", ['user_id' => $user_id, 'now1' => $now, 'now2' => $now, 'now3' => $nowPlusFive]);

            $overdue = (int) ($result->overdue_count ?? 0);
            $dueSoon = (int) ($result->due_soon_count ?? 0);

            return [
                'overdue_count' => $overdue,
                'orb_state'     => $overdue > 0 ? 'danger' : ($dueSoon > 0 ? 'warning' : 'clear'),
            ];
        });
    }

    public static function clearCache(int $user_id): void
    {
        Cache::forget(self::CACHE_KEY . $user_id);
    }
}
