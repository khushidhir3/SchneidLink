<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('category'); // electrical|hvac|plc|transformer|inspection|networking|other
            $table->string('priority')->default('medium'); // low|medium|high|urgent
            $table->string('status')->default('pending'); // pending|assigned|in_progress|completed|cancelled
            $table->decimal('location_lat', 10, 7);
            $table->decimal('location_lng', 10, 7);
            $table->string('location_address');
            $table->json('attachments')->nullable();
            $table->timestamp('requested_at')->useCurrent();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index('client_id');
            $table->index('status');
            $table->index('priority');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};
