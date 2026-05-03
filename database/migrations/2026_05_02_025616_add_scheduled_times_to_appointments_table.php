<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->timestamp('scheduled_start')->nullable()->after('location_id');
            $table->timestamp('scheduled_end')->nullable()->after('scheduled_start');
            $table->string('type')->nullable()->default('General')->after('scheduled_end');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['scheduled_start', 'scheduled_end', 'type']);
        });
    }
};