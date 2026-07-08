<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ViewProfileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        return Inertia::render('App/Profile', [
            'languages' => [
                ['key' => 'en', 'title' => __('messages.english')],
                ['key' => 'pt_BR', 'title' => __('messages.portuguese')],
            ],
            'systemTime' => Carbon::now()->toIso8601String(),
        ]);
    }
}
