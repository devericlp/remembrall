<?php

namespace App\Http\Controllers\Task;

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
        $task = $recurrence->load('task')->task;

        return Inertia::render('App/Task/TaskShow', [
            'taskRecurrence' => [
                'id' => $recurrence->id,
                'task_id' => $recurrence->task_id,
                'title' => $task->title,
                'description' => $task->description,
                'category' => $task->category,
                'priority' => $task->priority,
                'start_date' => $recurrence->start_date,
                'end_date' => $recurrence->end_date,
                'completed_at' => $recurrence->completed_at,
                'reminder_at' => $recurrence->reminder_at,
            ],
        ]);
    }
}
