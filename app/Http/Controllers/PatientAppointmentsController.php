<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class PatientAppointmentsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $patient = $user->patient;

        if (!$patient) {
            $patientId = null;
            $appointments = (object) [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total' => 0,
                'links' => [],
            ];
        } else {
            $patientId = $patient->id;
            
            $search = $request->query('search', '');
            $status = $request->query('status', '');

            $appointments = Appointment::with(['doctor.user', 'location', 'schedule'])
                ->where('patient_id', $patient->id)
                ->when($search, fn($query) =>
                    $query->whereHas('doctor.user', fn($q) =>
                        $q->where('name', 'like', "%{$search}%")
                    )
                )
                ->when($status, fn($query) =>
                    $query->where('status', $status)
                )
                ->orderBy('id', 'desc')
                ->paginate(10)
                ->withQueryString();

            $appointments->getCollection()->transform(fn($a) => [
                'id' => $a->id,
                'doctor' => $a->doctor ? [
                    'user' => ['name' => $a->doctor->user->name ?? 'N/A'],
                    'photo_url' => $a->doctor->photo_url,
                ] : null,
                'location' => $a->location ? ['name' => $a->location->name] : null,
                'schedule' => $a->schedule ? [
                    'weekday' => $a->schedule->weekday,
                    'date_appointment' => $a->schedule->date_appointment ? (is_string($a->schedule->date_appointment) ? $a->schedule->date_appointment : $a->schedule->date_appointment->format('Y-m-d')) : null,
                    'start_time' => $a->schedule->start_time,
                    'end_time' => $a->schedule->end_time,
                ] : null,
                'scheduled_start' => $a->scheduled_start,
                'scheduled_end' => $a->scheduled_end,
                'status' => $a->status,
                'type' => $a->type ?? 'General',
                'created_at' => $a->created_at ? $a->created_at->toIso8601String() : null,
            ]);
        }

        $doctors = Doctor::with('user')
            ->get()
            ->sortBy(fn($d) => $d->user->name ?? '')
            ->values()
            ->map(fn($d) => ['id' => $d->id, 'user' => ['name' => $d->user->name ?? 'N/A'], 'photo_url' => $d->photo_url]);

        return Inertia::render('patient/appointments', [
            'appointments' => $appointments,
            'filters' => [
                'search' => $request->query('search', ''),
                'status' => $request->query('status', ''),
            ],
            'doctors' => $doctors,
            'patientId' => $patientId,
        ]);
    }

    public function store(Request $request)
    {
        file_put_contents('/tmp/debug_booking.log', "store() called\n", FILE_APPEND);
        
        $user = $request->user();
        file_put_contents('/tmp/debug_booking.log', "user_id=" . ($user ? $user->id : 'null') . "\n", FILE_APPEND);
        
        $patient = $user->patient;
        file_put_contents('/tmp/debug_booking.log', "patient_id=" . ($patient ? $patient->id : 'null') . "\n", FILE_APPEND);

        if (!$patient) {
            return back()->with('error', 'Patient record not found');
        }

        $validated = $request->validate([
            'doctor_id' => 'required|integer',
            'location_id' => 'nullable|integer',
            'schedule_id' => 'nullable|integer',
            'date_appointment' => 'nullable|date',
            'type' => 'nullable|string|max:255',
        ]);
        
        file_put_contents('/tmp/debug_booking.log', "validated=" . json_encode($validated) . "\n", FILE_APPEND);

        try {
            $appointment = Appointment::create([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'doctor_id' => (int) $validated['doctor_id'],
                'patient_id' => $patient->id,
                'location_id' => !empty($validated['location_id']) ? (int) $validated['location_id'] : null,
                'schedule_id' => !empty($validated['schedule_id']) ? (int) $validated['schedule_id'] : null,
                'date_appointment' => $validated['date_appointment'] ?? null,
                'status' => 'pending',
                'booking_source' => 'web',
                'type' => $validated['type'] ?? 'General',
            ]);
            
            file_put_contents('/tmp/debug_booking.log', "Created appointment id=" . $appointment->id . "\n", FILE_APPEND);
            
            return redirect('/patient/appointments')->with('success', 'Appointment booked successfully');
        } catch (\Exception $e) {
            file_put_contents('/tmp/debug_booking.log', "Error: " . $e->getMessage() . "\n", FILE_APPEND);
            return back()->with('error', 'Failed to create appointment: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Appointment $appointment)
    {
        $user = $request->user();
        $patient = $user->patient;

        if (!$patient || $appointment->patient_id !== $patient->id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'status' => ['required', Rule::in(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])],
            'type' => 'nullable|string|max:255',
        ]);

        $appointment->update($validated);

        return redirect('/patient/appointments')->with('success', 'Appointment updated successfully');
    }

    public function destroy(Appointment $appointment)
    {
        $user = request()->user();
        $patient = $user->patient;

        if (!$patient || $appointment->patient_id !== $patient->id) {
            abort(403, 'Unauthorized');
        }

        $appointment->delete();

        return redirect('/patient/appointments')->with('success', 'Appointment deleted successfully');
    }
}