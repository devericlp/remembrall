<?php

namespace App\Enums;

enum Priorities: string
{
    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';

    public function getDescription(): string
    {
        return match ($this) {
            self::LOW => __('messages.low'),
            self::MEDIUM => __('messages.medium'),
            self::HIGH => __('messages.high'),
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
