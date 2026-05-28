<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Recurrence;
use Inertia\Inertia;

class DestroyTaskController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Recurrence $recurrence)
    {
        $recurrence->delete();

        Inertia::flash('message', __('messages.task_deleted_successfully'));

        return to_route('home.index');
    }
}
