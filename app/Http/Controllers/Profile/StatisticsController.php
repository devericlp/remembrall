<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Models\Recurrence;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StatisticsController extends Controller
{
    public function __invoke(): Response
    {
        $user = Auth::user();

        $total = Recurrence::whereHas('task', fn ($q) => $q->where('user_id', $user->id))->count();
        $completed = Recurrence::whereHas('task', fn ($q) => $q->where('user_id', $user->id))
            ->whereNotNull('completed_at')
            ->count();

        $byCategory = Task::where('user_id', $user->id)
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category');

        return Inertia::render('App/Statistics', [
            'total' => $total,
            'completed' => $completed,
            'byCategory' => $byCategory,
        ]);
    }
}
