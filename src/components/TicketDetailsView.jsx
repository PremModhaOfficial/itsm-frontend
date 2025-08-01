import React, { useState } from 'react';
import {
    Tag, User, Calendar, Clock, MessageSquare, History, CheckCircle, ArrowRight, Layers, Shield, Star, ThumbsUp, GitCommitVertical
} from 'lucide-react';

// --- Mock Data based on your Sequelize Model ---
// Replace this with data fetched from your API
const mockTicketData = {
    id: 437,
    subject: "Unable to connect to production database from new web server",
    description: "We've provisioned a new web server (WEB-PROD-05) and it's failing to establish a connection to our primary production database (DB-PROD-01). The firewall rules seem to be correct, and other servers in the same subnet can connect without issues. We've checked connection strings and credentials, and they are accurate. This is blocking the deployment of our new application feature.",
    status: 'in_progress',
    tags: ['database', 'networking', 'production', 'web-server'],
    priority: 'high',
    impact: 'high',
    urgency: 'high',
    sla_violated: false,
    resolution_due: '2025-08-05T17:00:00Z',
    requester: { name: 'Alice Johnson', email: 'alice.j@example.com' },
    assigned_technician: { name: 'Bob Williams', email: 'bob.w@example.com' },
    required_skills: ['PostgreSQL', 'Firewall Configuration', 'Linux SysAdmin'],
    tasks: [
        { sub: "Verify firewall rules on WEB-PROD-05", status: "completed", description: "Checked using ufw." },
        { sub: "Test database credentials from the server", status: "completed", description: "Used psql to test." },
        { sub: "Check for IP whitelisting on DB-PROD-01", status: "in_progress", description: "Contacting DB admin team." },
        { sub: "Perform network trace route", status: "pending", description: "Awaiting downtime window." }
    ],
    work_logs: [
        {
            timestamp: '2025-08-01T10:05:00Z',
            author: 'Bob Williams',
            note: 'Initial investigation confirms the issue. Credentials and basic network connectivity from the gateway have been verified. Starting a deeper dive into server-specific configurations.'
        },
        {
            timestamp: '2025-08-01T11:30:00Z',
            author: 'Bob Williams',
            note: 'Found a misconfigured security group policy attached to WEB-PROD-05 that was overriding the subnet-level rules. I am adjusting the policy now. Will test connectivity again shortly.'
        }
    ],
    audit_trail: [
        {
            timestamp: '2025-08-01T09:02:00Z',
            author: 'System',
            change: { field: 'Ticket', action: 'Created', from: null, to: 'New Ticket' }
        },
        {
            timestamp: '2025-08-01T09:15:00Z',
            author: 'Auto-Assigner',
            change: { field: 'Assigned Technician', from: 'Unassigned', to: 'Bob Williams' }
        },
        {
            timestamp: '2025-08-01T09:15:00Z',
            author: 'Auto-Assigner',
            change: { field: 'Status', from: 'new', to: 'assigned' }
        },
        {
            timestamp: '2025-08-01T10:00:00Z',
            author: 'Bob Williams',
            change: { field: 'Status', from: 'assigned', to: 'in_progress' }
        }
    ],
    created_at: '2025-08-01T09:02:00Z',
    updated_at: '2025-08-01T11:30:00Z',
    satisfaction_rating: 5,
    feedback: "Bob was extremely fast and knowledgeable. Great work!"
};


// --- Helper Functions & Sub-components ---

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const getStatusColor = (status) => {
    switch (status) {
        case 'new': return 'bg-blue-100 text-blue-800';
        case 'assigned': return 'bg-indigo-100 text-indigo-800';
        case 'in_progress': return 'bg-yellow-100 text-yellow-800';
        case 'on_hold': return 'bg-gray-100 text-gray-800';
        case 'resolved': return 'bg-green-100 text-green-800';
        case 'closed': return 'bg-green-200 text-green-900';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'low': return 'bg-gray-100 text-gray-800';
        case 'normal': return 'bg-blue-100 text-blue-800';
        case 'high': return 'bg-orange-100 text-orange-800';
        case 'critical': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100';
    }
};

const DetailItem = ({ icon: Icon, label, children }) => (
    <div className="flex flex-col">
        <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Icon className="h-4 w-4 text-gray-400" />
            {label}
        </dt>
        <dd className="mt-1 text-sm text-gray-900">{children}</dd>
    </div>
);

const TimelineItem = ({ icon: Icon, color, author, timestamp, children }) => (
    <li className="mb-6 ms-6">
        <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${color} ring-8 ring-white`}>
            <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="ml-2 items-center justify-between rounded-lg border border-gray-200 bg-white p-4 sm:flex">
            <div className="text-sm font-normal text-gray-600">
                {children}
            </div>
            <div className="mt-2 text-xs font-normal text-gray-400 sm:mt-0 sm:text-right">
                <p>{author}</p>
                <time>{formatDate(timestamp)}</time>
            </div>
        </div>
    </li>
);

// --- Main Component ---

export default function TicketDetailsPage() {
    const [activeTab, setActiveTab] = useState('work_logs');
    const [addTaskClicked, setAddTaskClicked] = useState(false)
    const ticket = mockTicketData;

    const renderAuditTrail = (log) => {
        const { field, action, from, to } = log.change;
        if (action === 'Created') {
            return <p>Ticket was created by <strong>{log.author}</strong>.</p>
        }
        return (
            <div>
                <span className="font-semibold">{field}</span> changed
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span className="rounded bg-red-100 px-2 py-0.5 text-red-800">{from || 'N/A'}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="rounded bg-green-100 px-2 py-0.5 text-green-800">{to}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 font-sans">
            <main className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* Left Column: Ticket Details */}
                    <div className="space-y-6 lg:col-span-2">

                        {/* Header */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-500">TICKET #{ticket.id}</span>
                                    <h1 className="mt-1 text-2xl font-bold text-gray-900">{ticket.subject}</h1>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                        {ticket.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <Tag className="h-4 w-4 text-gray-400" />
                                {ticket.tags.map(tag => (
                                    <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-gray-800">Description</h2>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{ticket.description}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ticket Details</h2>
                            <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
                                <DetailItem icon={User} label="Requester">{ticket.requester.name}</DetailItem>
                                <DetailItem icon={User} label="Assigned To">{ticket.assigned_technician?.name || 'Unassigned'}</DetailItem>
                                <DetailItem icon={Shield} label="Impact">{ticket.impact}</DetailItem>
                                <DetailItem icon={Layers} label="Urgency">{ticket.urgency}</DetailItem>
                                <DetailItem icon={Calendar} label="Created Date">{formatDate(ticket.created_at)}</DetailItem>
                                <DetailItem icon={Clock} label="Resolution Due">{formatDate(ticket.resolution_due)}</DetailItem>
                            </dl>
                        </div>

                        {/* Tasks & Required Skills */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h3 className="font-semibold text-gray-800">Required Skills</h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {ticket.required_skills.map(skill => (
                                        <span key={skill} className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <div className='flex justify-between'>
                                    <div className='flex-row'>
                                        <h3 className="font-semibold text-gray-800">Tasks </h3>
                                    </div>
                                    <div className='flex-row'>
                                        <button
                                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={() => {
                                                // Placeholder for addTask method
                                                // This should be replaced with actual method to add task to database
                                                setAddTaskClicked(!addTaskClicked)
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            <span className="ml-2">Add Task</span>
                                        </button>
                                    </div>
                                </div>
                                {addTaskClicked &&
                                    <div className='flex flex-row flex-1 border border-gray-200'>
                                        <label htmlFor="newTask" className='m-0'>
                                            <input type="text" placeholder='task' />
                                        </label>
                                    </div>
                                }
                                <ul className="mt-3 space-y-2">
                                    {ticket.tasks.map(task => (
                                        <li key={task.sub} className="flex items-center gap-3">
                                            <CheckCircle className={`h-5 w-5 ${task.status === 'completed' ? 'text-green-500' : 'text-gray-300'}`} />
                                            <span className={`text-sm ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                                {task.sub}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Satisfaction */}
                        {ticket.satisfaction_rating && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2"><ThumbsUp className="h-5 w-5 text-indigo-500" /> Customer Feedback</h3>
                                <div className="mt-3 flex items-center gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-5 w-5 ${i < ticket.satisfaction_rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                                    ))}
                                </div>
                                <p className="mt-2 text-sm italic text-gray-600">"{ticket.feedback}"</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Activity Feed */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="rounded-lg border border-gray-200 bg-white">
                            {/* Tabs */}
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex">
                                    <button onClick={() => setActiveTab('work_logs')} className={`flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-center text-sm font-medium ${activeTab === 'work_logs' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                                        Work Logs
                                    </button>
                                    <button onClick={() => setActiveTab('audit_trail')} className={`flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-center text-sm font-medium ${activeTab === 'audit_trail' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                                        Audit Trail
                                    </button>
                                </nav>
                            </div>

                            {/* Timeline Content */}
                            <div className="p-6">
                                <ol className="relative border-s border-gray-200">
                                    {activeTab === 'work_logs' && (
                                        ticket.work_logs.length > 0 ? ticket.work_logs.map((log) => (
                                            <TimelineItem key={log.timestamp} icon={MessageSquare} color="bg-blue-100 text-blue-600" author={log.author} timestamp={log.timestamp}>
                                                <p>{log.note}</p>
                                            </TimelineItem>
                                        )) : <p className="text-sm text-gray-500">No work logs yet.</p>
                                    )}
                                    {activeTab === 'audit_trail' && (
                                        ticket.audit_trail.length > 0 ? ticket.audit_trail.map((log) => (
                                            <TimelineItem key={log.timestamp} icon={GitCommitVertical} color="bg-gray-100 text-gray-600" author={log.author} timestamp={log.timestamp}>
                                                {renderAuditTrail(log)}
                                            </TimelineItem>
                                        )) : <p className="text-sm text-gray-500">No audit trail history.</p>
                                    )}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
