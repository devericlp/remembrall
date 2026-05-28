<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Socialite;
use Native\Mobile\Facades\Browser;

class RedirectProviderController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $provider)
    {
        $url = Socialite::driver($provider)->redirect()->getTargetUrl();

        Browser::auth($url);

        return back();

    }
}
