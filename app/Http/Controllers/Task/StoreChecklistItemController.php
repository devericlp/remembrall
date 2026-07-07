<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Recurrence;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreChecklistItemController extends Controller
{
    public function __invoke(Request $request, Recurrence $recurrence): RedirectResponse
    {
        $request->validate([
            'description' => ['required', 'string', 'max:100'],
        ]);

        $nextOrder = $recurrence->checklistItems()->max('order') + 1;

        $recurrence->checklistItems()->create([
            'description' => $request->description,
            'completed' => false,
            'order' => $nextOrder,
        ]);

        return back();
    }
}
