<?php

namespace App\Actions\Tasks;

use App\Models\Task;
use Illuminate\Database\Eloquent\Builder;

class GetCountOverdueTasks
{
    /**
     * Action responsible to get the count of overdue tasks.
     */
    public function handle(int $user_id): int
    {
        $overdue_tasks = Task::query()
            ->where('user_id', $user_id)
            ->withCount(['recurrences' => fn (Builder $query) => $query->whereNull('completed_at')->overdue()])
            ->get();

        return $overdue_tasks->sum('recurrences_count') ?? 0;
    }
}
