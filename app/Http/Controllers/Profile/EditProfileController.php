<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class EditProfileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        return Inertia::render('App/EditProfile');
    }
}
