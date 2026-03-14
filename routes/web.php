<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'SplashScreen')->name('splash.screen');
Route::inertia('/login', 'Login/Index')->name('login');