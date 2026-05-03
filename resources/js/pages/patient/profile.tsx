import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { User, Mail, Phone, Save } from 'lucide-react';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
    };
    patient: {
        id: number;
        dob: string | null;
        gender: string | null;
        medical_notes: string | null;
    };
    errors?: Record<string, string>;
    success?: string;
}

export default function PatientProfile() {
    const props = usePage().props as unknown as Props;
    const user = props.user;
    const patient = props.patient;
    const errors = props.errors || {};
    const success = props.success || '';

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        dob: patient.dob || '',
        gender: patient.gender || '',
        medical_notes: patient.medical_notes || '',
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Head title="My Profile - Patient" />
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
                    action="/patient/profile"
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
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold">Medical Information</h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium">Medical Notes</label>
                            <textarea
                                name="medical_notes"
                                value={formData.medical_notes}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Any medical conditions, allergies, etc..."
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                            />
                        </div>
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