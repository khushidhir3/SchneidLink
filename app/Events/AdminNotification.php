<?php
namespace App\Events;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class AdminNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public function __construct(
        public string $type,
        public string $message,
        public array $data = []
    ) {}
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admins'),
        ];
    }
    public function broadcastWith(): array
    {
        return [
            'type'    => $this->type,
            'message' => $this->message,
            'data'    => $this->data,
        ];
    }
    public function broadcastAs(): string
    {
        return 'admin.notification';
    }
}
