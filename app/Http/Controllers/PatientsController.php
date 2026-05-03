<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class PatientsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');

        $patients = Patient::with('user')
            ->when($search, fn($query) => 
                $query->whereHas('user', fn($q) => 
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                )
            )
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $patients->getCollection()->transform(fn($p) => [
            'id' => $p->id,
            'user_id' => $p->user_id,
            'user' => ['name' => $p->user->name ?? 'N/A', 'email' => $p->user->email ?? '', 'phone' => $p->user->phone ?? ''],
            'dob' => $p->dob ? $p->dob->format('Y-m-d') : null,
            'gender' => $p->gender,
            'medical_notes' => $p->medical_notes,
            'created_at' => $p->created_at,
        ]);

        return Inertia::render('admin/patients', [
            'patients' => $patients,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'dob' => 'nullable|date',
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'medical_notes' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => bcrypt($validated['password']),
            'role' => 'patient',
        ]);

        Patient::create([
            'user_id' => $user->id,
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'medical_notes' => $validated['medical_notes'] ?? null,
        ]);

        return redirect('/admin/patients')->with('success', 'Patient created successfully');
    }

    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($patient->user_id)],
            'phone' => 'nullable|string|max:20',
            'dob' => 'nullable|date',
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'medical_notes' => 'nullable|string',
        ]);

        $patient->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ]);

        $patient->update([
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'medical_notes' => $validated['medical_notes'] ?? null,
        ]);

        return redirect('/admin/patients')->with('success', 'Patient updated successfully');
    }

    public function destroy(Patient $patient)
    {
        $user = $patient->user;
        $patient->delete();
        $user->delete();

        return redirect('/admin/patients')->with('success', 'Patient deleted successfully');
    }
}