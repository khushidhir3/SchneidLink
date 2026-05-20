<?php

namespace App\Http\Controllers;

use App\Models\Quest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestController extends Controller
{
    public function index()
    {
        return Inertia::render('MapDashboard');
    }

    public function store(Request $request)
    {
        $quest = Quest::create([
            'required_skill' => $request->input('required_skill', 'Software'),
            'priority'       => $request->input('priority', 'high'),
            'location'       => $request->input('location'),
            'status'         => 'pending',
        ]);

        return response()->json([
            'message' => 'created successfully',
            'quest'   => $quest
        ]);
    }

    public function accept($id)
    {
        $quest = Quest::findOrFail($id);
        $quest->status = 'accepted';
        $quest->save();

        return response()->json([
            'message' => 'updated',
            'quest'   => $quest
        ]);
    }
}
