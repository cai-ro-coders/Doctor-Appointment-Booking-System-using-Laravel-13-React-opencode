<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Location;
use App\Models\Patient;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $specialties = [
            ['name' => 'Cardiology', 'description' => 'Heart and cardiovascular system'],
            ['name' => 'Dermatology', 'description' => 'Skin, hair, and nails'],
            ['name' => 'Neurology', 'description' => 'Brain and nervous system'],
            ['name' => 'Orthopedics', 'description' => 'Bones, joints, and muscles'],
            ['name' => 'Pediatrics', 'description' => 'Children and adolescent health'],
            ['name' => 'Internal Medicine', 'description' => 'Adult internal organs'],
            ['name' => 'Ophthalmology', 'description' => 'Eye care'],
            ['name' => 'ENT', 'description' => 'Ear, nose, and throat'],
        ];

        foreach ($specialties as $specialty) {
            Specialty::firstOrCreate(['name' => $specialty['name']], $specialty);
        }

        $locations = [
            ['name' => 'Main Medical Center', 'address' => '123 Healthcare Ave', 'city' => 'New York', 'state' => 'NY', 'zip' => '10001', 'latitude' => 40.7128, 'longitude' => -74.0060],
            ['name' => 'Downtown Clinic', 'address' => '456 Medical Plaza', 'city' => 'New York', 'state' => 'NY', 'zip' => '10002', 'latitude' => 40.7180, 'longitude' => -74.0030],
            ['name' => 'Westside Hospital', 'address' => '789 Health Drive', 'city' => 'New York', 'state' => 'NY', 'zip' => '10003', 'latitude' => 40.7200, 'longitude' => -74.0100],
            ['name' => 'Uptown Medical', 'address' => '321 Care Street', 'city' => 'New York', 'state' => 'NY', 'zip' => '10004', 'latitude' => 40.7250, 'longitude' => -73.9980],
        ];

        foreach ($locations as $location) {
            Location::firstOrCreate(['name' => $location['name']], $location);
        }

        $doctorUsers = User::where('role', 'doctor')->get();
        $specialtyModels = Specialty::all();
        $locationModels = Location::all();

        foreach ($doctorUsers as $doctorUser) {
            $doctor = Doctor::firstOrCreate(
                ['user_id' => $doctorUser->id],
                [
                    'bio' => 'Experienced doctor with ' . rand(5, 20) . ' years of practice.',
                    'photo_url' => 'https://i.pravatar.cc/300?u=' . $doctorUser->id,
                    'consultation_fee' => rand(100, 300),
                    'is_active' => true,
                ]
            );

            $doctorSpecialtyIds = $specialtyModels->random(rand(1, 3))->pluck('id');
            $doctor->specialties()->sync($doctorSpecialtyIds);

            $primaryLocation = $locationModels->random();
            $doctor->locations()->sync([$primaryLocation->id => ['is_primary' => true]]);
        }

        $patientNamesFirst = ['John', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Jennifer', 'Robert', 'Maria', 'William', 'Patricia', 'Richard', 'Linda', 'Joseph', 'Barbara', 'Thomas', 'Susan', 'Charles', 'Jessica', 'Christopher', 'Sarah', 'Daniel', 'Karen', 'Matthew', 'Nancy', 'Anthony', 'Lisa', 'Mark', 'Betty', 'Donald', 'Margaret', 'Steven', 'Sandra', 'Paul', 'Ashley', 'Andrew', 'Kimberly', 'Joshua', 'Emily', 'Kenneth', 'Donna', 'Kevin', 'Michelle', 'Brian', 'Carol', 'George', 'Amanda', 'Edward', 'Dorothy', 'Ronald', 'Melissa'];
        $patientNamesLast = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

        $patients = [];
        for ($i = 1; $i <= 100; $i++) {
            $firstName = $patientNamesFirst[array_rand($patientNamesFirst)];
            $lastName = $patientNamesLast[array_rand($patientNamesLast)];
            $email = strtolower($firstName) . '.' . strtolower($lastName) . $i . '@example.com';

            $existingUser = User::where('email', $email)->first();
            if (!$existingUser) {
                $user = User::create([
                    'name' => $firstName . ' ' . $lastName,
                    'email' => $email,
                    'password' => bcrypt('password'),
                    'role' => 'patient',
                    'phone' => '+1' . rand(2000000000, 9999999999),
                    'timezone' => 'America/New_York',
                    'email_verified_at' => now(),
                ]);
            } else {
                $user = $existingUser;
            }

            $patient = Patient::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'dob' => now()->subYears(rand(18, 80))->subDays(rand(0, 365)),
                    'gender' => ['male', 'female', 'other'][array_rand(['male', 'female', 'other'])],
                    'medical_notes' => null,
                ]
            );
            $patients[] = $patient;
        }

        $statuses = ['tentative', 'pending', 'confirmed', 'cancelled', 'completed', 'no_show'];
        $sources = ['web', 'mobile', 'admin', 'api'];
        $doctors = Doctor::where('is_active', true)->get();

        for ($i = 0; $i < 200; $i++) {
            $doctor = $doctors->random();
            $patient = $patients[array_rand($patients)];
            $location = $locationModels->random();

            $scheduledStart = now()->addDays(rand(-30, 60))->setHour(rand(9, 17))->setMinute(0)->setSecond(0);
            $slotLength = rand(15, 60);
            $scheduledEnd = (clone $scheduledStart)->addMinutes($slotLength);

            $status = $statuses[array_rand($statuses)];
            $cancelledAt = $status === 'cancelled' ? (clone $scheduledStart)->addHours(rand(1, 24)) : null;

            Appointment::create([
                'uuid' => Str::uuid(),
                'doctor_id' => $doctor->id,
                'patient_id' => $patient->id,
                'location_id' => $location->id,
                'scheduled_start' => $scheduledStart,
                'scheduled_end' => $scheduledEnd,
                'slot_length_minutes' => $slotLength,
                'status' => $status,
                'booking_source' => $sources[array_rand($sources)],
                'cancellation_reason' => $status === 'cancelled' ? 'Patient requested cancellation' : null,
                'is_reminder_sent' => rand(0, 1) == 1,
                'created_by' => $doctor->user_id,
                'cancelled_at' => $cancelledAt,
            ]);
        }

        foreach ($doctors as $doctor) {
            for ($day = 0; $day <= 6; $day++) {
                if (rand(0, 1)) {
                    continue;
                }
                \App\Models\DoctorSchedule::create([
                    'doctor_id' => $doctor->id,
                    'weekday' => $day,
                    'start_time' => sprintf('%02d:00:00', rand(9, 11)),
                    'end_time' => sprintf('%02d:00:00', rand(14, 18)),
                    'slot_length_minutes' => rand(15, 60),
                    'buffer_minutes_before' => rand(0, 15),
                    'buffer_minutes_after' => rand(0, 15),
                    'is_active' => true,
                ]);
            }
        }
    }
}