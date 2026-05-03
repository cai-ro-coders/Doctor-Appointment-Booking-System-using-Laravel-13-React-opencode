import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

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
    doctors: {
        data: Doctor[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search: string;
    };
    specialties: Specialty[];
    locations: Location[];
}

export default function AdminDoctors() {
    const props = usePage().props as unknown as Props;
    const doctors = props.doctors;
    const filters = props.filters;

    const [search, setSearch] = useState(filters.search || '');
    const [deleteDoctor, setDeleteDoctor] = useState<Doctor | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('search', search);
        window.location.href = url.toString();
    };

    const closeDeleteModal = () => {
        setDeleteDoctor(null);
    };

    const handleDelete = () => {
        if (!deleteDoctor) return;
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/admin/doctors/${deleteDoctor.id}`;
        
        const methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = '_method';
        methodInput.value = 'DELETE';
        form.appendChild(methodInput);
        
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '_token';
        tokenInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        form.appendChild(tokenInput);
        
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <>
            <Head title="Doctors - Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">Doctors Management</div>

                <div className="flex flex-wrap gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-lg border border-gray-300 pl-10 pr-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                            Search
                        </button>
                    </form>
                </div>

                <a
                    href="/admin/doctors/create"
                    className="w-fit flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                    <Plus className="h-4 w-4" />
                    Add Doctor
                </a>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Photo</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Fee</th>
                                    <th className="p-3">Specialties</th>
                                    <th className="p-3">Locations Clinic</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Created</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="p-3 text-center text-gray-500">
                                            No doctors found
                                        </td>
                                    </tr>
                                ) : (
                                    doctors.data.map((doctor) => (
                                        <tr key={doctor.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-3">{doctor.id}</td>
                                            <td className="p-3">
                                                {doctor.photo_url ? (
                                                    <img src={doctor.photo_url} alt={doctor.user?.name} className="h-10 w-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-gray-500 text-sm">{doctor.user?.name?.charAt(0) || '?'}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3">{doctor.user?.name || 'N/A'}</td>
                                            <td className="p-3">{doctor.user?.email || 'N/A'}</td>
                                            <td className="p-3">${doctor.consultation_fee || 0}</td>
                                            <td className="p-3">
                                                {doctor.specialties && doctor.specialties.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {doctor.specialties.slice(0, 2).map(s => (
                                                            <span key={s.id} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                                {s.name}
                                                            </span>
                                                        ))}
                                                        {doctor.specialties.length > 2 && (
                                                            <span className="text-xs text-gray-500">+{doctor.specialties.length - 2}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">None</span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                {doctor.locations && doctor.locations.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {doctor.locations.slice(0, 2).map(l => (
                                                            <span key={l.id} className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                {l.name}
                                                            </span>
                                                        ))}
                                                        {doctor.locations.length > 2 && (
                                                            <span className="text-xs text-gray-500">+{doctor.locations.length - 2}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">None</span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <span className={`rounded-full px-2 py-1 text-xs text-white ${doctor.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                                                    {doctor.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-3">{new Date(doctor.created_at).toLocaleDateString()}</td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <a
                                                        href={`/admin/doctors/${doctor.id}/edit`}
                                                        className="rounded bg-blue-500 p-1 text-white hover:bg-blue-600"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => setDeleteDoctor(doctor)}
                                                        className="rounded bg-red-500 p-1 text-white hover:bg-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {doctors.links && doctors.links.length > 0 && (
                    <div className="flex gap-2">
                        {doctors.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => link.url && window.location.assign(link.url)}
                                disabled={!link.url}
                                className={`rounded px-3 py-1 ${
                                    link.active
                                        ? 'bg-blue-500 text-white'
                                        : link.url
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {deleteDoctor && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold">Confirm Delete</h2>
                            <p className="mb-4">
                                Are you sure you want to delete doctor "{deleteDoctor.user?.name}"? This will also delete the associated user account.
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={closeDeleteModal}
                                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}