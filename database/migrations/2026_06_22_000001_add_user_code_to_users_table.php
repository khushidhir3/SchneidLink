<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    public function up(): void
    {
        // MongoDB: create a unique index on user_code (sparse so nulls are allowed)
        DB::connection('mongodb')
            ->getCollection('users')
            ->createIndex(
                ['user_code' => 1],
                ['unique' => true, 'sparse' => true, 'name' => 'users_user_code_unique']
            );
    }
    public function down(): void
    {
        DB::connection('mongodb')
            ->getCollection('users')
            ->dropIndex('users_user_code_unique');
    }
};
