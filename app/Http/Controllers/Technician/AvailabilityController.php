<?php
namespace App\Http\Controllers\Technician;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
class AvailabilityController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|in:available,offline',
        ]);
        $technician = $request->user()->technician;
        if (!$technician) {
            abort(403, 'Technician profile not found.');
        }
        if ($technician->availability_status === 'on_job' && $validated['status'] === 'offline') {
            return back()->with('error', 'Cannot go offline while on a job.');
        }
        $technician->update([
            'availability_status' => $validated['status'],
        ]);
        return back()->with('success', 'Availability updated.');
    }
}
