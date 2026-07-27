<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Users\SyncSocialUser;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class ProviderCallbackController extends Controller
{
    public function __invoke(string $provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
            $user = app(SyncSocialUser::class)->handle($socialUser, $provider);
        } catch (Throwable) {
            Inertia::flash('error', __('messages.auth_provider_error'));

            return redirect()->route('auth.login');
        }

        Auth::login($user, true);

        return redirect('/home');
    }
}
