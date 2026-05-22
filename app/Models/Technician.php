<?php
namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
class Technician extends Model
{
    protected $fillable = [
        'user_id',
        'employee_code',
        'availability_status',
        'current_lat',
        'current_lng',
        'last_location_at',
        'rating_avg',
        'total_jobs',
    ];
    protected function casts(): array
    {
        return [
            'current_lat'      => 'float',
            'current_lng'      => 'float',
            'rating_avg'       => 'float',
            'total_jobs'       => 'integer',
            'last_location_at' => 'datetime',
        ];
    }
    public function scopeAvailable($query)
    {
        return $query->where('availability_status', 'available');
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'technician_skills')
                    ->withPivot('experience_years', 'proficiency')
                    ->withTimestamps();
    }
    public function dispatches()
    {
        return $this->hasMany(Dispatch::class);
    }
    public function locations()
    {
        return $this->hasMany(TechnicianLocation::class);
    }
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
    public function recalculateRating(): void
    {
        $avg = $this->ratings()->avg('score') ?? 0;
        $this->update(['rating_avg' => round($avg, 2)]);
    }
}
