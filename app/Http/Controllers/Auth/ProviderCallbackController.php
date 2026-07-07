<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Users\SyncSocialUser;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class ProviderCallbackController extends Controller
{
    public function __invoke(string $provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (Throwable) {
            return redirect()->route('auth.login')
                ->with('error', __('messages.auth_provider_error'));
        }

        $user = app(SyncSocialUser::class)->handle($socialUser);

        Auth::login($user);

        return redirect('/home');
    }
}
