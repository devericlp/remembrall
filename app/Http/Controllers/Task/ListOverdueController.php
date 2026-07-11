<?php

namespace App\Http\Controllers\Task;

use App\Enums\Categories;
use App\Enums\Priorities;
use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ListOverdueController extends Controller
{
    public function __invoke(): Response
    {
        $baseQuery = Task::query()
            ->join('recurrences', 'tasks.id', '=', 'recurrences.task_id')
            ->where('tasks.user_id', Auth::id())
            ->where('recurrences.end_date', '<', now())
            ->whereNull('recurrences.completed_at');

        $oldestDate = (clone $baseQuery)
            ->min('recurrences.end_date');

        $highPriorityCount = (clone $baseQuery)
            ->where('tasks.priority', Priorities::HIGH->value)
            ->count();

        $query = (clone $baseQuery)
            ->select([
                'recurrences.id',
                'tasks.id as task_id',
                'tasks.title',
                'tasks.description',
                'tasks.category',
                'tasks.priority',
                'recurrences.start_date',
                'recurrences.end_date',
                'recurrences.completed_at',
                'recurrences.reminder_at',
            ])
            ->selectRaw('(SELECT COUNT(*) FROM recurrence_checklist_items WHERE recurrence_id = recurrences.id) as checklist_total_count')
            ->selectRaw('(SELECT COUNT(*) FROM recurrence_checklist_items WHERE recurrence_id = recurrences.id AND completed = 1) as checklist_completed_count')
            ->orderBy('recurrences.end_date', 'ASC');

        return Inertia::render('App/Task/ListOverdue', [
            'tasks' => Inertia::scroll(fn () => $query->paginate()),
            'categories' => Categories::options(),
            'priorities' => Priorities::options(),
            'oldestDate' => $oldestDate,
            'highPriorityCount' => $highPriorityCount,
        ]);
    }
}
