<?php

namespace App\Http\Controllers;

use App\Models\DoctorSchedule;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorMySchedulesController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $doctor = $user->doctor;
        
        $search = $request->query('search', '');
        $location = $request->query('location', '');
        
        $schedules = DoctorSchedule::with(['doctor.user', 'location'])
            ->where('doctor_id', $doctor->id)
            ->when($search, fn($query) => 
                $query->whereDate('date_appointment', $search)
            )
            ->when($location, fn($query) => 
                $query->where('location_id', $location)
            )
            ->orderBy('date_appointment', 'desc')
            ->orderBy('start_time', 'asc')
            ->paginate(10)
            ->withQueryString();

        $locations = $doctor->locations()->orderBy('name', 'asc')->get();

        return Inertia::render('doctor/schedules', [
            'schedules' => $schedules,
            'filters' => [
                'search' => $search,
                'location' => $location,
            ],
            'doctorId' => $doctor->id,
            'locations' => $locations,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $doctor = $user->doctor;

        $validated = $request->validate([
            'date_appointment' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'slot_length_minutes' => 'nullable',
            'buffer_minutes_before' => 'nullable',
            'buffer_minutes_after' => 'nullable',
            'location_id' => 'nullable|exists:locations,id',
        ]);

        DoctorSchedule::create([
            'doctor_id' => $doctor->id,
            'location_id' => $validated['location_id'] ?? null,
            'date_appointment' => $validated['date_appointment'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'slot_length_minutes' => $validated['slot_length_minutes'] ?? 30,
            'buffer_minutes_before' => $validated['buffer_minutes_before'] ?? 0,
            'buffer_minutes_after' => $validated['buffer_minutes_after'] ?? 0,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect('/doctor/schedules')->with('success', 'Schedule created successfully');
    }

    public function update(Request $request, DoctorSchedule $doctorSchedule)
    {
        $user = $request->user();
        $doctor = $user->doctor;

        if ($doctorSchedule->doctor_id !== $doctor->id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'date_appointment' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'slot_length_minutes' => 'nullable',
            'buffer_minutes_before' => 'nullable',
            'buffer_minutes_after' => 'nullable',
            'location_id' => 'nullable|exists:locations,id',
        ]);

        $doctorSchedule->update([
            'location_id' => $validated['location_id'] ?? null,
            'date_appointment' => $validated['date_appointment'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'slot_length_minutes' => $validated['slot_length_minutes'] ?? 30,
            'buffer_minutes_before' => $validated['buffer_minutes_before'] ?? 0,
            'buffer_minutes_after' => $validated['buffer_minutes_after'] ?? 0,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect('/doctor/schedules')->with('success', 'Schedule updated successfully');
    }

    public function destroy(DoctorSchedule $doctorSchedule)
    {
        $user = request()->user();
        $doctor = $user->doctor;

        if ($doctorSchedule->doctor_id !== $doctor->id) {
            abort(403, 'Unauthorized');
        }

        $doctorSchedule->delete();

        return redirect('/doctor/schedules')->with('success', 'Schedule deleted successfully');
    }
}