<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $stats = [
            'total'       => ServiceRequest::where('client_id', $user->id)->count(),
            'pending'     => ServiceRequest::where('client_id', $user->id)->where('status', 'pending')->count(),
            'in_progress' => ServiceRequest::where('client_id', $user->id)->whereIn('status', ['assigned', 'in_progress'])->count(),
            'completed'   => ServiceRequest::where('client_id', $user->id)->where('status', 'completed')->count(),
        ];

        $recentRequests = ServiceRequest::where('client_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Client/Dashboard', [
            'stats'          => $stats,
            'recentRequests' => $recentRequests,
        ]);
    }
}
