<?php

namespace App\Http\Controllers\Dispatcher;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use App\Models\Technician;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index()
    {
        $technicians = Technician::with('user')
            ->whereNotNull('current_lat')
            ->whereNotNull('current_lng')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id, 'name' => $t->user->name,
                'lat' => $t->current_lat, 'lng' => $t->current_lng,
                'status' => $t->availability_status, 'rating' => $t->rating_avg,
            ]);

        $pendingRequests = ServiceRequest::where('status', 'pending')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id, 'title' => $r->title,
                'lat' => $r->location_lat, 'lng' => $r->location_lng,
                'priority' => $r->priority, 'category' => $r->category,
            ]);

        return Inertia::render('Dispatcher/Map', [
            'technicians' => $technicians,
            'pendingRequests' => $pendingRequests,
        ]);
    }
}
