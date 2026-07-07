<?php

namespace App\Http\Controllers\Achievement;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class ListAchievementsController extends Controller
{
    public function __invoke(string $tab = 'all'): Response
    {
        throw_if(! in_array($tab, ['all', 'achieved', 'locked']), InvalidArgumentException::class, "Invalid tab: $tab");

        $user = Auth::user();
        $userAchievements = $user->achievements()->get()->keyBy('id');
        $earnedIds = $userAchievements->keys();

        $progress = DB::table('recurrences')
            ->join('tasks', 'tasks.id', '=', 'recurrences.task_id')
            ->where('tasks.user_id', $user->id)
            ->whereNotNull('recurrences.completed_at')
            ->count();

        $query = Achievement::query()->orderBy('id');

        if ($tab === 'achieved') {
            $query->whereIn('id', $earnedIds);
        } elseif ($tab === 'locked') {
            $query->whereNotIn('id', $earnedIds);
        }

        $achievements = Inertia::scroll(fn () => $query->paginate(5)->through(function (Achievement $achievement) use ($userAchievements, $progress) {
            $userAch = $userAchievements->get($achievement->id);

            return [
                'id' => $achievement->id,
                'slug' => $achievement->slug,
                'title' => $achievement->title,
                'subtitle' => $achievement->subtitle,
                'description' => $achievement->description,
                'image' => $achievement->image,
                'condition' => $achievement->condition,
                'progress' => $progress,
                'earned_at' => $userAch?->pivot->earned_at,
                'is_earned' => $userAch !== null,
            ];
        }));

        return Inertia::render('App/Achievements', [
            'tab' => $tab,
            'achievements' => $achievements,
        ]);
    }
}
