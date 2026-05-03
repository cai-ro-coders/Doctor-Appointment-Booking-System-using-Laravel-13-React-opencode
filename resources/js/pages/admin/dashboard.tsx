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
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface Stat {
    totalDoctors: number;
    totalPatients: number;
    totalAppointments: number;
    totalUsers: number;
}

interface Appointment {
    id: number;
    doctor: { user: { name: string } };
    patient: { user: { name: string } };
    date_appointment: string;
    scheduled_start: string | null;
    scheduled_end: string | null;
    status: string;
}

interface Props {
    stats: Stat;
    appointmentsByStatus: Record<string, number>;
    recentAppointments: Appointment[];
}

const statusColors: Record<string, string> = {
    confirmed: '#22c55e',
    pending: '#eab308',
    cancelled: '#ef4444',
    completed: '#3b82f6',
    tentative: '#6b7280',
    no_show: '#f97316',
};

const formatDateTime = (dateTime: string | null | undefined): string => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function AdminDashboard() {
    const { props } = usePage<Props>();
    const stats = props.stats;
    const recentAppointments = props.recentAppointments;
    const appointmentsByStatus = props.appointmentsByStatus;

    const barData = {
        labels: Object.keys(appointmentsByStatus).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [
            {
                label: 'Appointments',
                data: Object.values(appointmentsByStatus),
                backgroundColor: Object.keys(appointmentsByStatus).map(
                    key => statusColors[key] || '#6b7280'
                ),
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
        labels: Object.keys(appointmentsByStatus).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [
            {
                data: Object.values(appointmentsByStatus),
                backgroundColor: Object.keys(appointmentsByStatus).map(
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

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">Admin Dashboard</div>

                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Doctors</div>
                        <div className="text-3xl font-bold">{stats.totalDoctors}</div>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Patients</div>
                        <div className="text-3xl font-bold">{stats.totalPatients}</div>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Appointments</div>
                        <div className="text-3xl font-bold">{stats.totalAppointments}</div>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Users</div>
                        <div className="text-3xl font-bold">{stats.totalUsers}</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="mb-4 text-lg font-semibold">Appointments by Status (Bar)</div>
                        <Bar data={barData} options={barOptions} />
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="mb-4 text-lg font-semibold">Appointments by Status (Doughnut)</div>
                        <div className="flex justify-center">
                            <div className="w-64">
                                <Doughnut data={doughnutData} options={doughnutOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Appointments Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-gray-800">
                    <div className="p-4 text-lg font-semibold">Recent Appointments</div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">Doctor</th>
                                    <th className="p-3">Patient</th>
                                    <th className="p-3">Date & Time</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentAppointments.map((appointment) => (
                                    <tr key={appointment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="p-3">{appointment.doctor?.user?.name || 'N/A'}</td>
                                        <td className="p-3">{appointment.patient?.user?.name || 'N/A'}</td>
                                        <td className="p-3">
                                            {formatDateTime(appointment.scheduled_start)}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className="rounded-full px-2 py-1 text-xs text-white"
                                                style={{
                                                    backgroundColor:
                                                        statusColors[appointment.status] || '#6b7280',
                                                }}
                                            >
                                                {appointment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}