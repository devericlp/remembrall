<?php

use App\Actions\Tasks\CheckDueTaskReminders;
use Illuminate\Support\Facades\Schedule;

Schedule::call(fn () => app(CheckDueTaskReminders::class)->handle())
    ->everyFifteenMinutes()
    ->name('check-due-task-reminders')
    ->withoutOverlapping();
