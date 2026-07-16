<?php
namespace App\Models;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
class User extends Authenticatable
{
    use HasFactory, Notifiable;
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'user_code',
    ];
    /**
     * Generate a unique, role-prefixed user code.
     */
    public static function generateUserCode(string $role): string
    {
        $prefix = match ($role) {
            'admin'      => 'ADM-',
            'client'     => 'CLT-',
            'dispatcher' => 'DSP-',
            'technician' => 'TECH-',
            default      => 'USR-',
        };
        do {
            $code = $prefix . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));
        } while (self::where('user_code', $code)->exists());
        return $code;
    }
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
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
    public function dashboardRoute(): string
    {
        return match ($this->role) {
            'technician' => '/technician/dashboard',
            'dispatcher' => '/dispatcher/dashboard',
            'admin'      => '/admin/dashboard',
            default      => '/dashboard',
        };
    }
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
