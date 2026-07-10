<?php

namespace App\Actions\Users;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UpdateProfile
{
    /**
     * Update the authenticated user's profile.
     */
    public function handle(string $name, string $email, ?UploadedFile $avatar, ?string $newPassword): void
    {
        $user = Auth::user();

        $data = ['name' => $name];

        if (! $user->provider_id) {
            $data['email'] = $email;
        }

        if ($avatar) {
            $data['avatar'] = Storage::disk('public')->url($avatar->store('avatars', 'public'));
        }

        if ($newPassword) {
            $data['password'] = $newPassword;
        }

        $user->update($data);
    }
}
