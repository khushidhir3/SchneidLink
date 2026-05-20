<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications_custom';

    protected $fillable = [
        'user_id',
        'type',
        'message',
        'data',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'data'    => 'array',
            'is_read' => 'boolean',
        ];
    }

    // ── Relationships ───────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
