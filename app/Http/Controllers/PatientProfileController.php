<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class PatientProfileController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $patient = $user->patient;

        return Inertia::render('patient/profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
            ],
            'patient' => [
                'id' => $patient->id,
                'dob' => $patient->dob ? $patient->dob->format('Y-m-d') : null,
                'gender' => $patient->gender,
                'medical_notes' => $patient->medical_notes,
            ],
            'errors' => $request->session()->get('errors') ? $request->session()->get('errors')->getBag('default')->getMessages() : [],
            'success' => $request->session()->get('success'),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $patient = $user->patient;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'dob' => 'nullable|date',
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'medical_notes' => 'nullable|string',
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:8',
            'confirm_password' => 'nullable|string|same:new_password',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ];

        if (!empty($validated['new_password'])) {
            if (empty($validated['current_password'])) {
                return back()->with('error', 'Current password is required to change password');
            }
            if (!\Hash::check($validated['current_password'], $user->password)) {
                return back()->with('error', 'Current password is incorrect');
            }
            $userData['password'] = bcrypt($validated['new_password']);
        }

        $user->update($userData);

        $patient->update([
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'medical_notes' => $validated['medical_notes'] ?? null,
        ]);

        return back()->with('success', 'Profile updated successfully');
    }
}