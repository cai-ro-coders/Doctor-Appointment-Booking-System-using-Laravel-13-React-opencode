import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, Clock, FolderGit2, LayoutGrid, MapPin, Stethoscope, Tag, User, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as { auth: { user: { role: string } } };
    const userRole = auth?.user?.role;

    const dashboardUrl =
        userRole === 'admin'
            ? '/admin/dashboard'
            : userRole === 'doctor'
            ? '/doctor/dashboard'
            : userRole === 'patient'
            ? '/patient/dashboard'
            : '/dashboard';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
        ...(userRole === 'admin'
            ? [
                  {
                      title: 'Users',
                      href: '/admin/users',
                      icon: Users,
                  },
                  {
                      title: 'Patients',
                      href: '/admin/patients',
                      icon: Users,
                  },
                  {
                      title: 'Doctors',
                      href: '/admin/doctors',
                      icon: Stethoscope,
                  },
                  {
                      title: 'Appointments',
                      href: '/admin/appointments',
                      icon: Calendar,
                  },
                  {
                      title: 'Doctor Schedules',
                      href: '/admin/doctor-schedules',
                      icon: Clock,
                  },
                  {
                      title: 'Specialties',
                      href: '/admin/specialties',
                      icon: Tag,
                  },
                  {
                      title: 'Doctor Locations',
                      href: '/admin/locations',
                      icon: MapPin,
                  },
              ]
            : []),
        ...(userRole === 'doctor'
            ? [
{
                      title: 'My Appointments',
                      href: '/doctor/appointments',
                      icon: Calendar,
                  },
                  {
                      title: 'My Locations',
                      href: '/doctor/locations',
                      icon: MapPin,
                  },
                  {
                      title: 'My Schedules',
                      href: '/doctor/schedules',
                      icon: Clock,
                  },
                  {
                      title: 'My Profile',
                      href: '/doctor/profile',
                      icon: User,
                  },
              ]
            : []),
...(userRole === 'patient'
            ? [
                  {
                      title: 'Available Doctors',
                      href: '/patient/doctors',
                      icon: Stethoscope,
                  },
                  {
                      title: 'My Appointments',
                      href: '/patient/appointments',
                      icon: Calendar,
                  },
                  {
                      title: 'Profile',
                      href: '/patient/profile',
                      icon: User,
                  },
              ]
            : []),
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
