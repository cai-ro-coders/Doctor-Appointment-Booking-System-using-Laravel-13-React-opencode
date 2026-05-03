<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('doctor_schedules', function (Blueprint $table) {
            $table->dropColumn([
                'weekday',
                'recurrence_rule',
                'slot_length_minutes',
                'buffer_minutes_before',
                'buffer_minutes_after',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('doctor_schedules', function (Blueprint $table) {
            $table->tinyInteger('weekday')->nullable()->after('location_id');
            $table->json('recurrence_rule')->nullable()->after('weekday');
            $table->smallInteger('slot_length_minutes')->nullable()->after('recurrence_rule');
            $table->smallInteger('buffer_minutes_before')->nullable()->after('slot_length_minutes');
            $table->smallInteger('buffer_minutes_after')->nullable()->after('buffer_minutes_before');
        });
    }
};