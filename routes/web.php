<?php

use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\ProviderCallbackController;
use App\Http\Controllers\Auth\RedirectProviderController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Profile\SwitchLanguageController;
use App\Http\Controllers\Profile\ToggleNotificationController;
use App\Http\Controllers\Profile\ViewProfileController;
use App\Http\Controllers\Task\CreateTaskController;
use App\Http\Controllers\Task\DestroyTaskController;
use App\Http\Controllers\Task\ListOverdueController;
use App\Http\Controllers\Task\MarkAsCompletedTaskController;
use App\Http\Controllers\Task\MarkAsPendingTaskController;
use App\Http\Controllers\Task\ShowTaskController;
use App\Http\Controllers\Task\StoreTaskController;
use Illuminate\Support\Facades\Route;

// Authentication Routes...

Route::middleware('guest')->group(function () {
    Route::inertia('/', 'Auth/SplashScreen');
    Route::inertia('/login', 'Auth/Login')->name('auth.login');

    Route::get('/auth/{provider}/redirect', RedirectProviderController::class)->name('auth.provider.redirect');
    Route::get('/auth/{provider}/callback', ProviderCallbackController::class)->name('auth.provider.callback');
});

Route::middleware(['auth', 'web'])->group(function () {
    Route::post('/auth/logout', LogoutController::class)->name('auth.logout');

    Route::get('/home/{tab?}', HomeController::class)->name('home.index');

    Route::prefix('profile')->group(function () {
        Route::get('/', ViewProfileController::class)
            ->name('profile.index');
        Route::put('/language/update', SwitchLanguageController::class)
            ->name('profile.language.update');
        Route::put('/notifications/update', ToggleNotificationController::class)
            ->name('profile.notifications.update');

    });

    Route::prefix('tasks')->group(function () {
        Route::get('/create', CreateTaskController::class)->name('tasks.create');
        Route::get('/overdue', ListOverdueController::class)->name('tasks.overdue.index');
        Route::get('/{recurrence}', ShowTaskController::class)->name('tasks.show');
        Route::post('/', StoreTaskController::class)->name('tasks.store');
        Route::put('/{recurrence}/complete', MarkAsCompletedTaskController::class)->name('tasks.complete');
        Route::put('/{recurrence}/pending', MarkAsPendingTaskController::class)->name('tasks.pending');
        Route::delete('/{recurrence}', DestroyTaskController::class)->name('tasks.destroy');
    });
});
