<?php

namespace App\Actions\Tasks;

use App\Enums\Categories;
use App\Enums\Priorities;
use App\Events\TaskCreated;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class StoreTask
{
    /**
     * Create a new task in the database.
     */
    public function handle(array $data): void
    {
        // create a task
        $task = new Task;

        $date = match ($data['date']) {
            'tomorrow' => now()->addDay(),
            null => now(),
            default => Carbon::parse($data['date'])
        };

        $start_date = $date->copy()->setTime(explode(':', $data['startTime'])[0], explode(':', $data['startTime'])[1]);
        $end_date = $date->copy()->setTime(explode(':', $data['endTime'])[0], explode(':', $data['endTime'])[1]);

        $task->user_id = Auth::id();
        $task->title = $data['title'];
        $task->description = $data['description'] ?? null;
        $task->reminder = $data['reminderInterval'];
        $task->priority = $data['priority'] ?? Priorities::LOW->value;
        $task->category = $data['category'] ?? Categories::GENERAL->value;
        $task->recurrence_type = $data['recurrence'] ?? null;
        $task->recurrence_value = match ($data['recurrence'] ?? null) {
            'weekly' => $data['weekDay'] ?? null,
            'monthly' => $data['monthDay'] ?? null,
            default => null,
        };
        $task->save();

        event(new TaskCreated(
            task_id: $task->id,
            start_date: $start_date,
            end_date: $end_date,
            reminder: $data['reminderInterval'] ?? null,
            recurrence: $data['recurrence'] ?? null,
            weekDay: $data['weekDay'] ?? null,
            monthDay: $data['monthDay'] ?? null,
        ));

    }
}
