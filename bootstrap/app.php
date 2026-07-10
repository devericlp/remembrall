<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\MeasureRequestTime;
use App\Http\Middleware\SetLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');
        $middleware->redirectGuestsTo('/login');
        $middleware->redirectUsersTo('/home');
        $middleware->web(append: [
            MeasureRequestTime::class,
            SetLocale::class, // This middleware must be registered before HandleInertiaRequests to ensure the locale is set before rendering any views.
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
