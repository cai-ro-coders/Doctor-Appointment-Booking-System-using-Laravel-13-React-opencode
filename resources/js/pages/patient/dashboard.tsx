import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { User, Calendar, Stethoscope, Activity, Brain, Eye, Heart, Bone, Pill, Syringe, Baby, FlaskConical } from 'lucide-react';

const specialtyIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    cardiology: Heart,
    neurology: Brain,
    ophthalmology: Eye,
    orthopedics: Bone,
    pediatrics: Baby,
    dermatology: Activity,
    general: Stethoscope,
    pharmacy: Pill,
    surgery: Syringe,
    laboratory: FlaskConical,
};

const getSpecialtyIcon = (name: string) => {
    const key = name.toLowerCase();
    return specialtyIcons[key] || Stethoscope;
};

interface Specialty {
    id: number;
    name: string;
}

interface Doctor {
    id: number;
    user: { name: string; email: string };
    photo_url: string | null;
    bio: string | null;
    consultation_fee: number;
    specialties: Specialty[];
}

interface Appointment {
    id: number;
    doctor: { user: { name: string }; photo_url: string | null } | null;
    status: string;
    type: string;
}

interface Stats {
    appointmentsByStatus: Record<string, number>;
    recentAppointments: number;
}

interface Props {
    patientName: string;
    totalDoctors: number;
    specialties: Specialty[];
    appointments: Appointment[];
    doctors: Doctor[];
    stats: Stats;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-green-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-500',
    no_show: 'bg-orange-500',
};

export default function PatientDashboard() {
    const props = usePage().props as unknown as Props;
    const patientName = props.patientName;
    const totalDoctors = props.totalDoctors;
    const specialties = props.specialties;
    const appointments = props.appointments;
    const doctors = props.doctors;
const stats = props.stats;

    const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctors);

    useEffect(() => {
        if (selectedSpecialty) {
            const filtered = doctors.filter(d => 
                d.specialties.some(s => s.id === selectedSpecialty)
            );
            setFilteredDoctors(filtered);
        } else {
            setFilteredDoctors(doctors);
        }
    }, [selectedSpecialty, doctors]);

    const handleAllClick = () => {
        setSelectedSpecialty(null);
        setFilteredDoctors(doctors);
    };

    const handleSpecialtyClick = (specialtyId: number) => {
        const targetId = Number(specialtyId);
        const filtered = doctors.filter(d => {
            return d.specialties.some(s => s.id == targetId);
        });
        setSelectedSpecialty(specialtyId);
        setFilteredDoctors(filtered);
    };

    const handleResetFilter = () => {
        setSelectedSpecialty(null);
        setFilteredDoctors(doctors);
    };

    return (
        <>
            <Head title="Patient Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">
                    Welcome back Patient, {patientName}!
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Available Doctors</p>
                                <p className="text-2xl font-bold">{totalDoctors}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Recent Appointments</p>
                                <p className="text-2xl font-bold">{stats.recentAppointments}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold">Filter by Specialty</h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            <button
                                onClick={handleResetFilter}
                                className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
                                    selectedSpecialty === null
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                                }`}
                            >
                                <Stethoscope className="mb-2 h-8 w-8 text-blue-500" />
                                <span className="text-sm font-medium">All</span>
                            </button>
                            {specialties.map((specialty) => {
                                const Icon = getSpecialtyIcon(specialty.name);
                                return (
                                <button
                                    key={specialty.id}
                                    onClick={() => handleSpecialtyClick(specialty.id)}
                                    className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
                                        selectedSpecialty === specialty.id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <Icon className="mb-2 h-8 w-8 text-blue-500" />
                                    <span className="text-sm font-medium">{specialty.name}</span>
                                </button>
                            );})}
                        </div>
                    </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold">Available Doctors</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">Photo</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Specialties</th>
                                    <th className="p-3">Fee</th>
                                    <th className="p-3">Bio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDoctors.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-3 text-center text-gray-500">
                                            No doctors found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDoctors.map((doctor) => (
                                        <tr key={doctor.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-3">
                                                {doctor.photo_url ? (
                                                    <img src={doctor.photo_url} alt={doctor.user.name} className="h-10 w-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                                                        <User className="h-5 w-5 text-gray-500" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3 font-medium">{doctor.user.name}</td>
                                            <td className="p-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {doctor.specialties.slice(0, 2).map((s) => (
                                                        <span key={s.id} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                            {s.name}
                                                        </span>
                                                    ))}
                                                    {doctor.specialties.length > 2 && (
                                                        <span className="text-xs text-gray-500">+{doctor.specialties.length - 2}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">${doctor.consultation_fee}</td>
                                            <td className="p-3 max-w-xs truncate">{doctor.bio || 'N/A'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold">My Appointments</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Doctor</th>
                                    <th className="p-3">Date & Time</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-3 text-center text-gray-500">
                                            No appointments found
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.map((appointment) => (
                                        <tr key={appointment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-3">{appointment.id}</td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    {appointment.doctor?.photo_url ? (
                                                        <img src={appointment.doctor.photo_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                                                            <User className="h-4 w-4 text-gray-500" />
                                                        </div>
                                                    )}
                                                    <span>{appointment.doctor?.user.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">{appointment.type || 'General'}</td>
                                            <td className="p-3">
                                                <span className={`rounded-full px-2 py-1 text-xs text-white ${statusColors[appointment.status] || 'bg-gray-500'}`}>
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