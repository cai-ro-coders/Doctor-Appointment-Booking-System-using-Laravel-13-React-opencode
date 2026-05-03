<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->enum('role', ['admin', 'doctor', 'patient'])->default('patient')->after('id');
            });
        }
        if (!Schema::hasColumn('users', 'phone')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('phone')->nullable()->after('email');
            });
        }
        if (!Schema::hasColumn('users', 'timezone')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('timezone')->default('UTC')->after('phone');
            });
        }
        if (!Schema::hasColumn('users', 'profile_data')) {
            Schema::table('users', function (Blueprint $table) {
                $table->json('profile_data')->nullable()->after('timezone');
            });
        }

        if (!Schema::hasTable('doctors')) {
            Schema::create('doctors', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
                $table->text('bio')->nullable();
                $table->string('photo_url')->nullable();
                $table->decimal('consultation_fee', 10, 2)->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('patients')) {
            Schema::create('patients', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
                $table->date('dob')->nullable();
                $table->enum('gender', ['male', 'female', 'other'])->nullable();
                $table->text('medical_notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('specialties')) {
            Schema::create('specialties', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('doctor_specialty')) {
            Schema::create('doctor_specialty', function (Blueprint $table) {
                $table->id();
                $table->foreignId('doctor_id')->constrained('doctors')->onDelete('cascade');
                $table->foreignId('specialty_id')->constrained('specialties')->onDelete('cascade');
                $table->timestamps();
                $table->unique(['doctor_id', 'specialty_id']);
            });
        }

        if (!Schema::hasTable('locations')) {
            Schema::create('locations', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('address')->nullable();
                $table->string('city')->nullable();
                $table->string('state')->nullable();
                $table->string('zip')->nullable();
                $table->decimal('latitude', 10, 8)->nullable();
                $table->decimal('longitude', 11, 8)->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('doctor_location')) {
            Schema::create('doctor_location', function (Blueprint $table) {
                $table->id();
                $table->foreignId('doctor_id')->constrained('doctors')->onDelete('cascade');
                $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');
                $table->boolean('is_primary')->default(false);
                $table->timestamps();
                $table->unique(['doctor_id', 'location_id']);
            });
        }

        if (!Schema::hasTable('doctor_schedules')) {
            Schema::create('doctor_schedules', function (Blueprint $table) {
                $table->id();
                $table->foreignId('doctor_id')->constrained('doctors')->onDelete('cascade')->indexed();
                $table->tinyInteger('weekday')->nullable();
                $table->json('recurrence_rule')->nullable();
                $table->time('start_time');
                $table->time('end_time');
                $table->smallInteger('slot_length_minutes')->nullable();
                $table->smallInteger('buffer_minutes_before')->nullable();
                $table->smallInteger('buffer_minutes_after')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('schedule_exceptions')) {
            Schema::create('schedule_exceptions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('doctor_schedule_id')->nullable()->constrained('doctor_schedules')->onDelete('cascade');
                $table->foreignId('doctor_id')->constrained('doctors')->onDelete('cascade')->indexed();
                $table->date('date')->nullable();
                $table->timestamp('start_datetime')->nullable();
                $table->timestamp('end_datetime')->nullable();
                $table->enum('type', ['time_off', 'override', 'extra_slot']);
                $table->string('reason')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('appointments')) {
            Schema::create('appointments', function (Blueprint $table) {
                $table->id();
                $table->uuid('uuid')->unique();
                $table->foreignId('doctor_id')->constrained('doctors')->onDelete('cascade')->indexed();
                $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade')->indexed();
                $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('set null');
                $table->timestamp('scheduled_start')->indexed();
                $table->timestamp('scheduled_end')->nullable();
                $table->smallInteger('slot_length_minutes');
                $table->enum('status', ['tentative', 'pending', 'confirmed', 'cancelled', 'completed', 'no_show']);
                $table->enum('booking_source', ['web', 'mobile', 'admin', 'api']);
                $table->text('cancellation_reason')->nullable();
                $table->boolean('is_reminder_sent')->default(false);
                $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamp('cancelled_at')->nullable();
                $table->timestamps();
                $table->index(['doctor_id', 'scheduled_start']);
                $table->index(['patient_id', 'scheduled_start']);
            });
        }

        if (!Schema::hasTable('appointment_logs')) {
            Schema::create('appointment_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('appointment_id')->constrained('appointments')->onDelete('cascade');
                $table->foreignId('actor_id')->nullable()->constrained('users')->onDelete('set null');
                $table->string('action');
                $table->json('payload')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('google_calendar_tokens')) {
            Schema::create('google_calendar_tokens', function (Blueprint $table) {
                $table->id();
                $table->foreignId('doctor_id')->unique()->constrained('doctors')->onDelete('cascade');
                $table->string('provider_user_id');
                $table->text('access_token');
                $table->text('refresh_token');
                $table->string('scopes');
                $table->timestamp('token_expires_at');
                $table->boolean('sync_enabled')->default(true);
                $table->timestamp('last_synced_at')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('email_notifications')) {
            Schema::create('email_notifications', function (Blueprint $table) {
                $table->id();
                $table->string('job_id')->nullable();
                $table->string('mailable_class');
                $table->string('to_email');
                $table->json('payload');
                $table->enum('status', ['queued', 'sent', 'failed']);
                $table->integer('attempts')->default(0);
                $table->timestamp('last_attempt_at')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->text('value');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('audit_logs')) {
            Schema::create('audit_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('actor_id')->nullable()->constrained('users')->onDelete('set null');
                $table->string('action');
                $table->string('auditable_type');
                $table->bigInteger('auditable_id');
                $table->json('old_values')->nullable();
                $table->json('new_values')->nullable();
                $table->string('ip_address')->nullable();
                $table->string('user_agent')->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('email_notifications');
        Schema::dropIfExists('google_calendar_tokens');
        Schema::dropIfExists('appointment_logs');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('schedule_exceptions');
        Schema::dropIfExists('doctor_schedules');
        Schema::dropIfExists('doctor_location');
        Schema::dropIfExists('locations');
        Schema::dropIfExists('doctor_specialty');
        Schema::dropIfExists('specialties');
        Schema::dropIfExists('patients');
        Schema::dropIfExists('doctors');
        Schema::dropIfExists('users');
    }
};