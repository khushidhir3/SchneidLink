<?php
namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
class Quest extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'quests';
    protected $guarded = [];
}
