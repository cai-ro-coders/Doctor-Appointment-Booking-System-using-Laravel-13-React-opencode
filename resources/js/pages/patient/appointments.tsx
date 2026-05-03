import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Search, User, Eye, X } from 'lucide-react';

interface Appointment {
    id: number;
    doctor: { user: { name: string }; photo_url: string | null } | null;
    location: { name: string } | null;
    schedule: { weekday: number; date_appointment: string | null; start_time: string; end_time: string } | null;
    scheduled_start: string | null;
    scheduled_end: string | null;
    status: string;
    type: string | null;
    created_at: string | null;
}

interface Props {
    appointments: {
        data: Appointment[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search: string; status: string };
    doctors: { id: number; user: { name: string } }[];
    success?: string;
    errors?: Record<string, string>;
}

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' },
];

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-green-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-500',
    no_show: 'bg-orange-500',
};

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatTime = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
};

const formatDateTime = (datetime: string | null): string => {
    if (!datetime) return '';
    const date = new Date(datetime);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

export default function PatientAppointments() {
    const props = usePage().props as unknown as Props;
    const appointments = props.appointments;
    const filters = props.filters;
    const success = props.success || '';
    const errors = props.errors || {};

    const sortedDoctors = [...(props.doctors || [])].sort((a, b) =>
        (a.user?.name || '').localeCompare(b.user?.name || '')
    );

    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [deleteAppointment, setDeleteAppointment] = useState<Appointment | null>(null);
    const [viewAppointment, setViewAppointment] = useState<Appointment | null>(null);

    const closeDeleteModal = () => setDeleteAppointment(null);
    const closeViewModal = () => setViewAppointment(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('search', search);
        if (statusFilter) url.searchParams.set('status', statusFilter);
        window.location.href = url.toString();
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        const url = new URL(window.location.href);
        if (status) {
            url.searchParams.set('status', status);
        } else {
            url.searchParams.delete('status');
        }
        window.location.href = url.toString();
    };

    const handleDelete = () => {
        if (!deleteAppointment) return;

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/patient/appointments/${deleteAppointment.id}`;
        
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = '_token';
            input.value = token;
            form.appendChild(input);
        }

        const method = document.createElement('input');
        method.type = 'hidden';
        method.name = '_method';
        method.value = 'DELETE';
        form.appendChild(method);

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <>
            <Head title="My Appointments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">My Appointments</h1>

                {success && (
                    <div className="rounded-lg bg-green-100 p-3 text-green-700 dark:bg-green-900 dark:text-green-300">
                        {success}
                    </div>
                )}

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by doctor name..."
                                    className="rounded-lg border border-gray-300 px-4 py-2 pl-10 dark:border-gray-600 dark:bg-gray-700"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b bg-gray-50 dark:bg-gray-700">
                                    <th className="p-3 text-left">Doctor</th>
                                    <th className="p-3 text-left">Location</th>
                                    <th className="p-3 text-left">Date & Time</th>
                                    <th className="p-3 text-left">Type</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-3 text-center text-gray-500">
                                            No appointments found
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.data.map((appointment) => (
                                        <tr key={appointment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    {appointment.doctor?.photo_url ? (
                                                        <img src={appointment.doctor.photo_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                                                            <User className="h-5 w-5 text-gray-500" />
                                                        </div>
                                                    )}
                                                    <span className="font-medium">
                                                        {appointment.doctor?.user?.name || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                {appointment.location?.name || '-'}
                                            </td>
                                            <td className="p-3">
                                                {appointment.scheduled_start ? (
                                                    <div>
                                                        <div className="font-medium">
                                                            {formatDateTime(appointment.scheduled_start)}
                                                        </div>
                                                        {appointment.scheduled_end && (
                                                            <div className="text-gray-500 text-sm">
                                                                to {formatDateTime(appointment.scheduled_end)}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : appointment.schedule ? (
                                                    <div>
                                                        <span className="font-medium">
                                                            {appointment.schedule.date_appointment 
                                                                ? appointment.schedule.date_appointment 
                                                                : weekdays[appointment.schedule.weekday]}
                                                        </span>
                                                        <span className="text-gray-500 text-sm ml-1">
                                                            {formatTime(appointment.schedule.start_time)} - {formatTime(appointment.schedule.end_time)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="p-3">{appointment.type || 'General'}</td>
                                            <td className="p-3">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs text-white ${
                                                        statusColors[appointment.status] || 'bg-gray-500'
                                                    }`}
                                                >
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setViewAppointment(appointment)}
                                                        className="rounded bg-blue-500 p-1 text-white hover:bg-blue-600"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteAppointment(appointment)}
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

                {viewAppointment && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Appointment Details</h2>
                                <button onClick={closeViewModal} className="text-gray-500 hover:text-gray-700">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Doctor</p>
                                    <p className="font-semibold">{viewAppointment.doctor?.user?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-semibold">{viewAppointment.location?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date & Time</p>
                                    <p className="font-semibold">
                                        {viewAppointment.scheduled_start ? (
                                            <span>
                                                {formatDateTime(viewAppointment.scheduled_start)}
                                                {viewAppointment.scheduled_end && (
                                                    <span> to {formatDateTime(viewAppointment.scheduled_end)}</span>
                                                )}
                                            </span>
                                        ) : viewAppointment.schedule ? (
                                            <span>
                                                {viewAppointment.schedule.date_appointment 
                                                    ? viewAppointment.schedule.date_appointment 
                                                    : weekdays[viewAppointment.schedule?.weekday || 0]}
                                                {' '}
                                                {viewAppointment.schedule?.start_time && formatTime(viewAppointment.schedule.start_time)}
                                                {viewAppointment.schedule?.end_time && ` - ${formatTime(viewAppointment.schedule.end_time)}`}
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Type</p>
                                    <p className="font-semibold">{viewAppointment.type || 'General'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`rounded-full px-2 py-1 text-xs text-white ${statusColors[viewAppointment.status] || 'bg-gray-500'}`}>
                                        {viewAppointment.status}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={closeViewModal}
                                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {deleteAppointment && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold">Confirm Delete</h2>
                            <p className="mb-4">
                                Are you sure you want to cancel this appointment?
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