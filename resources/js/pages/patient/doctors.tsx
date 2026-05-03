import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { User, Search, Stethoscope, Calendar, FlaskConical, Activity, Brain, Eye, Heart, Bone, Pill, Syringe, Baby } from 'lucide-react';

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
    is_active: boolean;
    specialties: Specialty[];
}

interface Props {
    doctors: {
        data: Doctor[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search: string;
        specialty: string;
    };
    specialties: Specialty[];
}

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

export default function PatientDoctors() {
    const props = usePage().props as unknown as Props;
    const doctors = props.doctors;
    const filters = props.filters;
    const specialties = props.specialties;

    const [search, setSearch] = useState(filters.search || '');
    const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(
        filters.specialty ? parseInt(filters.specialty) : null
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('search', search);
        if (selectedSpecialty) url.searchParams.set('specialty', selectedSpecialty.toString());
        window.location.href = url.toString();
    };

    const handleSpecialtyFilter = (specialtyId: number | null) => {
        setSelectedSpecialty(specialtyId);
        const url = new URL(window.location.href);
        if (specialtyId) {
            url.searchParams.set('specialty', specialtyId.toString());
        } else {
            url.searchParams.delete('specialty');
        }
        if (search) url.searchParams.set('search', search);
        window.location.href = url.toString();
    };

    return (
        <>
            <Head title="Available Doctors - Patient" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">Available Doctors</div>

                <div className="flex flex-wrap gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search doctors..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-lg border border-gray-300 pl-10 pr-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                            Search
                        </button>
                    </form>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold">Filter by Specialty</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        <button
                            onClick={() => handleSpecialtyFilter(null)}
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
                                onClick={() => handleSpecialtyFilter(specialty.id)}
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

                {doctors.data.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-12 text-center dark:border-sidebar-border dark:bg-gray-800">
                        <User className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-lg text-gray-500">No doctors found</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {doctors.data.map((doctor) => (
                            <Link
                                key={doctor.id}
                                href={`/patient/doctors/${doctor.id}`}
                                className="rounded-xl border border-sidebar-border/70 bg-white p-6 transition-all hover:shadow-lg dark:border-sidebar-border dark:bg-gray-800"
                            >
                                <div className="flex flex-col items-center">
                                    {doctor.photo_url ? (
                                        <img
                                            src={doctor.photo_url}
                                            alt={doctor.user.name}
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300">
                                            <User className="h-12 w-12 text-gray-500" />
                                        </div>
                                    )}
                                    <h3 className="mt-4 text-lg font-semibold">{doctor.user.name}</h3>
                                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                                        {doctor.specialties.slice(0, 2).map((s) => (
                                            <span key={s.id} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {s.name}
                                            </span>
                                        ))}
                                        {doctor.specialties.length > 2 && (
                                            <span className="text-xs text-gray-500">+{doctor.specialties.length - 2}</span>
                                        )}
                                    </div>
                                    <p className="mt-3 text-lg font-bold text-green-600">${doctor.consultation_fee}</p>
                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        <span>Book Appointment</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {doctors.links && doctors.links.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {doctors.links.map((link, index) => (
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
            </div>
        </>
    );
}