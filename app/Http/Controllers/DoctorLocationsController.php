<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Location;
use App\Models\DoctorLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorLocationsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $doctor = $user->doctor;

        if (!$doctor) {
            return back()->with('error', 'No doctor profile found.');
        }

        $search = $request->query('search', '');
        $locationFilter = $request->query('location', '');

        $doctorLocations = DoctorLocation::with(['doctor.user', 'location'])
            ->where('doctor_id', $doctor->id)
            ->when($locationFilter, fn($q) => $q->where('location_id', $locationFilter))
            ->when($search, fn($q) => $q->whereHas('location', fn($lq) =>
                $lq->where('name', 'like', "%{$search}%")
                   ->orWhere('address', 'like', "%{$search}%")
            ))
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $doctorLocations->getCollection()->transform(function ($dl) {
            return [
                'id' => $dl->location->id,
                'name' => $dl->location?->name ?? 'Unknown',
                'address' => $dl->location?->address,
                'city' => $dl->location?->city,
                'state' => $dl->location?->state,
                'zip' => $dl->location?->zip,
                'is_primary' => (bool) $dl->is_primary,
            ];
        });

        $availableLocations = Location::orderBy('name')->get()->map(fn($l) => [
            'id' => $l->id,
            'name' => $l->name,
        ]);

        return Inertia::render('doctor/locations', [
            'locations' => $doctorLocations,
            'filters' => [
                'search' => $search,
                'location' => $locationFilter,
            ],
            'doctorId' => $doctor->id,
            'availableLocations' => $availableLocations,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $doctor = $user->doctor;

        if (!$doctor) {
            return back()->with('error', 'No doctor profile found.');
        }

        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'is_primary' => 'boolean',
        ]);

        $exists = DoctorLocation::where('doctor_id', $doctor->id)
            ->where('location_id', $validated['location_id'])
            ->exists();

        if ($exists) {
            return back()->with('error', 'This location is already associated with your account.');
        }

        DoctorLocation::create([
            'doctor_id' => $doctor->id,
            'location_id' => $validated['location_id'],
            'is_primary' => $validated['is_primary'] ?? false,
        ]);

        return back()->with('success', 'Location added successfully.');
    }

    public function update(Request $request, Location $location)
    {
        $user = $request->user();
        $doctor = $user->doctor;

        if (!$doctor) {
            return back()->with('error', 'No doctor profile found.');
        }

        DoctorLocation::where('doctor_id', $doctor->id)
            ->where('location_id', $location->id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_primary' => 'boolean',
        ]);

        $location->update($validated);

        return back()->with('success', 'Location updated successfully.');
    }

    public function destroy(Request $request, Location $location)
    {
        $user = $request->user();
        $doctor = $user->doctor;

        if (!$doctor) {
            return back()->with('error', 'No doctor profile found.');
        }

        $pivot = DoctorLocation::where('doctor_id', $doctor->id)
            ->where('location_id', $location->id)
            ->firstOrFail();

        $pivot->delete();
        $location->delete();

        return back()->with('success', 'Location removed successfully.');
    }
}