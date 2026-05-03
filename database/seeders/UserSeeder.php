<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'email' => 'admin@example.com',
                'role' => 'admin',
                'name' => 'Admin User',
                'phone' => '+1234567890',
                'timezone' => 'America/New_York',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'sarah.johnson@example.com',
                'role' => 'doctor',
                'name' => 'Dr. Sarah Johnson',
                'phone' => '+1234567891',
                'timezone' => 'America/New_York',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'michael.chen@example.com',
                'role' => 'doctor',
                'name' => 'Dr. Michael Chen',
                'phone' => '+1234567892',
                'timezone' => 'America/Chicago',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'john.smith@example.com',
                'role' => 'patient',
                'name' => 'John Smith',
                'phone' => '+1234567893',
                'timezone' => 'America/New_York',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'emily.davis@example.com',
                'role' => 'patient',
                'name' => 'Emily Davis',
                'phone' => '+1234567894',
                'timezone' => 'America/Los_Angeles',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            $email = $user['email'];
            $exists = DB::table('users')->where('email', $email)->exists();
            if (!$exists) {
                DB::table('users')->insert($user);
            } else {
                unset($user['email'], $user['created_at']);
                DB::table('users')->where('email', $email)->update($user);
            }
        }
    }
}