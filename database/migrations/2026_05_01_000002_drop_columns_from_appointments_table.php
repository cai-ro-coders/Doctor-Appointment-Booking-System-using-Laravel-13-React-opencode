<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE appointments DROP FOREIGN KEY appointments_created_by_foreign');
        
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'scheduled_start',
                'scheduled_end',
                'slot_length_minutes',
                'created_by',
                'cancelled_at',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dateTime('scheduled_start')->nullable();
            $table->dateTime('scheduled_end')->nullable();
            $table->integer('slot_length_minutes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->dateTime('cancelled_at')->nullable();
        });
    }
};