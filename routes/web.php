<?php
use App\Http\Controllers\Client;
use App\Http\Controllers\Technician;
use App\Http\Controllers\Dispatcher;
use App\Http\Controllers\Admin;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'    => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});
Route::get('/map-dashboard', [\App\Http\Controllers\QuestController::class, 'index'])->name('map.dashboard');
Route::post('/quests', [\App\Http\Controllers\QuestController::class, 'store']);
Route::post('/quests/{quest}/accept', [\App\Http\Controllers\QuestController::class, 'accept']);
Route::middleware(['auth', 'role:client'])->group(function () {
    Route::get('/dashboard', [Client\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/requests', [Client\ServiceRequestController::class, 'index'])->name('client.requests.index');
    Route::get('/requests/create', [Client\ServiceRequestController::class, 'create'])->name('client.requests.create');
    Route::post('/requests', [Client\ServiceRequestController::class, 'store'])->name('client.requests.store');
    Route::get('/requests/{request}', [Client\ServiceRequestController::class, 'show'])->name('client.requests.show');
    Route::put('/requests/{request}/cancel', [Client\ServiceRequestController::class, 'cancel'])->name('client.requests.cancel');
    Route::get('/requests/{request}/track', [Client\ServiceRequestController::class, 'track'])->name('client.requests.track');
    Route::post('/requests/{request}/rate', [Client\RatingController::class, 'store'])->name('client.requests.rate');
});
Route::middleware(['auth', 'role:technician'])->prefix('technician')->group(function () {
    Route::get('/dashboard', [Technician\DashboardController::class, 'index'])->name('technician.dashboard');
    Route::get('/jobs', [Technician\JobController::class, 'index'])->name('technician.jobs.index');
    Route::get('/jobs/{dispatch}', [Technician\JobController::class, 'show'])->name('technician.jobs.show');
    Route::put('/jobs/{dispatch}/accept', [Technician\JobController::class, 'accept'])->name('technician.jobs.accept');
    Route::put('/jobs/{dispatch}/reject', [Technician\JobController::class, 'reject'])->name('technician.jobs.reject');
    Route::put('/jobs/{dispatch}/status', [Technician\JobController::class, 'updateStatus'])->name('technician.jobs.status');
    Route::post('/location', [Technician\LocationController::class, 'update'])->name('technician.location.update');
    Route::put('/availability', [Technician\AvailabilityController::class, 'update'])->name('technician.availability.update');
});
Route::middleware(['auth', 'role:dispatcher,admin'])->prefix('dispatcher')->group(function () {
    Route::get('/dashboard', [Dispatcher\DashboardController::class, 'index'])->name('dispatcher.dashboard');
    Route::get('/requests', [Dispatcher\RequestController::class, 'index'])->name('dispatcher.requests.index');
    Route::get('/requests/{request}', [Dispatcher\RequestController::class, 'show'])->name('dispatcher.requests.show');
    Route::post('/requests/{request}/assign', [Dispatcher\DispatchController::class, 'store'])->name('dispatcher.requests.assign');
    Route::put('/dispatches/{dispatch}/reassign', [Dispatcher\DispatchController::class, 'reassign'])->name('dispatcher.dispatches.reassign');
    Route::get('/technicians', [Dispatcher\TechnicianController::class, 'index'])->name('dispatcher.technicians.index');
    Route::get('/map', [Dispatcher\MapController::class, 'index'])->name('dispatcher.map');
});
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/users', [Admin\UserController::class, 'index'])->name('admin.users.index');
    Route::post('/users', [Admin\UserController::class, 'store'])->name('admin.users.store');
    Route::put('/users/{user}', [Admin\UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/users/{user}', [Admin\UserController::class, 'destroy'])->name('admin.users.destroy');
    Route::get('/technicians', [Admin\TechnicianController::class, 'index'])->name('admin.technicians.index');
    Route::post('/technicians', [Admin\TechnicianController::class, 'store'])->name('admin.technicians.store');
    Route::get('/analytics', [Admin\AnalyticsController::class, 'index'])->name('admin.analytics');
});
Route::middleware('auth')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.readAll');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
require __DIR__.'/auth.php';
