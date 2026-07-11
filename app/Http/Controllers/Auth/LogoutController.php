<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

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
