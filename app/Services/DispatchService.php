<?php

namespace App\Services;

use App\Events\DispatchCreated;
use App\Events\DispatchStatusUpdated;
use App\Models\Dispatch;
use App\Models\ServiceRequest;
use App\Models\Technician;
use App\Models\User;
use Carbon\Carbon;

class DispatchService
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Find the best available technician for a service request.
     *
     * Logic: available technicians with matching skill category,
     * sorted by distance (Haversine) then by rating desc.
     */
    public function findBestTechnician(ServiceRequest $request): ?Technician
    {
        $lat = $request->location_lat;
        $lng = $request->location_lng;
        $category = $request->category;

        // Get available technicians with matching skills
        $technicians = Technician::available()
            ->whereHas('skills', function ($query) use ($category) {
                $query->where('category', $category);
            })
            ->whereNotNull('current_lat')
            ->whereNotNull('current_lng')
            ->with('user')
            ->get();

        if ($technicians->isEmpty()) {
            // Fallback: any available technician with location
            $technicians = Technician::available()
                ->whereNotNull('current_lat')
                ->whereNotNull('current_lng')
                ->with('user')
                ->get();
        }

        if ($technicians->isEmpty()) {
            return null;
        }

        // Calculate distance for each and sort
        $techniciansByDistance = $technicians->map(function ($tech) use ($lat, $lng) {
            $tech->computed_distance = $this->haversineDistance(
                $lat, $lng,
                $tech->current_lat, $tech->current_lng
            );
            return $tech;
        })->sortBy('computed_distance')->sortByDesc('rating_avg');

        // Return closest with best rating
        return $techniciansByDistance->sortBy([
            ['computed_distance', 'asc'],
            ['rating_avg', 'desc'],
        ])->first();
    }

    /**
     * Assign a technician to a service request.
     */
    public function assignTechnician(
        ServiceRequest $request,
        Technician $technician,
        ?User $dispatcher = null
    ): Dispatch {
        // Calculate distance
        $distance = null;
        if ($technician->current_lat && $technician->current_lng) {
            $distance = $this->haversineDistance(
                $request->location_lat,
                $request->location_lng,
                $technician->current_lat,
                $technician->current_lng
            );
        }

        $dispatch = Dispatch::create([
            'request_id'    => $request->id,
            'technician_id' => $technician->id,
            'dispatcher_id' => $dispatcher?->id,
            'status'        => 'pending',
            'assigned_at'   => Carbon::now(),
            'distance_km'   => $distance ? round($distance, 2) : null,
        ]);

        // Update request status
        $request->update(['status' => 'assigned']);

        // Set technician to on_job
        $technician->update(['availability_status' => 'on_job']);

        // Fire event
        event(new DispatchCreated($dispatch));

        // Notify technician
        $this->notificationService->notify(
            $technician->user,
            'dispatch_assigned',
            "New job assigned: {$request->title}",
            [
                'dispatch_id' => $dispatch->id,
                'request_id'  => $request->id,
                'priority'    => $request->priority,
            ]
        );

        return $dispatch;
    }

    /**
     * Complete a job.
     */
    public function completeJob(Dispatch $dispatch): void
    {
        $now = Carbon::now();

        $dispatch->update([
            'status'       => 'completed',
            'completed_at' => $now,
        ]);

        $request = $dispatch->serviceRequest;
        $request->update([
            'status'      => 'completed',
            'resolved_at' => $now,
        ]);

        $technician = $dispatch->technician;
        $technician->update([
            'availability_status' => 'available',
            'total_jobs'          => $technician->total_jobs + 1,
        ]);

        // Fire event
        event(new DispatchStatusUpdated($dispatch));

        // Notify client
        $this->notificationService->notify(
            $request->client,
            'job_completed',
            "Your service request \"{$request->title}\" has been completed.",
            [
                'request_id'  => $request->id,
                'dispatch_id' => $dispatch->id,
            ]
        );
    }

    /**
     * Calculate distance between two points using the Haversine formula.
     *
     * @return float Distance in kilometers
     */
    public function haversineDistance(
        float $lat1, float $lng1,
        float $lat2, float $lng2
    ): float {
        $earthRadius = 6371; // km

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2)
           + cos(deg2rad($lat1)) * cos(deg2rad($lat2))
           * sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
