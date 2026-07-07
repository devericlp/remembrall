<?php

namespace App\Http\Controllers\Task;

use App\Actions\Tasks\GetOrbState;
use App\Http\Controllers\Controller;
use App\Models\Recurrence;
use Illuminate\Support\Facades\Auth;

class DestroyEntireTaskController extends Controller
{
    public function __invoke(Recurrence $recurrence)
    {
        GetOrbState::clearCache(Auth::id());

        $recurrence->task->delete();

        return to_route('home.index');
    }
}
