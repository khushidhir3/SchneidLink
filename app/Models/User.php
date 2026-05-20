<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ── Role Helpers ────────────────────────────────────────

    public function isClient(): bool
    {
        return $this->role === 'client';
    }

    public function isTechnician(): bool
    {
        return $this->role === 'technician';
    }

    public function isDispatcher(): bool
    {
        return $this->role === 'dispatcher';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Get the dashboard route for this user's role.
     */
    public function dashboardRoute(): string
    {
        return match ($this->role) {
            'technician' => '/technician/dashboard',
            'dispatcher' => '/dispatcher/dashboard',
            'admin'      => '/admin/dashboard',
            default      => '/dashboard',
        };
    }

    // ── Relationships ───────────────────────────────────────

    public function technician()
    {
        return $this->hasOne(Technician::class);
    }

    public function serviceRequests()
    {
        return $this->hasMany(ServiceRequest::class, 'client_id');
    }

    public function dispatchesAsDispatcher()
    {
        return $this->hasMany(Dispatch::class, 'dispatcher_id');
    }

    public function customNotifications()
    {
        return $this->hasMany(Notification::class);
    }
}
