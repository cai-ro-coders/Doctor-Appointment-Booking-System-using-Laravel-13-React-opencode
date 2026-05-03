import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

interface Patient {
    id: number;
    user: {
        name: string;
        email: string;
        phone: string;
    };
    dob: string | null;
    gender: string | null;
    medical_notes: string | null;
    created_at: string;
}

interface Props {
    patients: {
        data: Patient[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search: string;
    };
}

export default function AdminPatients() {
    const props = usePage().props as unknown as Props;
    const patients = props.patients;
    const filters = props.filters;

    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [deletePatient, setDeletePatient] = useState<Patient | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('search', search);
        window.location.href = url.toString();
    };

    const openEditModal = (patient: Patient) => {
        setEditingPatient(patient);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPatient(null);
        setDeletePatient(null);
    };

    const handleDelete = () => {
        if (!deletePatient) return;
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/admin/patients/${deletePatient.id}`;
        
        const methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = '_method';
        methodInput.value = 'DELETE';
        form.appendChild(methodInput);
        
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '_token';
        tokenInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        form.appendChild(tokenInput);
        
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <>
            <Head title="Patients - Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-2xl font-bold">Patients Management</div>

                <div className="flex flex-wrap gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
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

                <button
                    onClick={() => {
                        setEditingPatient(null);
                        setShowModal(true);
                    }}
                    className="w-fit flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                    <Plus className="h-4 w-4" />
                    Add Patient
                </button>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Phone</th>
                                    <th className="p-3">DOB</th>
                                    <th className="p-3">Gender</th>
                                    <th className="p-3">Created</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-3 text-center text-gray-500">
                                            No patients found
                                        </td>
                                    </tr>
                                ) : (
                                    patients.data.map((patient) => (
                                        <tr key={patient.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-3">{patient.id}</td>
                                            <td className="p-3">{patient.user?.name || 'N/A'}</td>
                                            <td className="p-3">{patient.user?.email || 'N/A'}</td>
                                            <td className="p-3">{patient.user?.phone || 'N/A'}</td>
                                            <td className="p-3">{patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}</td>
                                            <td className="p-3 capitalize">{patient.gender || 'N/A'}</td>
                                            <td className="p-3">{new Date(patient.created_at).toLocaleDateString()}</td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEditModal(patient)}
                                                        className="rounded bg-blue-500 p-1 text-white hover:bg-blue-600"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletePatient(patient)}
                                                        className="rounded bg-red-500 p-1 text-white hover:bg-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {patients.links && patients.links.length > 0 && (
                    <div className="flex gap-2">
                        {patients.links.map((link, index) => (
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

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold">
                                {editingPatient ? 'Edit Patient' : 'Add Patient'}
                            </h2>
                            <form
                                method="POST"
                                action={
                                    editingPatient
                                        ? `/admin/patients/${editingPatient.id}`
                                        : '/admin/patients'
                                }
                                id="patientForm"
                            >
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                                {editingPatient && <input type="hidden" name="_method" value="PATCH" />}
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={editingPatient?.user?.name || ''}
                                        required
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={editingPatient?.user?.email || ''}
                                        required
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        defaultValue={editingPatient?.user?.phone || ''}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                                
                                {!editingPatient && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            minLength={8}
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                        />
                                    </div>
                                )}
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        defaultValue={editingPatient?.dob || ''}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Gender</label>
                                    <select
                                        name="gender"
                                        defaultValue={editingPatient?.gender || ''}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Medical Notes</label>
                                    <textarea
                                        name="medical_notes"
                                        defaultValue={editingPatient?.medical_notes || ''}
                                        rows={3}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                    >
                                        {editingPatient ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {deletePatient && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                            <h2 className="mb-4 text-xl font-bold">Confirm Delete</h2>
                            <p className="mb-4">
                                Are you sure you want to delete patient "{deletePatient.user?.name}"? This will also delete the associated user account.
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={closeModal}
                                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}