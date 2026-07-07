<?php

namespace App\Listeners;

use App\Enums\ReminderIntervals;
use App\Events\TaskCreated;
use App\Models\Recurrence;
use App\Models\Task;

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
        $lastOccurrence = null;

        switch ($recurrence) {
            case 'daily':
                for ($date = $start->copy(); $date->lessThan($limit); $date->addDay()) {
                    Recurrence::create([
                        'task_id' => $task_id,
                        'start_date' => $date->toDateTimeString(),
                        'end_date' => $date->copy()->setTimeFrom($end)->toDateTimeString(),
                        'reminder_at' => $reminder ? $date->copy()->subMinutes($reminder)->toDateTimeString() : null,
                    ]);
                    $lastOccurrence = $date->copy();
                }
                break;
            case 'weekly':
                $weekDayMap = [
                    'sunday' => 0, 'monday' => 1, 'tuesday' => 2, 'wednesday' => 3,
                    'thursday' => 4, 'friday' => 5, 'saturday' => 6,
                ];

                foreach ($event->weekDay ?? [] as $dayName) {
                    $carbonWeekDay = $weekDayMap[strtolower($dayName)] ?? null;
                    if ($carbonWeekDay === null) continue;

                    $date = $start->copy()->next($carbonWeekDay);
                    while ($date->lessThan($limit)) {
                        Recurrence::create([
                            'task_id' => $task_id,
                            'start_date' => $date->toDateTimeString(),
                            'end_date' => $date->copy()->setTimeFrom($end)->toDateTimeString(),
                            'reminder_at' => $reminder ? $date->copy()->subMinutes($reminder)->toDateTimeString() : null,
                        ]);
                        if ($lastOccurrence === null || $date->greaterThan($lastOccurrence)) {
                            $lastOccurrence = $date->copy();
                        }
                        $date->addWeek();
                    }
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
                    $lastOccurrence = $date->copy();
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

        if ($recurrence && $lastOccurrence) {
            Task::whereKey($task_id)->update([
                'renew_date' => $lastOccurrence->copy()->subDay()->toDateString(),
            ]);
        }
    }
}
