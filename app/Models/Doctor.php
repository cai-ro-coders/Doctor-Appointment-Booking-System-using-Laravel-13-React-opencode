<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Doctor extends Model
{
    protected $fillable = [
        'user_id',
        'bio',
        'photo_url',
        'consultation_fee',
        'rating',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'consultation_fee' => 'decimal:2',
            'rating' => 'decimal:1',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function specialties(): BelongsToMany
    {
        return $this->belongsToMany(Specialty::class, 'doctor_specialty');
    }

    public function locations(): BelongsToMany
    {
        return $this->belongsToMany(Location::class, 'doctor_location')->withPivot('is_primary');
    }

    public function schedules()
    {
        return $this->hasMany(DoctorSchedule::class);
    }
}