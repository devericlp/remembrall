<?php

namespace App\Actions\Tasks;

use App\Models\Recurrence;

class DeleteRecurrence
{
    public function handle(Recurrence $recurrence): void
    {
        $recurrence->checklistItems()->delete();
        $recurrence->delete();
    }
}
