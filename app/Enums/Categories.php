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
            self::GENERAL => 'bg-[#2A261F] text-[#C8B89A] border border-[#6E6658]/30',
            self::WORK => 'bg-[#211F2A] text-[#B8A9D9] border border-[#8A7AA6]/30',
            self::PERSONAL => 'bg-[#1F2A22] text-[#B7CFA4] border border-[#9CB88A]/30',
            self::MEETING => 'bg-[#2A221F] text-[#D0A18A] border border-[#A98B7A]/30',
            self::STUDY => 'bg-[#2B2518] text-[#D2A25A] border border-[#D2A25A]/30',
            self::HEALTH => 'bg-[#2A1D1E] text-[#E58B86] border border-[#C86D67]/30',
            self::HOUSEHOLD => 'bg-[#2A241F] text-[#D2B496] border border-[#C7A68B]/30',
            self::CAREER => 'bg-[#1E2430] text-[#AAB7E6] border border-[#7D89B8]/30',
            self::FAMILY => 'bg-[#1F2925] text-[#B8D6C6] border border-[#9DB6A9]/30',
            self::FINANCE => 'bg-[#2B2517] text-[#D6B85C] border border-[#C7A24A]/30',
        };
    }

    public function getIcon(): string
    {
        return match ($this) {
            self::GENERAL => 'LayoutGrid',
            self::WORK => 'Briefcase',
            self::PERSONAL => 'User',
            self::MEETING => 'Users',
            self::STUDY => 'BookOpen',
            self::HEALTH => 'Heart',
            self::HOUSEHOLD => 'House',
            self::CAREER => 'TrendingUp',
            self::FAMILY => 'Baby',
            self::FINANCE => 'Wallet',
        };
    }

    public static function options(): array
    {
        $options = array_map(fn ($case) => [
            'id' => $case->value,
            'title' => $case->getDescription(),
            'color' => $case->getColor(),
            'icon' => $case->getIcon(),
        ], self::cases());

        usort($options, fn ($a, $b) => strcmp($a['title'], $b['title']));

        return $options;
    }
}
