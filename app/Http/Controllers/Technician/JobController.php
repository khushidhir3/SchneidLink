<?php
namespace App\Http\Controllers\Technician;
use App\Events\DispatchStatusUpdated;
use App\Http\Controllers\Controller;
use App\Models\Dispatch;
use App\Services\DispatchService;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
class JobController extends Controller
{
    public function __construct(
        protected DispatchService $dispatchService,
        protected NotificationService $notificationService
    ) {}
    public function index(Request $request)
    {
        $technician = $request->user()->technician;
        $dispatches = Dispatch::with('serviceRequest')
            ->where('technician_id', $technician->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        return Inertia::render('Technician/Jobs/Index', [
            'dispatches' => $dispatches,
        ]);
    }
    public function show(Request $request, $id)
    {
        $technician = $request->user()->technician;
        $dispatch = Dispatch::with('serviceRequest.client', 'rating')
            ->where('technician_id', $technician->id)
            ->findOrFail($id);
        return Inertia::render('Technician/Jobs/Show', [
            'dispatch' => $dispatch,
        ]);
    }
    public function accept(Request $request, $id)
    {
        $technician = $request->user()->technician;
        $dispatch = Dispatch::where('technician_id', $technician->id)->findOrFail($id);
        if ($dispatch->status !== 'pending') {
            return back()->with('error', 'This job cannot be accepted.');
        }
        $dispatch->update([
            'status'      => 'accepted',
            'accepted_at' => Carbon::now(),
        ]);
        $dispatch->serviceRequest->update(['status' => 'in_progress']);
        event(new DispatchStatusUpdated($dispatch));
        $this->notificationService->notify(
            $dispatch->serviceRequest->client,
            'dispatch_accepted',
            'A technician has accepted your service request.',
            ['request_id' => $dispatch->request_id]
        );
        return back()->with('success', 'Job accepted!');
    }
    public function reject(Request $request, $id)
    {
        $technician = $request->user()->technician;
        $dispatch = Dispatch::where('technician_id', $technician->id)->findOrFail($id);
        if ($dispatch->status !== 'pending') {
            return back()->with('error', 'This job cannot be rejected.');
        }
        $dispatch->update(['status' => 'rejected']);
        $technician->update(['availability_status' => 'available']);
        $dispatch->serviceRequest->update(['status' => 'pending']);
        return back()->with('success', 'Job rejected.');
    }
    public function updateStatus(Request $request, $id)
    {
        $technician = $request->user()->technician;
        $dispatch = Dispatch::with('serviceRequest')->where('technician_id', $technician->id)->findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:en_route,arrived,completed',
            'notes'  => 'nullable|string|max:2000',
        ]);
        $newStatus = $validated['status'];
        $now = Carbon::now();
        $validTransitions = [
            'accepted'  => ['en_route'],
            'en_route'  => ['arrived'],
            'arrived'   => ['completed'],
        ];
        if (!isset($validTransitions[$dispatch->status]) ||
            !in_array($newStatus, $validTransitions[$dispatch->status])) {
            return back()->with('error', 'Invalid status transition.');
        }
        $updateData = ['status' => $newStatus];
        if ($newStatus === 'en_route') {
            $updateData['en_route_at'] = $now;
        } elseif ($newStatus === 'arrived') {
            $updateData['arrived_at'] = $now;
        } elseif ($newStatus === 'completed') {
            $updateData['completed_at'] = $now;
            if ($validated['notes'] ?? null) {
                $updateData['technician_notes'] = $validated['notes'];
            }
        }
        $dispatch->update($updateData);
        if ($newStatus === 'completed') {
            $this->dispatchService->completeJob($dispatch->fresh());
        } else {
            event(new DispatchStatusUpdated($dispatch));
            $statusMessages = [
                'en_route' => 'Your technician is en route!',
                'arrived'  => 'Your technician has arrived at the location.',
            ];
            $this->notificationService->notify(
                $dispatch->serviceRequest->client,
                "dispatch_{$newStatus}",
                $statusMessages[$newStatus] ?? "Status updated to {$newStatus}",
                ['request_id' => $dispatch->request_id]
            );
        }
        return back()->with('success', 'Status updated.');
    }
}
