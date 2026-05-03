<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorAppointmentViewController extends Controller
{
    public function show(Appointment $appointment)
    {
        $user = request()->user();
        $doctor = $user->doctor;

        if ($appointment->doctor_id !== $doctor->id) {
            abort(403, 'Unauthorized');
        }

        $appointment->load(['patient.user', 'location', 'schedule']);

        return Inertia::render('doctor/appointment-view', [
            'appointment' => [
                'id' => $appointment->id,
                'patient' => $appointment->patient ? [
                    'user' => [
                        'name' => $appointment->patient->user->name ?? 'N/A',
                        'email' => $appointment->patient->user->email ?? '',
                        'phone' => $appointment->patient->user->phone ?? '',
                    ],
                    'medical_notes' => $appointment->patient->medical_notes ?? '',
                    'dob' => $appointment->patient->dob ? $appointment->patient->dob->format('Y-m-d') : null,
                    'gender' => $appointment->patient->gender ?? '',
                ] : null,
                'location' => $appointment->location ? ['name' => $appointment->location->name] : null,
                'schedule' => $appointment->schedule ? [
                    'weekday' => $appointment->schedule->weekday,
                    'date_appointment' => $appointment->schedule->date_appointment,
                    'start_time' => $appointment->schedule->start_time,
                    'end_time' => $appointment->schedule->end_time,
                ] : null,
                'scheduled_start' => $appointment->scheduled_start,
                'scheduled_end' => $appointment->scheduled_end,
                'date_appointment' => $appointment->date_appointment,
                'schedule_id' => $appointment->schedule_id,
                'status' => $appointment->status,
                'type' => $appointment->type,
            ],
        ]);
    }
}