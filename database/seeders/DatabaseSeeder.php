<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Facility Manager',
            'email' => 'manager@example.com',
            'password' => bcrypt('password'),
            'role' => 'manager',
            'location' => [
                'type' => 'Point',
                'coordinates' => [77.2090, 28.6139], // Delhi
            ]
        ]);

        User::create([
            'name' => 'Technician Bob',
            'email' => 'tech@example.com',
            'password' => bcrypt('password'),
            'role' => 'technician',
            'skills' => ['Software', 'Electrical'],
            'location' => [
                'type' => 'Point',
                'coordinates' => [77.2100, 28.6140], // Close to manager
            ]
        ]);

        // Create the 2dsphere index for location queries
        User::raw(function($collection) {
            return $collection->createIndex(['location' => '2dsphere']);
        });
    }
}
