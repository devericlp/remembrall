<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\RecurrenceChecklistItem;
use Illuminate\Http\RedirectResponse;

class DestroyChecklistItemController extends Controller
{
    public function __invoke(RecurrenceChecklistItem $checklistItem): RedirectResponse
    {
        $checklistItem->delete();

        return back();
    }
}
