<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('MapDashboard');
})->name('dashboard');

// Quest Routes
Route::post('/quests', [\App\Http\Controllers\QuestController::class, 'store'])->name('quests.store');
Route::post('/quests/{id}/accept', [\App\Http\Controllers\QuestController::class, 'accept'])->name('quests.accept');
Route::post('/quests/{id}/complete', [\App\Http\Controllers\QuestController::class, 'complete'])->name('quests.complete');

require __DIR__.'/auth.php';
