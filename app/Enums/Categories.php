<?php

namespace App\Enums;

enum Categories: string
{
    case GENERAL = 'general';
    case WORK = 'work';
    case PERSONAL = 'personal';
    case MEETING = 'meeting';
    case STUDY = 'study';
    case HEALTH = 'health';
    case HOUSEHOLD = 'household';
    case CAREER = 'career';
    case FAMILY = 'family';
    case FINANCE = 'finance';

    public function getDescription(): string
    {
        return match ($this) {
            self::GENERAL => __('messages.general'),
            self::WORK => __('messages.work'),
            self::PERSONAL => __('messages.personal'),
            self::MEETING => __('messages.meeting'),
            self::STUDY => __('messages.study'),
            self::HEALTH => __('messages.health'),
            self::HOUSEHOLD => __('messages.household'),
            self::CAREER => __('messages.career'),
            self::FAMILY => __('messages.family'),
            self::FINANCE => __('messages.finance'),
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::GENERAL => 'bg-gray-500',
            self::WORK => 'bg-blue-500',
            self::PERSONAL => 'bg-green-500',
            self::MEETING => 'bg-purple-500',
            self::STUDY => 'bg-yellow-500',
            self::HEALTH => 'bg-red-500',
            self::HOUSEHOLD => 'bg-pink-500',
            self::CAREER => 'bg-indigo-500',
            self::FAMILY => 'bg-teal-500',
            self::FINANCE => 'bg-orange-500',
        };
    }

    public function getBorderColor(): string
    {
        return match ($this) {
            self::GENERAL => 'border-gray-500',
            self::WORK => 'border-l-blue-500',
            self::PERSONAL => 'border-l-green-500',
            self::MEETING => 'border-l-purple-500',
            self::STUDY => 'border-l-yellow-500',
            self::HEALTH => 'border-l-red-500',
            self::HOUSEHOLD => 'border-l-pink-500',
            self::CAREER => 'border-l-indigo-500',
            self::FAMILY => 'border-l-teal-500',
            self::FINANCE => 'border-l-orange-500',
        };
    }

    public function getSeal(): string
    {
        return match ($this) {
            self::GENERAL => '/images/general-seal.png',
            self::WORK => '/images/work-seal.png',
            self::PERSONAL => '/images/personal-seal.png',
            self::MEETING => '/images/meeting-seal.png',
            self::STUDY => '/images/study-seal.png',
            self::HEALTH => '/images/health-seal.png',
            self::HOUSEHOLD => '/images/household-seal.png',
            self::CAREER => '/images/career-seal.png',
            self::FAMILY => '/images/family-seal.png',
            self::FINANCE => '/images/finance-seal.png',
        };
    }

    public static function options(): array
    {
        $options = array_map(fn ($case) => [
            'id' => $case->value,
            'title' => $case->getDescription(),
            'color' => $case->getColor(),
            'borderColor' => $case->getBorderColor(),
            'seal' => $case->getSeal(),
        ], self::cases());

        usort($options, fn ($a, $b) => strcmp($a['title'], $b['title']));

        return $options;
    }
}
