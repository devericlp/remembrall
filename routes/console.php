<?php

use App\Console\Commands\SendDueTaskReminders;
use Illuminate\Support\Facades\Schedule;

Schedule::command(SendDueTaskReminders::class)
    ->everyMinute()
    ->name('send-due-task-reminders')
    ->withoutOverlapping();
