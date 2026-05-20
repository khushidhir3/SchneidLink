<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ServiceRequest extends Model
{
    protected $fillable = [
        'client_id',
        'title',
        'description',
        'category',
        'priority',
        'status',
        'location_lat',
        'location_lng',
        'location_address',
        'attachments',
        'requested_at',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'attachments'  => 'array',
            'location_lat' => 'float',
            'location_lng' => 'float',
            'requested_at' => 'datetime',
            'resolved_at'  => 'datetime',
        ];
    }

    // ── Relationships ───────────────────────────────────────

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function dispatch()
    {
        return $this->hasOne(Dispatch::class, 'request_id');
    }
}
