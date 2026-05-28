<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Users\SyncSocialUser;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Socialite;

class ProviderCallbackController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $provider)
    {
        $user = Socialite::driver($provider)->user();

        $user = app(SyncSocialUser::class)->handle($user);

        Auth::login($user);

        return redirect('/home');
    }
}
