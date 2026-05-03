import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Search } from 'lucide-react';

interface Appointment {
    id: number;
    patient: { user: { name: string; email: string; phone: string }; medical_notes: string; dob: string | null; gender: string } | null;
    location: { name: string } | null;
    schedule: { weekday: number; date_appointment: string | null; start_time: string; end_time: string } | null;
    scheduled_start: string | null;
    scheduled_end: string | null;
    date_appointment: string;
    schedule_id: number;
    status: string;
    type: string;
}

interface Patient {
    id: number;
    user: { name: string };
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
    filters: {
        search: string;
        status: string;
        date: string;
    };
    patients: Patient[];
    doctorId: number;
}

const statusOptions = [
    { value: '', label: 'All Statuses' },
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

export default function DoctorAppointments() {
    const props = usePage().props as unknown as Props & { errors?: Record<string, string>; success?: string };
    const appointments = props.appointments;
    const filters = props.filters;
    const success = props.success || '';

    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [dateFilter, setDateFilter] = useState(filters.date || '');
    const [deleteAppointment, setDeleteAppointment] = useState<Appointment | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('search', search);
        if (statusFilter) url.searchParams.set('status', statusFilter);
        if (dateFilter) url.searchParams.set('date', dateFilter);
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
        if (dateFilter) url.searchParams.set('date', dateFilter);
        window.location.href = url.toString();
    };

    const handleDateFilter = (date: string) => {
        setDateFilter(date);
        const url = new URL(window.location.href);
        if (date) {
            url.searchParams.set('date', date);
        } else {
            url.searchParams.delete('date');
        }
        if (statusFilter) url.searchParams.set('status', statusFilter);
        window.location.href = url.toString();
    };

    const updateStatus = async (appointmentId: number, newStatus: string) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        
        try {
            const response = await fetch(`/doctor/appointments/${appointmentId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleTodayAppointments = () => {
        const today = new Date().toISOString().split('T')[0];
        handleDateFilter(today);
    };

    const openEditModal = (appointment: Appointment) => {
        setEditingAppointment(appointment);
        setPatientSearch(appointment.patient?.user?.name || '');
        const patient = sortedPatients.find(p => p.user?.name === appointment.patient?.user?.name);
        setSelectedPatientId(patient?.id || 0);
        setShowModal(true);
    };

    const closeModal = () => {
        setDeleteAppointment(null);
    };

    const handleDelete = () => {
        if (!deleteAppointment) return;
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/doctor/appointments/${deleteAppointment.id}`;
        
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
            <Head title="Appointments - Doctor" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">My Appointments</div>

                {success && (
                    <div className="rounded-lg bg-green-100 p-3 text-green-700 dark:bg-green-900 dark:text-green-300">
                        {success}
                    </div>
                )}

                <div className="flex flex-wrap gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search by patient name..."
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

                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => handleDateFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                    />

                    <button
                        onClick={handleTodayAppointments}
                        className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                        Today
                    </button>

                    {(statusFilter || dateFilter) && (
                        <button
                            onClick={() => {
                                setStatusFilter('');
                                setDateFilter('');
                                const url = new URL(window.location.href);
                                url.searchParams.delete('status');
                                url.searchParams.delete('date');
                                window.location.href = url.toString();
                            }}
                            className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Patient</th>
                                    <th className="p-3">Date & Time</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Actions</th>
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
                                            <td className="p-3">{appointment.id}</td>
                                            <td className="p-3">{appointment.patient?.user?.name || 'N/A'}</td>
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
                                                            {appointment.schedule.date_appointment || weekdays[appointment.schedule.weekday]}
                                                        </span>
                                                        <span className="text-gray-500 text-sm ml-1">
                                                            {formatTime(appointment.schedule.start_time)} - {formatTime(appointment.schedule.end_time)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    appointment.date_appointment || '-'
                                                )}
                                            </td>
                                            <td className="p-3">{appointment.type || 'General'}</td>
                                            <td className="p-3">
                                                <select
                                                    value={appointment.status}
                                                    onChange={(e) => updateStatus(appointment.id, e.target.value)}
                                                    className={`rounded-full px-2 py-1 text-xs text-white border-0 cursor-pointer ${
                                                        statusColors[appointment.status] || 'bg-gray-500'
                                                    }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="no_show">No Show</option>
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/doctor/appointments/${appointment.id}/view`}
                                                        className="rounded bg-green-500 p-1 text-white hover:bg-green-600"
                                                    >
                                                        <Search className="h-4 w-4" />
                                                    </Link>
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

                {appointments.links && appointments.links.length > 0 && (
                    <div className="flex gap-2">
                        {appointments.links.map((link, index) => (
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

                {deleteAppointment && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold">Confirm Delete</h2>
                            <p className="mb-4">
                                Are you sure you want to delete this appointment?
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