import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';

interface Location {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    is_primary: boolean;
}

interface Props {
    locations: {
        data: Location[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search: string;
    };
    doctorId: number;
    availableLocations: { id: number; name: string }[];
}

export default function DoctorLocations() {
    const props = usePage().props as unknown as Props & { errors?: Record<string, string>; success?: string };
    const locations = props.locations;
    const filters = props.filters;
    const success = props.success || '';

    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [deleteLocation, setDeleteLocation] = useState<Location | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('search', search);
        window.location.href = url.toString();
    };

    const closeModal = () => {
        setShowModal(false);
        setDeleteLocation(null);
    };

    const handleDelete = () => {
        if (!deleteLocation) return;

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/doctor/locations/${deleteLocation.id}`;

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
            <Head title="Locations - Doctor" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">My Clinic Locations</div>

                {success && (
                    <div className="rounded-lg bg-green-100 p-3 text-green-700 dark:bg-green-900 dark:text-green-300">
                        {success}
                    </div>
                )}

                <div className="flex flex-wrap gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search by name, address, or city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                            Search
                        </button>
                    </form>

                    {filters.search && (
                        <button
                            onClick={() => {
                                const url = new URL(window.location.href);
                                url.searchParams.delete('search');
                                window.location.href = url.toString();
                            }}
                            className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        >
                            Clear Search
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="w-fit flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                    <Plus className="h-4 w-4" />
                    Add Location
                </button>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">Clinic Name</th>
                                    <th className="p-3">Address</th>
                                    <th className="p-3">City</th>
                                    <th className="p-3">Primary</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-3 text-center text-gray-500">
                                            No locations found
                                        </td>
                                    </tr>
                                ) : (
                                    locations.data.map((location) => (
                                        <tr key={location.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-3 font-medium">{location.name || 'N/A'}</td>
                                            <td className="p-3">{location.address || 'N/A'}</td>
                                            <td className="p-3">{location.city || 'N/A'}</td>
                                            <td className="p-3">
                                                {location.is_primary ? (
                                                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                                        Primary
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">No</span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setDeleteLocation(location)}
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

                {locations.links && locations.links.length > 0 && (
                    <div className="flex gap-2">
                        {locations.links.map((link, index) => (
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
                            <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Add Location
                            </h2>
                            <form
                                method="POST"
                                action="/doctor/locations"
                                id="locationForm"
                            >
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />

                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Clinic Name</label>
                                    <select
                                        name="location_id"
                                        required
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <option value="">Select a clinic...</option>
                                        {props.availableLocations.map((loc) => (
                                            <option key={loc.id} value={loc.id}>
                                                {loc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="flex items-center gap-2 text-sm font-medium">
                                        <input
                                            type="checkbox"
                                            name="is_primary"
                                            value="1"
                                            className="rounded border-gray-300"
                                        />
                                        Set as primary location
                                    </label>
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
                                        Add
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
                                Are you sure you want to delete this location?
                            </p>
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