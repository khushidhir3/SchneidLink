<?php
namespace App\Http\Controllers\Dispatcher;
use App\Http\Controllers\Controller;
use App\Models\Dispatch;
use App\Models\ServiceRequest;
use App\Models\Technician;
use App\Services\DispatchService;
use Illuminate\Http\Request;
class DispatchController extends Controller
{
    public function __construct(
        protected DispatchService $dispatchService
    ) {}
    public function store(Request $request, $requestId)
    {
        $validated = $request->validate([
            'technician_id' => 'required|exists:technicians,id',
        ]);
        $serviceRequest = ServiceRequest::findOrFail($requestId);
        if ($serviceRequest->status !== 'pending') {
            return back()->with('error', 'This request has already been assigned.');
        }
        $technician = Technician::findOrFail($validated['technician_id']);
        $dispatch = $this->dispatchService->assignTechnician(
            $serviceRequest,
            $technician,
            $request->user()
        );
        return back()->with('success', 'Technician assigned successfully.');
    }
    public function reassign(Request $request, $dispatchId)
    {
        $validated = $request->validate([
            'technician_id' => 'required|exists:technicians,id',
        ]);
        $dispatch = Dispatch::findOrFail($dispatchId);
        $oldTechnician = $dispatch->technician;
        $oldTechnician->update(['availability_status' => 'available']);
        $newTechnician = Technician::findOrFail($validated['technician_id']);
        $newTechnician->update(['availability_status' => 'on_job']);
        $dispatch->update([
            'technician_id' => $newTechnician->id,
            'status'        => 'pending',
            'accepted_at'   => null,
            'en_route_at'   => null,
            'arrived_at'    => null,
        ]);
        return back()->with('success', 'Technician reassigned.');
    }
}
