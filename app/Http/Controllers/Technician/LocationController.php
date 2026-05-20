<?php

namespace App\Http\Controllers\Technician;

use App\Events\TechnicianLocationUpdated;
use App\Http\Controllers\Controller;
use App\Models\Dispatch;
use App\Models\TechnicianLocation;
use Carbon\Carbon;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'lat'        => 'required|numeric',
            'lng'        => 'required|numeric',
            'accuracy_m' => 'nullable|numeric',
        ]);

        $technician = $request->user()->technician;

        if (!$technician) {
            abort(403, 'Technician profile not found.');
        }

        $now = Carbon::now();

        // Update current position on technician record
        $technician->update([
            'current_lat'      => $validated['lat'],
            'current_lng'      => $validated['lng'],
            'last_location_at' => $now,
        ]);

        // Append to location history
        TechnicianLocation::create([
            'technician_id' => $technician->id,
            'lat'           => $validated['lat'],
            'lng'           => $validated['lng'],
            'accuracy_m'    => $validated['accuracy_m'] ?? null,
            'recorded_at'   => $now,
            'created_at'    => $now,
        ]);

        // Broadcast to active request channels (en_route or arrived)
        $activeDispatch = Dispatch::where('technician_id', $technician->id)
            ->whereIn('status', ['en_route', 'arrived'])
            ->first();

        if ($activeDispatch) {
            event(new TechnicianLocationUpdated($technician, $activeDispatch->request_id));
        }

        return response()->json(['message' => 'Location updated']);
    }
}
