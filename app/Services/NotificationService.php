<?php

namespace App\Services;

use App\Events\NewNotification;
use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Create a notification and broadcast it in real-time.
     */
    public function notify(User $user, string $type, string $message, array $data = []): Notification
    {
        $notification = Notification::create([
            'user_id' => $user->id,
            'type'    => $type,
            'message' => $message,
            'data'    => $data,
            'is_read' => false,
        ]);

        // Broadcast for real-time delivery
        event(new NewNotification($notification));

        return $notification;
    }
}
