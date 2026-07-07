<?php

namespace App\Actions\Tasks;

use App\Actions\Achievements\CheckNewAchievements;
use App\Models\Achievement;
use App\Models\Recurrence;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class CompleteTask
{
    public function __construct(
        private readonly CheckNewAchievements $checkNewAchievements,
    ) {}

    /**
     * @return Collection<int, Achievement>
     */
    public function handle(Recurrence $recurrence): Collection
    {
        $recurrence->update(['completed_at' => now()]);

        GetOrbState::clearCache(Auth::id());

        /** @var User $user */
        $user = Auth::user();

        return $this->checkNewAchievements->handle($user);
    }
}
