import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';

interface Appointment {
    id: number;
    doctor: { user: { name: string } } | null;
    patient: { user: { name: string } } | null;
    location: { name: string } | null;
    schedule: { date_appointment: string | null; start_time: string; end_time: string } | null;
    date_appointment: string;
    schedule_id: number;
    status: string;
    type: string;
    scheduled_start?: string;
    scheduled_end?: string;
    location_id?: number;
}

interface Doctor {
    id: number;
    user: { name: string };
}

interface Patient {
    id: number;
    user: { name: string };
}

interface Location {
    id: number;
    name: string;
    city: string | null;
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
    };
    doctors: Doctor[];
    patients: Patient[];
    locations: Location[];
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

const formatTime = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
};

export default function AdminAppointments() {
    const props = usePage().props as unknown as Props;
    const appointments = props.appointments;
    const filters = props.filters;
    
    const sortedPatients = [...(props.patients || [])].sort((a, b) => 
        (a.user?.name || '').localeCompare(b.user?.name || '')
    );
    const sortedDoctors = [...(props.doctors || [])].sort((a, b) => 
        (a.user?.name || '').localeCompare(b.user?.name || '')
    );

    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [patientSearch, setPatientSearch] = useState('');
    const [doctorSearch, setDoctorSearch] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<number>(0);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number>(0);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [deleteAppointment, setDeleteAppointment] = useState<Appointment | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsAppointment, setDetailsAppointment] = useState<Appointment | null>(null);
    const [editType, setEditType] = useState('');
    const [editStatus, setEditStatus] = useState('pending');

    const filteredPatients = patientSearch
        ? sortedPatients.filter(p => 
            p.user?.name?.toLowerCase().includes(patientSearch.toLowerCase())
          )
        : sortedPatients;

    const filteredDoctors = doctorSearch
        ? sortedDoctors.filter(d => 
            d.user?.name?.toLowerCase().includes(doctorSearch.toLowerCase())
          )
        : sortedDoctors;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('search', search);
        if (selectedStatus) url.searchParams.set('status', selectedStatus);
        window.location.href = url.toString();
    };

    const handleStatusFilter = (status: string) => {
        const url = new URL(window.location.href);
        if (status) {
            url.searchParams.set('status', status);
        } else {
            url.searchParams.delete('status');
        }
        window.location.href = url.toString();
    };

    const openEditModal = (appointment: Appointment) => {
        setEditingAppointment(appointment);
        setPatientSearch(appointment.patient?.user?.name || '');
        setDoctorSearch(appointment.doctor?.user?.name || '');
        setEditType(appointment.type || '');
        setEditStatus(appointment.status || 'pending');
        setSelectedLocationId(appointment.location_id || null);
        const patient = sortedPatients.find(p => p.user?.name === appointment.patient?.user?.name);
        const doctor = sortedDoctors.find(d => d.user?.name === appointment.doctor?.user?.name);
        setSelectedPatientId(patient?.id || 0);
        setSelectedDoctorId(doctor?.id || 0);
        setShowModal(true);
    };

    const openDetailsModal = (appointment: Appointment) => {
        setDetailsAppointment(appointment);
        setShowDetailsModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAppointment(null);
        setDeleteAppointment(null);
        setShowDetailsModal(false);
        setDetailsAppointment(null);
        setEditType('');
        setEditStatus('pending');
        setSelectedLocationId(null);
    };

    const handleDelete = () => {
        if (!deleteAppointment) return;
        router.delete(`/admin/appointments/${deleteAppointment.id}`, {
            onSuccess: () => setDeleteAppointment(null),
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch(`/admin/appointments/${editingAppointment?.id}`, {
            patient_id: selectedPatientId,
            doctor_id: selectedDoctorId,
            location_id: selectedLocationId,
            type: editType,
            status: editStatus,
        }, {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <>
            <Head title="Appointments - Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">Appointments Management</div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-lg border border-gray-300 pl-10 pr-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                            />
                        </div>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
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
                    <a href="/admin/appointments/create" className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                        <Plus className="h-4 w-4" /> New Appointment
                    </a>
                </div>

                {/* Appointments Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Patient</th>
                                    <th className="p-3">Doctor</th>
                                    <th className="p-3">Location</th>
                                    <th className="p-3">Date & Time</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-3 text-center text-gray-500">
                                            No appointments found
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.data.map((appointment) => {
                                        let timeDisplay = '-';
                                        const scheduledStart = appointment.scheduled_start;
                                        const scheduledEnd = appointment.scheduled_end;
                                        
                                        if (scheduledStart && scheduledEnd) {
                                            const startParts = scheduledStart.split(' ');
                                            const endParts = scheduledEnd.split(' ');
                                            const startTime = startParts[1] ? formatTime(startParts[1]) : '';
                                            const endTime = endParts[1] ? formatTime(endParts[1]) : '';
                                            timeDisplay = startTime && endTime ? `${startTime} - ${endTime}` : '';
                                        } else if (appointment.schedule) {
                                            const startTime = appointment.schedule.start_time ? formatTime(appointment.schedule.start_time) : '';
                                            const endTime = appointment.schedule.end_time ? formatTime(appointment.schedule.end_time) : '';
                                            timeDisplay = startTime && endTime ? `${startTime} - ${endTime}` : '';
                                        }

                                        return (
                                            <tr key={appointment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="p-3">{appointment.id}</td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => openDetailsModal(appointment)}
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        {appointment.patient?.user?.name || 'N/A'}
                                                    </button>
                                                </td>
                                                <td className="p-3">
                                                    {appointment.doctor?.user?.name || 'N/A'}
                                                </td>
                                                <td className="p-3">
                                                    {appointment.location?.name || 'N/A'}
                                                </td>
                                                <td className="p-3">
                                                    <div>
                                                        <div>{appointment.date_appointment || '-'}</div>
                                                        {timeDisplay && <div className="text-sm text-gray-500">{timeDisplay}</div>}
                                                    </div>
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
                                                            onClick={() => openEditModal(appointment)}
                                                            className="rounded bg-blue-500 p-1 text-white hover:bg-blue-600"
                                                        >
                                                            <Pencil className="h-4 w-4" />
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
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
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

                {/* Edit Modal */}
                {showModal && editingAppointment && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold">Edit Appointment</h2>
                            <form onSubmit={handleEditSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Patient</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search patient..."
                                            value={patientSearch}
                                            onChange={(e) => setPatientSearch(e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                        />
                                        {patientSearch && selectedPatientId === 0 && (
                                            <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600">
                                                {filteredPatients.length === 0 ? (
                                                    <div className="p-2 text-gray-500">No patients found</div>
                                                ) : (
                                                    filteredPatients.slice(0, 10).map((patient) => (
                                                        <div
                                                            key={patient.id}
                                                            className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                            onClick={() => {
                                                                setPatientSearch(patient.user.name);
                                                                setSelectedPatientId(patient.id);
                                                            }}
                                                        >
                                                            {patient.user.name}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Doctor</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search doctor..."
                                            value={doctorSearch}
                                            onChange={(e) => setDoctorSearch(e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                        />
                                        {doctorSearch && selectedDoctorId === 0 && (
                                            <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600">
                                                {filteredDoctors.length === 0 ? (
                                                    <div className="p-2 text-gray-500">No doctors found</div>
                                                ) : (
                                                    filteredDoctors.slice(0, 10).map((doctor) => (
                                                        <div
                                                            key={doctor.id}
                                                            className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                            onClick={() => {
                                                                setDoctorSearch(doctor.user.name);
                                                                setSelectedDoctorId(doctor.id);
                                                            }}
                                                        >
                                                            {doctor.user.name}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Location (optional)</label>
                                    <select
                                        value={selectedLocationId || ''}
                                        onChange={(e) => setSelectedLocationId(e.target.value ? Number(e.target.value) : null)}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <option value="">Select location</option>
                                        {props.locations.map((location) => (
                                            <option key={location.id} value={location.id}>
                                                {location.name} {location.city ? `(${location.city})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Type</label>
                                    <input
                                        type="text"
                                        value={editType}
                                        onChange={(e) => setEditType(e.target.value)}
                                        placeholder="General, Follow-up, etc."
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Status</label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        required
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="no_show">No Show</option>
                                    </select>
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
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
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

                {/* Details Modal */}
                {showDetailsModal && detailsAppointment && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold">Appointment Details</h2>
                            <div className="space-y-2">
                                <p><strong>ID:</strong> {detailsAppointment.id}</p>
                                <p><strong>Patient:</strong> {detailsAppointment.patient?.user?.name || 'N/A'}</p>
                                <p><strong>Doctor:</strong> {detailsAppointment.doctor?.user?.name || 'N/A'}</p>
                                <p><strong>Start:</strong> {new Date(detailsAppointment.scheduled_start).toLocaleString()}</p>
                                <p><strong>End:</strong> {new Date(detailsAppointment.scheduled_end).toLocaleString()}</p>
                                <p><strong>Type:</strong> {detailsAppointment.type || 'General'}</p>
                                <p><strong>Status:</strong> <span className={`rounded-full px-2 py-1 text-xs text-white ${statusColors[detailsAppointment.status] || 'bg-gray-500'}`}>{detailsAppointment.status}</span></p>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}