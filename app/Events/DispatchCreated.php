<?php

namespace App\Events;

use App\Models\Dispatch;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DispatchCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Dispatch $dispatch
    ) {}

    public function broadcastOn(): array
    {
        $techUserId = $this->dispatch->technician->user_id;

        return [
            new PrivateChannel("technician.{$techUserId}"),
        ];
    }

    public function broadcastWith(): array
    {
        $request = $this->dispatch->serviceRequest;

        return [
            'dispatch_id' => $this->dispatch->id,
            'title'       => $request->title,
            'location'    => [
                'lat'     => $request->location_lat,
                'lng'     => $request->location_lng,
                'address' => $request->location_address,
            ],
            'priority'    => $request->priority,
            'category'    => $request->category,
        ];
    }

    public function broadcastAs(): string
    {
        return 'dispatch.created';
    }
}
