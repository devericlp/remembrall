<?php

namespace App\Actions\Achievements;

use App\Enums\Achievements;
use App\Models\Achievement;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CheckNewAchievements
{
    /**
     * Grant the next pending achievement the user has earned, one at a time.
     *
     * @return Collection<int, Achievement>
     */
    public function handle(User $user): Collection
    {
        $completedCount = DB::table('recurrences')
            ->join('tasks', 'tasks.id', '=', 'recurrences.task_id')
            ->where('tasks.user_id', $user->id)
            ->whereNotNull('recurrences.completed_at')
            ->count();

        $ownedSlugs = $user->achievements()->pluck('slug');

        $nextAchievement = collect(Achievements::cases())
            ->first(fn (Achievements $a) => $completedCount >= $a->getThreshold() && ! $ownedSlugs->contains($a->value));

        if ($nextAchievement === null) {
            return new Collection;
        }

        $achievement = Achievement::where('slug', $nextAchievement->value)->firstOrFail();

        $user->achievements()->attach($achievement->id);

        return new Collection([$achievement]);
    }
}
