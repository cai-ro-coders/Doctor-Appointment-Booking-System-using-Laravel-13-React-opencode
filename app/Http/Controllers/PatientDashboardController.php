<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Specialty;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $patient = $user->patient;
        
        $totalDoctors = Doctor::count();
        $specialties = Specialty::orderBy('name', 'asc')->get();
        
        $doctors = Doctor::with(['user', 'specialties', 'locations'])
            ->get()
            ->sortBy(fn($d) => $d->user->name ?? '')
            ->values()
            ->map(fn($d) => [
                'id' => $d->id,
                'user' => ['name' => $d->user->name ?? 'N/A', 'email' => $d->user->email ?? ''],
                'photo_url' => $d->photo_url,
                'bio' => $d->bio,
                'consultation_fee' => $d->consultation_fee,
                'specialties' => $d->specialties->map(fn($s) => ['id' => $s->id, 'name' => $s->name])->toArray(),
            ]);
        
        $appointments = collect([]);
        $recentAppointments = 0;
        
        if ($patient) {
            $appointments = Appointment::with('doctor.user')
                ->where('patient_id', $patient->id)
                ->orderBy('id', 'desc')
                ->limit(10)
                ->get()
                ->map(fn($a) => [
                    'id' => $a->id,
                    'doctor' => $a->doctor ? [
                        'user' => ['name' => $a->doctor->user->name ?? 'N/A'],
                        'photo_url' => $a->doctor->photo_url,
                    ] : null,
                    'status' => $a->status,
                    'type' => $a->type ?? 'General',
                ]);
            
            $recentAppointments = Appointment::where('patient_id', $patient->id)->count();
        }

        return Inertia::render('patient/dashboard', [
            'patientName' => $user->name,
            'totalDoctors' => $totalDoctors,
            'specialties' => $specialties->map(fn($s) => ['id' => $s->id, 'name' => $s->name])->toArray(),
            'appointments' => $appointments,
            'doctors' => $doctors,
            'stats' => [
                'appointmentsByStatus' => [],
                'recentAppointments' => $recentAppointments,
            ],
        ]);
    }
}