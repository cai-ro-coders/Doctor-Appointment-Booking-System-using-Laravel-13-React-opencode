import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

interface Doctor {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
    address: string | null;
    city: string | null;
}

interface DoctorLocation {
    id: number;
    doctor_id: number;
    location_id: number;
    is_primary: boolean;
    created_at: string;
    doctor_name: string;
    doctor_email: string;
    doctor_photo: string | null;
    location_name: string;
    location_address: string | null;
    location_city: string | null;
}

interface Props {
    doctorLocations: {
        data: DoctorLocation[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search: string;
        doctor: string;
        location: string;
    };
    doctors: Doctor[];
    locations: Location[];
}

export default function AdminDoctorLocations() {
    const props = usePage().props as unknown as Props;
    const doctorLocations = props.doctorLocations;
    const filters = props.filters;

    const [search, setSearch] = useState(filters.search || '');
    const [selectedDoctor, setSelectedDoctor] = useState(filters.doctor || '');
    const [selectedLocation, setSelectedLocation] = useState(filters.location || '');
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState<DoctorLocation | null>(null);
    const [deleteLocation, setDeleteLocation] = useState<DoctorLocation | null>(null);
    const [formDoctor, setFormDoctor] = useState<number | ''>('');
    const [formLocation, setFormLocation] = useState<number | ''>('');
    const [formIsPrimary, setFormIsPrimary] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('search', search);
        url.searchParams.set('doctor', selectedDoctor);
        url.searchParams.set('location', selectedLocation);
        window.location.href = url.toString();
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedDoctor('');
        setSelectedLocation('');
        window.location.href = '/admin/doctor-locations';
    };

    const openAddModal = () => {
        setEditingLocation(null);
        setFormDoctor('');
        setFormLocation('');
        setFormIsPrimary(false);
        setShowModal(true);
    };

    const openEditModal = (doctorLocation: DoctorLocation) => {
        setEditingLocation(doctorLocation);
        setFormDoctor(doctorLocation.doctor_id);
        setFormLocation(doctorLocation.location_id);
        setFormIsPrimary(doctorLocation.is_primary);
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        
        const formData = new FormData(form);
        const doctorId = formData.get('doctor_id');
        const locationId = formData.get('location_id');
        
        console.log('Submitting doctor_id:', doctorId, 'location_id:', locationId);
        
        const action = editingLocation
            ? `/admin/doctor-locations/${editingLocation.id}`
            : '/admin/doctor-locations';
            
        const submitForm = document.createElement('form');
        submitForm.method = 'POST';
        submitForm.action = action;
        
        const token = document.createElement('input');
        token.type = 'hidden';
        token.name = '_token';
        token.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        submitForm.appendChild(token);
        
        if (editingLocation) {
            const methodInput = document.createElement('input');
            methodInput.type = 'hidden';
            methodInput.name = '_method';
            methodInput.value = 'PATCH';
            submitForm.appendChild(methodInput);
        }
        
        if (doctorId) {
            const docInput = document.createElement('input');
            docInput.type = 'hidden';
            docInput.name = 'doctor_id';
            docInput.value = doctorId.toString();
            submitForm.appendChild(docInput);
        }
        
        if (locationId) {
            const locInput = document.createElement('input');
            locInput.type = 'hidden';
            locInput.name = 'location_id';
            locInput.value = locationId.toString();
            submitForm.appendChild(locInput);
        }
        
        const primaryInput = document.createElement('input');
        primaryInput.type = 'hidden';
        primaryInput.name = 'is_primary';
        primaryInput.value = formIsPrimary ? '1' : '0';
        submitForm.appendChild(primaryInput);
        
        document.body.appendChild(submitForm);
        submitForm.submit();
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingLocation(null);
        setDeleteLocation(null);
        setFormDoctor('');
        setFormLocation('');
        setFormIsPrimary(false);
    };

    const handleDelete = () => {
        if (!deleteLocation) return;
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/admin/doctor-locations/${deleteLocation.id}`;
        
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
            <Head title="Doctor Locations - Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">Doctor Locations Management</div>

                <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search doctor or location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded-lg border border-gray-300 pl-10 pr-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                        />
                    </div>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                    >
                        <option value="">All Doctors</option>
                        {props.doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                    >
                        <option value="">All Locations</option>
                        {props.locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                        Search
                    </button>
                    {(search || selectedDoctor || selectedLocation) && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            Clear
                        </button>
                    )}
                </form>

                <button
                    onClick={openAddModal}
                    className="w-fit flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                    <Plus className="h-4 w-4" />
                    Add Doctor Location
                </button>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Photo</th>
                                    <th className="p-3">Doctor</th>
                                    <th className="p-3">Location</th>
                                    <th className="p-3">Primary</th>
                                    <th className="p-3">Created</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctorLocations.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-3 text-center text-gray-500">
                                            No doctor locations found
                                        </td>
                                    </tr>
                                ) : (
                                    doctorLocations.data.map((dl) => (
                                        <tr key={dl.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-3">{dl.id}</td>
                                            <td className="p-3">
                                                {dl.doctor_photo ? (
                                                    <img src={dl.doctor_photo} alt={dl.doctor_name} className="h-10 w-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-gray-500 text-sm">{dl.doctor_name?.charAt(0) || '?'}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <div className="font-medium">{dl.doctor_name}</div>
                                                <div className="text-xs text-gray-500">{dl.doctor_email}</div>
                                            </td>
                                            <td className="p-3">
                                                <div className="font-medium">{dl.location_name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {dl.location_city || 'N/A'}
                                                    {dl.location_address && ` - ${dl.location_address}`}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                {dl.is_primary ? (
                                                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        Primary
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                        Regular
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3">{new Date(dl.created_at).toLocaleDateString()}</td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEditModal(dl)}
                                                        className="rounded bg-blue-500 p-1 text-white hover:bg-blue-600"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteLocation(dl)}
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

                {doctorLocations.links && doctorLocations.links.length > 0 && (
                    <div className="flex gap-2">
                        {doctorLocations.links.map((link, index) => (
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

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold">
                                {editingLocation ? 'Edit Doctor Location' : 'Add Doctor Location'}
                            </h2>
                            <form
                                id="doctorLocationForm"
                                onSubmit={handleSubmit}
                            >
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                                {editingLocation && <input type="hidden" name="_method" value="PATCH" />}
                                
                                {!editingLocation && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium">Doctor</label>
                                            <select
                                                name="doctor_id"
                                                value={formDoctor}
                                                onChange={(e) => setFormDoctor(Number(e.target.value) || '')}
                                                required
                                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                            >
                                                <option value="">Select Doctor</option>
                                                {props.doctors.map((doctor) => (
                                                    <option key={doctor.id} value={doctor.id}>
                                                        {doctor.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium">Location</label>
                                            <select
                                                name="location_id"
                                                value={formLocation}
                                                onChange={(e) => setFormLocation(Number(e.target.value) || '')}
                                                required
                                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                            >
                                                <option value="">Select Location</option>
                                                {props.locations.map((location) => (
                                                    <option key={location.id} value={location.id}>
                                                        {location.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                                
                                <div className="mb-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="is_primary"
                                            checked={formIsPrimary}
                                            onChange={(e) => setFormIsPrimary(e.target.checked)}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm font-medium">Set as Primary Location</span>
                                    </label>
                                    <p className="mt-1 text-xs text-gray-500">
                                        The primary location will be shown first for this doctor
                                    </p>
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                    >
                                        {editingLocation ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {deleteLocation && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold">Confirm Delete</h2>
                            <p className="mb-4">
                                Are you sure you want to remove this doctor-location association?
                            </p>
                            <div className="mb-4 rounded bg-gray-100 p-3 dark:bg-gray-700">
                                <div className="font-medium">{deleteLocation.doctor_name}</div>
                                <div className="text-sm text-gray-500">at {deleteLocation.location_name}</div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={closeModal}
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