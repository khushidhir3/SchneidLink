<?php

namespace App\Http\Controllers\Technician;

use App\Http\Controllers\Controller;
use App\Models\Dispatch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $technician = $user->technician;

        if (!$technician) {
            abort(403, 'Technician profile not found.');
        }

        // Active job (accepted/en_route/arrived)
        $activeDispatch = Dispatch::with('serviceRequest')
            ->where('technician_id', $technician->id)
            ->whereIn('status', ['accepted', 'en_route', 'arrived'])
            ->first();

        // Pending jobs (waiting for accept/reject)
        $pendingDispatches = Dispatch::with('serviceRequest')
            ->where('technician_id', $technician->id)
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        // Today's completed jobs count
        $todayCompleted = Dispatch::where('technician_id', $technician->id)
            ->where('status', 'completed')
            ->whereDate('completed_at', today())
            ->count();

        return Inertia::render('Technician/Dashboard', [
            'technician'        => $technician,
            'activeDispatch'    => $activeDispatch,
            'pendingDispatches' => $pendingDispatches,
            'todayCompleted'    => $todayCompleted,
        ]);
    }
}
