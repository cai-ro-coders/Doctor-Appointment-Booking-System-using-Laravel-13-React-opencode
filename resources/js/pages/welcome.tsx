import { Head, Link } from '@inertiajs/react';
import { login, register } from '@/routes';
import {
    Heart,
    Brain,
    Baby,
    Smile,
    Bone,
    Search,
    Calendar,
    CheckCircle,
    Star,
    Phone,
    Mail,
    MapPin,
    Clock,
    Menu,
    X,
    ChevronRight,
    User,
    Activity,
    Stethoscope,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const specialties = [
    { icon: Heart, name: 'Cardiology', description: 'Heart & cardiovascular care' },
    { icon: Brain, name: 'Neurology', description: 'Brain & nervous system' },
    { icon: Baby, name: 'Pediatrics', description: 'Child healthcare' },
    { icon: Smile, name: 'Dental Care', description: 'Oral health services' },
    { icon: Bone, name: 'Orthopedics', description: 'Bone & joint specialists' },
    { icon: Stethoscope, name: 'General Medicine', description: 'Primary healthcare' },
];

const doctors = [
    {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        rating: 4.9,
        experience: '15 years',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Neurology',
        rating: 4.8,
        experience: '12 years',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
        id: 3,
        name: 'Dr. Emily Davis',
        specialty: 'Pediatrics',
        rating: 4.9,
        experience: '10 years',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
        id: 4,
        name: 'Dr. James Wilson',
        specialty: 'Orthopedics',
        rating: 4.7,
        experience: '18 years',
        image: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
];

const reviews = [
    {
        name: 'Amanda Roberts',
        text: 'Very easy to book appointments and the doctors are highly professional. Highly recommend Doccare!',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
        name: 'David Thompson',
        text: 'Found an amazing cardiologist through this platform. The whole process was seamless.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
        name: 'Jennifer Martinez',
        text: 'Great experience! The doctors are verified and the booking system works perfectly.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
];

const stats = [
    { value: '10k+', label: 'Patients' },
    { value: '500+', label: 'Doctors' },
    { value: '50+', label: 'Clinics' },
];

const howItWorks = [
    {
        icon: Search,
        title: 'Search Doctor',
        description: 'Find specialists by name, location, or category',
        number: '01',
    },
    {
        icon: User,
        title: 'Check Profile',
        description: 'View experience, ratings, and availability',
        number: '02',
    },
    {
        icon: Calendar,
        title: 'Schedule Booking',
        description: 'Choose date & time instantly',
        number: '03',
    },
    {
        icon: CheckCircle,
        title: 'Get Your Solution',
        description: 'Consult and receive treatment',
        number: '04',
    },
];

export default function Welcome() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(0);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head title="Doccare - Best Doctors Your Nearby Location" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500&display=swap"
                rel="stylesheet"
            />

            <style>{`
                :root {
                    --primary: #0DE0FE;
                    --secondary: #09E5AB;
                    --accent: #FF9B44;
                    --background: #F8F9FA;
                    --text-dark: #272B41;
                    --text-muted: #6B7280;
                }
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                html {
                    scroll-behavior: smooth;
                }
                body {
                    font-family: 'Roboto', sans-serif;
                    background: var(--background);
                    color: var(--text-dark);
                    overflow-x: hidden;
                }
                h1, h2, h3, h4, h5, h6 {
                    font-family: 'Poppins', sans-serif;
                }
                .gradient-text {
                    background: linear-gradient(135deg, #0DE0FE, #09E5AB);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .gradient-bg {
                    background: linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%);
                }
                .btn-primary {
                    background: linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%);
                    color: white;
                    padding: 14px 28px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-family: 'Poppins', sans-serif;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(13, 224, 254, 0.4);
                }
                .btn-secondary {
                    background: white;
                    color: var(--text-dark);
                    padding: 14px 28px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-family: 'Poppins', sans-serif;
                    border: 2px solid #e5e7eb;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .btn-secondary:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                }
                .card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                }
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
                }
                .fade-in {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: fadeInUp 0.8s ease forwards;
                }
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-on-scroll {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s ease;
                }
                .animate-on-scroll.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .counter {
                    display: inline-block;
                }
            `}</style>

            {/* Navigation */}
            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: scrollY > 50 ? 'white' : 'transparent',
                    boxShadow: scrollY > 50 ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.3s ease',
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '16px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background:
                                        'linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Activity color="white" size={24} />
                            </div>
                            <span
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    fontFamily: 'Poppins, sans-serif',
                                    color: scrollY > 50 ? '#272B41' : 'white',
                                }}
                            >
                                Doccare
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div
                        style={{
                            display: 'none',
                            gap: '32px',
                            alignItems: 'center',
                        }}
                        className="desktop-menu"
                    >
                        {['Home', 'About', 'Specialties', 'Doctors', 'Reviews'].map(
                            (item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    style={{
                                        color: scrollY > 50 ? '#272B41' : 'white',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        fontSize: '15px',
                                        transition: 'color 0.3s ease',
                                    }}
                                >
                                    {item}
                                </a>
                            )
                        )}
                        <Link href={login()} style={{ textDecoration: 'none' }}>
                            <button
                                style={{
                                    background: 'transparent',
                                    border:
                                        scrollY > 50
                                            ? '2px solid #0DE0FE'
                                            : '2px solid white',
                                    color: scrollY > 50 ? '#0DE0FE' : 'white',
                                    padding: '10px 24px',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Sign In
                            </button>
                        </Link>
                        <Link href={register()} style={{ textDecoration: 'none' }}>
                            <button
                                style={{
                                    background:
                                        'linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '10px 24px',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Get Started
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                        }}
                        className="mobile-toggle"
                    >
                        {mobileMenuOpen ? (
                            <X color={scrollY > 50 ? '#272B41' : 'white'} size={28} />
                        ) : (
                            <Menu color={scrollY > 50 ? '#272B41' : 'white'} size={28} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            padding: '24px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        }}
                    >
                        {['Home', 'About', 'Specialties', 'Doctors', 'Reviews'].map(
                            (item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        display: 'block',
                                        padding: '12px 0',
                                        color: '#272B41',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        borderBottom: '1px solid #f3f4f6',
                                    }}
                                >
                                    {item}
                                </a>
                            )
                        )}
                        <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                            <Link href={login()} style={{ flex: 1, textDecoration: 'none' }}>
                                <button
                                    style={{
                                        width: '100%',
                                        background: 'transparent',
                                        border: '2px solid #0DE0FE',
                                        color: '#0DE0FE',
                                        padding: '12px',
                                        borderRadius: '10px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Sign In
                                </button>
                            </Link>
                            <Link href={register()} style={{ flex: 1, textDecoration: 'none' }}>
                                <button
                                    style={{
                                        width: '100%',
                                        background:
                                            'linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '12px',
                                        borderRadius: '10px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            <style>{`
                @media (min-width: 768px) {
                    .desktop-menu {
                        display: flex !important;
                    }
                }
                @media (max-width: 767px) {
                    .mobile-toggle {
                        display: block !important;
                    }
                }
            `}</style>

            {/* Hero Section */}
            <section
                id="home"
                style={{
                    minHeight: '100vh',
                    background:
                        'linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: '80px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background Elements */}
                <div
                    style={{
                        position: 'absolute',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        top: '-100px',
                        right: '-100px',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                        bottom: '-50px',
                        left: '-50px',
                    }}
                />

                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '24px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '60px',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {/* Left Content */}
                    <div style={{ color: 'white' }}>
                        <div
                            style={{
                                display: 'inline-block',
                                background: 'rgba(255,255,255,0.2)',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '24px',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            Trusted Healthcare Platform
                        </div>
                        <h1
                            style={{
                                fontSize: 'clamp(36px, 5vw, 56px)',
                                fontWeight: 700,
                                lineHeight: 1.2,
                                marginBottom: '24px',
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        >
                            Consult Best Doctors{' '}
                            <span style={{ color: '#FF9B44' }}>
                                Your Nearby Location.
                            </span>
                        </h1>
                        <p
                            style={{
                                fontSize: '18px',
                                opacity: 0.9,
                                marginBottom: '32px',
                                lineHeight: 1.6,
                            }}
                        >
                            Embark on your healing journey with Doccare, where finding
                            trusted doctors, booking appointments, and managing your
                            health is just a click away.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <Link href={register()} style={{ textDecoration: 'none' }}>
                                <button
                                    style={{
                                        background: 'white',
                                        color: '#272B41',
                                        padding: '16px 32px',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontFamily: 'Poppins, sans-serif',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                        e.currentTarget.style.boxShadow =
                                            '0 10px 30px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    Book an Appointment
                                </button>
                            </Link>
                            <button
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    padding: '16px 32px',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    border: '2px solid white',
                                    cursor: 'pointer',
                                    fontFamily: 'Poppins, sans-serif',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                }}
                            >
                                Learn More
                            </button>
                        </div>

                        {/* Floating Cards */}
                        <div
                            style={{
                                marginTop: '48px',
                                display: 'flex',
                                gap: '16px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    padding: '16px 24px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                }}
                            >
                                <div
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: '#f0fdf4',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <CheckCircle color="#09E5AB" size={24} />
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            color: '#272B41',
                                        }}
                                    >
                                        Quick Booking
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            color: '#6B7280',
                                        }}
                                    >
                                        Under 2 minutes
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    padding: '16px 24px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                }}
                            >
                                <div
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: '#fef3c7',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Star color="#FF9B44" size={24} />
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            color: '#272B41',
                                        }}
                                    >
                                        4.9 Rating
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            color: '#6B7280',
                                        }}
                                    >
                                        Verified reviews
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div style={{ position: 'relative' }}>
                        <div
                            style={{
                                position: 'relative',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&h=700&fit=crop"
                                alt="Doctor consultation"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section
                id="about"
                style={{
                    padding: '100px 24px',
                    background: '#F8F9FA',
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '60px',
                        alignItems: 'center',
                    }}
                >
                    {/* Left Image */}
                    <div style={{ position: 'relative' }}>
                        <div
                            style={{
                                borderRadius: '20px',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=500&fit=crop"
                                alt="Healthcare team"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                        {/* Stats Card */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '-30px',
                                right: '-20px',
                                background: 'white',
                                padding: '24px 32px',
                                borderRadius: '16px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '32px',
                                }}
                            >
                                {stats.map((stat, index) => (
                                    <div key={index} style={{ textAlign: 'center' }}>
                                        <div
                                            style={{
                                                fontSize: '28px',
                                                fontWeight: 700,
                                                color: '#0DE0FE',
                                                fontFamily: 'Poppins, sans-serif',
                                            }}
                                        >
                                            {stat.value}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '14px',
                                                color: '#6B7280',
                                            }}
                                        >
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div>
                        <div
                            style={{
                                color: '#0DE0FE',
                                fontSize: '14px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                marginBottom: '12px',
                            }}
                        >
                            About Us
                        </div>
                        <h2
                            style={{
                                fontSize: 'clamp(28px, 4vw, 40px)',
                                fontWeight: 700,
                                marginBottom: '24px',
                                fontFamily: 'Poppins, sans-serif',
                                color: '#272B41',
                            }}
                        >
                            About Our Healthcare Platform
                        </h2>
                        <p
                            style={{
                                fontSize: '16px',
                                color: '#6B7280',
                                lineHeight: 1.8,
                                marginBottom: '32px',
                            }}
                        >
                            We connect patients with trusted healthcare professionals
                            through a seamless digital experience. Our mission is to
                            make healthcare accessible, efficient, and reliable for
                            everyone.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                            {[
                                'Verified doctors',
                                'Easy booking system',
                                '24/7 support',
                            ].map((item, index) => (
                                <li
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        marginBottom: '16px',
                                        color: '#272B41',
                                        fontWeight: 500,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <CheckCircle color="white" size={14} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href={register()} style={{ textDecoration: 'none' }}>
                            <button
                                className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                Get Started <ChevronRight size={20} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Specialties Section */}
            <section
                id="specialties"
                style={{
                    padding: '100px 24px',
                    background: 'white',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div
                            style={{
                                color: '#0DE0FE',
                                fontSize: '14px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                marginBottom: '12px',
                            }}
                        >
                            Our Specialties
                        </div>
                        <h2
                            style={{
                                fontSize: 'clamp(28px, 4vw, 40px)',
                                fontWeight: 700,
                                fontFamily: 'Poppins, sans-serif',
                                color: '#272B41',
                            }}
                        >
                            Find the Right Specialist
                        </h2>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '24px',
                        }}
                    >
                        {specialties.map((specialty, index) => (
                            <div
                                key={index}
                                className="card"
                                style={{
                                    padding: '32px',
                                    cursor: 'pointer',
                                }}
                            >
                                <div
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '16px',
                                        background:
                                            'linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '20px',
                                    }}
                                >
                                    <specialty.icon color="white" size={32} />
                                </div>
                                <h3
                                    style={{
                                        fontSize: '20px',
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        fontFamily: 'Poppins, sans-serif',
                                        color: '#272B41',
                                    }}
                                >
                                    {specialty.name}
                                </h3>
                                <p
                                    style={{
                                        fontSize: '14px',
                                        color: '#6B7280',
                                    }}
                                >
                                    {specialty.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section
                id="how-it-works"
                style={{
                    padding: '100px 24px',
                    background: '#F8F9FA',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div
                            style={{
                                color: '#0DE0FE',
                                fontSize: '14px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                marginBottom: '12px',
                            }}
                        >
                            How It Works
                        </div>
                        <h2
                            style={{
                                fontSize: 'clamp(28px, 4vw, 40px)',
                                fontWeight: 700,
                                fontFamily: 'Poppins, sans-serif',
                                color: '#272B41',
                            }}
                        >
                            Simple Steps to Better Health
                        </h2>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '32px',
                            position: 'relative',
                        }}
                    >
                        {howItWorks.map((step, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <div
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background:
                                            'linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 24px',
                                        position: 'relative',
                                        boxShadow: '0 10px 30px rgba(13, 224, 254, 0.3)',
                                    }}
                                >
                                    <step.icon color="white" size={36} />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: '#FF9B44',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {step.number}
                                    </div>
                                </div>
                                <h3
                                    style={{
                                        fontSize: '20px',
                                        fontWeight: 600,
                                        marginBottom: '12px',
                                        fontFamily: 'Poppins, sans-serif',
                                        color: '#272B41',
                                    }}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: '14px',
                                        color: '#6B7280',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Connecting Line */}
                    <div
                        style={{
                            display: 'none',
                            position: 'absolute',
                            top: '40px',
                            left: 'calc(25% - 2px)',
                            width: '50%',
                            height: '4px',
                            background:
                                'linear-gradient(90deg, #0DE0FE, #09E5AB)',
                            zIndex: 0,
                        }}
                        className="desktop-line"
                    />
                </div>
            </section>

            <style>{`
                @media (min-width: 768px) {
                    .desktop-line {
                        display: block !important;
                    }
                }
            `}</style>

            {/* Our Team / Doctors */}
            <section
                id="doctors"
                style={{
                    padding: '100px 24px',
                    background: 'white',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div
                            style={{
                                color: '#0DE0FE',
                                fontSize: '14px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                marginBottom: '12px',
                            }}
                        >
                            Our Team
                        </div>
                        <h2
                            style={{
                                fontSize: 'clamp(28px, 4vw, 40px)',
                                fontWeight: 700,
                                fontFamily: 'Poppins, sans-serif',
                                color: '#272B41',
                            }}
                        >
                            Meet Our Expert Doctors
                        </h2>
                    </div>

                    {/* Filter Buttons */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '12px',
                            marginBottom: '40px',
                            flexWrap: 'wrap',
                        }}
                    >
                        {['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics'].map(
                            (filter, index) => (
                                <button
                                    key={index}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '20px',
                                        border: index === 0 ? 'none' : '1px solid #e5e7eb',
                                        background:
                                            index === 0
                                                ? 'linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%)'
                                                : 'white',
                                        color: index === 0 ? 'white' : '#6B7280',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {filter}
                                </button>
                            )
                        )}
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '24px',
                        }}
                    >
                        {doctors.map((doctor, index) => (
                            <div
                                key={index}
                                className="card"
                                style={{
                                    padding: '24px',
                                    textAlign: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        width: '150px',
                                        height: '150px',
                                        borderRadius: '50%',
                                        margin: '0 auto 20px',
                                        overflow: 'hidden',
                                        border: '4px solid #0DE0FE',
                                    }}
                                >
                                    <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '8px',
                                            right: '8px',
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            background: '#09E5AB',
                                            border: '3px solid white',
                                        }}
                                    />
                                </div>
                                <h3
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        marginBottom: '4px',
                                        fontFamily: 'Poppins, sans-serif',
                                        color: '#272B41',
                                    }}
                                >
                                    {doctor.name}
                                </h3>
                                <p
                                    style={{
                                        fontSize: '14px',
                                        color: '#0DE0FE',
                                        marginBottom: '12px',
                                    }}
                                >
                                    {doctor.specialty}
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '16px',
                                        marginBottom: '16px',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                        }}
                                    >
                                        <Star
                                            color="#FF9B44"
                                            fill="#FF9B44"
                                            size={16}
                                        />
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                color: '#272B41',
                                            }}
                                        >
                                            {doctor.rating}
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            color: '#6B7280',
                                            fontSize: '14px',
                                        }}
                                    >
                                        {doctor.experience}
                                    </span>
                                </div>
                                    <Link href={login()} style={{ textDecoration: 'none' }}>
                                        <button
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '10px',
                                                border: '2px solid #0DE0FE',
                                                background: 'transparent',
                                                color: '#0DE0FE',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background =
                                                    'linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%)';
                                                e.currentTarget.style.color = 'white';
                                                e.currentTarget.style.border = 'none';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#0DE0FE';
                                                e.currentTarget.style.border = '2px solid #0DE0FE';
                                            }}
                                        >
                                            View Profile
                                        </button>
                                    </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews / Testimonials */}
            <section
                id="reviews"
                style={{
                    padding: '100px 24px',
                    background:
                        'linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%)',
                }}
            >
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <div
                        style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            marginBottom: '12px',
                        }}
                    >
                        Testimonials
                    </div>
                    <h2
                        style={{
                            fontSize: 'clamp(28px, 4vw, 40px)',
                            fontWeight: 700,
                            fontFamily: 'Poppins, sans-serif',
                            color: 'white',
                            marginBottom: '60px',
                        }}
                    >
                        What Our Patients Say
                    </h2>

                    <div
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '48px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginBottom: '24px',
                            }}
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    color="#FF9B44"
                                    fill="#FF9B44"
                                    size={24}
                                />
                            ))}
                        </div>
                        <p
                            style={{
                                fontSize: '20px',
                                color: '#272B41',
                                lineHeight: 1.8,
                                marginBottom: '32px',
                                fontStyle: 'italic',
                            }}
                        >
                            "{reviews[currentReview].text}"
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '16px',
                            }}
                        >
                            <img
                                src={reviews[currentReview].image}
                                alt={reviews[currentReview].name}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                            />
                            <div style={{ textAlign: 'left' }}>
                                <div
                                    style={{
                                        fontWeight: 600,
                                        fontSize: '18px',
                                        color: '#272B41',
                                        fontFamily: 'Poppins, sans-serif',
                                    }}
                                >
                                    {reviews[currentReview].name}
                                </div>
                                <div style={{ color: '#6B7280', fontSize: '14px' }}>
                                    Verified Patient
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '12px',
                            marginTop: '32px',
                        }}
                    >
                        {reviews.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentReview(index)}
                                style={{
                                    width: index === currentReview ? '32px' : '12px',
                                    height: '12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background:
                                        index === currentReview
                                            ? 'white'
                                            : 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                style={{
                    padding: '80px 24px',
                    background: '#F8F9FA',
                }}
            >
                <div
                    style={{
                        maxWidth: '1000px',
                        margin: '0 auto',
                        background:
                            'linear-gradient(135deg, #272B41 0%, #3d4256 100%)',
                        borderRadius: '24px',
                        padding: '60px',
                        textAlign: 'center',
                    }}
                >
                    <h2
                        style={{
                            fontSize: 'clamp(24px, 4vw, 36px)',
                            fontWeight: 700,
                            color: 'white',
                            marginBottom: '16px',
                            fontFamily: 'Poppins, sans-serif',
                        }}
                    >
                        Ready to Book Your Appointment?
                    </h2>
                    <p
                        style={{
                            fontSize: '18px',
                            color: 'rgba(255,255,255,0.7)',
                            marginBottom: '32px',
                        }}
                    >
                        Join thousands of patients who trust Doccare for their healthcare needs.
                    </p>
                    <Link href={register()} style={{ textDecoration: 'none' }}>
                        <button
                            style={{
                                background:
                                    'linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%)',
                                color: 'white',
                                padding: '16px 40px',
                                borderRadius: '12px',
                                fontWeight: 600,
                                fontSize: '16px',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'Poppins, sans-serif',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow =
                                    '0 10px 30px rgba(13, 224, 254, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            Get Started Now
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer
                style={{
                    background: '#1a1d2e',
                    color: 'white',
                    padding: '60px 24px 24px',
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '48px',
                        marginBottom: '48px',
                    }}
                >
                    {/* Logo & Description */}
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '16px',
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background:
                                        'linear-gradient(135deg, #0DE0FE 0%, #09E5AB 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Activity color="white" size={24} />
                            </div>
                            <span
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    fontFamily: 'Poppins, sans-serif',
                                }}
                            >
                                Doccare
                            </span>
                        </div>
                        <p
                            style={{
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.6)',
                                lineHeight: 1.8,
                            }}
                        >
                            Connecting patients with trusted healthcare professionals
                            through seamless digital experience.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4
                            style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                marginBottom: '20px',
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        >
                            Quick Links
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {['Home', 'About', 'Doctors', 'Specialties', 'Contact'].map(
                                (link, index) => (
                                    <li key={index} style={{ marginBottom: '12px' }}>
                                        <a
                                            href={`#${
                                                link === 'Home'
                                                    ? 'home'
                                                    : link.toLowerCase()
                                            }`}
                                            style={{
                                                color: 'rgba(255,255,255,0.6)',
                                                textDecoration: 'none',
                                                fontSize: '14px',
                                                transition: 'color 0.3s ease',
                                            }}
                                        >
                                            {link}
                                        </a>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4
                            style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                marginBottom: '20px',
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        >
                            Services
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {[
                                'Cardiology',
                                'Neurology',
                                'Pediatrics',
                                'Dental Care',
                                'Orthopedics',
                            ].map((service, index) => (
                                <li key={index} style={{ marginBottom: '12px' }}>
                                    <a
                                        href="#"
                                        style={{
                                            color: 'rgba(255,255,255,0.6)',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                        }}
                                    >
                                        {service}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4
                            style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                marginBottom: '20px',
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        >
                            Contact Info
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '16px',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '14px',
                                }}
                            >
                                <MapPin size={18} />
                                <span>123 Healthcare Ave, Medical City</span>
                            </li>
                            <li
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '16px',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '14px',
                                }}
                            >
                                <Phone size={18} />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '16px',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '14px',
                                }}
                            >
                                <Mail size={18} />
                                <span>support@doccare.com</span>
                            </li>
                            <li
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '14px',
                                }}
                            >
                                <Clock size={18} />
                                <span>24/7 Support</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        paddingTop: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}
                >
                    <p
                        style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.6)',
                        }}
                    >
                        &copy; 2026 Doccare. All rights reserved.
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            gap: '24px',
                        }}
                    >
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(
                            (link, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    style={{
                                        color: 'rgba(255,255,255,0.6)',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                    }}
                                >
                                    {link}
                                </a>
                            )
                        )}
                    </div>
                </div>
            </footer>
        </>
    );
}