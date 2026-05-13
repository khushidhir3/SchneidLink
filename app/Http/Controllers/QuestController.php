<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quest;
use App\Models\User;
use App\Events\QuestCreated;
use App\Events\QuestAccepted;

class QuestController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'required_skill' => 'required|string',
            'priority' => 'required|string|in:low,medium,high,critical',
            'location' => 'required|array',
            'location.coordinates' => 'required|array',
        ]);

        // MOCK: Generate a fake quest object
        $quest = new Quest([
            'manager_id' => 1,
            'required_skill' => $validated['required_skill'],
            'priority' => $validated['priority'],
            'location' => [
                'type' => 'Point',
                'coordinates' => $validated['location']['coordinates'],
            ],
            'status' => 'pending',
        ]);
        $quest->_id = uniqid(); // Mock ID for React key

        // MOCK: Generate fake technicians
        $nearbyTechnicians = collect([
            new User([
                'id' => 2,
                'name' => 'Technician Bob',
                'role' => 'technician',
                'skills' => [$validated['required_skill']],
                'location' => [
                    'type' => 'Point',
                    'coordinates' => [77.2100, 28.6140],
                ]
            ])
        ]);

        broadcast(new QuestCreated($quest, $nearbyTechnicians));

        return response()->json([
            'message' => 'Quest dispatched successfully! (MOCKED)',
            'quest' => $quest,
            'notified_technicians' => $nearbyTechnicians->count(),
        ]);
    }

    public function accept(Request $request, $id)
    {
        // MOCK: Generate fake quest and technician
        $quest = new Quest([
            'status' => 'accepted',
            'technician_id' => 2,
        ]);
        $quest->_id = $id;

        $technician = new User([
            'id' => 2,
            'name' => 'Technician Bob',
            'role' => 'technician'
        ]);

        broadcast(new QuestAccepted($quest, $technician));

        return response()->json([
            'message' => 'Quest accepted! (MOCKED)',
            'quest' => $quest,
        ]);
    }

    public function complete(Request $request, $id)
    {
        return response()->json([
            'message' => 'Quest completed! Achievement logic executed. (MOCKED)',
        ]);
    }
}
