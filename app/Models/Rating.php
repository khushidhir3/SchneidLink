<?php
namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
class Rating extends Model
{
    protected $fillable = [
        'dispatch_id',
        'rated_by',
        'technician_id',
        'score',
        'comment',
    ];
    protected function casts(): array
    {
        return [
            'score' => 'integer',
        ];
    }
    public function dispatch()
    {
        return $this->belongsTo(Dispatch::class);
    }
    public function rater()
    {
        return $this->belongsTo(User::class, 'rated_by');
    }
    public function technician()
    {
        return $this->belongsTo(Technician::class);
    }
}
