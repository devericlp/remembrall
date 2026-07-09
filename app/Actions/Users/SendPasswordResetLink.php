<?php

namespace App\Actions\Users;

use Illuminate\Support\Facades\Password;

class SendPasswordResetLink
{
    /**
     * Send a password reset link to the given email, if it belongs to a user.
     */
    public function handle(string $email): void
    {
        Password::sendResetLink(['email' => $email]);
    }
}
