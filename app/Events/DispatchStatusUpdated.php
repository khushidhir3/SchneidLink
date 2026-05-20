<?php

namespace App\Events;

use App\Models\Dispatch;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DispatchStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Dispatch $dispatch
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("request.{$this->dispatch->request_id}"),
        ];
    }

    public function broadcastWith(): array
    {
        $technician = $this->dispatch->technician;

        return [
            'dispatch_id' => $this->dispatch->id,
            'status'      => $this->dispatch->status,
            'technician'  => [
                'lat' => $technician->current_lat,
                'lng' => $technician->current_lng,
            ],
            'assigned_at'  => $this->dispatch->assigned_at?->toISOString(),
            'accepted_at'  => $this->dispatch->accepted_at?->toISOString(),
            'en_route_at'  => $this->dispatch->en_route_at?->toISOString(),
            'arrived_at'   => $this->dispatch->arrived_at?->toISOString(),
            'completed_at' => $this->dispatch->completed_at?->toISOString(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'dispatch.status.updated';
    }
}
