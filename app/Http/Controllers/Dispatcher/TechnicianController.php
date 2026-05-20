<?php

namespace App\Http\Controllers\Dispatcher;

use App\Http\Controllers\Controller;
use App\Models\Technician;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TechnicianController extends Controller
{
    public function index(Request $request)
    {
        $technicians = Technician::with(['user', 'skills'])
            ->orderBy('rating_avg', 'desc')
            ->get();
            
        return Inertia::render('Dispatcher/Technicians/Index', [
            'technicians' => $technicians,
        ]);
    }
}
