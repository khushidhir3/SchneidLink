<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dispatches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained('service_requests')->onDelete('cascade');
            $table->foreignId('technician_id')->constrained('technicians')->onDelete('cascade');
            $table->foreignId('dispatcher_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('status')->default('pending'); // pending|accepted|rejected|en_route|arrived|completed
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('en_route_at')->nullable();
            $table->timestamp('arrived_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->float('distance_km')->nullable();
            $table->text('technician_notes')->nullable();
            $table->timestamps();

            $table->index('request_id');
            $table->index('technician_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dispatches');
    }
};
