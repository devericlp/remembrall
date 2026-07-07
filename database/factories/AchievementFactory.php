<?php

namespace Database\Factories;

use App\Models\Achievement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Achievement>
 */
class AchievementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title'       => $this->faker->words(3, true),
            'image'       => $this->faker->imageUrl(200, 200, 'achievements'),
            'subtitle'    => $this->faker->optional()->sentence(),
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}
