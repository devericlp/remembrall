<?php

namespace App\Actions\Tasks;

use App\Models\Task;

class CreateTaskRecurrence
{
    /**
     * Action responsible to register all recurrences of a task in the database and google calendar.
     */
    public function handle(int $task_id, $date, $recurrence): void {}
}
