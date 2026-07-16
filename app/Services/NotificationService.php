<?php
namespace App\Services;
use App\Events\AdminNotification;
use App\Events\NewNotification;
use App\Models\Notification;
use App\Models\User;
class NotificationService
{
    public function notify(User $user, string $type, string $message, array $data = []): Notification
    {
        $notification = Notification::create([
            'user_id' => $user->id,
            'type'    => $type,
            'message' => $message,
            'data'    => $data,
            'is_read' => false,
        ]);
        event(new NewNotification($notification));
        return $notification;
    }

    /**
     * Send a notification to ALL admin users.
     * Used for system-wide alerts (new requests, completions, critical failures).
     */
    public function notifyAllAdmins(string $type, string $message, array $data = []): void
    {
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            $this->notify($admin, $type, $message, $data);
        }
        // Also broadcast on the shared 'admins' channel for real-time
        event(new AdminNotification($type, $message, $data));
    }

    /**
     * Send a notification to admins filtered by service category.
     * Currently falls back to all admins; ready for future category-assignment support.
     */
    public function notifyAdminByCategory(string $category, string $type, string $message, array $data = []): void
    {
        $this->notifyAllAdmins($type, $message, array_merge($data, ['category' => $category]));
    }
}
