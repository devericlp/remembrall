<?php

namespace App\Actions\Users;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GetAuthUser
{
    /**
     * Get the authenticated user
     */
    public function handle(): ?array
    {
        return Auth::user()?->only('id',
            'name',
            'email',
            'avatar',
            'receive_notifications',
            'notify_overdue',
            'notify_due_soon'
        );
    }
}
