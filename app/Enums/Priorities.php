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

    public function getColor(): string
    {
        return match ($this) {
            self::LOW => 'bg-[#2A261F] text-[#D9C6A7] border border-[#D9C6A7]/20',
            self::MEDIUM => 'bg-[#2B2518] text-[#D2A25A] border border-[#D2A25A]/25',
            self::HIGH => 'bg-[#2A1D1E] text-[#E8606E] border border-[#E8606E]/30',
        };
    }

    public static function options(): array
    {
        return array_map(fn ($case) => [
            'id' => $case->value,
            'title' => $case->getDescription(),
            'color' => $case->getColor(),
        ], self::cases());
    }
}
