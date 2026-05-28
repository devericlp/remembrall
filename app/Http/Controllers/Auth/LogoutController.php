<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Users\SyncSocialUser;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Socialite;

class LogoutController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        Auth::logout();
     
        request()->session()->invalidate();
    
        request()->session()->regenerateToken();

        return to_route('auth.login');
    }
}
