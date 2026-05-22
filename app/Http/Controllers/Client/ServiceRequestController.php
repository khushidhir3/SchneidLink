<?php
namespace App\Http\Controllers\Client;
use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
class ServiceRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = ServiceRequest::where('client_id', $request->user()->id);
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        $requests = $query->orderBy('created_at', 'desc')->paginate(15);
        return Inertia::render('Client/Requests/Index', [
            'requests' => $requests,
            'filters'  => $request->only(['status', 'priority']),
        ]);
    }
    public function create()
    {
        return Inertia::render('Client/Requests/Create');
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'required|string',
            'category'         => 'required|in:electrical,hvac,plc,transformer,inspection,networking,other',
            'priority'         => 'required|in:low,medium,high,urgent',
            'location_lat'     => 'required|numeric',
            'location_lng'     => 'required|numeric',
            'location_address' => 'required|string|max:500',
            'attachments'      => 'nullable|array',
            'attachments.*'    => 'file|max:10240',
        ]);
        $attachmentPaths = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $attachmentPaths[] = $file->store('attachments', 'public');
            }
        }
        ServiceRequest::create([
            'client_id'        => $request->user()->id,
            'title'            => $validated['title'],
            'description'      => $validated['description'],
            'category'         => $validated['category'],
            'priority'         => $validated['priority'],
            'location_lat'     => $validated['location_lat'],
            'location_lng'     => $validated['location_lng'],
            'location_address' => $validated['location_address'],
            'attachments'      => $attachmentPaths ?: null,
            'status'           => 'pending',
            'requested_at'     => now(),
        ]);
        return redirect()->route('client.requests.index')
            ->with('success', 'Service request created successfully.');
    }
    public function show(Request $request, $id)
    {
        $serviceRequest = ServiceRequest::with('dispatch.technician.user', 'dispatch.rating')
            ->findOrFail($id);
        if ($serviceRequest->client_id !== $request->user()->id) {
            abort(403);
        }
        return Inertia::render('Client/Requests/Show', [
            'serviceRequest' => $serviceRequest,
        ]);
    }
    public function cancel(Request $request, $id)
    {
        $serviceRequest = ServiceRequest::findOrFail($id);
        if ($serviceRequest->client_id !== $request->user()->id) {
            abort(403);
        }
        if ($serviceRequest->status !== 'pending') {
            return back()->with('error', 'Only pending requests can be cancelled.');
        }
        $serviceRequest->update(['status' => 'cancelled']);
        return back()->with('success', 'Request cancelled.');
    }
    public function track(Request $request, $id)
    {
        $serviceRequest = ServiceRequest::with('dispatch.technician.user')
            ->findOrFail($id);
        if ($serviceRequest->client_id !== $request->user()->id) {
            abort(403);
        }
        return Inertia::render('Client/Requests/Track', [
            'serviceRequest' => $serviceRequest,
        ]);
    }
}
