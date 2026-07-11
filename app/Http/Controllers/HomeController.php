<?php

namespace App\Http\Controllers;

use App\Actions\Tasks\GetHomeStats;
use App\Enums\Categories;
use App\Enums\Priorities;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(?string $tab = null): Response
    {

        throw_if(! in_array($tab, ['day', 'week', 'month', null]), InvalidArgumentException::class, "Invalid tab: $tab");

        $stats = (new GetHomeStats)->handle(Auth::id());

        $query = Task::query()
            ->join('recurrences', 'tasks.id', '=', 'recurrences.task_id')
            ->where('tasks.user_id', Auth::id())
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

        switch ($tab) {
            case 'week':
                $tasks = $query
                    ->whereBetween('recurrences.start_date', [
                        now()->startOfWeek(Carbon::MONDAY),
                        now()->endOfWeek(Carbon::SUNDAY),
                    ])
                    ->get();
                break;
            case 'month':
                $tasks = $query->get();
                break;
            default:
                $tab = 'day';
                $tasks = Inertia::scroll(fn () => $query
                    ->where('recurrences.start_date', '<=', now()->endOfDay())
                    ->where('recurrences.end_date', '>=', now()->startOfDay())
                    ->paginate());
                break;
        }

        return Inertia::render('App/Home', [
            'tab' => $tab,
            'tasks' => $tasks,
            'categories' => Categories::options(),
            'priorities' => Priorities::options(),
            'overdueCount' => $stats['overdue_count'],
            'totalPending' => $stats['total_pending'],
            'dueSoonCount' => $stats['due_soon_count'],
        ]);
    }
}
