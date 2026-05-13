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
use App\Models\User;

class QuestAccepted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $quest;
    public $technician;

    /**
     * Create a new event instance.
     */
    public function __construct(Quest $quest, User $technician)
    {
        $this->quest = $quest;
        $this->technician = $technician;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('quests'), // Or a PrivateChannel for the manager
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'quest' => $this->quest->toArray(),
            'technician' => $this->technician->toArray(),
        ];
    }
}
