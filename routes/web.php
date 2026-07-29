<?php

use App\Http\Controllers\Achievement\ListAchievementsController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\ProviderCallbackController;
use App\Http\Controllers\Auth\RedirectProviderController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrbController;
use App\Http\Controllers\Profile\EditProfileController;
use App\Http\Controllers\Profile\PushNotificationStatusController;
use App\Http\Controllers\Profile\StatisticsController;
use App\Http\Controllers\Profile\SwitchLanguageController;
use App\Http\Controllers\Profile\ToggleNotificationController;
use App\Http\Controllers\Profile\UpdateProfileController;
use App\Http\Controllers\Profile\ViewProfileController;
use App\Http\Controllers\Task\CreateTaskController;
use App\Http\Controllers\Task\DestroyChecklistItemController;
use App\Http\Controllers\Task\DestroyEntireTaskController;
use App\Http\Controllers\Task\DestroyRecurrenceController;
use App\Http\Controllers\Task\ListOverdueController;
use App\Http\Controllers\Task\MarkAsCompletedTaskController;
use App\Http\Controllers\Task\MarkAsPendingTaskController;
use App\Http\Controllers\Task\ReorderChecklistItemsController;
use App\Http\Controllers\Task\ShowTaskController;
use App\Http\Controllers\Task\StoreChecklistItemController;
use App\Http\Controllers\Task\StoreTaskController;
use App\Http\Controllers\Task\ToggleChecklistItemController;
use App\Http\Controllers\Task\UpdateOccurrenceTimeController;
use Illuminate\Support\Facades\Route;

Route::get('/service-worker.js', function () {
    return response()->file(public_path('build/service-worker.js'), [
        'Content-Type' => 'application/javascript',
        'Service-Worker-Allowed' => '/',
        'Cache-Control' => 'no-cache',
    ]);
});

Route::inertia('/', 'Auth/SplashScreen');
Route::put('/language/update', SwitchLanguageController::class)->name('language.update');

Route::middleware('guest')->group(function () {
    Route::inertia('/login', 'Auth/Login')->name('auth.login');
    Route::post('/login', LoginController::class)->middleware('throttle:10,1')->name('auth.login.store');
    Route::inertia('/onboarding', 'Auth/Onboarding')->name('auth.onboarding');

    Route::inertia('/register', 'Auth/Register')->name('auth.register');
    Route::post('/register', RegisterController::class)->middleware('throttle:10,1')->name('auth.register.store');

    Route::inertia('/forgot-password', 'Auth/ForgotPassword')->name('auth.forgot-password');
    Route::post('/forgot-password', ForgotPasswordController::class)->middleware('throttle:5,1')->name('auth.forgot-password.store');
    Route::get('/reset-password/{token}', fn () => redirect()->route('auth.login'))->name('password.reset');

    Route::get('/auth/{provider}/redirect', RedirectProviderController::class)->middleware('throttle:10,1')->name('auth.provider.redirect');
    Route::get('/auth/{provider}/callback', ProviderCallbackController::class)->middleware('throttle:10,1')->name('auth.provider.callback');
});

Route::middleware(['auth', 'web'])->group(function () {
    Route::post('/auth/logout', LogoutController::class)->name('auth.logout');

    Route::get('/home/{tab?}', HomeController::class)->name('home.index');
    Route::get('/orb', OrbController::class)->name('orb.index');
    Route::get('/achievements/{tab?}', ListAchievementsController::class)->name('achievements.index');

    Route::prefix('profile')->group(function () {
        Route::get('/', ViewProfileController::class)
            ->name('profile.index');
        Route::get('/edit', EditProfileController::class)
            ->name('profile.edit');
        Route::put('/update', UpdateProfileController::class)
            ->name('profile.update');
        Route::put('/language/update', SwitchLanguageController::class)
            ->name('profile.language.update');
        Route::put('/notifications/update', ToggleNotificationController::class)
            ->name('profile.notifications.update');
        Route::get('/notifications/status', PushNotificationStatusController::class)
            ->name('profile.notifications.status');
        Route::get('/statistics', StatisticsController::class)
            ->name('profile.statistics');
    });

    Route::prefix('tasks')->group(function () {
        Route::get('/create', CreateTaskController::class)->name('tasks.create');
        Route::get('/overdue', ListOverdueController::class)->name('tasks.overdue.index');
        Route::get('/{recurrence}', ShowTaskController::class)->name('tasks.show');
        Route::post('/', StoreTaskController::class)->name('tasks.store');
        Route::put('/{recurrence}/complete', MarkAsCompletedTaskController::class)->name('tasks.complete');
        Route::put('/{recurrence}/pending', MarkAsPendingTaskController::class)->name('tasks.pending');
        Route::put('/{recurrence}/time', UpdateOccurrenceTimeController::class)->name('tasks.time.update');
        Route::post('/{recurrence}/checklist', StoreChecklistItemController::class)->name('tasks.checklist.store');
        Route::put('/{recurrence}/checklist/reorder', ReorderChecklistItemsController::class)->name('tasks.checklist.reorder');
        Route::put('/checklist/{checklistItem}/toggle', ToggleChecklistItemController::class)->name('tasks.checklist.toggle');
        Route::delete('/checklist/{checklistItem}', DestroyChecklistItemController::class)->name('tasks.checklist.destroy');
        Route::delete('/{recurrence}', DestroyRecurrenceController::class)->name('tasks.destroy');
        Route::delete('/{recurrence}/task', DestroyEntireTaskController::class)->name('tasks.destroy.all');
    });
});
