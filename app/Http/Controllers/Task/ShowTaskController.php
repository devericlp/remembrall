<?php

namespace App\Http\Controllers\Task;

use App\Enums\Categories;
use App\Enums\Priorities;
use App\Http\Controllers\Controller;
use App\Models\Recurrence;
use Inertia\Inertia;
use Inertia\Response;

class ShowTaskController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Recurrence $recurrence): Response
    {
        $recurrence->load('task', 'checklistItems');
        $task = $recurrence->task;
        $category = Categories::from($task->category);

        return Inertia::render('App/Task/TaskShow', [
            'priorities' => Priorities::options(),
            'taskRecurrence' => [
                'id' => $recurrence->id,
                'task_id' => $recurrence->task_id,
                'title' => $task->title,
                'description' => $task->description,
                'category' => $task->category,
                'category_icon' => $category->getIcon(),
                'category_color' => $category->getColor(),
                'priority' => $task->priority,
                'recurrence_type' => $task->recurrence_type,
                'start_date' => $recurrence->start_date,
                'end_date' => $recurrence->end_date,
                'completed_at' => $recurrence->completed_at,
                'reminder_at' => $recurrence->reminder_at,
                'checklist_total_count' => $recurrence->checklistItems->count(),
                'checklist_completed_count' => $recurrence->checklistItems->where('completed', true)->count(),
                'checklist_items' => $recurrence->checklistItems->map(fn($item) => [
                    'id' => $item->id,
                    'description' => $item->description,
                    'completed' => $item->completed,
                ])->values(),
            ],
        ]);
    }
}
