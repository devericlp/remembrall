<?php

namespace App\Http\Controllers\Task;

use App\Enums\Categories;
use App\Enums\Priorities;
use App\Enums\RecurrenceTypes;
use App\Enums\ReminderIntervals;
use App\Enums\WeekDays;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CreateTaskController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        return Inertia::render('App/Task/CreateTask', [
            'priorities' => Priorities::options(),
            'categories' => Categories::options(),
            'reminders' => ReminderIntervals::options(),
            'weekDays' => WeekDays::options(),
            'recurrenceTypes' => RecurrenceTypes::options(),
        ]);
    }
}
