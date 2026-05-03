<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\DoctorSchedule;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class DoctorSchedulesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $location = $request->query('location', '');

        $schedules = DoctorSchedule::with(['doctor.user', 'location'])
            ->when($search, fn($query) => 
                $query->whereHas('doctor.user', fn($q) => 
                    $q->where('name', 'like', "%{$search}%")
                )->orWhereHas('location', fn($lq) =>
                    $lq->where('name', 'like', "%{$search}%")
                )
            )
            ->when($location, fn($query) =>
                $query->where('location_id', $location)
            )
            ->orderBy('date_appointment', 'desc')
            ->orderBy('start_time', 'asc')
            ->paginate(10)
            ->withQueryString();

        $schedules->getCollection()->transform(function ($schedule) {
            return [
                'id' => $schedule->id,
                'doctor_id' => $schedule->doctor_id,
                'location_id' => $schedule->location_id,
                'weekday_name' => $schedule->date_appointment ?? 'N/A',
                'date_appointment' => $schedule->date_appointment,
                'start_time' => $schedule->start_time,
                'end_time' => $schedule->end_time,
                'is_active' => $schedule->is_active,
                'doctor_name' => $schedule->doctor?->user?->name ?? 'Unknown',
                'location_name' => $schedule->location?->name ?? null,
            ];
        });

        $doctors = Doctor::select('doctors.id', 'doctors.photo_url', 'users.name as user_name')
            ->join('users', 'doctors.user_id', '=', 'users.id')
            ->orderBy('users.name', 'asc')
            ->get()
            ->map(fn($d) => ['id' => $d->id, 'photo_url' => $d->photo_url, 'user' => ['name' => $d->user_name]]);

        $locations = Location::orderBy('name')->get()->map(fn($l) => ['id' => $l->id, 'name' => $l->name, 'city' => $l->city]);

        return Inertia::render('admin/doctor-schedules', [
            'schedules' => $schedules,
            'filters' => [
                'search' => $search,
                'location' => $location,
            ],
            'doctors' => $doctors,
            'locations' => $locations,
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('Store called', ['all' => $request->all()]);

        try {
            $validated = $request->validate([
                'doctor_id' => 'required|exists:doctors,id',
                'location_id' => 'nullable|exists:locations,id',
                'date_appointment' => 'required|date',
                'start_time' => 'required',
                'end_time' => 'required',
            ]);

            \Log::info('Validated:', $validated);

            $schedule = DoctorSchedule::create([
                'doctor_id' => $validated['doctor_id'],
                'location_id' => $validated['location_id'] ?? null,
                'date_appointment' => $validated['date_appointment'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'is_active' => true,
            ]);

            \Log::info('Schedule created with ID:', ['id' => $schedule->id]);

            return redirect('/admin/doctor-schedules')->with('success', 'Schedule created successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed:', ['errors' => $e->errors()]);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            \Log::error('Schedule creation failed:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return back()->with('error', 'Failed to create schedule: ' . $e->getMessage());
        }
    }

    public function update(Request $request, DoctorSchedule $doctorSchedule)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'location_id' => 'nullable|exists:locations,id',
            'date_appointment' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        $doctorSchedule->update([
            'doctor_id' => $validated['doctor_id'],
            'location_id' => $validated['location_id'] ?? null,
            'date_appointment' => $validated['date_appointment'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect('/admin/doctor-schedules')->with('success', 'Schedule updated successfully');
    }

    public function destroy(DoctorSchedule $doctorSchedule)
    {
        $doctorSchedule->delete();

        return redirect('/admin/doctor-schedules')->with('success', 'Schedule deleted successfully');
    }
}