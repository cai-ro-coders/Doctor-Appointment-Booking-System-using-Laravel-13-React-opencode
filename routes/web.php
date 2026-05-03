<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AppointmentsController;
use App\Http\Controllers\DoctorAppointmentsController;
use App\Http\Controllers\DoctorAppointmentViewController;
use App\Http\Controllers\DoctorDashboardController;
use App\Http\Controllers\DoctorMySchedulesController;
use App\Http\Controllers\DoctorProfileController;
use App\Http\Controllers\DoctorSchedulesController;
use App\Http\Controllers\DoctorLocationsController;
use App\Http\Controllers\DoctorsController;
use App\Http\Controllers\LocationsController;
use App\Http\Controllers\PatientsController;
use App\Http\Controllers\PatientAppointmentsController;
use App\Http\Controllers\PatientDashboardController;
use App\Http\Controllers\PatientDoctorsController;
use App\Http\Controllers\PatientProfileController;
use App\Http\Controllers\SpecialtiesController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::middleware(['role:admin'])->group(function () {
        Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::get('admin/users', [UsersController::class, 'index'])->name('admin.users');
        Route::post('admin/users', [UsersController::class, 'store'])->name('admin.users.store');
        Route::patch('admin/users/{user}', [UsersController::class, 'update'])->name('admin.users.update');
        Route::delete('admin/users/{user}', [UsersController::class, 'destroy'])->name('admin.users.destroy');
        Route::get('admin/appointments', [AppointmentsController::class, 'index'])->name('admin.appointments');
        Route::get('admin/appointments/create', [AppointmentsController::class, 'create'])->name('admin.appointments.create');
        Route::get('admin/appointments/available-schedules', [AppointmentsController::class, 'availableSchedules'])->name('admin.appointments.availableSchedules');
        Route::post('admin/appointments', [AppointmentsController::class, 'store'])->name('admin.appointments.store');
        Route::patch('admin/appointments/{appointment}', [AppointmentsController::class, 'update'])->name('admin.appointments.update');
        Route::delete('admin/appointments/{appointment}', [AppointmentsController::class, 'destroy'])->name('admin.appointments.destroy');
        Route::get('admin/patients', [PatientsController::class, 'index'])->name('admin.patients');
        Route::post('admin/patients', [PatientsController::class, 'store'])->name('admin.patients.store');
        Route::patch('admin/patients/{patient}', [PatientsController::class, 'update'])->name('admin.patients.update');
        Route::delete('admin/patients/{patient}', [PatientsController::class, 'destroy'])->name('admin.patients.destroy');
        Route::get('admin/doctors', [DoctorsController::class, 'index'])->name('admin.doctors');
        Route::get('admin/doctors/create', [DoctorsController::class, 'create'])->name('admin.doctors.create');
        Route::post('admin/doctors', [DoctorsController::class, 'store'])->name('admin.doctors.store');
        Route::get('admin/doctors/{doctor}/edit', [DoctorsController::class, 'edit'])->name('admin.doctors.edit');
        Route::patch('admin/doctors/{doctor}', [DoctorsController::class, 'update'])->name('admin.doctors.update');
        Route::delete('admin/doctors/{doctor}', [DoctorsController::class, 'destroy'])->name('admin.doctors.destroy');
        Route::get('admin/doctor-schedules', [DoctorSchedulesController::class, 'index'])->name('admin.doctor-schedules');
        Route::post('admin/doctor-schedules', [DoctorSchedulesController::class, 'store'])->name('admin.doctor-schedules.store');
        Route::patch('admin/doctor-schedules/{doctorSchedule}', [DoctorSchedulesController::class, 'update'])->name('admin.doctor-schedules.update');
        Route::delete('admin/doctor-schedules/{doctorSchedule}', [DoctorSchedulesController::class, 'destroy'])->name('admin.doctor-schedules.destroy');
        Route::get('admin/specialties', [SpecialtiesController::class, 'index'])->name('admin.specialties');
        Route::post('admin/specialties', [SpecialtiesController::class, 'store'])->name('admin.specialties.store');
        Route::patch('admin/specialties/{specialty}', [SpecialtiesController::class, 'update'])->name('admin.specialties.update');
        Route::delete('admin/specialties/{specialty}', [SpecialtiesController::class, 'destroy'])->name('admin.specialties.destroy');
        Route::get('admin/doctor-locations', [DoctorLocationsController::class, 'index'])->name('admin.doctor-locations');
        Route::post('admin/doctor-locations', [DoctorLocationsController::class, 'store'])->name('admin.doctor-locations.store');
        Route::patch('admin/doctor-locations/{id}', [DoctorLocationsController::class, 'update'])->name('admin.doctor-locations.update');
        Route::delete('admin/doctor-locations/{id}', [DoctorLocationsController::class, 'destroy'])->name('admin.doctor-locations.destroy');
        Route::get('admin/locations', [LocationsController::class, 'index'])->name('admin.locations');
        Route::post('admin/locations', [LocationsController::class, 'store'])->name('admin.locations.store');
        Route::patch('admin/locations/{location}', [LocationsController::class, 'update'])->name('admin.locations.update');
        Route::delete('admin/locations/{location}', [LocationsController::class, 'destroy'])->name('admin.locations.destroy');
    });

    Route::middleware(['role:doctor'])->group(function () {
        Route::get('doctor/dashboard', [DoctorDashboardController::class, 'index'])->name('doctor.dashboard');
        Route::get('doctor/appointments', [DoctorAppointmentsController::class, 'index'])->name('doctor.appointments');
        Route::post('doctor/appointments', [DoctorAppointmentsController::class, 'store'])->name('doctor.appointments.store');
        Route::patch('doctor/appointments/{appointment}', [DoctorAppointmentsController::class, 'update'])->name('doctor.appointments.update');
        Route::patch('doctor/appointments/{appointment}/status', [DoctorAppointmentsController::class, 'updateStatus'])->name('doctor.appointments.updateStatus');
        Route::delete('doctor/appointments/{appointment}', [DoctorAppointmentsController::class, 'destroy'])->name('doctor.appointments.destroy');
        Route::get('doctor/appointments/{appointment}/view', [DoctorAppointmentViewController::class, 'show'])->name('doctor.appointments.view');
        Route::get('doctor/locations', [DoctorLocationsController::class, 'index'])->name('doctor.locations');
        Route::post('doctor/locations', [DoctorLocationsController::class, 'store'])->name('doctor.locations.store');
        Route::patch('doctor/locations/{location}', [DoctorLocationsController::class, 'update'])->name('doctor.locations.update');
        Route::delete('doctor/locations/{location}', [DoctorLocationsController::class, 'destroy'])->name('doctor.locations.destroy');
        Route::get('doctor/schedules', [DoctorMySchedulesController::class, 'index'])->name('doctor.schedules');
        Route::post('doctor/schedules', [DoctorMySchedulesController::class, 'store'])->name('doctor.schedules.store');
        Route::patch('doctor/schedules/{doctorSchedule}', [DoctorMySchedulesController::class, 'update'])->name('doctor.schedules.update');
        Route::delete('doctor/schedules/{doctorSchedule}', [DoctorMySchedulesController::class, 'destroy'])->name('doctor.schedules.destroy');
        Route::get('doctor/profile', [DoctorProfileController::class, 'index'])->name('doctor.profile');
        Route::patch('doctor/profile', [DoctorProfileController::class, 'update'])->name('doctor.profile.update');
    });

    Route::middleware(['role:patient'])->group(function () {
        Route::get('patient/dashboard', [PatientDashboardController::class, 'index'])->name('patient.dashboard');
        Route::get('patient/profile', [PatientProfileController::class, 'index'])->name('patient.profile');
        Route::patch('patient/profile', [PatientProfileController::class, 'update'])->name('patient.profile.update');
        Route::get('patient/doctors', [PatientDoctorsController::class, 'index'])->name('patient.doctors');
        Route::get('patient/doctors/{doctor}', [PatientDoctorsController::class, 'show'])->name('patient.doctors.show');
        Route::post('patient/doctors/{doctor}/book', [PatientDoctorsController::class, 'book'])->name('patient.doctors.book');
        Route::get('patient/appointments', [PatientAppointmentsController::class, 'index'])->name('patient.appointments');
        Route::post('patient/appointments', [PatientAppointmentsController::class, 'store'])->name('patient.appointments.store');
        Route::patch('patient/appointments/{appointment}', [PatientAppointmentsController::class, 'update'])->name('patient.appointments.update');
        Route::delete('patient/appointments/{appointment}', [PatientAppointmentsController::class, 'destroy'])->name('patient.appointments.destroy');
    });
});

require __DIR__.'/settings.php';
