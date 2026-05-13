<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Quest;

class QuestCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $quest;
    public $technicians;

    /**
     * Create a new event instance.
     */
    public function __construct(Quest $quest, $technicians)
    {
        $this->quest = $quest;
        $this->technicians = $technicians;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('quests'),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'quest' => $this->quest->toArray(),
        ];
    }
}
