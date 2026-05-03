<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\DoctorSchedule;
use App\Models\Location;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AppointmentsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $status = $request->query('status', '');
        
        $appointments = Appointment::with(['doctor.user', 'patient.user', 'location'])
            ->when($search, fn($query) => 
                $query->whereHas('patient.user', fn($q) => 
                    $q->where('name', 'like', "%{$search}%")
                )->orWhereHas('doctor.user', fn($q) => 
                    $q->where('name', 'like', "%{$search}%")
                )
            )
            ->when($status, fn($query) => 
                $query->where('status', $status)
            )
            ->orderBy('date_appointment', 'desc')
            ->paginate(10)
            ->withQueryString();

        $appointments->getCollection()->transform(fn($a) => [
            'id' => $a->id,
            'patient' => $a->patient ? ['user' => ['name' => $a->patient->user->name ?? 'N/A']] : null,
            'doctor' => $a->doctor ? ['user' => ['name' => $a->doctor->user->name ?? 'N/A']] : null,
            'location' => $a->location ? ['name' => $a->location->name] : null,
            'location_id' => $a->location_id,
            'schedule' => $a->schedule ? [
                'date_appointment' => $a->schedule->date_appointment,
                'start_time' => $a->schedule->start_time,
                'end_time' => $a->schedule->end_time,
            ] : null,
            'date_appointment' => $a->date_appointment,
            'schedule_id' => $a->schedule_id,
            'status' => $a->status,
            'type' => $a->type,
            'scheduled_start' => $a->scheduled_start,
            'scheduled_end' => $a->scheduled_end,
        ]);

        $doctors = Doctor::select('doctors.id', 'users.name as user_name')
            ->join('users', 'doctors.user_id', '=', 'users.id')
            ->orderBy('users.name', 'asc')
            ->get()
            ->map(fn($d) => ['id' => $d->id, 'user' => ['name' => $d->user_name]]);
        
        $patients = Patient::select('patients.id', 'users.name as user_name')
            ->join('users', 'patients.user_id', '=', 'users.id')
            ->orderBy('users.name', 'asc')
            ->get()
            ->map(fn($p) => ['id' => $p->id, 'user' => ['name' => $p->user_name]]);

        $locations = Location::orderBy('name')->get()->map(fn($l) => ['id' => $l->id, 'name' => $l->name, 'city' => $l->city]);

        return Inertia::render('admin/appointments', [
            'appointments' => $appointments,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'doctors' => $doctors,
            'patients' => $patients,
            'locations' => $locations,
        ]);
    }

    public function create()
    {
        $doctors = Doctor::select('doctors.id', 'users.name as user_name')
            ->join('users', 'doctors.user_id', '=', 'users.id')
            ->orderBy('users.name', 'asc')
            ->get()
            ->map(fn($d) => ['id' => $d->id, 'user' => ['name' => $d->user_name]]);
        
        $patients = Patient::select('patients.id', 'users.name as user_name')
            ->join('users', 'patients.user_id', '=', 'users.id')
            ->orderBy('users.name', 'asc')
            ->get()
            ->map(fn($p) => ['id' => $p->id, 'user' => ['name' => $p->user_name]]);

        $locations = Location::orderBy('name')->get()->map(fn($l) => ['id' => $l->id, 'name' => $l->name, 'city' => $l->city]);

        return Inertia::render('admin/appointment-form', [
            'doctors' => $doctors,
            'patients' => $patients,
            'locations' => $locations,
        ]);
    }

    public function availableSchedules(Request $request)
    {
        $locationId = $request->query('location_id');
        $doctorId = $request->query('doctor_id');
        $year = $request->query('year', date('Y'));
        $month = $request->query('month', date('m'));

        $startDate = sprintf('%s-%s-01', $year, str_pad($month, 2, '0', STR_PAD_LEFT));
        $endDate = date('Y-m-t', strtotime($startDate));

        $schedules = DoctorSchedule::where('is_active', true)
            ->whereBetween('date_appointment', [$startDate, $endDate])
            ->when($locationId, fn($q) => $q->where('location_id', $locationId))
            ->when($doctorId, fn($q) => $q->where('doctor_id', $doctorId))
            ->with(['doctor.user', 'location'])
            ->get();

        $bookedAppointments = Appointment::whereBetween('date_appointment', [$startDate, $endDate])
            ->when($locationId, fn($q) => $q->where('location_id', $locationId))
            ->when($doctorId, fn($q) => $q->where('doctor_id', $doctorId))
            ->get()
            ->groupBy('date_appointment');

        $availableDates = [];
        foreach ($schedules as $schedule) {
            $date = $schedule->date_appointment;
            $booked = $bookedAppointments->get($date, collect());
            
            $isFullyBooked = $booked->contains(function($apt) use ($schedule) {
                return $apt->schedule_id === $schedule->id;
            });

            if (!$isFullyBooked) {
                if (!isset($availableDates[$date])) {
                    $availableDates[$date] = [
                        'date' => $date,
                        'schedules' => [],
                    ];
                }
                $availableDates[$date]['schedules'][] = [
                    'id' => $schedule->id,
                    'doctor_name' => $schedule->doctor?->user?->name ?? 'Unknown',
                    'doctor_id' => $schedule->doctor_id,
                    'location_name' => $schedule->location?->name ?? null,
                    'start_time' => $schedule->start_time,
                    'end_time' => $schedule->end_time,
                ];
            }
        }

        return response()->json(array_values($availableDates));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'location_id' => 'nullable|exists:locations,id',
            'date_appointment' => 'required|date',
            'scheduled_start' => 'required',
            'scheduled_end' => 'required',
            'status' => ['required', Rule::in(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])],
            'type' => 'nullable|string|max:255',
        ]);

        $startTime = str_contains($validated['scheduled_start'], ':') && !str_contains($validated['scheduled_start'], ' ')
            ? $validated['date_appointment'] . ' ' . $validated['scheduled_start']
            : $validated['scheduled_start'];

        $endTime = str_contains($validated['scheduled_end'], ':') && !str_contains($validated['scheduled_end'], ' ')
            ? $validated['date_appointment'] . ' ' . $validated['scheduled_end']
            : $validated['scheduled_end'];

        Appointment::create([
            'uuid' => \Illuminate\Support\Str::uuid(),
            'doctor_id' => $validated['doctor_id'],
            'patient_id' => $validated['patient_id'],
            'location_id' => $validated['location_id'] ?? null,
            'date_appointment' => $validated['date_appointment'],
            'scheduled_start' => $startTime,
            'scheduled_end' => $endTime,
            'status' => $validated['status'],
            'type' => $validated['type'] ?? 'General',
        ]);

        return redirect('/admin/appointments')->with('success', 'Appointment created successfully');
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'doctor_id' => 'nullable|exists:doctors,id',
            'patient_id' => 'nullable|exists:patients,id',
            'location_id' => 'nullable|exists:locations,id',
            'date_appointment' => 'nullable|date',
            'scheduled_start' => 'nullable',
            'scheduled_end' => 'nullable',
            'status' => ['nullable', Rule::in(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])],
            'type' => 'nullable|string|max:255',
        ]);

        $updateData = [
            'type' => $validated['type'] ?? $appointment->type,
            'status' => $validated['status'] ?? $appointment->status,
        ];

        if (!empty($validated['doctor_id'])) {
            $updateData['doctor_id'] = $validated['doctor_id'];
        }
        if (!empty($validated['patient_id'])) {
            $updateData['patient_id'] = $validated['patient_id'];
        }
        if (array_key_exists('location_id', $validated)) {
            $updateData['location_id'] = $validated['location_id'];
        }

        $appointment->update($updateData);

        return redirect('/admin/appointments')->with('success', 'Appointment updated successfully');
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return redirect('/admin/appointments')->with('success', 'Appointment deleted successfully');
    }
}