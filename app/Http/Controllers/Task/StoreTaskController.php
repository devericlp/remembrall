<?php

namespace App\Http\Controllers\Task;

use App\Actions\Tasks\GetOrbState;
use App\Actions\Tasks\StoreTask;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StoreTaskController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(StoreTaskRequest $request): RedirectResponse
    {
        app(StoreTask::class)->handle($request->all());

        GetOrbState::clearCache(Auth::id());

        Inertia::flash([
            'message' => __('messages.task_created_successfully'),
            'type' => 'success',
        ]);

        return back();
    }
}
