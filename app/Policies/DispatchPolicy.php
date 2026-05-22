<?php
namespace App\Policies;
use App\Models\Dispatch;
use App\Models\User;
class DispatchPolicy
{
    public function create(User $user): bool
    {
        return $user->isDispatcher() || $user->isAdmin();
    }
    public function reassign(User $user, Dispatch $dispatch): bool
    {
        return $user->isDispatcher() || $user->isAdmin();
    }
}
