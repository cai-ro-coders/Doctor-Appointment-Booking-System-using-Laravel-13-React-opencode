import { Head, usePage } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement,
} from 'chart.js';
import { Calendar, Users, Clock, Activity } from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
);

interface Stat {
    totalPatients: number;
    todayPatients: number;
    todayAppointments: number;
}

interface Appointment {
    id: number;
    patient: { user: { name: string } };
    date_appointment: string;
    schedule_id: number;
    status: string;
    type: string;
}

interface ScheduleItem {
    date: string;
    day: string;
    appointments: number;
}

interface Props {
    stats: Stat;
    appointments: Appointment[];
    weeklyAppointments: Record<string, number>;
    appointmentsByStatus: Record<string, number>;
}

const statusColors: Record<string, string> = {
    confirmed: '#22c55e',
    pending: '#eab308',
    cancelled: '#ef4444',
    completed: '#3b82f6',
    tentative: '#6b7280',
    no_show: '#f97316',
};

const statusBgColors: Record<string, string> = {
    confirmed: 'bg-green-500',
    pending: 'bg-yellow-500',
    cancelled: 'bg-red-500',
    completed: 'bg-blue-500',
    tentative: 'bg-gray-500',
    no_show: 'bg-orange-500',
};

export default function DoctorDashboard() {
    const props = usePage().props as unknown as Props;
    const stats = props.stats || { totalPatients: 0, todayPatients: 0, todayAppointments: 0 };
    const appointments = props.appointments || [];
    const weeklyAppointments = props.weeklyAppointments || {};
    const appointmentsByStatus = props.appointmentsByStatus || {};

    const barData = {
        labels: Object.keys(weeklyAppointments || {}).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [
            {
                label: 'Appointments',
                data: Object.values(weeklyAppointments || {}),
                backgroundColor: '#3b82f6',
                borderWidth: 0,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
            },
        },
    };

    const doughnutData = {
        labels: Object.keys(appointmentsByStatus || {}).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [
            {
                data: Object.values(appointmentsByStatus || {}),
                backgroundColor: Object.keys(appointmentsByStatus || {}).map(
                    key => statusColors[key] || '#6b7280'
                ),
                borderWidth: 0,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    const todayAppointments = appointments.filter(apt => {
        const today = new Date().toISOString().split('T')[0];
        return apt.date_appointment && apt.date_appointment.startsWith(today);
    });

    const getStatusBadgeClass = (status: string) => {
        return statusBgColors[status] || 'bg-gray-500';
    };

    return (
        <>
            <Head title="Doctor Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">Doctor Dashboard</div>

                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            <div className="text-sm text-gray-500 dark:text-gray-400">Total Patients</div>
                        </div>
                        <div className="text-3xl font-bold">{stats.totalPatients}</div>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-500" />
                            <div className="text-sm text-gray-500 dark:text-gray-400">Today Patients</div>
                        </div>
                        <div className="text-3xl font-bold">{stats.todayPatients}</div>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-purple-500" />
                            <div className="text-sm text-gray-500 dark:text-gray-400">Today Appointments</div>
                        </div>
                        <div className="text-3xl font-bold">{stats.todayAppointments}</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="mb-4 text-lg font-semibold">Weekly Appointments</div>
                        <Bar data={barData} options={barOptions} />
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="mb-4 text-lg font-semibold">Appointments by Status</div>
                        <div className="flex justify-center">
                            <div className="w-64">
                                <Doughnut data={doughnutData} options={doughnutOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Appointments Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-gray-800">
                    <div className="p-4 text-lg font-semibold">Today's Appointments</div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">Patient</th>
                                    <th className="p-3">Time</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todayAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-3 text-center text-gray-500">
                                            No appointments for today
                                        </td>
                                    </tr>
                                ) : (
                                    todayAppointments.map((appointment) => (
                                        <tr key={appointment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-3">
                                                {appointment.patient?.user?.name || 'N/A'}
                                            </td>
                                            <td className="p-3">
                                                {appointment.date_appointment || 'N/A'}
                                            </td>
                                            <td className="p-3">{appointment.type || 'General'}</td>
                                            <td className="p-3">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs text-white ${getStatusBadgeClass(appointment.status)}`}
                                                >
                                                    {appointment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-gray-800">
                    <div className="p-4 text-lg font-semibold">Upcoming Appointments</div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">Patient</th>
                                    <th className="p-3">Date & Time</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-3 text-center text-gray-500">
                                            No upcoming appointments
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.slice(0, 10).map((appointment) => (
                                        <tr key={appointment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-3">
                                                {appointment.patient?.user?.name || 'N/A'}
                                            </td>
                                            <td className="p-3">
                                                {appointment.date_appointment || 'N/A'}
                                            </td>
                                            <td className="p-3">{appointment.type || 'General'}</td>
                                            <td className="p-3">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs text-white ${getStatusBadgeClass(appointment.status)}`}
                                                >
                                                    {appointment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}