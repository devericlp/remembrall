<?php

namespace App\Http\Controllers\Task;

use App\Actions\Tasks\GetOrbState;
use App\Http\Controllers\Controller;
use App\Models\Recurrence;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MarkAsPendingTaskController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Recurrence $recurrence)
    {
        $recurrence->update(['completed_at' => null]);

        GetOrbState::clearCache(Auth::id());

        Inertia::flash('message', __('messages.task_updated_successfully'));

        return back();
    }
}
