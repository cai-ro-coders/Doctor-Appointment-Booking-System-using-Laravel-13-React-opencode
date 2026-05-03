<?php

namespace Database\Factories;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DoctorFactory extends Factory
{
    protected $model = Doctor::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'bio' => $this->faker->paragraph(),
            'photo_url' => 'https://i.pravatar.cc/300?u=' . $this->faker->unique()->uuid(),
            'consultation_fee' => $this->faker->randomFloat(2, 50, 300),
            'is_active' => true,
        ];
    }
}