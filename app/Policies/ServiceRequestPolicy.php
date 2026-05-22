<?php
namespace App\Policies;
use App\Models\ServiceRequest;
use App\Models\User;
class ServiceRequestPolicy
{
    public function view(User $user, ServiceRequest $serviceRequest): bool
    {
        if ($user->isAdmin() || $user->isDispatcher()) {
            return true;
        }
        return $user->id === $serviceRequest->client_id;
    }
    public function cancel(User $user, ServiceRequest $serviceRequest): bool
    {
        return $user->id === $serviceRequest->client_id
            && $serviceRequest->status === 'pending';
    }
    public function create(User $user): bool
    {
        return $user->isClient();
    }
}
