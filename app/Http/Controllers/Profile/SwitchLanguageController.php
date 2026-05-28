<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SwitchLanguageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        $language = request()->input('language');

        session(['locale' => $language]);

        app()->setLocale($language);

        Inertia::flash('message', __('messages.language_updated_successfully'));

        return back();
    }
}
