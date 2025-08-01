import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Tag, User, Calendar, Clock, MessageSquare, History, CheckCircle, ArrowRight, Layers, Shield, Star, ThumbsUp, GitCommitVertical, ArrowLeft, Loader2
} from 'lucide-react';
import ticketsApi from '../api/tickets';
import skillsApi from '../api/skills';
import techniciansApi from '../api/technician';

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

const AssignmentTooltip = ({ technicianDetails, technicianWorkload, ticketSkills, skillNames }) => {
    if (!technicianDetails) return null;

    const matchingSkills = technicianDetails.skills?.filter(skill => 
        ticketSkills?.includes(skill.skill_id)
    ) || [];

    const currentWorkload = technicianWorkload?.tickets?.length || 0;

    return (
        <div className="absolute z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 -top-2 left-full ml-2">
            <div className="text-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Assignment Justification</h4>
                
                {/* Technician Info */}
                <div className="mb-3">
                    <p className="text-gray-600 mb-1">
                        <span className="font-medium">Skill Level:</span> {technicianDetails.skill_level || 'N/A'}
                    </p>
                    <p className="text-gray-600 mb-1">
                        <span className="font-medium">Specialization:</span> {technicianDetails.specialization || 'N/A'}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">Current Workload:</span> {currentWorkload} active tickets
                    </p>
                </div>

                {/* Matching Skills */}
                {matchingSkills.length > 0 && (
                    <div className="mb-3">
                        <p className="font-medium text-gray-700 mb-1">Matching Skills ({matchingSkills.length}):</p>
                        <div className="flex flex-wrap gap-1">
                            {matchingSkills.map(skill => (
                                <span key={skill.skill_id} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {skillNames[skill.skill_id] || `Skill ${skill.skill_id}`}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Availability Status */}
                <div className="mb-3">
                    <p className="text-gray-600">
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 text-xs rounded ${
                            technicianDetails.availability_status === 'available' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {technicianDetails.availability_status?.replace('_', ' ') || 'Unknown'}
                        </span>
                    </p>
                </div>

                {/* Assignment Reason */}
                <div className="text-xs text-gray-500 border-t pt-2">
                    <p className="font-medium">Why this technician?</p>
                    <ul className="mt-1 space-y-1">
                        {matchingSkills.length > 0 && (
                            <li>• Has {matchingSkills.length} required skills</li>
                        )}
                        {technicianDetails.skill_level === 'senior' && (
                            <li>• Senior level expertise</li>
                        )}
                        {currentWorkload < 5 && (
                            <li>• Low current workload</li>
                        )}
                        {technicianDetails.availability_status === 'available' && (
                            <li>• Currently available</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

export default function TicketDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('work_logs');
    const [ticket, setTicket] = useState(null);
    const [skillNames, setSkillNames] = useState({});
    const [technicianDetails, setTechnicianDetails] = useState(null);
    const [technicianWorkload, setTechnicianWorkload] = useState(null);
    const [showAssignmentTooltip, setShowAssignmentTooltip] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await ticketsApi.getTicketById(id);
                
                // Handle the API response structure: { success: true, data: {...} }
                if (response.success && response.data) {
                    setTicket(response.data);
                    
                    // Fetch skill names if required_skills exist
                    if (response.data.required_skills && response.data.required_skills.length > 0) {
                        const skillNamesMap = {};
                        for (const skillId of response.data.required_skills) {
                            try {
                                const skillResponse = await skillsApi.getSkillById(skillId);
                                if (skillResponse.success && skillResponse.data) {
                                    skillNamesMap[skillId] = skillResponse.data.name;
                                }
                            } catch (skillErr) {
                                console.warn(`Failed to fetch skill ${skillId}:`, skillErr);
                                skillNamesMap[skillId] = `Skill ${skillId}`;
                            }
                        }
                        setSkillNames(skillNamesMap);
                    }

                    // Fetch technician details if assigned
                    if (response.data.assigned_technician_id) {
                        fetchTechnicianDetails(response.data.assigned_technician_id);
                    }
                } else {
                    setError('Invalid response format from server');
                }
            } catch (err) {
                console.error('Error fetching ticket:', err);
                setError(err.message || 'Failed to fetch ticket details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTicket();
        }
    }, [id]);

    const fetchTechnicianDetails = async (technicianId) => {
        try {
            // Fetch technician details
            const techResponse = await techniciansApi.getTechnicianById(technicianId);
            if (techResponse.success && techResponse.data) {
                setTechnicianDetails(techResponse.data);
            }

            // Fetch technician's current workload
            const workloadResponse = await ticketsApi.getTicketsByTechnicianId(technicianId, { status: 'in_progress,assigned,new' });
            if (workloadResponse.success && workloadResponse.data) {
                setTechnicianWorkload(workloadResponse.data);
            }
        } catch (err) {
            console.warn('Failed to fetch technician details:', err);
        }
    };

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading ticket details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Ticket</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Ticket Not Found</h3>
                        <p className="text-yellow-600 mb-4">The ticket you're looking for doesn't exist or has been removed.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 font-sans">
            <main className="mx-auto max-w-7xl">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-md transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </button>
                </div>

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
                                        {ticket.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                                    </span>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority?.toUpperCase() || 'NORMAL'}
                                    </span>
                                </div>
                            </div>

                            {/* Tags */}
                            {ticket.tags && ticket.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                    {ticket.tags.map(tag => (
                                        <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{tag}</span>
                                    ))}
                                </div>
                            )}
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
                                <DetailItem icon={User} label="Requester">
                                    {ticket.requester?.name || ticket.requester_id || 'N/A'}
                                </DetailItem>
                                <DetailItem icon={User} label="Assigned To">
                                    <div className="relative">
                                        <span 
                                            className="cursor-help hover:text-indigo-600 transition-colors"
                                            onMouseEnter={() => setShowAssignmentTooltip(true)}
                                            onMouseLeave={() => setShowAssignmentTooltip(false)}
                                        >
                                            {ticket.assigned_technician?.name || ticket.assigned_technician_id || 'Unassigned'}
                                        </span>
                                        {showAssignmentTooltip && ticket.assigned_technician_id && (
                                            <AssignmentTooltip 
                                                technicianDetails={technicianDetails}
                                                technicianWorkload={technicianWorkload}
                                                ticketSkills={ticket.required_skills}
                                                skillNames={skillNames}
                                            />
                                        )}
                                    </div>
                                </DetailItem>
                                <DetailItem icon={Shield} label="Impact">
                                    {ticket.impact || 'N/A'}
                                </DetailItem>
                                <DetailItem icon={Layers} label="Urgency">
                                    {ticket.urgency || 'N/A'}
                                </DetailItem>
                                <DetailItem icon={Calendar} label="Created Date">
                                    {formatDate(ticket.created_at)}
                                </DetailItem>
                                <DetailItem icon={Clock} label="Resolution Due">
                                    {formatDate(ticket.resolution_due)}
                                </DetailItem>
                            </dl>
                        </div>

                        {/* Tasks & Required Skills */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {ticket.required_skills && ticket.required_skills.length > 0 && (
                                <div className="rounded-lg border border-gray-200 bg-white p-6">
                                    <h3 className="font-semibold text-gray-800">Required Skills</h3>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {ticket.required_skills.map(skillId => (
                                            <span key={skillId} className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                                                {skillNames[skillId] || `Skill ${skillId}`}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {ticket.tasks && ticket.tasks.length > 0 && (
                                <div className="rounded-lg border border-gray-200 bg-white p-6">
                                    <h3 className="font-semibold text-gray-800">Tasks</h3>
                                    <ul className="mt-3 space-y-2">
                                        {ticket.tasks.map((task, index) => (
                                            <li key={index} className="flex items-center gap-3">
                                                <CheckCircle className={`h-5 w-5 ${task.status === 'done' || task.status === 'completed' ? 'text-green-500' : 'text-gray-300'}`} />
                                                <span className={`text-sm ${task.status === 'done' || task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                                    {task.sub || task.description || task.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
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
                                {ticket.feedback && (
                                    <p className="mt-2 text-sm italic text-gray-600">"{ticket.feedback}"</p>
                                )}
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
                                        ticket.work_logs && ticket.work_logs.length > 0 ? ticket.work_logs.map((log, index) => (
                                            <TimelineItem key={log.time || index} icon={MessageSquare} color="bg-blue-100 text-blue-600" author={log.author || 'System'} timestamp={log.time}>
                                                <p>{log.note}</p>
                                            </TimelineItem>
                                        )) : <p className="text-sm text-gray-500">No work logs yet.</p>
                                    )}
                                    {activeTab === 'audit_trail' && (
                                        ticket.audit_trail && ticket.audit_trail.length > 0 ? ticket.audit_trail.map((log, index) => (
                                            <TimelineItem key={log.timestamp || index} icon={GitCommitVertical} color="bg-gray-100 text-gray-600" author={log.author || 'System'} timestamp={log.timestamp}>
                                                <div>
                                                    <span className="font-semibold">Status</span> changed
                                                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                                        <span className="rounded bg-red-100 px-2 py-0.5 text-red-800">{log.from || 'N/A'}</span>
                                                        <ArrowRight className="h-3 w-3" />
                                                        <span className="rounded bg-green-100 px-2 py-0.5 text-green-800">{log.to}</span>
                                                    </div>
                                                </div>
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
