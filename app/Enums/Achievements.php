<?php

namespace App\Enums;

enum Achievements: string
{
    case FIRST_TASK_DONE = 'first-task';
    case TEN_TASKS_DONE = 'ten-tasks';
    case TWENTY_FIVE_TASKS_DONE = 'twenty-five-tasks';
    case FIFTY_TASKS_DONE = 'fifty-tasks';
    case ONE_HUNDRED_TASKS_DONE = 'one-hundred-tasks';
    case TWO_HUNDRED_AND_FIFTY_TASKS_DONE = 'two-hundred-and-fifty-tasks';
    case FIVE_HUNDRED_TASKS_DONE = 'five-hundred-tasks';
    case ONE_THOUSAND_TASKS_DONE = 'one-thousand-tasks';

    public function getTitle(): string
    {
        return match ($this) {
            self::FIRST_TASK_DONE => __('messages.first_memory'),
            self::TEN_TASKS_DONE => __('messages.memory_collector'),
            self::TWENTY_FIVE_TASKS_DONE => __('messages.memory_keeper'),
            self::FIFTY_TASKS_DONE => __('messages.memory_archivist'),
            self::ONE_HUNDRED_TASKS_DONE => __('messages.master_of_memories'),
            self::TWO_HUNDRED_AND_FIFTY_TASKS_DONE => __('messages.memory_sage'),
            self::FIVE_HUNDRED_TASKS_DONE => __('messages.legend_of_memories'),
            self::ONE_THOUSAND_TASKS_DONE => __('messages.the_remembrall'),
        };
    }

    public function getSubtitle(): string
    {
        return match ($this) {
            self::FIRST_TASK_DONE => 'First Task Done',
            self::TEN_TASKS_DONE => 'Ten Tasks Done',
            self::TWENTY_FIVE_TASKS_DONE => 'Twenty-Five Tasks Done',
            self::FIFTY_TASKS_DONE => 'Fifty Tasks Done',
            self::ONE_HUNDRED_TASKS_DONE => 'One Hundred Tasks Done',
            self::TWO_HUNDRED_AND_FIFTY_TASKS_DONE => 'Two Hundred and Fifty Tasks Done',
            self::FIVE_HUNDRED_TASKS_DONE => 'Five Hundred Tasks Done',
            self::ONE_THOUSAND_TASKS_DONE => 'One Thousand Tasks Done',
        };
    }

    public function getImage(): string
    {
        return match ($this) {
            self::FIRST_TASK_DONE => 'images/achievements/first-task.png',
            self::TEN_TASKS_DONE => 'images/achievements/ten-tasks.png',
            self::TWENTY_FIVE_TASKS_DONE => 'images/achievements/twenty-five-tasks.png',
            self::FIFTY_TASKS_DONE => 'images/achievements/fifty-tasks.png',
            self::ONE_HUNDRED_TASKS_DONE => 'images/achievements/one-hundred-tasks.png',
            self::TWO_HUNDRED_AND_FIFTY_TASKS_DONE => 'images/achievements/two-hundred-and-fifty-tasks.png',
            self::FIVE_HUNDRED_TASKS_DONE => 'images/achievements/five-hundred-tasks.png',
            self::ONE_THOUSAND_TASKS_DONE => 'images/achievements/one-thousand-tasks.png',
        };
    }

    public function getThreshold(): int
    {
        return match ($this) {
            self::FIRST_TASK_DONE => 1,
            self::TEN_TASKS_DONE => 10,
            self::TWENTY_FIVE_TASKS_DONE => 25,
            self::FIFTY_TASKS_DONE => 50,
            self::ONE_HUNDRED_TASKS_DONE => 100,
            self::TWO_HUNDRED_AND_FIFTY_TASKS_DONE => 250,
            self::FIVE_HUNDRED_TASKS_DONE => 500,
            self::ONE_THOUSAND_TASKS_DONE => 1000,
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::FIRST_TASK_DONE => __('messages.complete_tasks', ['number' => 1]),
            self::TEN_TASKS_DONE => __('messages.complete_tasks', ['number' => 10]),
            self::TWENTY_FIVE_TASKS_DONE => __('messages.complete_tasks', ['number' => 25]),
            self::FIFTY_TASKS_DONE => __('messages.complete_tasks', ['number' => 50]),
            self::ONE_HUNDRED_TASKS_DONE => __('messages.complete_tasks', ['number' => 100]),
            self::TWO_HUNDRED_AND_FIFTY_TASKS_DONE => __('messages.complete_tasks', ['number' => 250]),
            self::FIVE_HUNDRED_TASKS_DONE => __('messages.complete_tasks', ['number' => 500]),
            self::ONE_THOUSAND_TASKS_DONE => __('messages.complete_tasks', ['number' => 1000]),
        };
    }

    public function getCondition(): array
    {
        return ['total' => $this->getThreshold()];
    }
}
