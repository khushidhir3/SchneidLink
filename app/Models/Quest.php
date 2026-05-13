<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Quest extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'quests';

    protected $fillable = [
        'manager_id',
        'technician_id',
        'required_skill',
        'priority',
        'location',
        'status',
        'accepted_at',
        'completed_at',
    ];

    protected $casts = [
        'accepted_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function technician()
    {
        return $this->belongsTo(User::class, 'technician_id');
    }
}
