<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $user = User::find(1);

        Task::factory()->count(25)->create([
            'user_id' => $user->id,
        ]);
        Task::factory()->count(25)->create([
            'user_id' => $user->id,
        ]);
        Task::factory()->count(25)->create([
            'user_id' => $user->id,
        ]);
    }
}
