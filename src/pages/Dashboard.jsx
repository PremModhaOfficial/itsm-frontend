import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logosaas.png";

// Import API services
import techniciansApi from '../api/technician';
import ticketsApi from '../api/tickets';
import skillsApi from '../api/skills';
import usersApi from '../api/users';
import authApi from '../api/auth';

export const Dashboard = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [expandedSkills, setExpandedSkills] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for dashboard overview data
    const [overviewStats, setOverviewStats] = useState({
        totalTickets: 0,
        openTickets: 0,
        resolvedToday: 0,
        avgResponseTime: 'N/A',
        totalTechniciansOverview: 0,
        availableTechsOverview: 0,
        totalTicketsResolvedOverall: 0,
        avgTechnicianRating: 'N/A'
    });

    // State for recent tickets (overview tab)
    const [recentTickets, setRecentTickets] = useState([]);

    // States for All Tickets tab pagination and data
    const [allTickets, setAllTickets] = useState([]);
    const [ticketsCurrentPage, setTicketsCurrentPage] = useState(1);
    const [ticketsTotalCount, setTicketsTotalCount] = useState(0);
    const ticketsLimit = 10; // Items per page for tickets

    // States for Technicians tab pagination and data
    const [allTechnicians, setAllTechnicians] = useState([]);
    const [techniciansCurrentPage, setTechniciansCurrentPage] = useState(1);
    const [techniciansTotalCount, setTechniciansTotalCount] = useState(0);
    const techniciansLimit = 10; // Items per page for technicians

    // Unified fetch logic for all tabs
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null); // Clear previous errors

            try {
                if (activeTab === 'overview') {
                    // Fetch total tickets
                    const allTicketsResponse = await ticketsApi.getAllTicketsSimple();
                    const totalTicketsCount = allTicketsResponse.total || allTicketsResponse.data?.total || allTicketsResponse.data?.length || 0;

                    // Fetch open tickets (making individual calls as backend does not support comma-separated status)
                    let openTicketsCount = 0;
                    const openStatuses = ['new', 'assigned', 'in_progress', 'on_hold'];
                    for (const status of openStatuses) {
                        const response = await ticketsApi.getAllTickets({ status: status });
                        openTicketsCount += response.total || response.data?.total || response.data?.tickets?.length || 0;
                    }

                    // Fetch tickets resolved today
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const endOfToday = new Date();
                    endOfToday.setHours(23, 59, 59, 999);

                    let resolvedTodayCount = 0;
                    const resolvedStatuses = ['resolved', 'closed'];
                    for (const status of resolvedStatuses) {
                        const response = await ticketsApi.getAllTickets({
                            status: status,
                            resolved_at_gte: today.toISOString(),
                            resolved_at_lte: endOfToday.toISOString(),
                        });
                        resolvedTodayCount += response.total || response.data?.total || response.data?.tickets?.length || 0;
                    }

                    // Fetch technician count for overview stat
                    const allTechniciansOverviewResponse = await techniciansApi.getAllTechniciansSimple();

                    const totalTechniciansCountOverview = allTechniciansOverviewResponse.total || allTechniciansOverviewResponse.data?.total || allTechniciansOverviewResponse.data?.length || 0;
                    console.log(totalTechniciansCountOverview)



                    // Fetch available technicians count for overview stat
                    const availableTechniciansResponse = await techniciansApi.getAllTechniciansSimple();
                    const availableTechsArray = availableTechniciansResponse.data?.technicians || availableTechniciansResponse.data || [];
                    const availableTechsCount = availableTechsArray.filter(tech =>
                        tech.status === 'online' || tech.availability_status === 'available'
                    ).length;

                    // Fetch recent tickets with requester and assigned technician details
                    const recentTicketsResponse = await ticketsApi.getAllTickets({
                        sort_by: 'created_at',
                        sort_order: 'desc',
                        limit: 4,
                        include: 'requester,assigned_technician'
                    });
                    setRecentTickets(recentTicketsResponse.data?.tickets || recentTicketsResponse.data || []);

                    setOverviewStats(prevStats => ({
                        ...prevStats,
                        totalTickets: totalTicketsCount,
                        openTickets: openTicketsCount,
                        resolvedToday: resolvedTodayCount,
                        totalTechniciansOverview: totalTechniciansCountOverview,
                        availableTechsOverview: availableTechsCount,
                        avgResponseTime: 'N/A'
                    }));

                } else if (activeTab === 'tickets') {
                    const ticketsResponse = await ticketsApi.getAllTickets({
                        limit: ticketsLimit,
                        offset: (ticketsCurrentPage - 1) * ticketsLimit,
                        include: 'requester,assigned_technician'
                    });
                    setAllTickets(ticketsResponse.data?.tickets || []);
                    setTicketsTotalCount(ticketsResponse.data?.total || 0);

                } else if (activeTab === 'technicians') {
                    const techsResponse = await techniciansApi.getAllTechnicians({
                        limit: techniciansLimit,
                        offset: (techniciansCurrentPage - 1) * techniciansLimit,
                        include: 'skills'
                    });

                    const rawTechniciansData = techsResponse || [];
                    console.log(techsResponse, "prem")

                    const transformedTechnicians = rawTechniciansData.map(tech => ({
                        id: tech.id,
                        name: tech.user?.name || tech.name,
                        role: tech.user?.department || tech.specialization || 'IT Technician',
                        avatar: (tech.user?.name || tech.name)?.split(' ').map(n => n[0]).join('').toUpperCase() || '??',
                        skills: tech.skills || [],
                        experience: tech.skill_level === 'senior' ? '8+ years' :
                            tech.skill_level === 'expert' ? '10+ years' :
                                tech.skill_level === 'mid' ? '4-7 years' :
                                    tech.skill_level === 'junior' ? '1-3 years' : 'N/A',
                        availability_status: tech.availability_status || 'offline',
                        status: tech.availability_status === 'available' ? 'online' :
                            tech.availability_status === 'busy' || tech.availability_status === 'in_meeting' ? 'busy' :
                                tech.availability_status === 'focus_mode' || tech.availability_status === 'on_break' || tech.availability_status === 'end_of_shift' ? 'away' : 'offline',
                        assigned_tickets_total: tech.assigned_tickets_total || 0,
                        satisfaction_rating: tech.satisfaction_rating || 0
                    }));

                    setAllTechnicians(transformedTechnicians);
                    setTechniciansTotalCount(techsResponse.data?.total || 0);

                    const availableTechs = transformedTechnicians.filter(tech =>
                        tech.availability_status === 'available' || tech.status === 'online'
                    ).length;

                    const totalTicketsResolvedByAllTechnicians = transformedTechnicians.reduce((sum, tech) =>
                        sum + (tech.assigned_tickets_total || 0), 0);

                    const totalRatings = transformedTechnicians.reduce((sum, tech) =>
                        sum + (tech.satisfaction_rating || 0), 0);
                    const avgRating = transformedTechnicians.length > 0 ? (totalRatings / transformedTechnicians.length).toFixed(1) : 'N/A';

                    setOverviewStats(prevStats => ({
                        ...prevStats,
                        totalTechniciansOverview: techsResponse.data?.total || 0,
                        availableTechsOverview: availableTechs,
                        totalTicketsResolvedOverall: totalTicketsResolvedByAllTechnicians,
                        avgTechnicianRating: avgRating
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch data:", err.response?.data || err.message);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        // Reset pagination when tab changes
        if (activeTab === 'tickets') {
            setTicketsCurrentPage(1);
        } else if (activeTab === 'technicians') {
            setTechniciansCurrentPage(1);
        }

        fetchData();
    }, [activeTab, ticketsCurrentPage, techniciansCurrentPage, ticketsLimit, techniciansLimit]);

    // Handlers for pagination
    const handleTicketsPageChange = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(ticketsTotalCount / ticketsLimit)) {
            setTicketsCurrentPage(newPage);
        }
    };

    const handleTechniciansPageChange = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(techniciansTotalCount / techniciansLimit)) {
            setTechniciansCurrentPage(newPage);
        }
    };

    const toggleSkills = (technicianId) => {
        setExpandedSkills(prev => ({
            ...prev,
            [technicianId]: !prev[technicianId]
        }));
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'normal': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new':
            case 'assigned':
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'on_hold': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed':
            case 'cancelled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTechnicianAvailabilityColor = (availabilityStatus) => {
        switch (availabilityStatus) {
            case 'available': return 'bg-green-100 text-green-600';
            case 'busy':
            case 'in_meeting': return 'bg-red-100 text-red-600';
            case 'on_break':
            case 'focus_mode':
            case 'end_of_shift': return 'bg-yellow-100 text-yellow-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    // Reusable Pagination Component
    const Pagination = ({ currentPage, totalCount, limit, onPageChange }) => {
        const totalPages = Math.ceil(totalCount / limit);
        const pageNumbers = [];

        if (totalPages > 0) {
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);

            if (currentPage <= 3) {
                endPage = Math.min(totalPages, 5);
            } else if (currentPage >= totalPages - 2) {
                startPage = Math.max(1, totalPages - 4);
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (startPage > 1) {
                if (startPage > 2) pageNumbers.unshift('...');
                if (!pageNumbers.includes(1)) pageNumbers.unshift(1);
            }
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pageNumbers.push('...');
                if (!pageNumbers.includes(totalPages)) pageNumbers.push(totalPages);
            }
        }

        if (totalPages <= 1) return null;

        return (
            <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4" aria-label="Pagination">
                <div className="flex-1 flex justify-between sm:justify-end">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <div className="hidden sm:flex sm:items-center sm:space-x-2 ml-3">
                        {pageNumbers.map((page, index) => (
                            page === '...' ? (
                                <span key={`dots-${index}`} className="px-3 py-1 text-sm font-medium text-gray-500">...</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    {page}
                                </button>
                            )
                        ))}
                    </div>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </nav>
        );
    };

    return (
        <div className="antialiased bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <img src={logo} alt="Logo" className="h-8 w-8 mr-3" />
                            <h1 className="text-xl font-semibold text-gray-900">ITSM Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-500 hover:text-gray-700">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                                </svg>
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">JD</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700">John Doe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', name: 'Overview' },
                            { id: 'tickets', name: 'Tickets' },
                            { id: 'technicians', name: 'Technicians' },
                            { id: 'reports', name: 'Reports' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                                                <dd className="text-lg font-medium text-gray-900">{overviewStats.totalTickets}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Open Tickets</dt>
                                                <dd className="text-lg font-medium text-gray-900">{overviewStats.openTickets}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Resolved Today</dt>
                                                <dd className="text-lg font-medium text-gray-900">{overviewStats.resolvedToday}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Avg Response Time</dt>
                                                <dd className="text-lg font-medium text-gray-900">{overviewStats.avgResponseTime}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Tickets */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Tickets</h3>
                                {loading && <p className="text-center text-gray-500">Loading recent tickets...</p>}
                                {error && activeTab === 'overview' && <p className="text-center text-red-500">Error loading recent tickets: {error}</p>}
                                {!loading && !error && recentTickets.length === 0 && (
                                    <p className="text-center text-gray-500">No recent tickets found.</p>
                                )}
                                {!loading && !error && recentTickets.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {recentTickets.map((ticket) => (
                                                    <tr key={ticket.id} className="hover:bg-gray-50"> {/* Removed row onClick */}
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                <Link to={`/tickets/${ticket.id}`} className="text-blue-600 hover:text-blue-900 hover:underline">
                                                                    {ticket.id}
                                                                </Link>
                                                            </div>
                                                            <div className="text-sm text-gray-500">{ticket.subject}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {ticket.requester ? (
                                                                <Link to={`/users/${ticket.requester.id}`} className="text-blue-600 hover:text-blue-900 hover:underline">
                                                                    {ticket.requester.name}
                                                                </Link>
                                                            ) : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                                {ticket.priority}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                                {ticket.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {ticket.assigned_technician ? (
                                                                <Link to={`/technicians/${ticket.assigned_technician.id}`} className="text-blue-600 hover:text-blue-900 hover:underline">
                                                                    {ticket.assigned_technician.name}
                                                                </Link>
                                                            ) : 'Unassigned'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(ticket.created_at).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tickets' && (
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">All Tickets</h3>
                            {loading && <p className="text-center text-gray-500">Loading tickets...</p>}
                            {error && activeTab === 'tickets' && <p className="text-center text-red-500">Error loading tickets: {error}</p>}
                            {!loading && !error && allTickets.length === 0 && (
                                <p className="px-6 py-4 text-center text-gray-500">No tickets found.</p>
                            )}
                            {!loading && !error && allTickets.length > 0 && (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {allTickets.map((ticket) => (
                                                    <tr key={ticket.id} className="hover:bg-gray-50"> {/* Removed row onClick */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            <Link to={`/tickets/${ticket.id}`} className="text-blue-600 hover:text-blue-900 hover:underline">
                                                                {ticket.id}
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.subject}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {ticket.requester ? (
                                                                <Link to={`/users/${ticket.requester.id}`} className="text-blue-600 hover:text-blue-900 hover:underline">
                                                                    {ticket.requester.name}
                                                                </Link>
                                                            ) : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                                {ticket.priority}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                                {ticket.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {ticket.assigned_technician ? (
                                                                <Link to={`/technicians/${ticket.assigned_technician.id}`} className="text-blue-600 hover:text-blue-900 hover:underline">
                                                                    {ticket.assigned_technician.name}
                                                                </Link>
                                                            ) : 'Unassigned'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(ticket.created_at).toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-200 transition-colors" onClick={(e) => { e.stopPropagation(); navigate(`/tickets/${ticket.id}`); }}>
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <Pagination
                                        currentPage={ticketsCurrentPage}
                                        totalCount={ticketsTotalCount}
                                        limit={ticketsLimit}
                                        onPageChange={handleTicketsPageChange}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'technicians' && (
                    <div className="space-y-6">
                        {/* Stats Bar */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div>
                                    <div className="text-3xl font-bold text-blue-600 mb-1">{overviewStats.totalTechniciansOverview}</div>
                                    <p className="text-gray-600 text-sm">Total Technicians</p>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-green-600 mb-1">{overviewStats.availableTechsOverview}</div>
                                    <p className="text-gray-600 text-sm">Available Now</p>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-purple-600 mb-1">{overviewStats.totalTicketsResolvedOverall?.toLocaleString() || 'N/A'}</div>
                                    <p className="text-gray-600 text-sm">Tickets Resolved</p>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-orange-600 mb-1">{overviewStats.avgTechnicianRating}</div>
                                    <p className="text-gray-600 text-sm">Avg. Rating</p>
                                </div>
                            </div>
                        </div>

                        {/* Technicians Table */}
                        <div className="flex justify-center">
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-7xl">
                                {loading && <p className="text-center text-gray-500 py-4">Loading technicians...</p>}
                                {error && activeTab === 'technicians' && <p className="text-center text-red-500 py-4">Error loading technicians: {error}</p>}
                                {!loading && !error && allTechnicians.length === 0 ? (
                                    <p className="px-6 py-4 text-center text-gray-500">No technicians found.</p>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Technician
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Experience
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Tickets
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Skills
                                                        </th>
                                                        {/* Removed Actions column header */}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {allTechnicians.map((technician) => (
                                                        <tr key={technician.id} className="hover:bg-gray-50"> {/* Removed row onClick */}
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="relative">
                                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                            <span className="text-sm font-bold text-blue-600">{technician.avatar}</span>
                                                                        </div>
                                                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${technician.status === 'online' ? 'bg-green-500' : technician.status === 'away' ? 'bg-yellow-500' : 'bg-red-500'} rounded-full border-2 border-white`}></div>
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <Link to={`/technicians/${technician.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-900 hover:underline">
                                                                            {technician.name}
                                                                        </Link>
                                                                        <div className="text-sm text-gray-500">{technician.role}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTechnicianAvailabilityColor(technician.availability_status)}`}>
                                                                    {technician.availability_status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {technician.experience}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {technician.assigned_tickets_total.toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                                    {technician.skills && technician.skills.length > 0 ? (
                                                                        expandedSkills[technician.id]
                                                                            ? technician.skills.map((skill) => (
                                                                                <span
                                                                                    key={skill.id}
                                                                                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                                                >
                                                                                    {skill.name}
                                                                                </span>
                                                                            ))
                                                                            : technician.skills.slice(0, 3).map((skill) => (
                                                                                <span
                                                                                    key={skill.id}
                                                                                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                                                >
                                                                                    {skill.name}
                                                                                </span>
                                                                            ))
                                                                    ) : (
                                                                        <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full">No Skills</span>
                                                                    )}
                                                                    {technician.skills && technician.skills.length > 3 && (
                                                                        <button
                                                                            onClick={() => toggleSkills(technician.id)}
                                                                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                                                                        >
                                                                            {expandedSkills[technician.id] ? 'Show Less' : `+${technician.skills.length - 3} more`}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            {/* Removed Actions column data */}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <Pagination
                                            currentPage={techniciansCurrentPage}
                                            totalCount={techniciansTotalCount}
                                            limit={techniciansLimit}
                                            onPageChange={handleTechniciansPageChange}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Reports</h3>
                            <p className="text-gray-500">Reporting and analytics interface will be implemented here.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
