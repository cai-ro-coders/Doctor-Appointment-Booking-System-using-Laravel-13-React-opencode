import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Clock, MapPin } from 'lucide-react';

interface Location {
    id: number;
    name: string;
}

interface DoctorSchedule {
    id: number;
    doctor: { id: number; user: { name: string } } | null;
    location: { id: number; name: string } | null;
    date_appointment: string;
    start_time: string;
    end_time: string;
    slot_length_minutes: number;
    buffer_minutes_before: number;
    buffer_minutes_after: number;
    is_active: boolean;
    created_at: string;
}

interface Props {
    schedules: {
        data: DoctorSchedule[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search: string; location: string };
    doctorId: number;
    locations: Location[];
}

export default function DoctorSchedules() {
    const props = usePage().props as unknown as Props & { success?: string };
    const schedules = props.schedules;
    const filters = props.filters;
    const locations = props.locations || [];
    const success = props.success || '';

    const [search, setSearch] = useState(filters.search || '');
    const [locationFilter, setLocationFilter] = useState(filters.location || '');
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<DoctorSchedule | null>(null);
    const [deleteSchedule, setDeleteSchedule] = useState<DoctorSchedule | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('search', search);
        window.location.href = url.toString();
    };

    const handleLocationFilter = (locationId: string) => {
        setLocationFilter(locationId);
        const url = new URL(window.location.href);
        if (locationId) {
            url.searchParams.set('location', locationId);
        } else {
            url.searchParams.delete('location');
        }
        window.location.href = url.toString();
    };

    const openEditModal = (schedule: DoctorSchedule) => {
        setEditingSchedule(schedule);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSchedule(null);
        setDeleteSchedule(null);
    };

    const handleDelete = () => {
        if (!deleteSchedule) return;
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/doctor/schedules/${deleteSchedule.id}`;
        
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
            <Head title="My Schedules - Doctor" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">My Schedules</div>

                {success && (
                    <div className="rounded-lg bg-green-100 p-3 text-green-700 dark:bg-green-900 dark:text-green-300">
                        {success}
                    </div>
                )}

                <div className="flex flex-wrap gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by day..."
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

                    <select
                        value={locationFilter}
                        onChange={(e) => handleLocationFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                    >
                        <option value="">All Locations</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>{location.name}</option>
                        ))}
                    </select>

                    {locationFilter && (
                        <button
                            onClick={() => handleLocationFilter('')}
                            className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>

                <button
                    onClick={() => {
                        setEditingSchedule(null);
                        setShowModal(true);
                    }}
                    className="w-fit flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                    <Plus className="h-4 w-4" />
                    Add Schedule
                </button>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Location</th>
                                    <th className="p-3">Day</th>
                                    <th className="p-3">Start Time</th>
                                    <th className="p-3">End Time</th>
                                    <th className="p-3">Slot (min)</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-3 text-center text-gray-500">
                                            No schedules found
                                        </td>
                                    </tr>
                                ) : (
                                    schedules.data.map((schedule) => (
                                        <tr key={schedule.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-3">{schedule.id}</td>
                                            <td className="p-3">{schedule.location?.name || 'All Locations'}</td>
                                            <td className="p-3">{schedule.date_appointment}</td>
                                            <td className="p-3">{schedule.start_time}</td>
                                            <td className="p-3">{schedule.end_time}</td>
                                            <td className="p-3">{schedule.slot_length_minutes}</td>
                                            <td className="p-3">
                                                <span className={`rounded-full px-2 py-1 text-xs text-white ${schedule.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                                                    {schedule.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEditModal(schedule)}
                                                        className="rounded bg-blue-500 p-1 text-white hover:bg-blue-600"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteSchedule(schedule)}
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

                {schedules.links && schedules.links.length > 0 && (
                    <div className="flex gap-2">
                        {schedules.links.map((link, index) => (
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
                                {editingSchedule ? 'Edit Schedule' : 'Add Schedule'}
                            </h2>
                            <form
                                method="POST"
                                action={
                                    editingSchedule
                                        ? `/doctor/schedules/${editingSchedule.id}`
                                        : '/doctor/schedules'
                                }
                                id="scheduleForm"
                            >
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                                {editingSchedule && <input type="hidden" name="_method" value="PATCH" />}
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Location</label>
                                    <select
                                        name="location_id"
                                        defaultValue={editingSchedule?.location?.id ?? ''}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <option value="">All Locations</option>
                                        {locations.map((location) => (
                                            <option key={location.id} value={location.id}>{location.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Date</label>
                                    <input
                                        type="date"
                                        name="date_appointment"
                                        defaultValue={editingSchedule?.date_appointment ?? ''}
                                        required
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Start Time</label>
                                    <input
                                        type="time"
                                        name="start_time"
                                        defaultValue={editingSchedule?.start_time || ''}
                                        required
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">End Time</label>
                                    <input
                                        type="time"
                                        name="end_time"
                                        defaultValue={editingSchedule?.end_time || ''}
                                        required
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Slot Length (minutes)</label>
                                    <input
                                        type="number"
                                        name="slot_length_minutes"
                                        defaultValue={editingSchedule?.slot_length_minutes || 30}
                                        min={5}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Buffer Before (minutes)</label>
                                    <input
                                        type="number"
                                        name="buffer_minutes_before"
                                        defaultValue={editingSchedule?.buffer_minutes_before || 0}
                                        min={0}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Buffer After (minutes)</label>
                                    <input
                                        type="number"
                                        name="buffer_minutes_after"
                                        defaultValue={editingSchedule?.buffer_minutes_after || 0}
                                        min={0}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            defaultChecked={editingSchedule?.is_active ?? true}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm font-medium">Active</span>
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
                                        {editingSchedule ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {deleteSchedule && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold">Confirm Delete</h2>
                            <p className="mb-4">
                                Are you sure you want to delete this schedule?
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