<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
class TechnicianController extends Controller
{
    public function index()
    {
        $technicians = Technician::with('user', 'skills')->orderBy('created_at', 'desc')->get();
        $skills = Skill::all();
        return Inertia::render('Admin/Technicians/Index', [
            'technicians' => $technicians,
            'skills' => $skills,
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'skills' => 'nullable|array',
            'skills.*.id' => 'exists:skills,id',
            'skills.*.proficiency' => 'in:beginner,intermediate,expert',
            'skills.*.experience_years' => 'integer|min:0|max:50',
        ]);
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'technician',
            'phone' => $validated['phone'] ?? null,
        ]);
        $technician = Technician::create([
            'user_id' => $user->id,
            'employee_code' => 'SE-' . strtoupper(substr(md5($user->id . now()), 0, 6)),
            'availability_status' => 'offline',
            'rating_avg' => 0, 'total_jobs' => 0,
        ]);
        if (!empty($validated['skills'])) {
            foreach ($validated['skills'] as $skill) {
                $technician->skills()->attach($skill['id'], [
                    'proficiency' => $skill['proficiency'] ?? 'intermediate',
                    'experience_years' => $skill['experience_years'] ?? 0,
                ]);
            }
        }
        return back()->with('success', 'Technician created.');
    }
}
