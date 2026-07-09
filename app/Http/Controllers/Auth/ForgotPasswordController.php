<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Users\SendPasswordResetLink;
use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use Illuminate\Http\RedirectResponse;

class ForgotPasswordController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(ForgotPasswordRequest $request): RedirectResponse
    {
        app(SendPasswordResetLink::class)->handle($request->string('email')->value());

        return back();
    }
}
