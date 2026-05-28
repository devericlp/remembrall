<?php

namespace App\Listeners;

use App\Enums\ReminderIntervals;
use App\Events\TaskCreated;
use App\Models\Recurrence;

class CreateTaskRecurrence
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TaskCreated $event): void
    {
        $task_id = $event->task_id;
        $start = $event->start_date;
        $end = $event->end_date;
        $reminder = $event->reminder ? ReminderIntervals::from($event->reminder)->getMinutes() : null;
        $limit = $start->copy()->addYear();
        $recurrence = $event->recurrence ?? null;

        switch ($recurrence) {
            case 'daily':
                for ($date = $start->copy(); $date->lessThan($limit); $date->addDay()) {
                    Recurrence::create([
                        'task_id' => $task_id,
                        'start_date' => $date->toDateTimeString(),
                        'end_date' => $date->copy()->setTimeFrom($end)->toDateTimeString(),
                        'reminder_at' => $reminder ? $date->copy()->subMinutes($reminder)->toDateTimeString() : null,
                    ]);
                }
                break;
            case 'weekly':
                // Pega o próximo dia da semana desejado
                $targetWeekDay = $event->weekDay;
                $date = $start->copy();
                if ($targetWeekDay) {
                    // Carbon: 0=Sunday, 1=Monday, ...
                    $carbonWeekDay = array_search(strtolower($targetWeekDay), [
                        'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
                    ]);
                    if ($carbonWeekDay !== false) {
                        $date->next($carbonWeekDay);
                    }
                }
                while ($date->lessThan($limit)) {
                    Recurrence::create([
                        'task_id' => $task_id,
                        'start_date' => $date->toDateTimeString(),
                        'end_date' => $date->copy()->setTimeFrom($end)->toDateTimeString(),
                        'reminder_at' => $reminder ? $date->copy()->subMinutes($reminder)->toDateTimeString() : null,
                    ]);
                    $date->addWeek();
                }
                break;
            case 'monthly':
                // Pega o próximo mês no dia desejado
                $targetMonthDay = $event->monthDay;
                $date = $start->copy();
                if ($targetMonthDay) {
                    if ($date->day > $targetMonthDay) {
                        $date->addMonth();
                    }
                    $date->day = $targetMonthDay;
                }
                while ($date->lessThan($limit)) {
                    Recurrence::create([
                        'task_id' => $task_id,
                        'start_date' => $date->toDateTimeString(),
                        'end_date' => $date->copy()->setTimeFrom($end)->toDateTimeString(),
                        'reminder_at' => $reminder ? $date->copy()->subMinutes($reminder)->toDateTimeString() : null,
                    ]);
                    $date->addMonth();
                }
                break;
            default:
                Recurrence::create([
                    'task_id' => $task_id,
                    'start_date' => $event->start_date,
                    'end_date' => $event->end_date,
                    'reminder_at' => $reminder ? $event->start_date->copy()->subMinutes($reminder)->toDateTimeString() : null,
                ]);
                break;
        }
    }
}
