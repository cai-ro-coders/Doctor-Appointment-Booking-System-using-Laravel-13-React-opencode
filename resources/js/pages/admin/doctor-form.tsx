import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Specialty {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
    address: string | null;
    city: string | null;
}

interface Doctor {
    id: number;
    user: {
        name: string;
        email: string;
    };
    bio: string | null;
    photo_url: string | null;
    consultation_fee: number;
    is_active: boolean;
    created_at: string;
    specialties?: Specialty[];
    locations?: Location[];
}

interface Props {
    doctor?: Doctor | null;
    specialties: Specialty[];
    locations: Location[];
    isEditing: boolean;
}

export default function DoctorForm() {
    const props = usePage().props as unknown as Props;
    const { doctor, specialties, locations, isEditing } = props;

    const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>(
        doctor?.specialties?.map(s => s.id) || []
    );
    const [selectedLocations, setSelectedLocations] = useState<number[]>(
        doctor?.locations?.map(l => l.id) || []
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '_token';
        tokenInput.value = csrfToken;
        form.appendChild(tokenInput);
        
        if (isEditing) {
            const methodInput = document.createElement('input');
            methodInput.type = 'hidden';
            methodInput.name = '_method';
            methodInput.value = 'PATCH';
            form.appendChild(methodInput);
        }
        
        selectedSpecialties.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'specialties[]';
            input.value = id.toString();
            form.appendChild(input);
        });
        
        selectedLocations.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'locations[]';
            input.value = id.toString();
            form.appendChild(input);
        });
        
        form.submit();
    };

    return (
        <>
            <Head title={isEditing ? 'Edit Doctor' : 'Add Doctor'} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <a 
                        href="/admin/doctors" 
                        className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </a>
                    <div className="text-2xl font-bold">
                        {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
                    </div>
                </div>

                <div className="max-w-4xl rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                    <form 
                        method="POST" 
                        action={isEditing ? `/admin/doctors/${doctor?.id}` : '/admin/doctors'}
                        encType="multipart/form-data"
                        onSubmit={handleSubmit}
                    >
                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                        {isEditing && <input type="hidden" name="_method" value="PATCH" />}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={doctor?.user?.name || ''}
                                    required
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={doctor?.user?.email || ''}
                                    required
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            
                            {!isEditing && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        minLength={8}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                            )}
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Consultation Fee</label>
                                <input
                                    type="number"
                                    name="consultation_fee"
                                    defaultValue={doctor?.consultation_fee || 0}
                                    min={0}
                                    step={0.01}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Photo</label>
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                />
                                {doctor?.photo_url && (
                                    <div className="mt-2">
                                        <img src={doctor.photo_url} alt="Doctor" className="h-20 w-20 rounded-full object-cover" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="mb-4 flex items-center">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        defaultChecked={doctor?.is_active ?? true}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm font-medium">Active</span>
                                </label>
                            </div>
                            
                            <div className="mb-4 md:col-span-2">
                                <label className="block text-sm font-medium">Bio</label>
                                <textarea
                                    name="bio"
                                    defaultValue={doctor?.bio || ''}
                                    rows={3}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Specialties</label>
                                <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700">
                                    {specialties.map((specialty) => (
                                        <label key={specialty.id} className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600">
                                            <input
                                                type="checkbox"
                                                checked={selectedSpecialties.includes(specialty.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedSpecialties([...selectedSpecialties, specialty.id]);
                                                    } else {
                                                        setSelectedSpecialties(selectedSpecialties.filter(id => id !== specialty.id));
                                                    }
                                                }}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm">{specialty.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Locations</label>
                                <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700">
                                    {locations.map((location) => (
                                        <label key={location.id} className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600">
                                            <input
                                                type="checkbox"
                                                checked={selectedLocations.includes(location.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedLocations([...selectedLocations, location.id]);
                                                    } else {
                                                        setSelectedLocations(selectedLocations.filter(id => id !== location.id));
                                                    }
                                                }}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm">{location.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                            <a
                                href="/admin/doctors"
                                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </a>
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            >
                                {isEditing ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}