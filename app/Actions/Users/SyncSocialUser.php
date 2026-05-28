<?php

namespace App\Actions\Users;

use App\Models\User;
use \Laravel\Socialite\Contracts\User as SocialiteUser;

class SyncSocialUser
{
    /**
     * Sync the social user with the local database, creating or updating a user record as necessary.
     *
     * @param SocialiteUser $user
     * @return User
     */
    public function handle(SocialiteUser $socialUser): User
    {
        return User::updateOrCreate([
            'email' => $socialUser->email,
        ], [
            'provider_name' => 'github',
            'provider_id' => $socialUser->id,
            'name' => $socialUser->name,
            'avatar' => $socialUser->avatar,
        ]);
    }
}