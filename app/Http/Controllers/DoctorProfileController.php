<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class DoctorProfileController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $doctor = $user->doctor;
        
        $doctor->load('specialties', 'locations');
        
        $allSpecialties = Specialty::orderBy('name', 'asc')->get();
        $allLocations = Location::orderBy('name', 'asc')->get();
        
        return Inertia::render('doctor/profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'profile_data' => $user->profile_data ?? [],
            ],
            'doctor' => [
                'id' => $doctor->id,
                'bio' => $doctor->bio ?? '',
                'photo_url' => $doctor->photo_url ?? null,
                'consultation_fee' => $doctor->consultation_fee ?? 0,
                'is_active' => $doctor->is_active,
                'specialties' => $doctor->specialties->map(fn($s) => ['id' => $s->id, 'name' => $s->name]),
                'locations' => $doctor->locations->map(fn($l) => ['id' => $l->id, 'name' => $l->name, 'address' => $l->address]),
            ],
            'allSpecialties' => $allSpecialties,
            'allLocations' => $allLocations,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $doctor = $user->doctor;
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
            'consultation_fee' => 'nullable|numeric|min:0',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'specialties' => 'nullable|array',
            'specialties.*' => 'exists:specialties,id',
            'locations' => 'nullable|array',
            'locations.*' => 'exists:locations,id',
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:8',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ]);

        $photoUrl = $doctor->photo_url;
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $filename = 'doctor_' . $doctor->id . '_' . time() . '.' . $photo->getClientOriginalExtension();
            $path = $photo->storeAs('doctors', $filename, 'public');
            $photoUrl = '/storage/' . $path;
        }

        $doctor->update([
            'bio' => $validated['bio'] ?? null,
            'consultation_fee' => $validated['consultation_fee'] ?? 0,
            'photo_url' => $photoUrl,
        ]);

        if ($request->has('specialties')) {
            $doctor->specialties()->sync($request->input('specialties'));
        }

        if ($request->has('locations')) {
            $doctor->locations()->sync($request->input('locations'));
        }

        if ($request->filled('current_password') && $request->filled('new_password')) {
            if (!Hash::check($request->input('current_password'), $user->password)) {
                return back()->with('error', 'Current password is incorrect');
            }
            $user->update([
                'password' => Hash::make($request->input('new_password')),
            ]);
        }

        return back()->with('success', 'Profile updated successfully');
    }
}