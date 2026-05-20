<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('technician_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('technician_id')->constrained()->onDelete('cascade');
            $table->foreignId('skill_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('experience_years')->default(0);
            $table->string('proficiency')->default('intermediate'); // beginner|intermediate|expert
            $table->timestamps();

            $table->unique(['technician_id', 'skill_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('technician_skills');
    }
};
