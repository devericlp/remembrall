<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Recurrence;
use Inertia\Inertia;

class MarkAsCompletedTaskController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Recurrence $recurrence)
    {
        $recurrence->update(['completed_at' => now()]);

        Inertia::flash('message', __('messages.task_updated_successfully'));

        return back();
    }
}
