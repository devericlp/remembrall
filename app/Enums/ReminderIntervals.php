<?php

namespace App\Enums;

enum ReminderIntervals: string
{
    case NO_REMINDER = 'no_reminder';
    case FIFTEEN_MINUTES = 'fifteen_minutes_before';
    case THIRTY_MINUTES = 'thirty_minutes_before';
    case ONE_HOUR = 'one_hour_before';

    public function getDescription(): string
    {
        return match ($this) {
            self::NO_REMINDER => __('messages.no_reminder'),
            self::FIFTEEN_MINUTES => __('messages.fifteen_minutes_before'),
            self::THIRTY_MINUTES => __('messages.thirty_minutes_before'),
            self::ONE_HOUR => __('messages.one_hour_before'),
        };
    }

    public function getMinutes(): int
    {
        return match ($this) {
            self::NO_REMINDER => 0,
            self::FIFTEEN_MINUTES => 15,
            self::THIRTY_MINUTES => 30,
            self::ONE_HOUR => 60,
        };
    }

    public static function options(): array
    {
        return array_map(fn ($case) => [
            'id' => $case->value,
            'title' => $case->getDescription(),
        ], self::cases());
    }
}
