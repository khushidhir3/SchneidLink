<?php
namespace App\Http\Controllers\Client;
use App\Http\Controllers\Controller;
use App\Models\Dispatch;
use App\Models\Rating;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
class RatingController extends Controller
{
    public function store(Request $request, $requestId)
    {
        $serviceRequest = ServiceRequest::with('dispatch')->findOrFail($requestId);
        if ($serviceRequest->client_id !== $request->user()->id) {
            abort(403);
        }
        if (!$serviceRequest->dispatch || $serviceRequest->dispatch->status !== 'completed') {
            return back()->with('error', 'Can only rate completed jobs.');
        }
        if ($serviceRequest->dispatch->rating) {
            return back()->with('error', 'You have already rated this job.');
        }
        $validated = $request->validate([
            'score'   => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);
        Rating::create([
            'dispatch_id'   => $serviceRequest->dispatch->id,
            'rated_by'      => $request->user()->id,
            'technician_id' => $serviceRequest->dispatch->technician_id,
            'score'         => $validated['score'],
            'comment'       => $validated['comment'] ?? null,
        ]);
        $serviceRequest->dispatch->technician->recalculateRating();
        return back()->with('success', 'Thank you for your feedback!');
    }
}
