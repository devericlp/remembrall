<?php

namespace App\Enums;

enum RecurrenceTypes: string
{
    case DAILY = 'daily';
    case WEEKLY = 'weekly';
    case MONTHLY = 'monthly';

    public function getDescription(): string
    {
        return match ($this) {
            self::DAILY => __('messages.daily'),
            self::WEEKLY => __('messages.weekly'),
            self::MONTHLY => __('messages.monthly'),
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
