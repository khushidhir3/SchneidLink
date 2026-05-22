<?php
namespace App\Events;
use App\Models\Technician;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class TechnicianLocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public int $requestId;
    public function __construct(
        public Technician $technician,
        int $requestId
    ) {
        $this->requestId = $requestId;
    }
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("request.{$this->requestId}"),
        ];
    }
    public function broadcastWith(): array
    {
        return [
            'lat' => $this->technician->current_lat,
            'lng' => $this->technician->current_lng,
        ];
    }
    public function broadcastAs(): string
    {
        return 'technician.location.updated';
    }
}
