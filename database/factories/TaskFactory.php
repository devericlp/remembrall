<?php

namespace Database\Factories;

use App\Enums\Categories;
use App\Enums\Priorities;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $date = $this->faker->dateTimeBetween('-1 month', '+1 month');

        $start = Carbon::instance($date)->setTime(
            $this->faker->numberBetween(0, 22),
            $this->faker->numberBetween(0, 59)
        );

        $end = (clone $start)->addHour();

        return [
            'title' => $this->faker->sentence(2),
            'description' => $this->faker->randomElement([$this->faker->paragraph(), null]),
            'user_id' => User::factory(),
            'start_date' => $start,
            'end_date' => $end,
            'reminder_at' => null,
            'completed_at' => null,
            'priority' => $this->faker->randomElement(Priorities::cases()),
            'category' => $this->faker->randomElement(Categories::cases()),
        ];
    }

    /**
     * Indicate that the task is completed.
     */
    public function completed(): static
    {
        return $this->state(function (array $attributes) {
            $completedAt = $this->faker->dateTimeBetween($attributes['start_date'], $attributes['end_date']);

            return [
                'completed_at' => $completedAt,
            ];
        });
    }

    /**
     * Indicate that the task is overdue.
     */
    public function overdue(): static
    {
        return $this->state(function (array $attributes) {

            $date = now()->subDays($this->faker->numberBetween(1, 30));

            $start = Carbon::instance($date)->setTime(
                $this->faker->numberBetween(0, 22),
                $this->faker->numberBetween(0, 59)
            );

            $end = (clone $start)->addHour();

            return [
                'completed_at' => null,
                'start_date' => $start,
                'end_date' => $end,
            ];
        });
    }
}
