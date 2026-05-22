<?php
namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
class TechnicianLocation extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'technician_id',
        'lat',
        'lng',
        'accuracy_m',
        'recorded_at',
        'created_at',
    ];
    protected function casts(): array
    {
        return [
            'lat'         => 'float',
            'lng'         => 'float',
            'accuracy_m'  => 'float',
            'recorded_at' => 'datetime',
            'created_at'  => 'datetime',
        ];
    }
    public function technician()
    {
        return $this->belongsTo(Technician::class);
    }
}
