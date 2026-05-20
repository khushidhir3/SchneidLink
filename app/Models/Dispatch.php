<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Dispatch extends Model
{
    protected $table = 'dispatches';

    protected $fillable = [
        'request_id',
        'technician_id',
        'dispatcher_id',
        'status',
        'assigned_at',
        'accepted_at',
        'en_route_at',
        'arrived_at',
        'completed_at',
        'distance_km',
        'technician_notes',
    ];

    protected function casts(): array
    {
        return [
            'assigned_at'  => 'datetime',
            'accepted_at'  => 'datetime',
            'en_route_at'  => 'datetime',
            'arrived_at'   => 'datetime',
            'completed_at' => 'datetime',
            'distance_km'  => 'float',
        ];
    }

    // ── Relationships ───────────────────────────────────────

    public function serviceRequest()
    {
        return $this->belongsTo(ServiceRequest::class, 'request_id');
    }

    public function technician()
    {
        return $this->belongsTo(Technician::class);
    }

    public function dispatcher()
    {
        return $this->belongsTo(User::class, 'dispatcher_id');
    }

    public function rating()
    {
        return $this->hasOne(Rating::class);
    }
}
