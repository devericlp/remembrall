<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\RecurrenceChecklistItem;
use Illuminate\Http\RedirectResponse;

class ToggleChecklistItemController extends Controller
{
    public function __invoke(RecurrenceChecklistItem $checklistItem): RedirectResponse
    {
        $checklistItem->update(['completed' => !$checklistItem->completed]);

        return back();
    }
}
