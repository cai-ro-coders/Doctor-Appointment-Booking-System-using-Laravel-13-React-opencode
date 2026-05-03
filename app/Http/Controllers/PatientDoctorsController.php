<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\Location;
use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientDoctorsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $specialtyId = $request->query('specialty', '');

        $doctors = Doctor::query()
            ->with(['user', 'specialties'])
            ->when($search, fn($query) =>
                $query->whereHas('user', fn($q) =>
                    $q->where('name', 'like', "%{$search}%")
                )
            )
            ->when($specialtyId, fn($query) =>
                $query->whereHas('specialties', fn($q) =>
                    $q->where('specialties.id', $specialtyId)
                )
            )
            ->paginate(12)
            ->withQueryString();

        $doctors->getCollection()->transform(fn($d) => [
            'id' => $d->id,
            'user' => ['name' => $d->user->name ?? 'N/A', 'email' => $d->user->email ?? ''],
            'photo_url' => $d->photo_url,
            'bio' => $d->bio,
            'consultation_fee' => $d->consultation_fee,
            'is_active' => $d->is_active,
            'specialties' => $d->specialties->map(fn($s) => ['id' => $s->id, 'name' => $s->name]),
        ]);

        $specialties = Specialty::orderBy('name', 'asc')->get();

        return Inertia::render('patient/doctors', [
            'doctors' => $doctors,
            'filters' => [
                'search' => $search,
                'specialty' => $specialtyId,
            ],
            'specialties' => $specialties,
        ]);
    }

    public function show(Doctor $doctor, Request $request)
    {
        $locationId = $request->query('location', '');
        
        $doctor->load(['user', 'specialties', 'locations']);
        
        if ($locationId) {
            $doctor->load(['schedules' => fn($q) => $q->where('location_id', $locationId)->where('is_active', true)]);
        } else {
            $doctor->load(['schedules' => fn($q) => $q->where('is_active', true)]);
        }
        
        $allLocations = $doctor->locations;
        
        if ($allLocations->isEmpty()) {
            $allLocations = Location::orderBy('name')->get();
        }
        
        return Inertia::render('patient/doctor-profile', [
            'doctor' => [
                'id' => $doctor->id,
                'user' => [
                    'name' => $doctor->user->name ?? 'N/A',
                    'email' => $doctor->user->email ?? '',
                ],
                'photo_url' => $doctor->photo_url,
                'bio' => $doctor->bio,
                'consultation_fee' => $doctor->consultation_fee,
                'rating' => $doctor->rating ?? 0,
                'is_active' => $doctor->is_active,
                'specialties' => $doctor->specialties->map(fn($s) => ['id' => $s->id, 'name' => $s->name]),
                'locations' => $allLocations->map(fn($l) => [
                    'id' => $l->id,
                    'name' => $l->name,
                    'address' => $l->address ?? '',
                ]),
                'schedules' => $doctor->schedules->map(fn($s) => [
                    'id' => $s->id,
                    'location_id' => $s->location_id,
                    'weekday' => $s->weekday,
                    'date_appointment' => $s->date_appointment,
                    'start_time' => $s->start_time,
                    'end_time' => $s->end_time,
                    'slot_length_minutes' => $s->slot_length_minutes,
                ]),
            ],
            'filters' => [
                'location' => $locationId,
            ],
            'allLocations' => $allLocations->map(fn($l) => ['id' => $l->id, 'name' => $l->name]),
            'success' => $request->session()->get('success'),
            'errors' => $request->session()->get('errors') ? $request->session()->get('errors')->getBag('default')->getMessages() : [],
        ]);
    }

    public function book(Request $request, Doctor $doctor)
    {
        $user = $request->user();
        $patient = $user->patient;

        if (!$patient) {
            return back()->with('error', 'You must be a patient to book an appointment.');
        }

        $validated = $request->validate([
            'location_id' => 'nullable|exists:locations,id',
            'date_appointment' => 'required|date',
            'scheduled_start' => 'required',
            'scheduled_end' => 'required',
            'type' => 'nullable|string|max:255',
        ]);

        Appointment::create([
            'uuid' => \Illuminate\Support\Str::uuid(),
            'doctor_id' => $doctor->id,
            'patient_id' => $patient->id,
            'location_id' => $validated['location_id'] ?? null,
            'date_appointment' => $validated['date_appointment'],
            'scheduled_start' => $validated['scheduled_start'],
            'scheduled_end' => $validated['scheduled_end'],
            'status' => 'pending',
            'type' => $validated['type'] ?? 'General',
            'booking_source' => 'web',
        ]);

        return redirect('/patient/appointments')->with('success', 'Appointment booked successfully!');
    }
}