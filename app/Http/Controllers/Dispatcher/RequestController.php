<?php
namespace App\Http\Controllers\Dispatcher;
use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
class RequestController extends Controller
{
    public function index(Request $request)
    {
        $query = ServiceRequest::with('client', 'dispatch.technician.user');
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        $requests = $query->orderBy('created_at', 'desc')->paginate(20);
        return Inertia::render('Dispatcher/Requests/Index', [
            'requests' => $requests,
            'filters'  => $request->only(['status', 'priority', 'category']),
        ]);
    }
    public function show($id)
    {
        $serviceRequest = ServiceRequest::with('client', 'dispatch.technician.user', 'dispatch.rating')
            ->findOrFail($id);
        return Inertia::render('Dispatcher/Requests/Show', [
            'serviceRequest' => $serviceRequest,
        ]);
    }
}
