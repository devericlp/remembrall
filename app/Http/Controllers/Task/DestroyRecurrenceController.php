<?php

namespace App\Http\Controllers\Task;

use App\Actions\Tasks\DeleteRecurrence;
use App\Actions\Tasks\GetOrbState;
use App\Http\Controllers\Controller;
use App\Models\Recurrence;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DestroyRecurrenceController extends Controller
{
    public function __invoke(Recurrence $recurrence, DeleteRecurrence $action)
    {
        $action->handle($recurrence);

        GetOrbState::clearCache(Auth::id());

        Inertia::flash('message', __('messages.task_deleted_successfully'));

        return to_route('home.index');
    }
}
