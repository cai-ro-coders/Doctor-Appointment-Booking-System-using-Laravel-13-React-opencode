import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Send, Stethoscope, Calendar, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const stripHtml = (html: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
};

interface Schedule {
    id: number;
    location_id: number | null;
    weekday: number;
    date_appointment: string;
    start_time: string;
    end_time: string;
    slot_length_minutes: number;
}

interface Doctor {
    id: number;
    user: { name: string; email: string };
    photo_url: string | null;
    bio: string;
    consultation_fee: number;
    rating: number;
    is_active: boolean;
    specialties: { id: number; name: string }[];
    locations: { id: number; name: string; address: string }[];
    schedules: Schedule[];
}

interface Props {
    doctor: Doctor;
    filters: { location: string };
    allLocations: { id: number; name: string }[];
    success?: string;
    errors?: Record<string, string>;
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DoctorProfile() {
    const props = usePage().props as unknown as Props;
    const doctor = props.doctor;
    const filters = props.filters;
    const success = props.success || '';
    const errors = props.errors || {};
    const allLocations = props.allLocations || [];
    const locations = doctor.locations || [];

    const [selectedLocation, setSelectedLocation] = useState(filters.location || '');
    const allAvailableDates = [...new Set(doctor.schedules.map(s => s.date_appointment))].sort();
    const [selectedDate, setSelectedDate] = useState(allAvailableDates[0] || '');
    const [calendarMonth, setCalendarMonth] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const availableDates = allAvailableDates;

    const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month - 1, 0).getDay();

    const calendarParts = calendarMonth.split('-');
    const calYear = parseInt(calendarParts[0]);
    const calMonth = parseInt(calendarParts[1]);
    const daysInCalMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfMonth(calYear, calMonth);
    const monthName = new Date(calYear, calMonth - 1).toLocaleString('default', { month: 'long' });

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInCalMonth; i++) {
        const dateStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        days.push({ day: i, date: dateStr, isAvailable: availableDates.includes(dateStr) });
    }

    const prevMonth = () => {
        const d = new Date(calYear, calMonth - 2);
        setCalendarMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    };
    const nextMonth = () => {
        const d = new Date(calYear, calMonth);
        setCalendarMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    };

    const filteredSchedulesByDate = selectedDate
        ? doctor.schedules.filter(s => s.date_appointment === selectedDate)
        : doctor.schedules;

    useEffect(() => {
        if (success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const filteredSchedules = selectedLocation
        ? doctor.schedules.filter(s => !s.location_id || s.location_id === parseInt(selectedLocation))
        : doctor.schedules;

    const handleLocationChange = (locationId: string) => {
        setSelectedLocation(locationId);
        setSelectedDate('');
        const url = new URL(window.location.href);
        if (locationId) {
            url.searchParams.set('location', locationId);
        } else {
            url.searchParams.delete('location');
        }
        window.location.href = url.toString();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (!selectedLocation) {
            e.preventDefault();
            alert('Please select a location first');
            return;
        }
        if (!selectedDate) {
            e.preventDefault();
            alert('Please select a date');
            return;
        }
        const form = e.currentTarget;
        const scheduleId = form.schedule_id.value;
        if (!scheduleId) {
            e.preventDefault();
            alert('Please select a time');
            return;
        }
        const selectedSchedule = doctor.schedules.find(s => s.id === parseInt(scheduleId));
        if (selectedSchedule) {
            const startInput = document.createElement('input');
            startInput.type = 'hidden';
            startInput.name = 'scheduled_start';
            startInput.value = `${selectedDate}T${selectedSchedule.start_time}`;
            form.appendChild(startInput);

            const endInput = document.createElement('input');
            endInput.type = 'hidden';
            endInput.name = 'scheduled_end';
            endInput.value = `${selectedDate}T${selectedSchedule.end_time}`;
            form.appendChild(endInput);
        }
        form.submit();
    };

    const formatTime = (time: string): string => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    return (
        <>
            <Head title={`Dr. ${doctor.user.name} - Profile`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Link
                    href="/patient/doctors"
                    className="flex w-fit items-center gap-2 text-blue-500 hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Doctors
                </Link>

                {success && (
                    <div className="rounded-lg bg-green-100 p-3 text-green-700 dark:bg-green-900 dark:text-green-300">
                        {success}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                            <div className="flex items-start gap-4">
                                {doctor.photo_url ? (
                                    <img src={doctor.photo_url} alt="" className="h-24 w-24 rounded-full object-cover" />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300">
                                        <Stethoscope className="h-12 w-12 text-gray-500" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold">Dr. {doctor.user.name}</h1>
                                    <p className="text-gray-500">{doctor.user.email}</p>
                                    {doctor.specialties.length > 0 && (
                                        <p className="mt-2 text-blue-600">
                                            {doctor.specialties.map(s => s.name).join(', ')}
                                        </p>
                                    )}
                                    <p className="mt-2 font-semibold text-green-600">${doctor.consultation_fee} per consultation</p>
                                    <div className="mt-2 flex items-center gap-1 text-yellow-500">
                                        <Star className="h-4 w-4 fill-yellow-500" />
                                        <span className="font-semibold text-gray-800">{doctor.rating || '0.0'}</span>
                                        <span className="text-sm text-gray-500">rating</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {doctor.locations.length > 0 && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                                <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Locations
                                </h3>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => handleLocationChange(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
                                >
                                    <option value="">Select a Location</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.id}>{location.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {filteredSchedules.length > 0 && (
                            <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-6 dark:bg-blue-900">
                                <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                                    <Send className="h-5 w-5" />
                                    Book Appointment
                                </h3>
                                
                                <form method="POST" action={`/patient/doctors/${doctor.id}/book`} onSubmit={handleSubmit}>
                                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                                    <input type="hidden" name="doctor_id" value={doctor.id} />
                                    
                                    {selectedLocation && <input type="hidden" name="location_id" value={selectedLocation} />}
                                    {selectedDate && <input type="hidden" name="date_appointment" value={selectedDate} />}

<div className="mb-4">
                                        <label className="block text-sm font-medium">Date</label>
                                        <div className="rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-gray-700">
                                            <div className="mb-2 flex items-center justify-between">
                                                <button type="button" onClick={prevMonth} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                                                    <ChevronLeft className="h-4 w-4" />
                                                </button>
                                                <span className="font-semibold">{monthName} {calYear}</span>
                                                <button type="button" onClick={nextMonth} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                                    <span key={d} className="font-medium text-gray-500">{d}</span>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-7 gap-1 mt-1">
                                                {days.map((d, i) => (
                                                    d === null ? <span key={i} className="p-1"></span> :
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        disabled={!d.isAvailable}
                                                        onClick={() => d.isAvailable && setSelectedDate(d.date)}
                                                        className={`p-1 rounded text-sm ${
                                                            selectedDate === d.date ? 'bg-blue-500 text-white' :
                                                            d.isAvailable ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-800 dark:text-green-300 cursor-pointer' :
                                                            'text-gray-300 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        {d.day}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">Select Time</label>
                                        <select
                                            name="schedule_id"
                                            required
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                        >
                                            <option value="">Select a time</option>
                                            {filteredSchedulesByDate.map((schedule) => (
                                                <option key={schedule.id} value={schedule.id}>
                                                    {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">Appointment Type</label>
                                        <input
                                            type="text"
                                            name="type"
                                            placeholder="General, Follow-up, etc."
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
                                    >
                                        <Send className="h-4 w-4" />
                                        Book Appointment
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold">About</h3>
                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                {doctor.bio ? stripHtml(doctor.bio) : 'No bio available.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
