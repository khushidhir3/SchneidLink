<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dispatch_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('rated_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('technician_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('score');
            $table->text('comment')->nullable();
            $table->timestamps();
            $table->index('technician_id');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
