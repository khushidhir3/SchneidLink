<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Dispatch;
use App\Models\ServiceRequest;
use App\Models\Technician;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_technicians' => Technician::count(),
            'total_jobs' => Dispatch::count(),
            'avg_rating' => round(Technician::where('rating_avg', '>', 0)->avg('rating_avg') ?? 0, 1),
        ];
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        $jobsPerDay = Dispatch::where('status', 'completed')
            ->where('completed_at', '>=', $thirtyDaysAgo)
            ->get()
            ->groupBy(fn($d) => Carbon::parse($d->completed_at)->format('Y-m-d'))
            ->map(fn($group) => $group->count())
            ->toArray();
        $chartData = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $chartData[] = ['date' => $date, 'jobs' => $jobsPerDay[$date] ?? 0];
        }
        $categoryBreakdown = ServiceRequest::all()
            ->groupBy('category')
            ->map(fn($g) => $g->count())
            ->toArray();
        $topTechnicians = Technician::with('user')
            ->where('total_jobs', '>', 0)
            ->orderBy('rating_avg', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($t) => [
                'name' => $t->user->name ?? 'Deleted User', 'total_jobs' => $t->total_jobs,
                'rating_avg' => $t->rating_avg, 'employee_code' => $t->employee_code,
            ]);
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats, 'chartData' => $chartData,
            'categoryBreakdown' => $categoryBreakdown,
            'topTechnicians' => $topTechnicians,
        ]);
    }
}
