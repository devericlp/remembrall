<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Recurrence;
use App\Models\RecurrenceChecklistItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReorderChecklistItemsController extends Controller
{
    public function __invoke(Request $request, Recurrence $recurrence): RedirectResponse
    {
        $request->validate([
            'items' => ['required', 'array'],
            'items.*' => ['integer'],
        ]);

        foreach ($request->items as $index => $id) {
            RecurrenceChecklistItem::where('id', $id)
                ->where('recurrence_id', $recurrence->id)
                ->update(['order' => $index]);
        }

        return back();
    }
}
