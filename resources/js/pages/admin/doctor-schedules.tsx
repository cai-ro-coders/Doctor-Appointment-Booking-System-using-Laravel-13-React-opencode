import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Doctor {
    id: number;
    user: { name: string };
}

interface Location {
    id: number;
    name: string;
    city: string | null;
}

interface DoctorSchedule {
    id: number;
    doctor_id: number;
    location_id: number | null;
    weekday_name: string;
    date_appointment: string | null;
    start_time: string;
    end_time: string;
    is_active: boolean;
    doctor_name: string;
    location_name: string | null;
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
    doctors: Doctor[];
    locations: Location[];
    errors: Record<string, string>;
}

const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

export default function AdminDoctorSchedules() {
    const page = usePage<Props>();
    const props = page.props;
    const schedules = props.schedules;
    const filters = props.filters;

    const [search, setSearch] = useState(filters.search || '');
    const [selectedLocation, setSelectedLocation] = useState(filters.location || '');
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<DoctorSchedule | null>(null);
    const [deleteSchedule, setDeleteSchedule] = useState<DoctorSchedule | null>(null);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState<number>(0);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        date_appointment: '',
        start_time: '',
        end_time: '',
        is_active: true,
    });
    const [processing, setProcessing] = useState(false);

    const filteredDoctors = doctorSearch
        ? props.doctors.filter(d => d.user?.name?.toLowerCase().includes(doctorSearch.toLowerCase()))
        : props.doctors;

    const openAddModal = () => {
        setEditingSchedule(null);
        setDoctorSearch('');
        setSelectedDoctorId(0);
        setSelectedLocationId(null);
        setFormData({
            date_appointment: '',
            start_time: '',
            end_time: '',
            is_active: true,
        });
        setShowModal(true);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedLocation) params.set('location', selectedLocation);
        const url = params.toString() ? `/admin/doctor-schedules?${params.toString()}` : '/admin/doctor-schedules';
        window.location.href = url;
    };

    const openEditModal = (schedule: DoctorSchedule) => {
        setEditingSchedule(schedule);
        setSelectedDoctorId(schedule.doctor_id);
        setSelectedLocationId(schedule.location_id);
        const doctor = props.doctors.find(d => d.id === schedule.doctor_id);
        setDoctorSearch(doctor?.user?.name || '');
        setFormData({
            date_appointment: schedule.date_appointment || '',
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            is_active: schedule.is_active,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSchedule(null);
        setDeleteSchedule(null);
        setDoctorSearch('');
        setSelectedDoctorId(0);
        setSelectedLocationId(null);
        setFormData({
            date_appointment: '',
            start_time: '',
            end_time: '',
            is_active: true,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        if (editingSchedule) {
            router.patch(`/admin/doctor-schedules/${editingSchedule.id}`, {
                doctor_id: selectedDoctorId,
                location_id: selectedLocationId,
                date_appointment: formData.date_appointment,
                start_time: formData.start_time,
                end_time: formData.end_time,
                is_active: formData.is_active,
            }, {
                onSuccess: () => closeModal(),
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post('/admin/doctor-schedules', {
                doctor_id: selectedDoctorId,
                location_id: selectedLocationId,
                date_appointment: formData.date_appointment,
                start_time: formData.start_time,
                end_time: formData.end_time,
                is_active: formData.is_active,
            }, {
                onSuccess: () => closeModal(),
                onFinish: () => setProcessing(false),
            });
        }
    };

    const handleDelete = () => {
        if (!deleteSchedule) return;
        router.delete(`/admin/doctor-schedules/${deleteSchedule.id}`, {
            onSuccess: () => setDeleteSchedule(null),
        });
    };

    const errors = props.errors || {};

    return (
        <>
            <Head title="Doctor Schedules - Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Doctor Schedules</div>

                <div className="flex flex-wrap gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                        <button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-white">Search</button>
                    </form>
                </div>

                <button onClick={openAddModal} className="w-fit flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white">
                    <Plus className="h-4 w-4" /> Add Schedule
                </button>

                <div className="rounded-xl border bg-white dark:bg-gray-800">
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-3 text-gray-900 dark:text-white">ID</th>
                                <th className="p-3 text-gray-900 dark:text-white">Doctor</th>
                                <th className="p-3 text-gray-900 dark:text-white">Location</th>
                                <th className="p-3 text-gray-900 dark:text-white">Date</th>
                                <th className="p-3 text-gray-900 dark:text-white">Start</th>
                                <th className="p-3 text-gray-900 dark:text-white">End</th>
                                <th className="p-3 text-gray-900 dark:text-white">Status</th>
                                <th className="p-3 text-gray-900 dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.data.length === 0 ? (
                                <tr><td colSpan={8} className="p-3 text-center text-gray-500">No schedules</td></tr>
                            ) : (
                                schedules.data.map((schedule) => (
                                    <tr key={schedule.id} className="border-b dark:border-gray-700">
                                        <td className="p-3 text-gray-900 dark:text-white">{schedule.id}</td>
                                        <td className="p-3 text-gray-900 dark:text-white">{schedule.doctor_name}</td>
                                        <td className="p-3 text-gray-900 dark:text-white">{schedule.location_name || 'N/A'}</td>
                                        <td className="p-3 text-gray-900 dark:text-white">{schedule.weekday_name}</td>
                                        <td className="p-3 text-gray-900 dark:text-white">{formatTime(schedule.start_time)}</td>
                                        <td className="p-3 text-gray-900 dark:text-white">{formatTime(schedule.end_time)}</td>
                                        <td className="p-3"><span className={`rounded px-2 py-1 text-xs text-white ${schedule.is_active ? 'bg-green-500' : 'bg-red-500'}`}>{schedule.is_active ? 'Active' : 'Inactive'}</span></td>
                                        <td className="p-3 flex gap-2">
                                            <button onClick={() => openEditModal(schedule)} className="rounded bg-blue-500 p-1 text-white"><Pencil className="h-4 w-4" /></button>
                                            <button onClick={() => setDeleteSchedule(schedule)} className="rounded bg-red-500 p-1 text-white"><Trash2 className="h-4 w-4" /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{editingSchedule ? 'Edit Schedule' : 'Add Schedule'}</h2>
                            <form onSubmit={handleSubmit}>
                                {errors.doctor_id && <p className="mb-2 text-sm text-red-500">{errors.doctor_id}</p>}
                                {errors.date_appointment && <p className="mb-2 text-sm text-red-500">{errors.date_appointment}</p>}
                                {errors.start_time && <p className="mb-2 text-sm text-red-500">{errors.start_time}</p>}
                                {errors.end_time && <p className="mb-2 text-sm text-red-500">{errors.end_time}</p>}

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white">Doctor</label>
                                    <input type="text" placeholder="Search doctor..." value={doctorSearch} onChange={(e) => setDoctorSearch(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    {doctorSearch && selectedDoctorId === 0 && (
                                        <div className="mt-1 max-h-40 overflow-auto rounded-lg border bg-white dark:bg-gray-700">
                                            {filteredDoctors.slice(0, 10).map((doctor) => (
                                                <div key={doctor.id} className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white" onClick={() => { setDoctorSearch(doctor.user.name); setSelectedDoctorId(doctor.id); }}>
                                                    {doctor.user.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedDoctorId > 0 && (
                                        <p className="mt-1 text-sm text-green-600">Selected doctor</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white">Location</label>
                                    <select value={selectedLocationId || ''} onChange={(e) => setSelectedLocationId(e.target.value ? Number(e.target.value) : null)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                                        <option value="">Select location</option>
                                        {props.locations.map((location) => (<option key={location.id} value={location.id}>{location.name} {location.city ? `(${location.city})` : ''}</option>))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white">Date</label>
                                    <input type="date" value={formData.date_appointment} onChange={(e) => setFormData({...formData, date_appointment: e.target.value})} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white">Start Time</label>
                                    <input type="time" value={formData.start_time} onChange={(e) => setFormData({...formData, start_time: e.target.value})} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white">End Time</label>
                                    <input type="time" value={formData.end_time} onChange={(e) => setFormData({...formData, end_time: e.target.value})} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                </div>

                                <div className="mb-4">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Active</span>
                                    </label>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={closeModal} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 dark:text-white dark:border-gray-600">Cancel</button>
                                    <button type="submit" disabled={processing} className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-50">
                                        {processing ? 'Saving...' : (editingSchedule ? 'Update' : 'Create')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {deleteSchedule && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Confirm Delete</h2>
                            <p className="mb-4 text-gray-900 dark:text-white">Are you sure?</p>
                            <div className="flex justify-end gap-2">
                                <button onClick={closeModal} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 dark:text-white">Cancel</button>
                                <button onClick={handleDelete} className="rounded-lg bg-red-500 px-4 py-2 text-white">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
