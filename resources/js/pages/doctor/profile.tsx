import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { User, Mail, Phone, DollarSign, Image, Save, MapPin } from 'lucide-react';

interface Specialty {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
    address: string;
}

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        profile_data: Record<string, unknown>;
    };
    doctor: {
        id: number;
        bio: string;
        photo_url: string | null;
        consultation_fee: number;
        is_active: boolean;
        specialties: Specialty[];
        locations: Location[];
    };
    allSpecialties: Specialty[];
    allLocations: Location[];
    errors?: Record<string, string>;
    success?: string;
}

export default function DoctorProfile() {
    const props = usePage().props as unknown as Props;
    const user = props.user;
    const doctor = props.doctor;
    const allSpecialties = props.allSpecialties;
    const allLocations = props.allLocations;
    const errors = props.errors || {};
    const success = props.success || '';

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        bio: doctor.bio || '',
        consultation_fee: doctor.consultation_fee || 0,
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>(
        doctor.specialties.map(s => s.id)
    );

    const [selectedLocations, setSelectedLocations] = useState<number[]>(
        doctor.locations.map(l => l.id)
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const toggleSpecialty = (id: number) => {
        if (selectedSpecialties.includes(id)) {
            setSelectedSpecialties(selectedSpecialties.filter(s => s !== id));
        } else {
            setSelectedSpecialties([...selectedSpecialties, id]);
        }
    };

    const toggleLocation = (id: number) => {
        if (selectedLocations.includes(id)) {
            setSelectedLocations(selectedLocations.filter(l => l !== id));
        } else {
            setSelectedLocations([...selectedLocations, id]);
        }
    };

    return (
        <>
            <Head title="My Profile - Doctor" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">My Profile</div>

                {success && (
                    <div className="rounded-lg bg-green-100 p-3 text-green-700 dark:bg-green-900 dark:text-green-300">
                        {success}
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div className="rounded-lg bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-300">
                        {Object.values(errors).join(', ')}
                    </div>
                )}

                <form
                    method="POST"
                    action="/doctor/profile"
                    encType="multipart/form-data"
                    className="space-y-6"
                >
                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                    <input type="hidden" name="_method" value="PATCH" />

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <div className="relative mt-1">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Phone</label>
                                <div className="relative mt-1">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Consultation Fee ($)</label>
                                <div className="relative mt-1">
                                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        name="consultation_fee"
                                        value={formData.consultation_fee}
                                        onChange={handleChange}
                                        min={0}
                                        step={0.01}
                                        className="w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium">Bio</label>
                            <div className="mt-1 rounded-lg border border-gray-300 dark:border-gray-600">
                                <div className="flex gap-1 border-b border-gray-200 bg-gray-50 p-1 dark:bg-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => document.execCommand('bold')}
                                        className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        title="Bold"
                                    >
                                        <span className="font-bold">B</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => document.execCommand('italic')}
                                        className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        title="Italic"
                                    >
                                        <span className="italic">I</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => document.execCommand('underline')}
                                        className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        title="Underline"
                                    >
                                        <span className="underline">U</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => document.execCommand('insertUnorderedList')}
                                        className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        title="Bullet List"
                                    >
                                        •
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => document.execCommand('insertOrderedList')}
                                        className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        title="Numbered List"
                                    >
                                        1.
                                    </button>
                                </div>
                                <div
                                    contentEditable
                                    dangerouslySetInnerHTML={{ __html: formData.bio }}
                                    onBlur={(e) => {
                                        setFormData({ ...formData, bio: e.currentTarget.innerHTML });
                                    }}
                                    className="min-h-[120px] w-full px-3 py-2 outline-none dark:bg-gray-700"
                                    data-placeholder="Tell patients about yourself..."
                                />
                            </div>
                            <input type="hidden" name="bio" value={formData.bio} />
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                            <Image className="h-5 w-5" />
                            Profile Photo
                        </h3>

                        <div className="flex items-center gap-4">
                            {doctor.photo_url ? (
                                <img
                                    src={doctor.photo_url}
                                    alt="Profile"
                                    className="h-24 w-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300">
                                    <User className="h-12 w-12 text-gray-500" />
                                </div>
                            )}
                            <div>
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                />
                                <p className="mt-1 text-sm text-gray-500">Max 2MB. JPG, PNG, GIF, WebP</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold">Specialties</h3>

                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                            {allSpecialties.map((specialty) => (
                                <label
                                    key={specialty.id}
                                    className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                        selectedSpecialties.includes(specialty.id)
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedSpecialties.includes(specialty.id)}
                                        onChange={() => toggleSpecialty(specialty.id)}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm">{specialty.name}</span>
                                </label>
                            ))}
                        </div>
                        {selectedSpecialties.map(id => (
                            <input key={id} type="hidden" name="specialties[]" value={id} />
                        ))}
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Locations
                        </h3>

                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                            {allLocations.map((location) => (
                                <label
                                    key={location.id}
                                    className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                        selectedLocations.includes(location.id)
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedLocations.includes(location.id)}
                                        onChange={() => toggleLocation(location.id)}
                                        className="rounded border-gray-300"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{location.name}</span>
                                        {location.address && <span className="text-xs text-gray-500">{location.address}</span>}
                                    </div>
                                </label>
                            ))}
                        </div>
                        {selectedLocations.map(id => (
                            <input key={id} type="hidden" name="locations[]" value={id} />
                        ))}
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold">Change Password</h3>
                        <p className="mb-4 text-sm text-gray-500">Leave blank if you don't want to change password</p>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium">Current Password</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    value={formData.current_password}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">New Password</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    minLength={8}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
                    >
                        <Save className="h-4 w-4" />
                        Save Changes
                    </button>
                </form>
            </div>
        </>
    );
}