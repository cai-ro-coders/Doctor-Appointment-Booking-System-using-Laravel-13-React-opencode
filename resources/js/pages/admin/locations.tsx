import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';

interface Location {
    id: number;
    name: string;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    latitude: number | null;
    longitude: number | null;
    created_at: string;
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
}

interface FormErrors {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    latitude?: string;
    longitude?: string;
}

export default function AdminLocations() {
    const props = usePage().props as unknown as Props;
    const locations = props.locations;
    const filters = props.filters;

    const [search, setSearch] = useState(filters.search || '');
    const [deleteLocation, setDeleteLocation] = useState<Location | null>(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        latitude: '',
        longitude: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('search', search);
        window.location.href = url.toString();
    };

    const clearFilters = () => {
        setSearch('');
        window.location.href = '/admin/locations';
    };

    const closeDeleteModal = () => {
        setDeleteLocation(null);
    };

    const handleDelete = () => {
        if (!deleteLocation) return;
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/admin/locations/${deleteLocation.id}`;
        
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

    const openAddModal = () => {
        setEditingLocation(null);
        setFormData({
            name: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            latitude: '',
            longitude: '',
        });
        setErrors({});
        setShowFormModal(true);
    };

    const openEditModal = (location: Location) => {
        setEditingLocation(location);
        setFormData({
            name: location.name,
            address: location.address || '',
            city: location.city || '',
            state: location.state || '',
            zip: location.zip || '',
            latitude: location.latitude?.toString() || '',
            longitude: location.longitude?.toString() || '',
        });
        setErrors({});
        setShowFormModal(true);
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setEditingLocation(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const url = editingLocation 
            ? `/admin/locations/${editingLocation.id}`
            : '/admin/locations';
        
        const method = editingLocation ? 'put' : 'post';

        router[method](url, formData, {
            onSuccess: () => {
                closeFormModal();
            },
            onError: (err) => {
                setErrors(err as FormErrors);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    useEffect(() => {
        if (showFormModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showFormModal]);

    return (
        <>
            <Head title="Locations - Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">Locations Management</div>

                <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, city, or address..."
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
                    {search && (
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
                    Add Location
                </button>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Address</th>
                                    <th className="p-3">City</th>
                                    <th className="p-3">State</th>
                                    <th className="p-3">Zip</th>
                                    <th className="p-3">Created</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-3 text-center text-gray-500">
                                            No locations found
                                        </td>
                                    </tr>
                                ) : (
                                    locations.data.map((location) => (
                                        <tr key={location.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-3">{location.id}</td>
                                            <td className="p-3 font-medium">{location.name}</td>
                                            <td className="p-3">{location.address || '-'}</td>
                                            <td className="p-3">{location.city || '-'}</td>
                                            <td className="p-3">{location.state || '-'}</td>
                                            <td className="p-3">{location.zip || '-'}</td>
                                            <td className="p-3">{new Date(location.created_at).toLocaleDateString()}</td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEditModal(location)}
                                                        className="rounded bg-blue-500 p-1 text-white hover:bg-blue-600"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
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

                {deleteLocation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold">Confirm Delete</h2>
                            <p className="mb-4">
                                Are you sure you want to delete location "{deleteLocation.name}"?
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

                {showFormModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold">
                                    {editingLocation ? 'Edit Location' : 'Add New Location'}
                                </h2>
                                <button
                                    onClick={closeFormModal}
                                    className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className={`mt-1 w-full rounded-lg border px-3 py-2 dark:bg-gray-700 ${
                                            errors.name 
                                                ? 'border-red-500' 
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`mt-1 w-full rounded-lg border px-3 py-2 dark:bg-gray-700 ${
                                            errors.address 
                                                ? 'border-red-500' 
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`mt-1 w-full rounded-lg border px-3 py-2 dark:bg-gray-700 ${
                                                errors.city 
                                                    ? 'border-red-500' 
                                                    : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        />
                                        {errors.city && (
                                            <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                                        )}
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className={`mt-1 w-full rounded-lg border px-3 py-2 dark:bg-gray-700 ${
                                                errors.state 
                                                    ? 'border-red-500' 
                                                    : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        />
                                        {errors.state && (
                                            <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                                        )}
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">Zip Code</label>
                                        <input
                                            type="text"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            className={`mt-1 w-full rounded-lg border px-3 py-2 dark:bg-gray-700 ${
                                                errors.zip 
                                                    ? 'border-red-500' 
                                                    : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        />
                                        {errors.zip && (
                                            <p className="mt-1 text-sm text-red-500">{errors.zip}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">Latitude</label>
                                        <input
                                            type="number"
                                            name="latitude"
                                            step="0.00000001"
                                            value={formData.latitude}
                                            onChange={handleInputChange}
                                            placeholder="-90 to 90"
                                            className={`mt-1 w-full rounded-lg border px-3 py-2 dark:bg-gray-700 ${
                                                errors.latitude 
                                                    ? 'border-red-500' 
                                                    : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        />
                                        {errors.latitude && (
                                            <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>
                                        )}
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">Longitude</label>
                                        <input
                                            type="number"
                                            name="longitude"
                                            step="0.00000001"
                                            value={formData.longitude}
                                            onChange={handleInputChange}
                                            placeholder="-180 to 180"
                                            className={`mt-1 w-full rounded-lg border px-3 py-2 dark:bg-gray-700 ${
                                                errors.longitude 
                                                    ? 'border-red-500' 
                                                    : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        />
                                        {errors.longitude && (
                                            <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeFormModal}
                                        className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {processing 
                                            ? 'Saving...' 
                                            : editingLocation 
                                                ? 'Update' 
                                                : 'Create'
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
