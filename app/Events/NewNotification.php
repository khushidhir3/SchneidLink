<?php
namespace App\Events;
use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class NewNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public function __construct(
        public Notification $notification
    ) {}
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.{$this->notification->user_id}"),
        ];
    }
    public function broadcastWith(): array
    {
        return [
            'id'      => $this->notification->id,
            'type'    => $this->notification->type,
            'message' => $this->notification->message,
            'data'    => $this->notification->data,
        ];
    }
    public function broadcastAs(): string
    {
        return 'notification.new';
    }
}
