<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $totalDoctors = Doctor::count();
        $totalPatients = Patient::count();
        $totalAppointments = Appointment::count();
        $totalUsers = User::count();

        $appointmentsByStatus = Appointment::select('status')
            ->get()
            ->groupBy('status')
            ->map(fn($group) => $group->count())
            ->toArray();

        $recentAppointments = Appointment::with(['doctor.user', 'patient.user'])
            ->orderBy('date_appointment', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($appointment) => [
                'id' => $appointment->id,
                'doctor' => $appointment->doctor ? ['user' => ['name' => $appointment->doctor->user->name ?? 'N/A']] : null,
                'patient' => $appointment->patient ? ['user' => ['name' => $appointment->patient->user->name ?? 'N/A']] : null,
                'date_appointment' => $appointment->date_appointment,
                'scheduled_start' => $appointment->scheduled_start,
                'scheduled_end' => $appointment->scheduled_end,
                'status' => $appointment->status,
            ]);

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalDoctors' => $totalDoctors,
                'totalPatients' => $totalPatients,
                'totalAppointments' => $totalAppointments,
                'totalUsers' => $totalUsers,
            ],
            'appointmentsByStatus' => $appointmentsByStatus,
            'recentAppointments' => $recentAppointments,
        ]);
    }
}