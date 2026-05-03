import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Trash2, Search } from 'lucide-react';

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

interface Props {
    appointment: Appointment;
}

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

export default function DoctorAppointmentView() {
    const props = usePage().props as unknown as Props;
    const appointment = props.appointment;

    return (
        <>
            <Head title="Appointment Details - Doctor" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/doctor/appointments"
                        className="flex items-center gap-2 text-blue-500 hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Appointments
                    </Link>
                </div>

                <div className="text-2xl font-bold">Appointment Details</div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold">Patient Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Name:</span>
                            <p className="text-gray-900 dark:text-gray-100">{appointment.patient?.user?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Email:</span>
                            <p className="text-gray-900 dark:text-gray-100">{appointment.patient?.user?.email || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Phone:</span>
                            <p className="text-gray-900 dark:text-gray-100">{appointment.patient?.user?.phone || 'N/A'}</p>
                        </div>
                        {appointment.patient?.dob && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
                                <p className="text-gray-900 dark:text-gray-100">{appointment.patient.dob}</p>
                            </div>
                        )}
                        {appointment.patient?.gender && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Gender:</span>
                                <p className="text-gray-900 dark:text-gray-100">{appointment.patient.gender}</p>
                            </div>
                        )}
                    </div>
                    {appointment.patient?.medical_notes && (
                        <div className="mt-4">
                            <span className="text-sm font-medium text-gray-500">Medical Notes:</span>
                            <p className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{appointment.patient.medical_notes}</p>
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold">Appointment Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Appointment ID:</span>
                            <p className="text-gray-900 dark:text-gray-100">#{appointment.id}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Type:</span>
                            <p className="text-gray-900 dark:text-gray-100">{appointment.type || 'General'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Status:</span>
                            <span className={`inline-block rounded-full px-2 py-1 text-xs text-white ${statusColors[appointment.status] || 'bg-gray-500'}`}>
                                {appointment.status}
                            </span>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Date:</span>
                            <p className="text-gray-900 dark:text-gray-100">
                                {appointment.schedule 
                                    ? (appointment.schedule.date_appointment || weekdays[appointment.schedule.weekday])
                                    : appointment.date_appointment || '-'}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Time:</span>
                            <p className="text-gray-900 dark:text-gray-100">
                                {appointment.scheduled_start ? (
                                    <span>
                                        {formatDateTime(appointment.scheduled_start)}
                                        {appointment.scheduled_end && (
                                            <span> to {formatDateTime(appointment.scheduled_end)}</span>
                                        )}
                                    </span>
                                ) : appointment.schedule ? (
                                    <span>{formatTime(appointment.schedule.start_time)} - {formatTime(appointment.schedule.end_time)}</span>
                                ) : (
                                    '-'
                                )}
                            </p>
                        </div>
                        {appointment.location && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Location:</span>
                                <p className="text-gray-900 dark:text-gray-100">{appointment.location.name}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}