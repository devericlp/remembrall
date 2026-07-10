<?php

namespace App\Http\Controllers\Profile;

use App\Actions\Users\UpdateProfile;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class UpdateProfileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(UpdateProfileRequest $request): RedirectResponse
    {
        app(UpdateProfile::class)->handle(
            $request->string('name')->value(),
            $request->string('email')->value(),
            $request->file('avatar'),
            $request->string('new_password')->value() ?: null,
        );

        Inertia::flash([
            'message' => __('messages.profile_updated_successfully'),
            'type' => 'success',
        ]);

        return back();
    }
}
