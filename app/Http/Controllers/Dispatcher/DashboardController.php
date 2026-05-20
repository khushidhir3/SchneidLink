<?php

namespace App\Http\Controllers\Dispatcher;

use App\Http\Controllers\Controller;
use App\Models\Dispatch;
use App\Models\ServiceRequest;
use App\Models\Technician;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'pending_requests'      => ServiceRequest::where('status', 'pending')->count(),
            'available_technicians' => Technician::available()->count(),
            'in_progress'           => Dispatch::whereIn('status', ['accepted', 'en_route', 'arrived'])->count(),
            'completed_today'       => Dispatch::where('status', 'completed')
                                        ->whereDate('completed_at', today())->count(),
        ];

        $pendingRequests = ServiceRequest::where('status', 'pending')
            ->with('client')
            ->orderBy('created_at', 'asc')
            ->get()
            ->sortBy(function ($request) {
                return match ($request->priority) {
                    'urgent' => 0,
                    'high'   => 1,
                    'medium' => 2,
                    default  => 3,
                };
            })
            ->take(20)
            ->values();

        $availableTechnicians = Technician::available()
            ->with('user', 'skills')
            ->get();

        return Inertia::render('Dispatcher/Dashboard', [
            'stats'                 => $stats,
            'pendingRequests'       => $pendingRequests,
            'availableTechnicians'  => $availableTechnicians,
        ]);
    }
}
