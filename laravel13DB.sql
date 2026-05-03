-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 03, 2026 at 02:59 AM
-- Server version: 5.7.39
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `laravel13DB`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `location_id` bigint(20) UNSIGNED DEFAULT NULL,
  `scheduled_start` timestamp NULL DEFAULT NULL,
  `scheduled_end` timestamp NULL DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'General',
  `schedule_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date_appointment` date DEFAULT NULL,
  `status` enum('tentative','pending','confirmed','cancelled','completed','no_show') COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_source` enum('web','mobile','admin','api') COLLATE utf8mb4_unicode_ci NOT NULL,
  `cancellation_reason` text COLLATE utf8mb4_unicode_ci,
  `is_reminder_sent` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `uuid`, `doctor_id`, `patient_id`, `location_id`, `scheduled_start`, `scheduled_end`, `type`, `schedule_id`, `date_appointment`, `status`, `booking_source`, `cancellation_reason`, `is_reminder_sent`, `created_at`, `updated_at`) VALUES
(217, 'e5b122f3-a86f-4b74-91b2-83076693cdd8', 5, 103, 2, '2026-05-02 06:08:14', '2026-05-02 11:08:14', 'General', NULL, '2026-05-02', 'confirmed', 'web', NULL, 0, '2026-05-01 21:15:36', '2026-05-01 21:56:25'),
(219, '82d0509c-81fc-41b3-abd0-ddb50604e18b', 4, 103, 3, '2026-05-04 05:36:00', '2026-05-04 06:36:00', 'General', NULL, '2026-05-04', 'confirmed', 'web', NULL, 0, '2026-05-01 21:22:07', '2026-05-01 21:23:01'),
(221, '7515f2de-7000-426c-9c4e-8457d46259aa', 5, 103, 1, '2026-05-15 05:29:00', '2026-05-15 05:35:00', 'follow up', NULL, '2026-05-15', 'pending', 'web', NULL, 0, '2026-05-01 22:10:15', '2026-05-01 22:10:15'),
(222, '37b6d34d-ebca-4ff8-b005-6e51efea8ab4', 4, 103, 3, '2026-05-04 05:36:00', '2026-05-04 06:36:00', 'checkup', NULL, '2026-05-04', 'confirmed', 'web', NULL, 0, '2026-05-02 03:12:30', '2026-05-02 03:16:27'),
(223, 'f875532b-5e50-4dd7-9e08-3a91b2563539', 4, 103, 2, '2026-05-19 11:20:00', '2026-05-19 11:24:00', 'check up', NULL, '2026-05-19', 'confirmed', 'web', NULL, 0, '2026-05-02 03:21:15', '2026-05-02 03:21:42'),
(224, '6df4959c-aef7-489b-9e78-6165020406be', 4, 18, 3, '2026-05-04 05:36:00', '2026-05-04 06:36:00', 'General', NULL, '2026-05-04', 'completed', 'web', NULL, 0, '2026-05-02 03:24:54', '2026-05-02 16:58:57'),
(225, '2ede5243-38c5-48e1-b6e0-891600c463ae', 4, 103, 2, '2026-05-19 11:20:00', '2026-05-19 11:24:00', 'checkup', NULL, '2026-05-19', 'cancelled', 'web', NULL, 0, '2026-05-02 16:56:36', '2026-05-02 16:58:45'),
(226, 'a8969ec8-38a7-4fa3-9118-006d5784030f', 5, 103, 2, '2026-05-03 01:00:00', '2026-05-03 01:06:00', 'check up', NULL, '2026-05-03', 'confirmed', 'web', NULL, 0, '2026-05-02 17:04:13', '2026-05-02 17:04:43');

-- --------------------------------------------------------

--
-- Table structure for table `appointment_logs`
--

CREATE TABLE `appointment_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) UNSIGNED NOT NULL,
  `actor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `actor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `auditable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `auditable_id` bigint(20) NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-3f4319bf8daac223fb689b0840f2a50d', 'i:1;', 1777688441),
('laravel-cache-3f4319bf8daac223fb689b0840f2a50d:timer', 'i:1777688441;', 1777688441),
('laravel-cache-88649aa0b272fa2663e61aa3ff9aaca8', 'i:1;', 1777770078),
('laravel-cache-88649aa0b272fa2663e61aa3ff9aaca8:timer', 'i:1777770078;', 1777770078),
('laravel-cache-d0fc5408d48d2b319c786d4e23fbfafd', 'i:1;', 1777770222),
('laravel-cache-d0fc5408d48d2b319c786d4e23fbfafd:timer', 'i:1777770222;', 1777770222),
('laravel-cache-dc44958e29ffba8b810d21377ae366b5', 'i:1;', 1777770417),
('laravel-cache-dc44958e29ffba8b810d21377ae366b5:timer', 'i:1777770417;', 1777770417),
('laravel-cache-f42a2edb46a505735537e108b73614a7', 'i:1;', 1777769953),
('laravel-cache-f42a2edb46a505735537e108b73614a7:timer', 'i:1777769953;', 1777769953),
('laravel-cache-ohn.smith@example.com|127.0.0.1', 'i:1;', 1777688441),
('laravel-cache-ohn.smith@example.com|127.0.0.1:timer', 'i:1777688441;', 1777688441);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `photo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `consultation_fee` decimal(10,2) DEFAULT NULL,
  `rating` decimal(2,1) NOT NULL DEFAULT '0.0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `user_id`, `bio`, `photo_url`, `consultation_fee`, `rating`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 3, 'Experienced doctor with 5 years of practice. updated', 'https://i.pravatar.cc/300?u=3', '260.00', '0.0', 1, '2026-04-29 00:50:43', '2026-04-29 21:31:12'),
(2, 4, 'Experienced doctor with 7 years of practice.', 'https://i.pravatar.cc/300?u=4', '296.00', '0.0', 1, '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(4, 113, 'Experienced doctor with 5 years of practice.', '/storage/doctors/doctor_4_1777515772.jpeg', '100.00', '0.0', 1, '2026-04-29 18:03:34', '2026-04-29 18:22:52'),
(5, 114, 'enjoys caring for patients of all ages and backgrounds, with a focus on building lasting relationships with families.&nbsp;<div>His goal is to help patients live healthy and fulfilling lives.&nbsp;</div><div><br></div><div>With a background in pedia and a medical degree from [University],&nbsp;</div><div>I has a special interest in [Interest, e.g., nutrition or preventative care].&nbsp;</div><div>When not in the clinic, he enjoys [Hobby, e.g., hiking and cooking]&nbsp;</div><div>with his family and pets.</div>', '/storage/doctors/doctor_114_1777515066.jpeg', '400.00', '0.0', 1, '2026-04-29 18:11:06', '2026-05-01 16:44:18'),
(6, 115, 'sample bio', '/storage/doctors/doctor_115_1777517922.jpg', '400.00', '0.0', 1, '2026-04-29 18:58:42', '2026-04-29 18:58:42'),
(8, 117, 'sample bio', '/storage/doctors/doctor_117_1777549756.jpg', '200.00', '0.0', 1, '2026-04-30 03:49:16', '2026-04-30 03:49:16');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_location`
--

CREATE TABLE `doctor_location` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `location_id` bigint(20) UNSIGNED NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctor_location`
--

INSERT INTO `doctor_location` (`id`, `doctor_id`, `location_id`, `is_primary`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 1, NULL, NULL),
(2, 2, 3, 1, NULL, NULL),
(3, 5, 2, 0, '2026-04-30 02:54:02', '2026-04-30 02:54:02'),
(4, 5, 1, 1, '2026-04-30 03:00:38', '2026-04-30 03:00:38'),
(7, 8, 2, 0, NULL, NULL),
(8, 1, 1, 1, '2026-05-01 17:42:40', '2026-05-01 17:42:40'),
(9, 5, 4, 0, '2026-05-01 21:55:01', '2026-05-01 21:55:01'),
(10, 4, 2, 1, '2026-05-02 03:18:56', '2026-05-02 03:18:56');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_schedules`
--

CREATE TABLE `doctor_schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `date_appointment` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `location_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctor_schedules`
--

INSERT INTO `doctor_schedules` (`id`, `doctor_id`, `date_appointment`, `start_time`, `end_time`, `is_active`, `created_at`, `updated_at`, `location_id`) VALUES
(26, 5, '2026-05-02', '14:08:14', '19:08:14', 1, '2026-05-02 04:08:14', '2026-05-02 04:08:14', 2),
(27, 5, '2026-05-02', '12:35:00', '12:41:00', 1, '2026-05-01 20:35:27', '2026-05-01 20:35:27', 2),
(28, 4, '2026-05-04', '13:36:00', '14:36:00', 1, '2026-05-01 20:36:12', '2026-05-01 20:36:12', 3),
(29, 2, '2026-05-06', '13:27:00', '13:33:00', 1, '2026-05-01 21:28:03', '2026-05-01 21:28:03', 1),
(30, 5, '2026-05-15', '13:29:00', '13:35:00', 1, '2026-05-01 21:29:31', '2026-05-01 21:29:31', 1),
(31, 4, '2026-05-13', '19:19:00', '19:25:00', 1, '2026-05-02 03:19:21', '2026-05-02 03:19:21', 2),
(32, 4, '2026-05-19', '19:20:00', '19:24:00', 1, '2026-05-02 03:20:53', '2026-05-02 03:20:53', 2),
(33, 2, '2026-05-15', '19:25:00', '19:31:00', 1, '2026-05-02 03:25:45', '2026-05-02 03:25:45', 2),
(34, 5, '2026-05-03', '09:00:00', '09:06:00', 1, '2026-05-02 17:00:59', '2026-05-02 17:00:59', 2);

-- --------------------------------------------------------

--
-- Table structure for table `doctor_specialty`
--

CREATE TABLE `doctor_specialty` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `specialty_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctor_specialty`
--

INSERT INTO `doctor_specialty` (`id`, `doctor_id`, `specialty_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL),
(4, 2, 4, NULL, NULL),
(5, 2, 5, NULL, NULL),
(6, 5, 5, NULL, NULL),
(7, 6, 2, NULL, NULL),
(8, 4, 8, NULL, NULL),
(10, 8, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `email_notifications`
--

CREATE TABLE `email_notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mailable_class` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `to_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` json NOT NULL,
  `status` enum('queued','sent','failed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` int(11) NOT NULL DEFAULT '0',
  `last_attempt_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `google_calendar_tokens`
--

CREATE TABLE `google_calendar_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `provider_user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `scopes` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token_expires_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sync_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `last_synced_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `address`, `city`, `state`, `zip`, `latitude`, `longitude`, `created_at`, `updated_at`) VALUES
(1, 'Main Medical Center', '123 Healthcare Ave', 'New York', 'NY', '10001', '40.71280000', '-74.00600000', '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(2, 'Downtown Clinic', '456 Medical Plaza', 'New York', 'NY', '10002', '40.71800000', '-74.00300000', '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(3, 'Westside Hospital', '789 Health Drive', 'New York', 'NY', '10003', '40.72000000', '-74.01000000', '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(4, 'Uptown Medical', '321 Care Street', 'New York', 'NY', '10004', '40.72500000', '-73.99800000', '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(5, 'Baypoint', 'cabalan purok', 'olongapo city', 'zamabales', '2200', NULL, NULL, '2026-04-30 04:01:38', '2026-04-30 04:02:01');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_14_170933_add_two_factor_columns_to_users_table', 1),
(5, '2026_04_29_000001_create_doctor_appointment_system_tables', 2),
(6, '2026_05_01_005817_add_location_id_to_doctor_schedules', 3),
(7, '2026_05_01_000002_drop_columns_from_appointments_table', 4),
(8, '2026_05_01_000003_add_schedule_id_to_appointments_table', 5),
(9, '2026_05_01_000004_add_date_appointment_to_doctor_schedules_table', 6),
(10, '2026_05_01_000005_add_date_appointment_to_appointments_table', 7),
(11, '2026_05_01_063823_add_rating_to_doctors_table', 8),
(12, '2026_05_01_064750_modify_doctor_schedules_table', 9),
(13, '2026_05_02_025616_add_scheduled_times_to_appointments_table', 9),
(14, '2026_05_02_030931_add_start_time_and_end_time_to_doctor_schedules', 10),
(15, '2026_05_02_033339_cleanup_doctor_schedules_table', 11),
(16, '2026_05_02_041912_fix_appointment_time_in_doctor_schedules_table', 12),
(17, '2026_05_02_042804_remove_appointment_time_from_doctor_schedules_table', 13);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `medical_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `user_id`, `dob`, `gender`, `medical_notes`, `created_at`, `updated_at`) VALUES
(1, 7, '1979-01-02', 'female', NULL, '2026-04-29 00:50:44', '2026-04-29 00:50:44'),
(2, 8, '1966-11-23', 'other', NULL, '2026-04-29 00:50:44', '2026-04-29 00:50:44'),
(3, 9, '1984-12-11', 'other', NULL, '2026-04-29 00:50:44', '2026-04-29 00:50:44'),
(4, 10, '1979-09-01', 'other', NULL, '2026-04-29 00:50:44', '2026-04-29 00:50:44'),
(5, 11, '1956-03-05', 'male', NULL, '2026-04-29 00:50:45', '2026-04-29 00:50:45'),
(6, 12, '2000-09-17', 'female', NULL, '2026-04-29 00:50:45', '2026-04-29 00:50:45'),
(7, 13, '1987-09-13', 'male', NULL, '2026-04-29 00:50:45', '2026-04-29 00:50:45'),
(8, 14, '1970-07-28', 'female', NULL, '2026-04-29 00:50:46', '2026-04-29 00:50:46'),
(9, 15, '1948-03-14', 'female', NULL, '2026-04-29 00:50:46', '2026-04-29 00:50:46'),
(10, 16, '1948-11-11', 'other', NULL, '2026-04-29 00:50:46', '2026-04-29 00:50:46'),
(11, 17, '1974-01-15', 'male', NULL, '2026-04-29 00:50:46', '2026-04-29 00:50:46'),
(12, 18, '1989-12-06', 'male', NULL, '2026-04-29 00:50:47', '2026-04-29 00:50:47'),
(13, 19, '1963-03-25', 'male', NULL, '2026-04-29 00:50:47', '2026-04-29 00:50:47'),
(14, 20, '1980-05-12', 'other', NULL, '2026-04-29 00:50:47', '2026-04-29 00:50:47'),
(15, 21, '1950-10-06', 'other', NULL, '2026-04-29 00:50:48', '2026-04-29 00:50:48'),
(16, 22, '2008-03-23', 'other', NULL, '2026-04-29 00:50:48', '2026-04-29 00:50:48'),
(17, 23, '1997-04-05', 'male', NULL, '2026-04-29 00:50:48', '2026-04-29 00:50:48'),
(18, 24, '1972-02-09', 'male', NULL, '2026-04-29 00:50:49', '2026-04-29 00:50:49'),
(19, 25, '1962-11-01', 'female', NULL, '2026-04-29 00:50:49', '2026-04-29 00:50:49'),
(20, 26, '1987-11-27', 'male', NULL, '2026-04-29 00:50:49', '2026-04-29 00:50:49'),
(21, 27, '1985-07-21', 'female', NULL, '2026-04-29 00:50:49', '2026-04-29 00:50:49'),
(22, 28, '1990-01-04', 'other', NULL, '2026-04-29 00:50:50', '2026-04-29 00:50:50'),
(23, 29, '1987-02-09', 'female', NULL, '2026-04-29 00:50:50', '2026-04-29 00:50:50'),
(24, 30, '1993-06-06', 'female', NULL, '2026-04-29 00:50:50', '2026-04-29 00:50:50'),
(25, 31, '1990-04-29', 'female', NULL, '2026-04-29 00:50:51', '2026-04-29 00:50:51'),
(26, 32, '1997-01-21', 'other', NULL, '2026-04-29 00:50:51', '2026-04-29 00:50:51'),
(27, 33, '1993-01-17', 'female', NULL, '2026-04-29 00:50:51', '2026-04-29 00:50:51'),
(28, 34, '1992-06-17', 'male', NULL, '2026-04-29 00:50:52', '2026-04-29 00:50:52'),
(29, 35, '1969-09-18', 'other', NULL, '2026-04-29 00:50:52', '2026-04-29 00:50:52'),
(30, 36, '1971-12-30', 'female', NULL, '2026-04-29 00:50:52', '2026-04-29 00:50:52'),
(31, 37, '1960-02-17', 'other', NULL, '2026-04-29 00:50:52', '2026-04-29 00:50:52'),
(32, 38, '1999-05-22', 'other', NULL, '2026-04-29 00:50:53', '2026-04-29 00:50:53'),
(33, 39, '1956-11-30', 'female', NULL, '2026-04-29 00:50:53', '2026-04-29 00:50:53'),
(34, 40, '1990-07-18', 'male', NULL, '2026-04-29 00:50:53', '2026-04-29 00:50:53'),
(35, 41, '2006-06-18', 'other', NULL, '2026-04-29 00:50:54', '2026-04-29 00:50:54'),
(36, 42, '1962-10-15', 'male', NULL, '2026-04-29 00:50:54', '2026-04-29 00:50:54'),
(37, 43, '1959-02-26', 'other', NULL, '2026-04-29 00:50:54', '2026-04-29 00:50:54'),
(38, 44, '1968-01-24', 'other', NULL, '2026-04-29 00:50:54', '2026-04-29 00:50:54'),
(39, 45, '1979-06-11', 'other', NULL, '2026-04-29 00:50:55', '2026-04-29 00:50:55'),
(40, 46, '1991-08-07', 'male', NULL, '2026-04-29 00:50:55', '2026-04-29 00:50:55'),
(41, 47, '1987-02-20', 'male', NULL, '2026-04-29 00:50:55', '2026-04-29 00:50:55'),
(42, 48, '1953-11-21', 'female', NULL, '2026-04-29 00:50:56', '2026-04-29 00:50:56'),
(43, 49, '1949-06-25', 'male', NULL, '2026-04-29 00:50:56', '2026-04-29 00:50:56'),
(44, 50, '1963-01-03', 'female', NULL, '2026-04-29 00:50:56', '2026-04-29 00:50:56'),
(45, 51, '1972-06-04', 'female', NULL, '2026-04-29 00:50:57', '2026-04-29 00:50:57'),
(46, 52, '2005-02-11', 'other', NULL, '2026-04-29 00:50:57', '2026-04-29 00:50:57'),
(47, 53, '1977-05-26', 'male', NULL, '2026-04-29 00:50:57', '2026-04-29 00:50:57'),
(48, 54, '1954-11-24', 'female', NULL, '2026-04-29 00:50:57', '2026-04-29 00:50:57'),
(49, 55, '1999-04-03', 'female', NULL, '2026-04-29 00:50:58', '2026-04-29 00:50:58'),
(50, 56, '1981-08-11', 'other', NULL, '2026-04-29 00:50:58', '2026-04-29 00:50:58'),
(51, 57, '1989-02-05', 'other', NULL, '2026-04-29 00:50:58', '2026-04-29 00:50:58'),
(52, 58, '1981-07-26', 'female', NULL, '2026-04-29 00:50:59', '2026-04-29 00:50:59'),
(53, 59, '1970-05-12', 'other', NULL, '2026-04-29 00:50:59', '2026-04-29 00:50:59'),
(54, 60, '1983-02-26', 'male', NULL, '2026-04-29 00:50:59', '2026-04-29 00:50:59'),
(55, 61, '1982-09-20', 'male', NULL, '2026-04-29 00:51:00', '2026-04-29 00:51:00'),
(56, 62, '1997-10-05', 'female', NULL, '2026-04-29 00:51:00', '2026-04-29 00:51:00'),
(57, 63, '1949-04-12', 'female', NULL, '2026-04-29 00:51:00', '2026-04-29 00:51:00'),
(58, 64, '1958-10-16', 'other', NULL, '2026-04-29 00:51:00', '2026-04-29 00:51:00'),
(59, 65, '1955-10-31', 'other', NULL, '2026-04-29 00:51:01', '2026-04-29 00:51:01'),
(60, 66, '1971-02-02', 'male', NULL, '2026-04-29 00:51:01', '2026-04-29 00:51:01'),
(61, 67, '1983-07-06', 'male', NULL, '2026-04-29 00:51:01', '2026-04-29 00:51:01'),
(62, 68, '1981-01-01', 'other', NULL, '2026-04-29 00:51:02', '2026-04-29 00:51:02'),
(63, 69, '1962-10-23', 'other', NULL, '2026-04-29 00:51:02', '2026-04-29 00:51:02'),
(64, 70, '1952-03-18', 'female', NULL, '2026-04-29 00:51:02', '2026-04-29 00:51:02'),
(65, 71, '2003-01-08', 'male', NULL, '2026-04-29 00:51:03', '2026-04-29 00:51:03'),
(66, 72, '1955-07-24', 'male', NULL, '2026-04-29 00:51:03', '2026-04-29 00:51:03'),
(67, 73, '1975-03-15', 'other', NULL, '2026-04-29 00:51:03', '2026-04-29 00:51:03'),
(68, 74, '1946-04-15', 'male', NULL, '2026-04-29 00:51:03', '2026-04-29 00:51:03'),
(69, 75, '1980-03-14', 'male', NULL, '2026-04-29 00:51:04', '2026-04-29 00:51:04'),
(70, 76, '2003-01-25', 'female', NULL, '2026-04-29 00:51:04', '2026-04-29 00:51:04'),
(71, 77, '1961-09-14', 'female', NULL, '2026-04-29 00:51:04', '2026-04-29 00:51:04'),
(72, 78, '2007-06-28', 'other', NULL, '2026-04-29 00:51:05', '2026-04-29 00:51:05'),
(73, 79, '1974-09-17', 'female', NULL, '2026-04-29 00:51:05', '2026-04-29 00:51:05'),
(74, 80, '1968-05-26', 'female', NULL, '2026-04-29 00:51:05', '2026-04-29 00:51:05'),
(75, 81, '1988-09-12', 'other', NULL, '2026-04-29 00:51:05', '2026-04-29 00:51:05'),
(76, 82, '1962-05-19', 'female', NULL, '2026-04-29 00:51:06', '2026-04-29 00:51:06'),
(77, 83, '1996-08-30', 'other', NULL, '2026-04-29 00:51:06', '2026-04-29 00:51:06'),
(78, 84, '1978-07-25', 'other', NULL, '2026-04-29 00:51:06', '2026-04-29 00:51:06'),
(79, 85, '1965-01-26', 'male', NULL, '2026-04-29 00:51:07', '2026-04-29 00:51:07'),
(80, 86, '1947-08-20', 'other', NULL, '2026-04-29 00:51:07', '2026-04-29 00:51:07'),
(81, 87, '2000-08-09', 'female', NULL, '2026-04-29 00:51:07', '2026-04-29 00:51:07'),
(82, 88, '1954-05-21', 'male', NULL, '2026-04-29 00:51:08', '2026-04-29 00:51:08'),
(83, 89, '2000-04-12', 'female', NULL, '2026-04-29 00:51:08', '2026-04-29 00:51:08'),
(84, 90, '1986-03-05', 'male', NULL, '2026-04-29 00:51:08', '2026-04-29 00:51:08'),
(85, 91, '1986-07-22', 'male', NULL, '2026-04-29 00:51:08', '2026-04-29 00:51:08'),
(86, 92, '2003-04-27', 'female', NULL, '2026-04-29 00:51:09', '2026-04-29 00:51:09'),
(87, 93, '1951-10-13', 'male', NULL, '2026-04-29 00:51:09', '2026-04-29 00:51:09'),
(88, 94, '1953-02-18', 'other', NULL, '2026-04-29 00:51:09', '2026-04-29 00:51:09'),
(89, 95, '1987-07-26', 'male', NULL, '2026-04-29 00:51:10', '2026-04-29 00:51:10'),
(90, 96, '1953-05-21', 'other', NULL, '2026-04-29 00:51:10', '2026-04-29 00:51:10'),
(91, 97, '1993-02-24', 'male', NULL, '2026-04-29 00:51:10', '2026-04-29 00:51:10'),
(92, 98, '1987-07-05', 'male', NULL, '2026-04-29 00:51:11', '2026-04-29 00:51:11'),
(93, 99, '2006-12-09', 'male', NULL, '2026-04-29 00:51:11', '2026-04-29 00:51:11'),
(94, 100, '1978-07-23', 'female', NULL, '2026-04-29 00:51:11', '2026-04-29 00:51:11'),
(95, 101, '1982-07-29', 'other', NULL, '2026-04-29 00:51:11', '2026-04-29 00:51:11'),
(96, 102, '1995-04-29', 'other', NULL, '2026-04-29 00:51:12', '2026-04-29 00:51:12'),
(97, 103, '1997-05-30', 'female', NULL, '2026-04-29 00:51:12', '2026-04-29 00:51:12'),
(98, 104, '1996-05-08', 'female', NULL, '2026-04-29 00:51:12', '2026-04-29 00:51:12'),
(99, 105, '1959-05-03', 'male', 'follow check up', '2026-04-29 00:51:13', '2026-05-01 17:29:59'),
(100, 106, '1954-07-13', 'female', NULL, '2026-04-29 00:51:13', '2026-04-29 00:51:13'),
(102, 111, '2026-04-10', 'female', 'checkup updated', '2026-04-29 17:49:30', '2026-04-29 17:49:58'),
(103, 5, '2026-05-02', 'male', 'The patient is a 45-year-old male presenting with acute-on-chronic lower back pain, likely secondary to a musculoskeletal strain, with no signs of neurological deficit.', '2026-05-01 16:53:55', '2026-05-01 17:17:58');

-- --------------------------------------------------------

--
-- Table structure for table `schedule_exceptions`
--

CREATE TABLE `schedule_exceptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `doctor_schedule_id` bigint(20) UNSIGNED DEFAULT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `date` date DEFAULT NULL,
  `start_datetime` timestamp NULL DEFAULT NULL,
  `end_datetime` timestamp NULL DEFAULT NULL,
  `type` enum('time_off','override','extra_slot') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('gvZ7tM6VhyNdmrjU0InHGEKqSA7JH9aZjFUnak3C', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJTVW1nd29rMGZoaVJEUklpWWhiSGJnczRNTlJxMGtPa3VwZzM2OXh5IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1777770504),
('XfJxQCL3VYBHBLJXDajWIK2y4ZzXrizdhsYhHWOO', 5, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJINU4wQVlpMjc1NVF4S2VhVzFpV0d5UlNVZnFaZWFrS2tPWlRva29xIiwidXJsIjp7ImludGVuZGVkIjoiaHR0cDpcL1wvMTI3LjAuMC4xOjgwMDBcL2RvY3Rvclwvc2NoZWR1bGVzIn0sIl9wcmV2aW91cyI6eyJ1cmwiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvcGF0aWVudFwvYXBwb2ludG1lbnRzIiwicm91dGUiOiJwYXRpZW50LmFwcG9pbnRtZW50cyJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjo1fQ==', 1777770328);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `specialties`
--

CREATE TABLE `specialties` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `specialties`
--

INSERT INTO `specialties` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Cardiology', 'Heart and cardiovascular system', '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(2, 'Dermatology', 'Skin, hair, and nails', '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(3, 'Neurology', 'Brain and nervous system', '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(4, 'Orthopedics', 'Bones, joints, and muscles', '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(5, 'Pediatrics', 'Children and adolescent health', '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(6, 'Internal Medicine', 'Adult internal organs', '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(7, 'Ophthalmology', 'Eye care', '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(8, 'ENT', 'Ear, nose, and throat', '2026-04-29 00:50:43', '2026-04-29 00:50:43');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role` enum('admin','doctor','patient') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'patient',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timezone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UTC',
  `profile_data` json DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role`, `name`, `email`, `phone`, `timezone`, `profile_data`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'patient', 'cairocoders ednalan', 'cairocoders@gmail.com', NULL, 'UTC', NULL, NULL, '$2y$12$oLcMhKKwa6Pwf830bOoM6ODT/Ox2FXndZI5FwdYCDB4dNiTysRPau', NULL, NULL, NULL, NULL, '2026-04-28 23:16:49', '2026-04-28 23:16:49'),
(2, 'admin', 'Admin User', 'admin@example.com', '+1234567890', 'America/New_York', NULL, '2026-04-29 00:00:32', '$2y$12$CxFxXVXpfYsMM5UlME.pmOZM2tzNDol0yi8FlIODhuVHKnb8RSSo.', NULL, NULL, NULL, NULL, '2026-04-28 23:55:12', '2026-04-29 00:00:32'),
(3, 'doctor', 'Dr. Sarah Johnson', 'sarah.johnson@example.com', '+1234567891', 'America/New_York', NULL, '2026-04-29 00:00:32', '$2y$12$qRQ.nGk2DpB4CFPCh2otv.1RB2nTCYRxvQHaPZ/diIScKjn9FISIS', NULL, NULL, NULL, NULL, '2026-04-28 23:55:12', '2026-04-29 00:00:32'),
(4, 'doctor', 'Dr. Michael Chen', 'michael.chen@example.com', '+1234567892', 'America/Chicago', NULL, '2026-04-29 00:00:32', '$2y$12$RzvXOMJ3owbBiAvKOPyfvuaa35OhOr5W1.t9DVgTSKxxyTuj9Q/fa', NULL, NULL, NULL, NULL, '2026-04-28 23:55:13', '2026-04-29 00:00:32'),
(5, 'patient', 'John Smith', 'john.smith@example.com', '+1234567893', 'America/New_York', NULL, '2026-04-29 00:00:33', '$2y$12$GcxAlJ8VRkhhFwGabB5IpO3xKv7JXnF4rSDhc8maAhMW2Vm7TIIAC', NULL, NULL, NULL, NULL, '2026-04-28 23:55:13', '2026-04-29 00:00:33'),
(6, 'patient', 'Emily Davis', 'emily.davis@example.com', '+1234567894', 'America/Los_Angeles', NULL, '2026-04-29 00:00:33', '$2y$12$mUkpX2tT5GAGHLd8YUPQFeyR7c5DnRa5y3gYbcPrU7FwP9e/jhMWi', NULL, NULL, NULL, NULL, '2026-04-28 23:55:13', '2026-04-29 00:00:33'),
(7, 'patient', 'Daniel White', 'daniel.white1@example.com', '+17463284252', 'America/New_York', NULL, '2026-04-29 00:50:43', '$2y$12$B8oUauz9HbmI//8DV5Aqp.4j58ci0.eq5.sKuNABNpyhnovB/7T/G', NULL, NULL, NULL, NULL, '2026-04-29 00:50:43', '2026-04-29 00:50:43'),
(8, 'patient', 'Matthew King', 'matthew.king2@example.com', '+17275959958', 'America/New_York', NULL, '2026-04-29 00:50:44', '$2y$12$KXpR/xBgC.RTcP.YvAVSyehU/HtkfPOSOBx6pXyQFZvWkPfTdub6i', NULL, NULL, NULL, NULL, '2026-04-29 00:50:44', '2026-04-29 00:50:44'),
(9, 'patient', 'Linda Robinson', 'linda.robinson3@example.com', '+16297534973', 'America/New_York', NULL, '2026-04-29 00:50:44', '$2y$12$WwC3tohNx1NIuUKQflV5nuFLyhefEAlb1bNWYRRt8GHGBekAp350K', NULL, NULL, NULL, NULL, '2026-04-29 00:50:44', '2026-04-29 00:50:44'),
(10, 'patient', 'Linda Campbell', 'linda.campbell4@example.com', '+17382391580', 'America/New_York', NULL, '2026-04-29 00:50:44', '$2y$12$BmqhIxQCQh627g8oEStEB.Lvy5t5aP9rlbIPk8XzGApl17CvcI8TK', NULL, NULL, NULL, NULL, '2026-04-29 00:50:44', '2026-04-29 00:50:44'),
(11, 'patient', 'Donna Allen', 'donna.allen5@example.com', '+18566000348', 'America/New_York', NULL, '2026-04-29 00:50:45', '$2y$12$BHahXvDvdp.zMAoAqsGk0ejlOB4kScooTncoPMNKyheiMcqM/iu1i', NULL, NULL, NULL, NULL, '2026-04-29 00:50:45', '2026-04-29 00:50:45'),
(12, 'patient', 'Michael Davis', 'michael.davis6@example.com', '+16263357997', 'America/New_York', NULL, '2026-04-29 00:50:45', '$2y$12$gEcngTa62.Ej1cOrWWEPyuM9RT15Dm.Dsqw0CKdzHVnLvv8UMkV9.', NULL, NULL, NULL, NULL, '2026-04-29 00:50:45', '2026-04-29 00:50:45'),
(13, 'patient', 'Margaret Jackson', 'margaret.jackson7@example.com', '+14365286260', 'America/New_York', NULL, '2026-04-29 00:50:45', '$2y$12$HY01DVwWniD8WTtS4VXDXuPWAD42uJi3.BfVY9ek9x0zusm5c.ZrW', NULL, NULL, NULL, NULL, '2026-04-29 00:50:45', '2026-04-29 00:50:45'),
(14, 'patient', 'James Nguyen', 'james.nguyen8@example.com', '+13608653016', 'America/New_York', NULL, '2026-04-29 00:50:46', '$2y$12$3F8lw/Eluy6eG0Yt.MkWZey7u7Vz0HmcAoFr/vhGTqADRNJVG.Id2', NULL, NULL, NULL, NULL, '2026-04-29 00:50:46', '2026-04-29 00:50:46'),
(15, 'patient', 'Andrew Smith', 'andrew.smith9@example.com', '+14828203576', 'America/New_York', NULL, '2026-04-29 00:50:46', '$2y$12$Dx0FosOESkm.Ul.om./A.OBOXI6yYE2y9mbxVI/JXIrYZHGn/TtsO', NULL, NULL, NULL, NULL, '2026-04-29 00:50:46', '2026-04-29 00:50:46'),
(16, 'patient', 'Brian Hernandez', 'brian.hernandez10@example.com', '+15758152735', 'America/New_York', NULL, '2026-04-29 00:50:46', '$2y$12$6tSHu6Fod1xEJJoL46q1kOZCr76UWp5/B2Zw5RrZZtnGbzGZf5fOy', NULL, NULL, NULL, NULL, '2026-04-29 00:50:46', '2026-04-29 00:50:46'),
(17, 'patient', 'Betty Harris', 'betty.harris11@example.com', '+16668132505', 'America/New_York', NULL, '2026-04-29 00:50:46', '$2y$12$E3rdDJcTyDrDEoqe/Km0seMXarkpjSmh7mn9ayT1cMQMDGFkYhOSm', NULL, NULL, NULL, NULL, '2026-04-29 00:50:46', '2026-04-29 00:50:46'),
(18, 'patient', 'Patricia Gonzalez', 'patricia.gonzalez12@example.com', '+13821461322', 'America/New_York', NULL, '2026-04-29 00:50:47', '$2y$12$4469o5gmGb.oktrFxrczUOAPpzX84AB1EDRvF.ZaTmNx4er.pkWui', NULL, NULL, NULL, NULL, '2026-04-29 00:50:47', '2026-04-29 00:50:47'),
(19, 'patient', 'Sarah Nguyen', 'sarah.nguyen13@example.com', '+14289173597', 'America/New_York', NULL, '2026-04-29 00:50:47', '$2y$12$wJPBHZhqYM8FjH22pPjRdec6YGzzk4ulECKcXsaRDycZLgHxMcgla', NULL, NULL, NULL, NULL, '2026-04-29 00:50:47', '2026-04-29 00:50:47'),
(20, 'patient', 'Matthew Rodriguez', 'matthew.rodriguez14@example.com', '+15315992012', 'America/New_York', NULL, '2026-04-29 00:50:47', '$2y$12$xyeqUQrEaG7vChLdrOy3quBkOtR1e3t6mOnow1uzX5BQtBf646vkO', NULL, NULL, NULL, NULL, '2026-04-29 00:50:47', '2026-04-29 00:50:47'),
(21, 'patient', 'Christopher Flores', 'christopher.flores15@example.com', '+17555742039', 'America/New_York', NULL, '2026-04-29 00:50:48', '$2y$12$f9vtjB3iWpRBiWHwIblipubwJWPOYd5t0ki3gAtVlzUm59jRzCN/G', NULL, NULL, NULL, NULL, '2026-04-29 00:50:48', '2026-04-29 00:50:48'),
(22, 'patient', 'William Thomas', 'william.thomas16@example.com', '+19879478232', 'America/New_York', NULL, '2026-04-29 00:50:48', '$2y$12$UqPgs65.7b01HIRPmIloj.V4bDFn3kbn8VzJhJke4PkJTOxlBBG9K', NULL, NULL, NULL, NULL, '2026-04-29 00:50:48', '2026-04-29 00:50:48'),
(23, 'patient', 'Betty Moore', 'betty.moore17@example.com', '+14191526794', 'America/New_York', NULL, '2026-04-29 00:50:48', '$2y$12$i1u6qm9PwFn1QF8rwRcFsuc6PtcJpQuQgwmN9t4GXuXJ7.qs4WGl6', NULL, NULL, NULL, NULL, '2026-04-29 00:50:48', '2026-04-29 00:50:48'),
(24, 'patient', 'Emily Campbell', 'emily.campbell18@example.com', '+18192917974', 'America/New_York', NULL, '2026-04-29 00:50:49', '$2y$12$sGxHroQHg17B69CKMFHH8edBg72w.bWRx3ZBmjS96jAlPDL95kbJO', NULL, NULL, NULL, NULL, '2026-04-29 00:50:49', '2026-04-29 00:50:49'),
(25, 'patient', 'Joseph Nguyen', 'joseph.nguyen19@example.com', '+16613341384', 'America/New_York', NULL, '2026-04-29 00:50:49', '$2y$12$sSzwQBfP97O4K97JKU/isehJLTbqMJ53WE9YqBhzGYcytERCCCXoG', NULL, NULL, NULL, NULL, '2026-04-29 00:50:49', '2026-04-29 00:50:49'),
(26, 'patient', 'George Clark', 'george.clark20@example.com', '+18578102752', 'America/New_York', NULL, '2026-04-29 00:50:49', '$2y$12$dgialapsjBvOMg5dyPumSuqWwPOfMQDmkTZJXjuyFV1ybWj3SBoFS', NULL, NULL, NULL, NULL, '2026-04-29 00:50:49', '2026-04-29 00:50:49'),
(27, 'patient', 'Charles Scott', 'charles.scott21@example.com', '+15265180112', 'America/New_York', NULL, '2026-04-29 00:50:49', '$2y$12$cc2z5c1CMB6yrti3pKg2R.XlZd6SCVdLNWSS29u.yeYmQWNS31F/i', NULL, NULL, NULL, NULL, '2026-04-29 00:50:49', '2026-04-29 00:50:49'),
(28, 'patient', 'Andrew Thomas', 'andrew.thomas22@example.com', '+13497453681', 'America/New_York', NULL, '2026-04-29 00:50:50', '$2y$12$m34c//SdfATLsgjxKtNpc.oZkzF.iWin08xerBY/HQIwaZGxQzLQK', NULL, NULL, NULL, NULL, '2026-04-29 00:50:50', '2026-04-29 00:50:50'),
(29, 'patient', 'Ashley Moore', 'ashley.moore23@example.com', '+14558276197', 'America/New_York', NULL, '2026-04-29 00:50:50', '$2y$12$VrP0TZbj2438iD/K.qRO6Ojk3D0E14z8Gi3lH4Z8wuZC8sz/tyJcO', NULL, NULL, NULL, NULL, '2026-04-29 00:50:50', '2026-04-29 00:50:50'),
(30, 'patient', 'James Rodriguez', 'james.rodriguez24@example.com', '+13343912552', 'America/New_York', NULL, '2026-04-29 00:50:50', '$2y$12$18UJ0KN5oJNV8.FjTNo/OOxIbU6zpfPeSvqbS3oppAZsyvf2V/Eym', NULL, NULL, NULL, NULL, '2026-04-29 00:50:50', '2026-04-29 00:50:50'),
(31, 'patient', 'Joshua King', 'joshua.king25@example.com', '+17684633905', 'America/New_York', NULL, '2026-04-29 00:50:51', '$2y$12$2X0mo5rvHPfY12iPWSalcu5cubtRcWKUgrIOhXMWXXirg3ZINUV1C', NULL, NULL, NULL, NULL, '2026-04-29 00:50:51', '2026-04-29 00:50:51'),
(32, 'patient', 'Donald Baker', 'donald.baker26@example.com', '+17616834016', 'America/New_York', NULL, '2026-04-29 00:50:51', '$2y$12$0r9JJktIRNXPBr2xZWqWzOLq3XzoSx7iQmRl2ShLeoYHTn3Z6CtvK', NULL, NULL, NULL, NULL, '2026-04-29 00:50:51', '2026-04-29 00:50:51'),
(33, 'patient', 'Sandra Allen', 'sandra.allen27@example.com', '+16699971837', 'America/New_York', NULL, '2026-04-29 00:50:51', '$2y$12$g38DsUX0.NSKaqPsX1sd9O969.E13FSRWJ2m4lb7ObFz.AdGawr9e', NULL, NULL, NULL, NULL, '2026-04-29 00:50:51', '2026-04-29 00:50:51'),
(34, 'patient', 'Jennifer Williams', 'jennifer.williams28@example.com', '+15899948164', 'America/New_York', NULL, '2026-04-29 00:50:52', '$2y$12$rEuLirbLq3UNd1CyQms/ouYUJDIkk91lB79B7PieVAjvQnqmVvt92', NULL, NULL, NULL, NULL, '2026-04-29 00:50:52', '2026-04-29 00:50:52'),
(35, 'patient', 'Michael Johnson', 'michael.johnson29@example.com', '+18571500288', 'America/New_York', NULL, '2026-04-29 00:50:52', '$2y$12$I149klumjw6O7cYGvHNMSefZDT/dGsaHeavAiCHCvabHMN6OjbNlu', NULL, NULL, NULL, NULL, '2026-04-29 00:50:52', '2026-04-29 00:50:52'),
(36, 'patient', 'Robert Wright', 'robert.wright30@example.com', '+13464479985', 'America/New_York', NULL, '2026-04-29 00:50:52', '$2y$12$voFOjErO0V9JAZ7xvVlyYucR5LP1uIUcW9yYfSd6ph0SlT4UoXsy2', NULL, NULL, NULL, NULL, '2026-04-29 00:50:52', '2026-04-29 00:50:52'),
(37, 'patient', 'Paul Hall', 'paul.hall31@example.com', '+13868029957', 'America/New_York', NULL, '2026-04-29 00:50:52', '$2y$12$qqaOnLV51R3BQV2jZy1je.h1bn79JSDYilbDoHKWHvdzVR54Z.tjC', NULL, NULL, NULL, NULL, '2026-04-29 00:50:52', '2026-04-29 00:50:52'),
(38, 'patient', 'Betty Davis', 'betty.davis32@example.com', '+12823323565', 'America/New_York', NULL, '2026-04-29 00:50:53', '$2y$12$NQhQuImkWQ3Q9IHx9sMc1emJKK5x3ljBTrXZORvksn0AjnnKHXgjK', NULL, NULL, NULL, NULL, '2026-04-29 00:50:53', '2026-04-29 00:50:53'),
(39, 'patient', 'Kimberly Anderson', 'kimberly.anderson33@example.com', '+17616831278', 'America/New_York', NULL, '2026-04-29 00:50:53', '$2y$12$Y0j86NjrmRsskxP./AQwluK525LM2LgQUNt0oZi4BDajt1mLZXWNK', NULL, NULL, NULL, NULL, '2026-04-29 00:50:53', '2026-04-29 00:50:53'),
(40, 'patient', 'Melissa Roberts', 'melissa.roberts34@example.com', '+12902437984', 'America/New_York', NULL, '2026-04-29 00:50:53', '$2y$12$b.4oFKtnNMWLd0DsQ55O..bIkP7D78BQFrBAiiICvapY/kDvqsq3W', NULL, NULL, NULL, NULL, '2026-04-29 00:50:53', '2026-04-29 00:50:53'),
(41, 'patient', 'Robert Wright', 'robert.wright35@example.com', '+13600797075', 'America/New_York', NULL, '2026-04-29 00:50:54', '$2y$12$Q2rQjofQY6ndfRRRqbfeEOz9BaSBe3WtILNcJfISfvqKmaSEIun1S', NULL, NULL, NULL, NULL, '2026-04-29 00:50:54', '2026-04-29 00:50:54'),
(42, 'patient', 'Andrew Smith', 'andrew.smith36@example.com', '+13789920850', 'America/New_York', NULL, '2026-04-29 00:50:54', '$2y$12$0RXvxLUGoS/8FPO2KDp74.E2FoKhYamJhPVDzZ2SQOv.0kS72vZDq', NULL, NULL, NULL, NULL, '2026-04-29 00:50:54', '2026-04-29 00:50:54'),
(43, 'patient', 'Barbara Taylor', 'barbara.taylor37@example.com', '+16053346094', 'America/New_York', NULL, '2026-04-29 00:50:54', '$2y$12$BP.sZRZ08vDRnEB6RfZaheGYFJw79OC/o9cymjD1mlJb.1UOFSB4e', NULL, NULL, NULL, NULL, '2026-04-29 00:50:54', '2026-04-29 00:50:54'),
(44, 'patient', 'Michael Robinson', 'michael.robinson38@example.com', '+17173663105', 'America/New_York', NULL, '2026-04-29 00:50:54', '$2y$12$gZUf0KWlsCSKVE7DZ5EjfOQDgp8EpWcIgCcRNe/V/gjm4tZb.Nnp.', NULL, NULL, NULL, NULL, '2026-04-29 00:50:54', '2026-04-29 00:50:54'),
(45, 'patient', 'Sarah Lewis', 'sarah.lewis39@example.com', '+14201191065', 'America/New_York', NULL, '2026-04-29 00:50:55', '$2y$12$tLKxg/y8dFaiuIVsmvF7x.zEPXMwdVRXxXDCw1Da4oqAWPWExX8wC', NULL, NULL, NULL, NULL, '2026-04-29 00:50:55', '2026-04-29 00:50:55'),
(46, 'patient', 'Mark Johnson', 'mark.johnson40@example.com', '+19830914230', 'America/New_York', NULL, '2026-04-29 00:50:55', '$2y$12$Fk1La7qetVhGzFuJ5YLb2uN86zicoLOOx9sR2/TNfJnTX4ZmMZtOC', NULL, NULL, NULL, NULL, '2026-04-29 00:50:55', '2026-04-29 00:50:55'),
(47, 'patient', 'Jessica Walker', 'jessica.walker41@example.com', '+13006552957', 'America/New_York', NULL, '2026-04-29 00:50:55', '$2y$12$4WieZlc1GSgTDDhay3XAE.K8T.icoCFS/cM3DVr.WkUNGM8N1hlXa', NULL, NULL, NULL, NULL, '2026-04-29 00:50:55', '2026-04-29 00:50:55'),
(48, 'patient', 'Kenneth Flores', 'kenneth.flores42@example.com', '+12208635248', 'America/New_York', NULL, '2026-04-29 00:50:56', '$2y$12$kj5SMyPRW3ZU4mrK1JZyY.OeEwGuWG/C6XLuYhR7mUzgMWUNvCrva', NULL, NULL, NULL, NULL, '2026-04-29 00:50:56', '2026-04-29 00:50:56'),
(49, 'patient', 'Anthony Lopez', 'anthony.lopez43@example.com', '+19156260121', 'America/New_York', NULL, '2026-04-29 00:50:56', '$2y$12$7OPpqTIBGYSET9nRASjdbO7jNU2nNWA9YnnDksdpGKckL6xwkPVCm', NULL, NULL, NULL, NULL, '2026-04-29 00:50:56', '2026-04-29 00:50:56'),
(50, 'patient', 'David Brown', 'david.brown44@example.com', '+15106575160', 'America/New_York', NULL, '2026-04-29 00:50:56', '$2y$12$0rvC6xVJ9ccLk63/BK7O6uHKZBod7H9mNU5AYopKgQqpoggyom.DG', NULL, NULL, NULL, NULL, '2026-04-29 00:50:56', '2026-04-29 00:50:56'),
(51, 'patient', 'Maria Rivera', 'maria.rivera45@example.com', '+14953826162', 'America/New_York', NULL, '2026-04-29 00:50:57', '$2y$12$cpTkt5xVJfYr3kIc2C13wO7aTlRTjeh80VSmXQlHL5H6Wzm9EWr.K', NULL, NULL, NULL, NULL, '2026-04-29 00:50:57', '2026-04-29 00:50:57'),
(52, 'patient', 'Barbara Roberts', 'barbara.roberts46@example.com', '+19996165810', 'America/New_York', NULL, '2026-04-29 00:50:57', '$2y$12$dlm0D886zlYtqWhJKFXpLO.BD6.Ae9cx5ww4mdKVTR1uaAEhOTyi6', NULL, NULL, NULL, NULL, '2026-04-29 00:50:57', '2026-04-29 00:50:57'),
(53, 'patient', 'Sandra Jones', 'sandra.jones47@example.com', '+19683582311', 'America/New_York', NULL, '2026-04-29 00:50:57', '$2y$12$tmJzs0yUENZiKWA2kB42ieEty/twGpcDNyHB4H/SV0Sn2g0/Pnn2.', NULL, NULL, NULL, NULL, '2026-04-29 00:50:57', '2026-04-29 00:50:57'),
(54, 'patient', 'Thomas Moore', 'thomas.moore48@example.com', '+19145527700', 'America/New_York', NULL, '2026-04-29 00:50:57', '$2y$12$9CAm/LJDOvvrh9baLudT7uSbuKBpPKG3w5SW3T.R23ojPGU317SVy', NULL, NULL, NULL, NULL, '2026-04-29 00:50:57', '2026-04-29 00:50:57'),
(55, 'patient', 'George Young', 'george.young49@example.com', '+15393833297', 'America/New_York', NULL, '2026-04-29 00:50:58', '$2y$12$u4CILhCeZ8/G6jVT.xFKge9VPQy2Nbi9clYjK36ADcBvMycvdH7MG', NULL, NULL, NULL, NULL, '2026-04-29 00:50:58', '2026-04-29 00:50:58'),
(56, 'patient', 'Sarah Smith', 'sarah.smith50@example.com', '+13502481441', 'America/New_York', NULL, '2026-04-29 00:50:58', '$2y$12$ApkAw31gh7mzczejaouVqOtFG/Asg.pt/8iiHZc3rRCeY.1B2V7GS', NULL, NULL, NULL, NULL, '2026-04-29 00:50:58', '2026-04-29 00:50:58'),
(57, 'patient', 'Joseph Carter', 'joseph.carter51@example.com', '+18372141517', 'America/New_York', NULL, '2026-04-29 00:50:58', '$2y$12$JJBdluFAW95JUq9SUMs5Y.u/kKgl07ryeviO4S9yyTOVTxsrYPXs6', NULL, NULL, NULL, NULL, '2026-04-29 00:50:58', '2026-04-29 00:50:58'),
(58, 'patient', 'Anthony Clark', 'anthony.clark52@example.com', '+16614671468', 'America/New_York', NULL, '2026-04-29 00:50:59', '$2y$12$NIMil8QnEx.C2TAz1TqcZeSKCiqyh2LPYGZIkMScHjCykanXNJY8O', NULL, NULL, NULL, NULL, '2026-04-29 00:50:59', '2026-04-29 00:50:59'),
(59, 'patient', 'Karen Garcia', 'karen.garcia53@example.com', '+19040291767', 'America/New_York', NULL, '2026-04-29 00:50:59', '$2y$12$b/r6p0vseU3LJAqCrEwKwupz6Nn4V6dtkCi34mhxleHOvWO3Ms5l6', NULL, NULL, NULL, NULL, '2026-04-29 00:50:59', '2026-04-29 00:50:59'),
(60, 'patient', 'Robert Baker', 'robert.baker54@example.com', '+19169889229', 'America/New_York', NULL, '2026-04-29 00:50:59', '$2y$12$xJWr7kfZmmrocYkhQzGzf.AVc9KtjZ9oCJ6RKli/5.AoGV.6cUtm.', NULL, NULL, NULL, NULL, '2026-04-29 00:50:59', '2026-04-29 00:50:59'),
(61, 'patient', 'Charles Adams', 'charles.adams55@example.com', '+15190772735', 'America/New_York', NULL, '2026-04-29 00:51:00', '$2y$12$jlfdfgwQElz1OSUJpYDJ2.BmiNLLPJx32Sgw0M4meZlP/.AN8tjTy', NULL, NULL, NULL, NULL, '2026-04-29 00:51:00', '2026-04-29 00:51:00'),
(62, 'patient', 'Ashley Jones', 'ashley.jones56@example.com', '+19142955842', 'America/New_York', NULL, '2026-04-29 00:51:00', '$2y$12$t6WacKD3ru8ED9nn/pCA.OhGI/ociS8Y/ReZA0S7n2UFfqxWmwBva', NULL, NULL, NULL, NULL, '2026-04-29 00:51:00', '2026-04-29 00:51:00'),
(63, 'patient', 'Emily Nelson', 'emily.nelson57@example.com', '+12223539658', 'America/New_York', NULL, '2026-04-29 00:51:00', '$2y$12$OIenQ810Y46XOFUWTX464.cOnu3A/rFE4VnpVgbaiTk/KOSswZ2MS', NULL, NULL, NULL, NULL, '2026-04-29 00:51:00', '2026-04-29 00:51:00'),
(64, 'patient', 'Kenneth Williams', 'kenneth.williams58@example.com', '+17816527317', 'America/New_York', NULL, '2026-04-29 00:51:00', '$2y$12$ZHrzgYwjAUG0xCIUoXVJoOj2CougYVd3goCE7Tt0SxGdCTgpQvbmW', NULL, NULL, NULL, NULL, '2026-04-29 00:51:00', '2026-04-29 00:51:00'),
(65, 'patient', 'Anthony Lopez', 'anthony.lopez59@example.com', '+18690749887', 'America/New_York', NULL, '2026-04-29 00:51:01', '$2y$12$GYK8TvYXtBDbsSth8GWU6uFRjKcO42d9qdkkfy0HpAeMmFJh5fVbm', NULL, NULL, NULL, NULL, '2026-04-29 00:51:01', '2026-04-29 00:51:01'),
(66, 'patient', 'Ronald Williams', 'ronald.williams60@example.com', '+18833593763', 'America/New_York', NULL, '2026-04-29 00:51:01', '$2y$12$nNPv7FSklja7kXZCvsj1ROJaTl6D.0K1TNVHviOGH.vkvBTL1/27e', NULL, NULL, NULL, NULL, '2026-04-29 00:51:01', '2026-04-29 00:51:01'),
(67, 'patient', 'Maria Anderson', 'maria.anderson61@example.com', '+19306332810', 'America/New_York', NULL, '2026-04-29 00:51:01', '$2y$12$zlPk4Xw8y9BvuGRZwrbCCOH2iqUPl0xZuIrflxPfhJWlAJKGtzTw.', NULL, NULL, NULL, NULL, '2026-04-29 00:51:01', '2026-04-29 00:51:01'),
(68, 'patient', 'Emily Flores', 'emily.flores62@example.com', '+18712599351', 'America/New_York', NULL, '2026-04-29 00:51:02', '$2y$12$lY0G7XRF7AYATgFQ6oTuPO7Jwgo4D/HttZaQi4OBluj0RPGsPjBDW', NULL, NULL, NULL, NULL, '2026-04-29 00:51:02', '2026-04-29 00:51:02'),
(69, 'patient', 'Betty Brown', 'betty.brown63@example.com', '+16912482803', 'America/New_York', NULL, '2026-04-29 00:51:02', '$2y$12$Z4s3Sipd0pSKuCkg8QEehOLxemsczzDYb6CRl1YB.lrTi891eH1bu', NULL, NULL, NULL, NULL, '2026-04-29 00:51:02', '2026-04-29 00:51:02'),
(70, 'patient', 'Patricia Walker', 'patricia.walker64@example.com', '+14281437058', 'America/New_York', NULL, '2026-04-29 00:51:02', '$2y$12$mZD/CQH/koFfS5XUammQye.Pb1RPhp1Dvlk7pHb2jCEFA1s4gTnuW', NULL, NULL, NULL, NULL, '2026-04-29 00:51:02', '2026-04-29 00:51:02'),
(71, 'patient', 'Charles Miller', 'charles.miller65@example.com', '+13230721922', 'America/New_York', NULL, '2026-04-29 00:51:03', '$2y$12$mlPRtEIgUrQ34WIDSKvBuen6AtGAGhx9UtK0.lUdkmTS3D0IS6x2.', NULL, NULL, NULL, NULL, '2026-04-29 00:51:03', '2026-04-29 00:51:03'),
(72, 'patient', 'Christopher Gonzalez', 'christopher.gonzalez66@example.com', '+12201592311', 'America/New_York', NULL, '2026-04-29 00:51:03', '$2y$12$RSbJGoqAlu.ZwoR/KrtawuAeqfbRrfw2vvU6d14P4g8k9sAr6jkeu', NULL, NULL, NULL, NULL, '2026-04-29 00:51:03', '2026-04-29 00:51:03'),
(73, 'patient', 'William Gonzalez', 'william.gonzalez67@example.com', '+15348925577', 'America/New_York', NULL, '2026-04-29 00:51:03', '$2y$12$aG34pdtTQkpqWsg18ZEQz.oISD.yZAjie0eEFbMi5bCCH0N2Va0fC', NULL, NULL, NULL, NULL, '2026-04-29 00:51:03', '2026-04-29 00:51:03'),
(74, 'patient', 'Sarah Young', 'sarah.young68@example.com', '+19295075584', 'America/New_York', NULL, '2026-04-29 00:51:03', '$2y$12$ooSgTcVrPGPtZtdfJ7CULuR1RjQOWbBYFmuztCZZdsR9jwexqk05C', NULL, NULL, NULL, NULL, '2026-04-29 00:51:03', '2026-04-29 00:51:03'),
(75, 'patient', 'John Wright', 'john.wright69@example.com', '+14993855623', 'America/New_York', NULL, '2026-04-29 00:51:04', '$2y$12$cX3QL5KoKHyWIV7FdfJpienSqcDe3p27YnK3flOFtdf0nkiohRmDi', NULL, NULL, NULL, NULL, '2026-04-29 00:51:04', '2026-04-29 00:51:04'),
(76, 'patient', 'Christopher Nelson', 'christopher.nelson70@example.com', '+12041577133', 'America/New_York', NULL, '2026-04-29 00:51:04', '$2y$12$hpnXKEFf/XyG4J8NHk6bcep18MAZGg4CUYmMrD77W9RpDvrVfwqAW', NULL, NULL, NULL, NULL, '2026-04-29 00:51:04', '2026-04-29 00:51:04'),
(77, 'patient', 'Edward Smith', 'edward.smith71@example.com', '+12165423815', 'America/New_York', NULL, '2026-04-29 00:51:04', '$2y$12$6cN.KokzZs1Q7nq6Yf4EP.QAuWTYZYzTXTnEUFJT6Yb1.uV6Nz8Ke', NULL, NULL, NULL, NULL, '2026-04-29 00:51:04', '2026-04-29 00:51:04'),
(78, 'patient', 'Patricia Nelson', 'patricia.nelson72@example.com', '+16489086352', 'America/New_York', NULL, '2026-04-29 00:51:05', '$2y$12$qDrSxHCnJQ8umGnhsisysOSBCh9403mlDmenqSfsSFRP2LVvV2Ax2', NULL, NULL, NULL, NULL, '2026-04-29 00:51:05', '2026-04-29 00:51:05'),
(79, 'patient', 'Michael Martinez', 'michael.martinez73@example.com', '+18057855627', 'America/New_York', NULL, '2026-04-29 00:51:05', '$2y$12$eDOsCk8zMhs5CIWBsre6o.XzGuETnLzroSNPKofFVobDjKcZQCzxW', NULL, NULL, NULL, NULL, '2026-04-29 00:51:05', '2026-04-29 00:51:05'),
(80, 'patient', 'Barbara Hill', 'barbara.hill74@example.com', '+15721715780', 'America/New_York', NULL, '2026-04-29 00:51:05', '$2y$12$NEFguEDcLqRe/EguOjQZgux.xmClsD7EwZ8aHIoDVB.eQ9ya6ia5S', NULL, NULL, NULL, NULL, '2026-04-29 00:51:05', '2026-04-29 00:51:05'),
(81, 'patient', 'Matthew Taylor', 'matthew.taylor75@example.com', '+17392141381', 'America/New_York', NULL, '2026-04-29 00:51:05', '$2y$12$.GQncj7vuJKIjnCEHPWY1O54SrC7e0Hfsd.gUTqb1QUFO.ZAUwlz6', NULL, NULL, NULL, NULL, '2026-04-29 00:51:05', '2026-04-29 00:51:05'),
(82, 'patient', 'James Taylor', 'james.taylor76@example.com', '+15919929448', 'America/New_York', NULL, '2026-04-29 00:51:06', '$2y$12$j0X/0UqBw/oj5phcNVDQx.JN0vrCcSzQkLnFc1G57HMEWIw9Huczm', NULL, NULL, NULL, NULL, '2026-04-29 00:51:06', '2026-04-29 00:51:06'),
(83, 'patient', 'James Torres', 'james.torres77@example.com', '+16502019454', 'America/New_York', NULL, '2026-04-29 00:51:06', '$2y$12$2rqDYZBjGreqarIXSbk4du8CS0hUyJYA8kXUQ1SIjsC8XBiXybHDq', NULL, NULL, NULL, NULL, '2026-04-29 00:51:06', '2026-04-29 00:51:06'),
(84, 'patient', 'Patricia Mitchell', 'patricia.mitchell78@example.com', '+18365663781', 'America/New_York', NULL, '2026-04-29 00:51:06', '$2y$12$D3Cm1WBm59Fwjwr6k/t4he5B.JtU4Xg4xahqrYBP3AvWcQ3LLb1Wa', NULL, NULL, NULL, NULL, '2026-04-29 00:51:06', '2026-04-29 00:51:06'),
(85, 'patient', 'Ashley Smith', 'ashley.smith79@example.com', '+15929925206', 'America/New_York', NULL, '2026-04-29 00:51:07', '$2y$12$sKu.chC6hmruz92DAJGXOealCHh1I3ktFHYN8TRT2mQzilMsCLedi', NULL, NULL, NULL, NULL, '2026-04-29 00:51:07', '2026-04-29 00:51:07'),
(86, 'patient', 'Betty King', 'betty.king80@example.com', '+16537424014', 'America/New_York', NULL, '2026-04-29 00:51:07', '$2y$12$9n2kTYCJPEZtPisWXmwivOAnq49KpEQFh8oGSOemAWBiHETr3jq7K', NULL, NULL, NULL, NULL, '2026-04-29 00:51:07', '2026-04-29 00:51:07'),
(87, 'patient', 'Daniel Moore', 'daniel.moore81@example.com', '+12881771798', 'America/New_York', NULL, '2026-04-29 00:51:07', '$2y$12$B2jfX4wmrPuVaggFOMot1.wSi7MOrNKxK2Ol9Iv6mmXoLl6wokBqi', NULL, NULL, NULL, NULL, '2026-04-29 00:51:07', '2026-04-29 00:51:07'),
(88, 'patient', 'Nancy Scott', 'nancy.scott82@example.com', '+12206293658', 'America/New_York', NULL, '2026-04-29 00:51:08', '$2y$12$jMmILHer/o7R.Z1PesNxBOjZ.1zjORl5j95MHe8qCy53t5UEq3xZ2', NULL, NULL, NULL, NULL, '2026-04-29 00:51:08', '2026-04-29 00:51:08'),
(89, 'patient', 'Robert Green', 'robert.green83@example.com', '+16314384131', 'America/New_York', NULL, '2026-04-29 00:51:08', '$2y$12$GqpwenFGdIsYCR8J7unA4u.SIciLVNxwlLDePe.UPm7uuFfzngUQ6', NULL, NULL, NULL, NULL, '2026-04-29 00:51:08', '2026-04-29 00:51:08'),
(90, 'patient', 'Margaret Martinez', 'margaret.martinez84@example.com', '+12951727413', 'America/New_York', NULL, '2026-04-29 00:51:08', '$2y$12$vTHQES77wToy.UR75GEfJOk.o3SPnMYvaOcVtzEAMli4d1eaM0bgS', NULL, NULL, NULL, NULL, '2026-04-29 00:51:08', '2026-04-29 00:51:08'),
(91, 'patient', 'Mark Anderson', 'mark.anderson85@example.com', '+17974710486', 'America/New_York', NULL, '2026-04-29 00:51:08', '$2y$12$E1XvQblAjRYSfGDy2IJyUeUele.HyWLjJQxPYdn.BNIQlEmLR0856', NULL, NULL, NULL, NULL, '2026-04-29 00:51:08', '2026-04-29 00:51:08'),
(92, 'patient', 'Sarah Jones', 'sarah.jones86@example.com', '+14106809901', 'America/New_York', NULL, '2026-04-29 00:51:09', '$2y$12$Q04DEKtwb3yj3mhNegOuTeiwbOfArIxQWHCjM/bkSNrKg0PJkd6IG', NULL, NULL, NULL, NULL, '2026-04-29 00:51:09', '2026-04-29 00:51:09'),
(93, 'patient', 'Patricia Moore', 'patricia.moore87@example.com', '+17456942603', 'America/New_York', NULL, '2026-04-29 00:51:09', '$2y$12$QsItgo7JBerrL3bwuMcuh.s3A8NN2Xm4WU5J0YjEkP.FzsZzOh/iK', NULL, NULL, NULL, NULL, '2026-04-29 00:51:09', '2026-04-29 00:51:09'),
(94, 'patient', 'Dorothy Roberts', 'dorothy.roberts88@example.com', '+14135050049', 'America/New_York', NULL, '2026-04-29 00:51:09', '$2y$12$TR8h8wBf50n3YzI3bwebouhXCuC5ICdJgsvZ0fK7b78DGl2j/g8UK', NULL, NULL, NULL, NULL, '2026-04-29 00:51:09', '2026-04-29 00:51:09'),
(95, 'patient', 'Joshua Gonzalez', 'joshua.gonzalez89@example.com', '+13691111382', 'America/New_York', NULL, '2026-04-29 00:51:10', '$2y$12$aJWF1.v3U04YyUtBJOHZ7.xqYR0X.fRbm.uB9PC.1V/CinXpY1tAi', NULL, NULL, NULL, NULL, '2026-04-29 00:51:10', '2026-04-29 00:51:10'),
(96, 'patient', 'Andrew Thompson', 'andrew.thompson90@example.com', '+12699870045', 'America/New_York', NULL, '2026-04-29 00:51:10', '$2y$12$EGK3r8782JX8SkzStFznuuOq/u0dcyl4PcDwmhVKY6LtA7P6IIUtC', NULL, NULL, NULL, NULL, '2026-04-29 00:51:10', '2026-04-29 00:51:10'),
(97, 'patient', 'Betty Allen', 'betty.allen91@example.com', '+13346786499', 'America/New_York', NULL, '2026-04-29 00:51:10', '$2y$12$R.HCSq5S3L4HucYA1Ygx4ei/53rerv1jwi4LDWXLf6KxUi31BEu8S', NULL, NULL, NULL, NULL, '2026-04-29 00:51:10', '2026-04-29 00:51:10'),
(98, 'patient', 'Edward Brown', 'edward.brown92@example.com', '+15464330011', 'America/New_York', NULL, '2026-04-29 00:51:11', '$2y$12$SdJ2hRVf96Wsd/4XRbCENe.6QOgG93ehJlil4O8xgx3lVBRmRwd5W', NULL, NULL, NULL, NULL, '2026-04-29 00:51:11', '2026-04-29 00:51:11'),
(99, 'patient', 'Karen King', 'karen.king93@example.com', '+12929763486', 'America/New_York', NULL, '2026-04-29 00:51:11', '$2y$12$.b1sPvQ2Cgi32Qki5ASTn.7pa/G/krTyQqpMRhYr3e5qoD0OXYiGO', NULL, NULL, NULL, NULL, '2026-04-29 00:51:11', '2026-04-29 00:51:11'),
(100, 'patient', 'William Rivera', 'william.rivera94@example.com', '+15638840206', 'America/New_York', NULL, '2026-04-29 00:51:11', '$2y$12$YQIhzOSZGE8SMU2D6IDzo.TPnF/.sNIsXDPtQrZ5d72lJPRNoZhwK', NULL, NULL, NULL, NULL, '2026-04-29 00:51:11', '2026-04-29 00:51:11'),
(101, 'patient', 'William Miller', 'william.miller95@example.com', '+18062262301', 'America/New_York', NULL, '2026-04-29 00:51:11', '$2y$12$UkdRfG6hkhkkngrEPr5xjOUhEginLJUgTkNhRZGOga1zZLmkELh..', NULL, NULL, NULL, NULL, '2026-04-29 00:51:11', '2026-04-29 00:51:11'),
(102, 'patient', 'Carol Wilson', 'carol.wilson96@example.com', '+17376025999', 'America/New_York', NULL, '2026-04-29 00:51:12', '$2y$12$7w2q9osHCOZQxQgPm9YRquWR6tuKYimn8q4Wm6z7IPTkWFR4S.XT6', NULL, NULL, NULL, NULL, '2026-04-29 00:51:12', '2026-04-29 00:51:12'),
(103, 'patient', 'Betty Johnson', 'betty.johnson97@example.com', '+15134537757', 'America/New_York', NULL, '2026-04-29 00:51:12', '$2y$12$P707evRzI9T3Coo/3Z7.heibrGuTgR0ylQ/8x0a97h1e2/74BSW76', NULL, NULL, NULL, NULL, '2026-04-29 00:51:12', '2026-04-29 00:51:12'),
(104, 'patient', 'Ashley Martinez', 'ashley.martinez98@example.com', '+14565270480', 'America/New_York', NULL, '2026-04-29 00:51:12', '$2y$12$T5TPWw1iT1q75gbc7WzStubO3N9e10ZD/QftvdXb.zICllD.LRN3q', NULL, NULL, NULL, NULL, '2026-04-29 00:51:12', '2026-04-29 00:51:12'),
(105, 'patient', 'Emily Harris', 'emily.harris99@example.com', '+13153773442', 'America/New_York', NULL, '2026-04-29 00:51:13', '$2y$12$x1jJPAZXX.oSB8dzkM1sXuT7HCCRTHtHwh7a4CEOGyvUsqW3ZXKMG', NULL, NULL, NULL, NULL, '2026-04-29 00:51:13', '2026-04-29 00:51:13'),
(106, 'patient', 'Sarah Johnson', 'sarah.johnson100@example.com', '+12305817695', 'America/New_York', NULL, '2026-04-29 00:51:13', '$2y$12$QimeBeBT08i5vYDAhawKEuxIDKKFe8N3jYzcid.8owISCd4xlhYuq', NULL, NULL, NULL, NULL, '2026-04-29 00:51:13', '2026-04-29 00:51:13'),
(108, 'patient', 'Clydey Ednalan', 'clydey@gmail.com', '4234234234', 'UTC', NULL, '2026-04-30 00:56:03', '$2y$12$CjEv6i5Xq9mH.0x17c.E2euC8z2oPD12sMo98X0BFLCtlricWx4PK', NULL, NULL, NULL, NULL, '2026-04-29 16:49:51', '2026-04-29 16:49:51'),
(111, 'patient', 'Catlin Ednalan', 'catlin@gmail.com', '+1234567893', 'UTC', NULL, NULL, '$2y$12$4vZEL.PeM18ErW29mL6wOOZylOXdsQgMtC8AVS1LULZWbOBG2iKm6', NULL, NULL, NULL, NULL, '2026-04-29 17:49:30', '2026-05-01 17:29:40'),
(113, 'doctor', 'Dr. Janh Johnson', 'testdoc1@gmail.com', '+1234567892', 'UTC', NULL, NULL, '$2y$12$tFFPZ8gh/tv4yXtJ618swe7gQT5lzi02yXjtMT1SjQCEh0pKWpeoe', NULL, NULL, NULL, NULL, '2026-04-29 18:03:34', '2026-05-01 16:58:46'),
(114, 'doctor', 'Dr. Clydey Ednalan', 'drclydey@gmail.com', '3435345435435', 'UTC', NULL, NULL, '$2y$12$WiTIzRbqWqlvcFoj2ABeK.5Vhp71WhCto9Pc8a4hWRMuwaIcsC/h.', NULL, NULL, NULL, NULL, '2026-04-29 18:11:06', '2026-04-30 23:05:13'),
(115, 'doctor', 'Emily Ednalan', 'emily@gmail.com', '+1234567892', 'UTC', NULL, NULL, '$2y$12$is6bR2I2PinvwvAjd2MoT.nNxCiu6gB0uJMtpAsYStBEVKlA9ZcIC', NULL, NULL, NULL, NULL, '2026-04-29 18:58:42', '2026-05-01 16:58:42'),
(117, 'doctor', 'Dr. Catlin  Ednalan', 'drcatlin@gmail.com', '+1234567892', 'UTC', NULL, NULL, '$2y$12$zbZCoqbSQzE9BfxhuNtPx.hZLx9s2Q0nVRWCYEBxdjc/owsrQVGnC', NULL, NULL, NULL, NULL, '2026-04-30 03:49:16', '2026-05-01 16:58:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointments_uuid_unique` (`uuid`),
  ADD KEY `appointments_location_id_foreign` (`location_id`),
  ADD KEY `appointments_doctor_id_scheduled_start_index` (`doctor_id`),
  ADD KEY `appointments_patient_id_scheduled_start_index` (`patient_id`);

--
-- Indexes for table `appointment_logs`
--
ALTER TABLE `appointment_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_logs_appointment_id_foreign` (`appointment_id`),
  ADD KEY `appointment_logs_actor_id_foreign` (`actor_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_logs_actor_id_foreign` (`actor_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `doctors_user_id_unique` (`user_id`);

--
-- Indexes for table `doctor_location`
--
ALTER TABLE `doctor_location`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `doctor_location_doctor_id_location_id_unique` (`doctor_id`,`location_id`),
  ADD KEY `doctor_location_location_id_foreign` (`location_id`);

--
-- Indexes for table `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_schedules_doctor_id_foreign` (`doctor_id`),
  ADD KEY `doctor_schedules_location_id_foreign` (`location_id`);

--
-- Indexes for table `doctor_specialty`
--
ALTER TABLE `doctor_specialty`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `doctor_specialty_doctor_id_specialty_id_unique` (`doctor_id`,`specialty_id`),
  ADD KEY `doctor_specialty_specialty_id_foreign` (`specialty_id`);

--
-- Indexes for table `email_notifications`
--
ALTER TABLE `email_notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `google_calendar_tokens`
--
ALTER TABLE `google_calendar_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `google_calendar_tokens_doctor_id_unique` (`doctor_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `patients_user_id_unique` (`user_id`);

--
-- Indexes for table `schedule_exceptions`
--
ALTER TABLE `schedule_exceptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedule_exceptions_doctor_schedule_id_foreign` (`doctor_schedule_id`),
  ADD KEY `schedule_exceptions_doctor_id_foreign` (`doctor_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indexes for table `specialties`
--
ALTER TABLE `specialties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `specialties_name_unique` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=227;

--
-- AUTO_INCREMENT for table `appointment_logs`
--
ALTER TABLE `appointment_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `doctor_location`
--
ALTER TABLE `doctor_location`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `doctor_specialty`
--
ALTER TABLE `doctor_specialty`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `email_notifications`
--
ALTER TABLE `email_notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `google_calendar_tokens`
--
ALTER TABLE `google_calendar_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `schedule_exceptions`
--
ALTER TABLE `schedule_exceptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `specialties`
--
ALTER TABLE `specialties`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `appointments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `appointment_logs`
--
ALTER TABLE `appointment_logs`
  ADD CONSTRAINT `appointment_logs_actor_id_foreign` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `appointment_logs_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_actor_id_foreign` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `doctor_location`
--
ALTER TABLE `doctor_location`
  ADD CONSTRAINT `doctor_location_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `doctor_location_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD CONSTRAINT `doctor_schedules_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `doctor_schedules_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `doctor_specialty`
--
ALTER TABLE `doctor_specialty`
  ADD CONSTRAINT `doctor_specialty_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `doctor_specialty_specialty_id_foreign` FOREIGN KEY (`specialty_id`) REFERENCES `specialties` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `google_calendar_tokens`
--
ALTER TABLE `google_calendar_tokens`
  ADD CONSTRAINT `google_calendar_tokens_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `schedule_exceptions`
--
ALTER TABLE `schedule_exceptions`
  ADD CONSTRAINT `schedule_exceptions_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `schedule_exceptions_doctor_schedule_id_foreign` FOREIGN KEY (`doctor_schedule_id`) REFERENCES `doctor_schedules` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
