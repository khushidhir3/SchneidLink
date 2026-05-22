<?php
namespace App\Policies;
use App\Models\Dispatch;
use App\Models\User;
class TechnicianPolicy
{
    public function updateStatus(User $user, Dispatch $dispatch): bool
    {
        if (!$user->isTechnician() || !$user->technician) {
            return false;
        }
        return $user->technician->id === $dispatch->technician_id;
    }
}
