<?php

namespace App\Http\Controllers\Task;

use App\Enums\Categories;
use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ListOverdueController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $query = Task::query()
            ->join('recurrences', 'tasks.id', '=', 'recurrences.task_id')
            ->where('tasks.user_id', Auth::id())
            ->where('recurrences.end_date', '<', now())
            ->whereNull('recurrences.completed_at')
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
            ->orderBy('recurrences.end_date', 'ASC');

        return Inertia::render('App/Task/ListOverdue', [
            'tasks' => Inertia::scroll(fn () => $query->paginate()),
            'categories' => Categories::options(),
        ]);
    }
}
