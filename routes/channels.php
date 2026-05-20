<?php

use Illuminate\Support\Facades\Broadcast;

// Default Laravel user channel
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// FieldDispatch channels
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('technician.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId && $user->isTechnician();
});

Broadcast::channel('request.{requestId}', function ($user, $requestId) {
    // Clients can listen to their own requests
    // Technicians can listen to requests they're dispatched to
    // Dispatchers/Admins can listen to any request
    if ($user->isDispatcher() || $user->isAdmin()) {
        return true;
    }

    $request = \App\Models\ServiceRequest::find($requestId);
    if (!$request) {
        return false;
    }

    if ($user->isClient() && $request->client_id === $user->id) {
        return true;
    }

    if ($user->isTechnician() && $request->dispatch) {
        return $request->dispatch->technician_id === $user->technician?->id;
    }

    return false;
});
