<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Users\AuthenticateUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(LoginRequest $request): RedirectResponse
    {
        $user = app(AuthenticateUser::class)->handle(
            $request->string('email')->value(),
            $request->string('password')->value(),
        );

        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        return redirect('/home');
    }
}
