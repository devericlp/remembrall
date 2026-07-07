<?php

namespace Database\Seeders;

use App\Enums\Achievements;
use App\Models\Achievement;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Achievements::cases() as $achievement) {
            Achievement::updateOrCreate(
                ['slug' => $achievement->value],
                [
                    'title'       => $achievement->getTitle(),
                    'subtitle'    => $achievement->getSubtitle(),
                    'description' => $achievement->getDescription(),
                    'image'       => $achievement->getImage(),
                    'condition'   => $achievement->getCondition(),
                ]
            );
        }
    }
}
