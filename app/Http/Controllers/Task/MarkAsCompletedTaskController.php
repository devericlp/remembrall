<?php

namespace App\Http\Controllers\Task;

use App\Actions\Tasks\CompleteTask;
use App\Http\Controllers\Controller;
use App\Models\Recurrence;
use Inertia\Inertia;

class MarkAsCompletedTaskController extends Controller
{
    public function __invoke(Recurrence $recurrence, CompleteTask $completeTask)
    {
        $newAchievements = $completeTask->handle($recurrence);

        Inertia::flash('message', __('messages.task_updated_successfully'));

        if ($newAchievements->isNotEmpty()) {
            Inertia::flash('newAchievements', $newAchievements->values()->toArray());
        }

        return back();
    }
}
