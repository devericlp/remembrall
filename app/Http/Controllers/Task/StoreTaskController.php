<?php

namespace App\Http\Controllers\Task;

use App\Actions\Tasks\StoreTask;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class StoreTaskController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(StoreTaskRequest $request): RedirectResponse
    {
        app(StoreTask::class)->handle($request->all());

        Inertia::flash([
            'message' => __('messages.task_created_successfully'),
            'type' => 'success',
        ]);

        return back();
    }
}
