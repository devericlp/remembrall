<?php

namespace App\Actions\Users;

use App\Models\User;

class CreateUser
{
    /**
     * Create a new user account.
     */
    public function handle(string $name, string $email, string $password): User
    {
        return User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ]);
    }
}
