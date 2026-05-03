<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class DoctorAppointmentsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $doctor = $user->doctor;
        
        $search = $request->query('search', '');
        $status = $request->query('status', '');
        $date = $request->query('date', '');
        
        $appointments = Appointment::with(['patient.user', 'location', 'schedule'])
            ->where('doctor_id', $doctor->id)
            ->when($search, fn($query) => 
                $query->whereHas('patient.user', fn($q) => 
                    $q->where('name', 'like', "%{$search}%")
                )
            )
            ->when($status, fn($query) => 
                $query->where('status', $status)
            )
            ->when($date, fn($query) => 
                $query->where(function($q) use ($date) {
                    $q->whereDate('date_appointment', $date)
                      ->orWhereHas('schedule', fn($sq) => 
                          $sq->whereDate('date_appointment', $date)
                      );
                })
            )
            ->orderBy('date_appointment', 'desc')
            ->paginate(10)
            ->withQueryString();

        $patients = Patient::select('patients.id', 'users.name as user_name')
            ->join('users', 'patients.user_id', '=', 'users.id')
            ->orderBy('users.name', 'asc')
            ->get()
            ->map(fn($p) => ['id' => $p->id, 'user' => ['name' => $p->user_name]]);

        return Inertia::render('doctor/appointments', [
            'appointments' => [
                'data' => $appointments->getCollection()->map(fn($a) => [
                    'id' => $a->id,
                    'patient' => $a->patient ? ['user' => ['name' => $a->patient->user->name ?? 'N/A', 'email' => $a->patient->user->email ?? '', 'phone' => $a->patient->user->phone ?? ''], 'medical_notes' => $a->patient->medical_notes ?? '', 'dob' => $a->patient->dob ? $a->patient->dob->format('Y-m-d') : null, 'gender' => $a->patient->gender ?? ''] : null,
                    'location' => $a->location ? ['name' => $a->location->name] : null,
                    'schedule' => $a->schedule ? [
                        'weekday' => $a->schedule->weekday,
                        'date_appointment' => $a->schedule->date_appointment,
                        'start_time' => $a->schedule->start_time,
                        'end_time' => $a->schedule->end_time,
                    ] : null,
                    'scheduled_start' => $a->scheduled_start,
                    'scheduled_end' => $a->scheduled_end,
                    'date_appointment' => $a->date_appointment,
                    'schedule_id' => $a->schedule_id,
                    'status' => $a->status,
                    'type' => $a->type,
                ])->toArray(),
                'current_page' => $appointments->currentPage(),
                'last_page' => $appointments->lastPage(),
                'per_page' => $appointments->perPage(),
                'total' => $appointments->total(),
                'links' => $appointments->linkCollection()->toArray(),
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'date' => $date,
            ],
            'patients' => $patients,
            'doctorId' => $doctor->id,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $doctor = $user->doctor;

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'location_id' => 'nullable|exists:locations,id',
            'schedule_id' => 'required|exists:doctor_schedules,id',
            'date_appointment' => 'required|date',
            'type' => 'nullable|string|max:255',
        ]);

        Appointment::create([
            'uuid' => \Illuminate\Support\Str::uuid(),
            'doctor_id' => $doctor->id,
            'patient_id' => $validated['patient_id'],
            'location_id' => $validated['location_id'] ?? null,
            'schedule_id' => $validated['schedule_id'],
            'date_appointment' => $validated['date_appointment'],
            'status' => 'pending',
            'type' => $validated['type'] ?? 'General',
        ]);

        return redirect('/doctor/appointments')->with('success', 'Appointment created successfully');
    }

    public function update(Request $request, Appointment $appointment)
    {
        $user = $request->user();
        $doctor = $user->doctor;

        if ($appointment->doctor_id !== $doctor->id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'location_id' => 'nullable|exists:locations,id',
            'schedule_id' => 'required|exists:doctor_schedules,id',
            'date_appointment' => 'required|date',
            'status' => ['required', Rule::in(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])],
            'type' => 'nullable|string|max:255',
        ]);

        $appointment->update($validated);

        return redirect('/doctor/appointments')->with('success', 'Appointment updated successfully');
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $user = $request->user();
        $doctor = $user->doctor;

        if ($appointment->doctor_id !== $doctor->id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])],
        ]);

        $appointment->update(['status' => $validated['status']]);

        return response()->json(['success' => true]);
    }

    public function destroy(Appointment $appointment)
    {
        $user = request()->user();
        $doctor = $user->doctor;

        if ($appointment->doctor_id !== $doctor->id) {
            abort(403, 'Unauthorized');
        }

        $appointment->delete();

        return redirect('/doctor/appointments')->with('success', 'Appointment deleted successfully');
    }
}