<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $doctor = $user->doctor;

        $totalPatients = Appointment::where('doctor_id', $doctor->id)
            ->distinct()
            ->count('patient_id');

        $today = now()->toDateString();
        $todayPatients = Appointment::where('doctor_id', $doctor->id)
            ->where(function($query) use ($today) {
                $query->whereDate('date_appointment', $today)
                    ->orWhereHas('schedule', fn($q) => 
                        $q->whereDate('date_appointment', $today)
                    );
            })
            ->distinct()
            ->count('patient_id');

        $todayAppointments = Appointment::where('doctor_id', $doctor->id)
            ->where(function($query) use ($today) {
                $query->whereDate('date_appointment', $today)
                    ->orWhereHas('schedule', fn($q) => 
                        $q->whereDate('date_appointment', $today)
                    );
            })
            ->count();

        $appointments = Appointment::with(['patient.user', 'schedule'])
            ->where('doctor_id', $doctor->id)
            ->where(function($query) {
                $query->where('date_appointment', '>=', now()->toDateString())
                    ->orWhereHas('schedule', fn($q) => 
                        $q->where('date_appointment', '>=', now()->toDateString())
                    );
            })
            ->orderBy('date_appointment', 'asc')
            ->limit(20)
            ->get()
            ->map(fn($appointment) => [
                'id' => $appointment->id,
                'patient' => $appointment->patient ? ['user' => ['name' => $appointment->patient->user->name ?? 'N/A']] : null,
                'date_appointment' => $appointment->schedule->date_appointment ?? $appointment->date_appointment,
                'schedule_id' => $appointment->schedule_id,
                'status' => $appointment->status,
                'type' => $appointment->type ?? 'General',
            ]);

        $weeklyAppointments = Appointment::where('doctor_id', $doctor->id)
            ->where(function($query) {
                $query->whereBetween('date_appointment', [now()->startOfWeek(), now()->endOfWeek()])
                    ->orWhereHas('schedule', fn($q) => 
                        $q->whereBetween('date_appointment', [now()->startOfWeek(), now()->endOfWeek()])
                    );
            })
            ->get()
            ->map(fn($apt) => \Carbon\Carbon::parse($apt->schedule->date_appointment ?? $apt->date_appointment))
            ->filter()
            ->groupBy(fn($date) => $date->format('l'))
            ->map(fn($group) => $group->count())
            ->toArray();

        $appointmentsByStatus = Appointment::where('doctor_id', $doctor->id)
            ->select('status')
            ->get()
            ->groupBy('status')
            ->map(fn($group) => $group->count())
            ->toArray();

        return Inertia::render('doctor/dashboard', [
            'stats' => [
                'totalPatients' => $totalPatients,
                'todayPatients' => $todayPatients,
                'todayAppointments' => $todayAppointments,
            ],
            'appointments' => $appointments,
            'weeklyAppointments' => $weeklyAppointments,
            'appointmentsByStatus' => $appointmentsByStatus,
        ]);
    }
}