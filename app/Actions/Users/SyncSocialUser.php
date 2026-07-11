<?php

namespace App\Actions\Users;

use App\Models\User;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use RuntimeException;

class SyncSocialUser
{
    /**
     * Sync the social user with the local database, creating or updating a user record as necessary.
     *
     * Only a new user or a user already tied to this same provider may be synced;
     * an existing account registered with a different provider (or with a password) is left untouched.
     *
     * @param  SocialiteUser  $user
     */
    public function handle(SocialiteUser $socialUser, string $provider): User
    {
        $existingUser = User::query()->where('email', $socialUser->email)->first();

        if ($existingUser && $existingUser->provider_name !== $provider) {
            throw new RuntimeException("User [{$socialUser->email}] is not registered with provider [{$provider}].");
        }

        return User::updateOrCreate([
            'email' => $socialUser->email,
        ], [
            'provider_name' => $provider,
            'provider_id' => $socialUser->id,
            'name' => $socialUser->name,
            'avatar' => $socialUser->avatar,
        ]);
    }
}
