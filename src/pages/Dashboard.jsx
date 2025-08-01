import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logosaas.png";

export const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedSkills, setExpandedSkills] = useState({});

    const toggleSkills = (technicianId) => {
        setExpandedSkills(prev => ({
            ...prev,
            [technicianId]: !prev[technicianId]
        }));
    };

    // Sample dashboard data
    const stats = {
        totalTickets: 1247,
        openTickets: 89,
        resolvedToday: 23,
        avgResponseTime: '2.3h',
        technicians: 6,
        availableTechs: 4
    };

    const recentTickets = [
        {
            id: 'TKT-001',
            title: 'Network connectivity issue',
            priority: 'High',
            status: 'In Progress',
            assignedTo: 'John Smith',
            createdAt: '2 hours ago',
            customer: 'Acme Corp'
        },
        {
            id: 'TKT-002',
            title: 'Software installation failed',
            priority: 'Medium',
            status: 'Open',
            assignedTo: 'Sarah Johnson',
            createdAt: '4 hours ago',
            customer: 'TechStart Inc'
        },
        {
            id: 'TKT-003',
            title: 'Printer not responding',
            priority: 'Low',
            status: 'Resolved',
            assignedTo: 'Emily Davis',
            createdAt: '6 hours ago',
            customer: 'Global Solutions'
        },
        {
            id: 'TKT-004',
            title: 'Email server down',
            priority: 'Critical',
            status: 'Open',
            assignedTo: 'Unassigned',
            createdAt: '1 hour ago',
            customer: 'DataFlow Systems'
        }
    ];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return 'bg-red-100 text-red-800';
            case 'High': return 'bg-orange-100 text-orange-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
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
                                                <dd className="text-lg font-medium text-gray-900">{stats.totalTickets}</dd>
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
                                                <dd className="text-lg font-medium text-gray-900">{stats.openTickets}</dd>
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
                                                <dd className="text-lg font-medium text-gray-900">{stats.resolvedToday}</dd>
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
                                                <dd className="text-lg font-medium text-gray-900">{stats.avgResponseTime}</dd>
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
                                                <tr key={ticket.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                                                        <div className="text-sm text-gray-500">{ticket.title}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.customer}</td>
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
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.assignedTo}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.createdAt}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>


                    </div>
                )}

                {activeTab === 'tickets' && (
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">All Tickets</h3>
                            <p className="text-gray-500">Ticket management interface will be implemented here.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'technicians' && (
                    <div className="space-y-6">
                        {/* Stats Bar */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div>
                                    <div className="text-3xl font-bold text-blue-600 mb-1">6</div>
                                    <p className="text-gray-600 text-sm">Total Technicians</p>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-green-600 mb-1">4</div>
                                    <p className="text-gray-600 text-sm">Available Now</p>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-purple-600 mb-1">5,541</div>
                                    <p className="text-gray-600 text-sm">Tickets Resolved</p>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-orange-600 mb-1">4.7</div>
                                    <p className="text-gray-600 text-sm">Avg. Rating</p>
                                </div>
                            </div>
                        </div>

                        {/* Technicians Table */}
                        <div className="flex justify-center">
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-7xl">
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
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {[
                                                {
                                                    id: 1,
                                                    name: "John Smith",
                                                    role: "Senior IT Technician",
                                                    avatar: "JS",
                                                    skills: ["Network Troubleshooting", "Hardware Repair", "Software Installation", "System Administration"],
                                                    experience: "8 years",
                                                    availability: "Available",
                                                    status: "online",
                                                    completedTickets: 1247
                                                },
                                                {
                                                    id: 2,
                                                    name: "Sarah Johnson",
                                                    role: "Network Specialist",
                                                    avatar: "SJ",
                                                    skills: ["Network Security", "Cisco Systems", "VPN Configuration", "Firewall Management"],
                                                    experience: "6 years",
                                                    availability: "Available",
                                                    status: "online",
                                                    completedTickets: 892
                                                },
                                                {
                                                    id: 3,
                                                    name: "Mike Chen",
                                                    role: "Software Support Engineer",
                                                    avatar: "MC",
                                                    skills: ["Database Management", "API Integration", "Cloud Services", "DevOps"],
                                                    experience: "5 years",
                                                    availability: "On Break",
                                                    status: "away",
                                                    completedTickets: 756
                                                },
                                                {
                                                    id: 4,
                                                    name: "Emily Davis",
                                                    role: "Hardware Technician",
                                                    avatar: "ED",
                                                    skills: ["PC Repair", "Laptop Maintenance", "Printer Support", "Hardware Upgrades"],
                                                    experience: "4 years",
                                                    availability: "Available",
                                                    status: "online",
                                                    completedTickets: 634
                                                },
                                                {
                                                    id: 5,
                                                    name: "David Wilson",
                                                    role: "System Administrator",
                                                    avatar: "DW",
                                                    skills: ["Server Management", "Active Directory", "Backup Solutions", "Virtualization"],
                                                    experience: "10 years",
                                                    availability: "Busy",
                                                    status: "busy",
                                                    completedTickets: 1567
                                                },
                                                {
                                                    id: 6,
                                                    name: "Lisa Rodriguez",
                                                    role: "Help Desk Specialist",
                                                    avatar: "LR",
                                                    skills: ["User Support", "Ticket Management", "Remote Assistance", "Documentation"],
                                                    experience: "3 years",
                                                    availability: "Available",
                                                    status: "online",
                                                    completedTickets: 445
                                                }
                                            ].map((technician) => (
                                                <tr key={technician.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="relative">
                                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                    <span className="text-sm font-bold text-blue-600">{technician.avatar}</span>
                                                                </div>
                                                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${technician.status === 'online' ? 'bg-green-500' : technician.status === 'away' ? 'bg-yellow-500' : 'bg-red-500'} rounded-full border-2 border-white`}></div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{technician.name}</div>
                                                                <div className="text-sm text-gray-500">{technician.role}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${technician.availability === 'Available' ? 'bg-green-100 text-green-600' :
                                                            technician.availability === 'On Break' ? 'bg-yellow-100 text-yellow-600' :
                                                                'bg-red-100 text-red-600'
                                                            }`}>
                                                            {technician.availability}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {technician.experience}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {technician.completedTickets.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                                            {expandedSkills[technician.id]
                                                                ? technician.skills.map((skill, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                                    >
                                                                        {skill}
                                                                    </span>
                                                                ))
                                                                : technician.skills.slice(0, 3).map((skill, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                                    >
                                                                        {skill}
                                                                    </span>
                                                                ))
                                                            }
                                                            {technician.skills.length > 3 && (
                                                                <button
                                                                    onClick={() => toggleSkills(technician.id)}
                                                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                                                                >
                                                                    {expandedSkills[technician.id] ? 'Show Less' : `+${technician.skills.length - 3} more`}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-200 transition-colors">
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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
