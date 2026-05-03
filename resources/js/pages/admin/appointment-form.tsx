import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface Schedule {
    id: number;
    doctor_name: string;
    doctor_id: number;
    location_name: string | null;
    start_time: string;
    end_time: string;
}

interface AvailableDate {
    date: string;
    schedules: Schedule[];
}

interface Props {
    doctors: Doctor[];
    patients: Patient[];
    locations: Location[];
    errors: Record<string, string>;
}

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' },
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

export default function AdminAppointmentForm() {
    const page = usePage<Props>();
    const props = page.props;
    const errors = props.errors || {};

    const sortedPatients = [...(props.patients || [])].sort((a, b) => 
        (a.user?.name || '').localeCompare(b.user?.name || '')
    );
    const sortedDoctors = [...(props.doctors || [])].sort((a, b) => 
        (a.user?.name || '').localeCompare(b.user?.name || '')
    );

    const [patientSearch, setPatientSearch] = useState('');
    const [doctorSearch, setDoctorSearch] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<number>(0);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number>(0);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [dateAppointment, setDateAppointment] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [status, setStatus] = useState('pending');
    const [type, setType] = useState('General');
    const [processing, setProcessing] = useState(false);
    const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);
    const [doctorDropdownOpen, setDoctorDropdownOpen] = useState(false);

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [availableDates, setAvailableDates] = useState<Record<string, AvailableDate>>({});
    const [loadingSchedules, setLoadingSchedules] = useState(false);

    const filteredPatients = patientSearch
        ? sortedPatients.filter(p => p.user?.name?.toLowerCase().includes(patientSearch.toLowerCase()))
        : sortedPatients;

    const filteredDoctors = doctorSearch
        ? sortedDoctors.filter(d => d.user?.name?.toLowerCase().includes(doctorSearch.toLowerCase()))
        : sortedDoctors;

    const fetchAvailableSchedules = useCallback(async () => {
        setLoadingSchedules(true);
        try {
            const params = new URLSearchParams({
                year: currentYear.toString(),
                month: currentMonth.toString(),
            });
            if (selectedLocationId) params.set('location_id', selectedLocationId.toString());
            if (selectedDoctorId) params.set('doctor_id', selectedDoctorId.toString());

            const response = await fetch(`/admin/appointments/available-schedules?${params.toString()}`);
            const data = await response.json();
            
            const dateMap: Record<string, AvailableDate> = {};
            data.forEach((item: AvailableDate) => {
                dateMap[item.date] = item;
            });
            setAvailableDates(dateMap);
        } catch (error) {
            console.error('Failed to fetch schedules:', error);
        } finally {
            setLoadingSchedules(false);
        }
    }, [currentMonth, currentYear, selectedLocationId, selectedDoctorId]);

    useEffect(() => {
        fetchAvailableSchedules();
    }, [fetchAvailableSchedules]);

    const handleLocationChange = (locationId: number | null) => {
        setSelectedLocationId(locationId);
        setDateAppointment('');
        setSelectedSchedule(null);
    };

    const prevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month - 1, 1).getDay();
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10" />);
        }

        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isAvailable = availableDates[dateStr] !== undefined;
            const isSelected = dateAppointment === dateStr;
            const isPast = dateStr < todayStr;

            days.push(
                <button
                    key={dateStr}
                    type="button"
                    disabled={!isAvailable || isPast}
                    onClick={() => {
                        setDateAppointment(dateStr);
                        setSelectedSchedule(null);
                    }}
                    className={`h-10 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                            ? 'bg-blue-500 text-white'
                            : isAvailable && !isPast
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 cursor-pointer'
                            : isPast
                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    }`}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    const selectPatient = (patient: Patient) => {
        setPatientSearch(patient.user.name);
        setSelectedPatientId(patient.id);
        setPatientDropdownOpen(false);
    };

    const selectDoctor = (doctor: Doctor) => {
        setDoctorSearch(doctor.user.name);
        setSelectedDoctorId(doctor.id);
        setDoctorDropdownOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/admin/appointments', {
            patient_id: selectedPatientId,
            doctor_id: selectedDoctorId || selectedSchedule?.doctor_id,
            location_id: selectedLocationId,
            date_appointment: dateAppointment,
            scheduled_start: selectedSchedule?.start_time || '',
            scheduled_end: selectedSchedule?.end_time || '',
            status,
            type,
        }, {
            onSuccess: () => {},
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Create Appointment - Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <a href="/admin/appointments" className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </a>
                    <div className="text-2xl font-bold">Create New Appointment</div>
                </div>

                <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left: Calendar and Schedule Selection */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold">Select Date & Time</h3>

                        {/* Location Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Location</label>
                            <select
                                value={selectedLocationId || ''}
                                onChange={(e) => handleLocationChange(e.target.value ? Number(e.target.value) : null)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                            >
                                <option value="">All locations</option>
                                {props.locations.map((location) => (
                                    <option key={location.id} value={location.id}>
                                        {location.name} {location.city ? `(${location.city})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Calendar */}
                        <div className="mb-4">
                            <div className="mb-2 flex items-center justify-between">
                                <button type="button" onClick={prevMonth} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <span className="font-medium">{monthNames[currentMonth - 1]} {currentYear}</span>
                                <button type="button" onClick={nextMonth} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
                                {dayNames.map((day) => (
                                    <div key={day}>{day}</div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {renderCalendar()}
                            </div>

                            {loadingSchedules && (
                                <p className="mt-2 text-center text-sm text-gray-500">Loading schedules...</p>
                            )}

                            <div className="mt-2 flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="h-3 w-3 rounded bg-green-100 dark:bg-green-900" />
                                    <span>Available</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="h-3 w-3 rounded bg-blue-500" />
                                    <span>Selected</span>
                                </div>
                            </div>
                        </div>

                        {/* Available Time Slots */}
                        {dateAppointment && availableDates[dateAppointment] && (
                            <div>
                                <h4 className="mb-2 text-sm font-medium">Available Schedules for {dateAppointment}</h4>
                                <div className="space-y-2">
                                    {availableDates[dateAppointment].schedules.map((schedule) => (
                                        <button
                                            key={schedule.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedSchedule(schedule);
                                                if (!selectedDoctorId) {
                                                    setSelectedDoctorId(schedule.doctor_id);
                                                }
                                            }}
                                            className={`w-full rounded-lg border p-3 text-left transition-colors ${
                                                selectedSchedule?.id === schedule.id
                                                    ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                                                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                                            }`}
                                        >
                                            <div className="text-sm font-medium">
                                                {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {schedule.doctor_name}
                                                {schedule.location_name && ` • ${schedule.location_name}`}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {dateAppointment && !availableDates[dateAppointment] && (
                            <p className="text-sm text-gray-500">No schedules available for this date</p>
                        )}
                    </div>

                    {/* Right: Appointment Details */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold">Appointment Details</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Patient */}
                            <div>
                                <label className="block text-sm font-medium">Patient</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search patient..."
                                        value={patientSearch}
                                        onChange={(e) => { setPatientSearch(e.target.value); setSelectedPatientId(0); setPatientDropdownOpen(true); }}
                                        onFocus={() => setPatientDropdownOpen(true)}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    {patientDropdownOpen && patientSearch && selectedPatientId === 0 && (
                                        <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600">
                                            {filteredPatients.length === 0 ? (
                                                <div className="p-2 text-gray-500">No patients found</div>
                                            ) : (
                                                filteredPatients.slice(0, 10).map((patient) => (
                                                    <div
                                                        key={patient.id}
                                                        className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                        onClick={() => selectPatient(patient)}
                                                    >
                                                        {patient.user.name}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                                {selectedPatientId > 0 && <p className="mt-1 text-sm text-green-600">Patient selected</p>}
                                {errors.patient_id && <p className="mt-1 text-sm text-red-500">{errors.patient_id}</p>}
                            </div>

                            {/* Doctor */}
                            <div>
                                <label className="block text-sm font-medium">Doctor</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search doctor..."
                                        value={doctorSearch}
                                        onChange={(e) => { setDoctorSearch(e.target.value); setSelectedDoctorId(0); setDoctorDropdownOpen(true); }}
                                        onFocus={() => setDoctorDropdownOpen(true)}
                                        disabled={selectedSchedule !== null}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 disabled:bg-gray-100 disabled:opacity-50"
                                    />
                                    {doctorDropdownOpen && doctorSearch && selectedDoctorId === 0 && !selectedSchedule && (
                                        <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600">
                                            {filteredDoctors.length === 0 ? (
                                                <div className="p-2 text-gray-500">No doctors found</div>
                                            ) : (
                                                filteredDoctors.slice(0, 10).map((doctor) => (
                                                    <div
                                                        key={doctor.id}
                                                        className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                        onClick={() => selectDoctor(doctor)}
                                                    >
                                                        {doctor.user.name}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                                {selectedDoctorId > 0 && <p className="mt-1 text-sm text-green-600">Doctor selected</p>}
                                {errors.doctor_id && <p className="mt-1 text-sm text-red-500">{errors.doctor_id}</p>}
                            </div>

                            {/* Selected Date & Time Display */}
                            {dateAppointment && selectedSchedule && (
                                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                    <p className="text-sm font-medium">Selected Schedule</p>
                                    <p className="text-sm">{dateAppointment}</p>
                                    <p className="text-sm">
                                        {formatTime(selectedSchedule.start_time)} - {formatTime(selectedSchedule.end_time)}
                                    </p>
                                    <p className="text-sm text-gray-500">{selectedSchedule.doctor_name}</p>
                                </div>
                            )}

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium">Type</label>
                                <input
                                    type="text"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    placeholder="General, Follow-up, etc."
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                />
                                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <a
                                    href="/admin/appointments"
                                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing || !dateAppointment || !selectedSchedule || !selectedPatientId}
                                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Appointment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
