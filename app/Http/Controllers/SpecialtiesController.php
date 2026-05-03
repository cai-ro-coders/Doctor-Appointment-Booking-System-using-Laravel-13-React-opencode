<?php

namespace App\Http\Controllers;

use App\Models\Specialty;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpecialtiesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');

        $specialties = Specialty::when($search, fn($query) => 
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
            )
            ->orderBy('name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/specialties', [
            'specialties' => $specialties,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:specialties,name',
            'description' => 'nullable|string',
        ]);

        Specialty::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return redirect('/admin/specialties')->with('success', 'Specialty created successfully');
    }

    public function update(Request $request, Specialty $specialty)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:specialties,name,' . $specialty->id,
            'description' => 'nullable|string',
        ]);

        $specialty->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return redirect('/admin/specialties')->with('success', 'Specialty updated successfully');
    }

    public function destroy(Specialty $specialty)
    {
        $specialty->delete();

        return redirect('/admin/specialties')->with('success', 'Specialty deleted successfully');
    }
}