<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;

Route::middleware('auth')->group(function () {
    Route::resource('posts', PostController::class);
});
