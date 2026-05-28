<?php

namespace App\Enums;

enum WeekDays: string
{
    case SUNDAY = 'sunday';
    case MONDAY = 'monday';
    case TUESDAY = 'tuesday';
    case WEDNESDAY = 'wednesday';
    case THURSDAY = 'thursday';
    case FRIDAY = 'friday';
    case SATURDAY = 'saturday';

    public function getDescription(): string
    {
        return match ($this) {
            self::SUNDAY => __('messages.sunday'),
            self::MONDAY => __('messages.monday'),
            self::TUESDAY => __('messages.tuesday'),
            self::WEDNESDAY => __('messages.wednesday'),
            self::THURSDAY => __('messages.thursday'),
            self::FRIDAY => __('messages.friday'),
            self::SATURDAY => __('messages.saturday'),
        };
    }

    public function getNumber(): int
    {
        return match ($this) {
            self::SUNDAY => 0,
            self::MONDAY => 1,
            self::TUESDAY => 2,
            self::WEDNESDAY => 3,
            self::THURSDAY => 4,
            self::FRIDAY => 5,
            self::SATURDAY => 6,
        };
    }

    public static function options(): array
    {
        return array_map(fn ($case) => [
            'id' => $case->value,
            'title' => $case->getDescription(),
            'number' => $case->getNumber(),
        ], self::cases());
    }
}
