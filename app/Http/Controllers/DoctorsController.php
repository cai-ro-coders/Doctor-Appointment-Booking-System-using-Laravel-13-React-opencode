<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Location;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class DoctorsController extends Controller
{
    public function create()
    {
        $specialties = Specialty::orderBy('name', 'asc')->get();
        $locations = Location::orderBy('name', 'asc')->get();

        return Inertia::render('admin/doctor-form', [
            'doctor' => null,
            'specialties' => $specialties,
            'locations' => $locations,
            'isEditing' => false,
        ]);
    }

    public function edit(Doctor $doctor)
    {
        $doctor->load(['user', 'specialties', 'locations']);
        $specialties = Specialty::orderBy('name', 'asc')->get();
        $locations = Location::orderBy('name', 'asc')->get();

        return Inertia::render('admin/doctor-form', [
            'doctor' => $doctor,
            'specialties' => $specialties,
            'locations' => $locations,
            'isEditing' => true,
        ]);
    }

    public function index(Request $request)
    {
        $search = $request->query('search', '');

        $doctors = Doctor::with(['user', 'specialties', 'locations'])
            ->when($search, fn($query) => 
                $query->whereHas('user', fn($q) => 
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                )
            )
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $specialties = Specialty::orderBy('name', 'asc')->get();
        $locations = Location::orderBy('name', 'asc')->get();

        return Inertia::render('admin/doctors', [
            'doctors' => $doctors,
            'filters' => [
                'search' => $search,
            ],
            'specialties' => $specialties,
            'locations' => $locations,
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('Doctor store request:', $request->all());
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'bio' => 'nullable|string',
            'consultation_fee' => 'nullable|numeric|min:0',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);
        
        \Log::info('Validated data:', $validated);

        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
                'role' => 'doctor',
            ]);

            $photoUrl = null;
            if ($request->hasFile('photo')) {
                $photo = $request->file('photo');
                $filename = 'doctor_' . $user->id . '_' . time() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('doctors', $filename, 'public');
                $photoUrl = '/storage/' . $path;
            }

            $doctor = Doctor::create([
                'user_id' => $user->id,
                'bio' => $validated['bio'] ?? null,
                'consultation_fee' => $validated['consultation_fee'] ?? 0,
                'photo_url' => $photoUrl,
                'is_active' => $request->boolean('is_active', true),
            ]);

            if ($request->has('specialties')) {
                $doctor->specialties()->attach($request->input('specialties'));
            }

            if ($request->has('locations')) {
                $doctor->locations()->attach($request->input('locations'));
            }

            return redirect('/admin/doctors')->with('success', 'Doctor created successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create doctor: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Doctor $doctor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($doctor->user_id)],
            'bio' => 'nullable|string',
            'consultation_fee' => 'nullable|numeric|min:0',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $doctor->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
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
            'is_active' => $request->boolean('is_active', true),
        ]);

        if ($request->has('specialties')) {
            $doctor->specialties()->sync($request->input('specialties'));
        } else {
            $doctor->specialties()->sync([]);
        }

        if ($request->has('locations')) {
            $doctor->locations()->sync($request->input('locations'));
        } else {
            $doctor->locations()->sync([]);
        }

        return redirect('/admin/doctors')->with('success', 'Doctor updated successfully');
    }

    public function destroy(Doctor $doctor)
    {
        $user = $doctor->user;
        $doctor->delete();
        $user->delete();

        return redirect('/admin/doctors')->with('success', 'Doctor deleted successfully');
    }
}