<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Dispatch;
use App\Models\ServiceRequest;
use App\Models\Technician;
use Carbon\Carbon;
use Inertia\Inertia;
class AnalyticsController extends Controller
{
    public function index()
    {
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        $jobsPerDay = Dispatch::where('status', 'completed')
            ->where('completed_at', '>=', $thirtyDaysAgo)
            ->get()
            ->groupBy(fn($d) => Carbon::parse($d->completed_at)->format('Y-m-d'))
            ->map(fn($g) => $g->count())->toArray();
        $chartData = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $chartData[] = ['date' => $date, 'jobs' => $jobsPerDay[$date] ?? 0];
        }
        $categoryBreakdown = ServiceRequest::all()
            ->groupBy('category')->map(fn($g) => $g->count())->toArray();
        $topTechnicians = Technician::with('user')
            ->where('total_jobs', '>', 0)
            ->orderBy('rating_avg', 'desc')->limit(10)->get()
            ->map(fn($t) => [
                'name' => $t->user->name ?? 'Deleted User', 'total_jobs' => $t->total_jobs,
                'rating_avg' => $t->rating_avg,
            ]);
        return Inertia::render('Admin/Analytics', [
            'chartData' => $chartData,
            'categoryBreakdown' => $categoryBreakdown,
            'topTechnicians' => $topTechnicians,
        ]);
    }
}
