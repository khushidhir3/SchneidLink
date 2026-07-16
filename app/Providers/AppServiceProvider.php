<?php
namespace App\Providers;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
    }
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Bind the public path dynamically to ensure assets and paths resolve correctly in serverless runtime
        $this->app->bind('path.public', function () {
            return base_path('public');
        });
    }
}
