<?php
namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
class Skill extends Model
{
    protected $fillable = [
        'name',
        'category',
    ];
    public function technicians()
    {
        return $this->belongsToMany(Technician::class, 'technician_skills')
                    ->withPivot('experience_years', 'proficiency')
                    ->withTimestamps();
    }
}
