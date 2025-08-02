import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, Filter, X } from 'lucide-react';
import ticketsApi from '../../api/tickets';
import { TicketsTable } from './TicketsTable';
import { Pagination } from './DashboardPagination';

// Helper functions (copied from Dashboard to be self-contained for now)
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


export const TicketsTab = ({ loading, setLoading, error, setError }) => {
    const [allTickets, setAllTickets] = useState([]);
    const [ticketsCurrentPage, setTicketsCurrentPage] = useState(1);
    const [ticketsTotalCount, setTicketsTotalCount] = useState(0);
    const ticketsLimit = 10;
    
    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        assigned_technician: '',
        requester: ''
    });
    const [sortConfig, setSortConfig] = useState({
        field: 'created_at',
        direction: 'desc'
    });

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Build query parameters
            const queryParams = {
                limit: ticketsLimit,
                offset: (ticketsCurrentPage - 1) * ticketsLimit,
                include: 'requester,assigned_technician'
            };

            // Add filters
            if (filters.status) queryParams.status = filters.status;
            if (filters.priority) queryParams.priority = filters.priority;
            if (filters.assigned_technician) queryParams.assigned_technician_id = filters.assigned_technician;
            if (filters.requester) queryParams.requester_id = filters.requester;

            // Add sorting
            if (sortConfig.field) {
                queryParams.sort_by = sortConfig.field;
                queryParams.sort_order = sortConfig.direction;
            }

            const ticketsResponse = await ticketsApi.getAllTickets(queryParams);
            setAllTickets(ticketsResponse.data?.tickets || []);
            setTicketsTotalCount(ticketsResponse.data?.pagination?.total || ticketsResponse.data?.total || ticketsResponse.total || 0);
        } catch (err) {
            console.error("Failed to fetch tickets:", err.response?.data || err.message);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [ticketsCurrentPage, ticketsLimit, filters, sortConfig, setLoading, setError]); // Dependencies for useCallback

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]); // Only re-run when fetchTickets changes

    const handleTicketsPageChange = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(ticketsTotalCount / ticketsLimit)) {
            setTicketsCurrentPage(newPage);
        }
    };

    // Filter and sort handlers
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setTicketsCurrentPage(1); // Reset to first page when filtering
    };

    const handleSort = (field) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        setTicketsCurrentPage(1); // Reset to first page when sorting
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            priority: '',
            assigned_technician: '',
            requester: ''
        });
        setTicketsCurrentPage(1);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                {/* Header with Filter Toggle */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">All Tickets</h3>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                            {hasActiveFilters && (
                                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-indigo-600 rounded-full">
                                    {Object.values(filters).filter(v => v !== '').length}
                                </span>
                            )}
                        </button>
                    </div>
                    
                    {/* Sort Controls */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <button
                            onClick={() => handleSort('created_at')}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                sortConfig.field === 'created_at' 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Date
                            {sortConfig.field === 'created_at' && (
                                sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                        </button>
                        <button
                            onClick={() => handleSort('priority')}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                sortConfig.field === 'priority' 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Priority
                            {sortConfig.field === 'priority' && (
                                sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                        </button>
                        <button
                            onClick={() => handleSort('status')}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                sortConfig.field === 'status' 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Status
                            {sortConfig.field === 'status' && (
                                sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900">Filter Tickets</h4>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                >
                                    <X className="h-3 w-3" />
                                    Clear All
                                </button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="new">New</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="on_hold">On Hold</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Priority Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={filters.priority}
                                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">All Priorities</option>
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>

                            {/* Assigned Technician Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Assigned To</label>
                                <select
                                    value={filters.assigned_technician}
                                    onChange={(e) => handleFilterChange('assigned_technician', e.target.value)}
                                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">All Technicians</option>
                                    <option value="unassigned">Unassigned</option>
                                    {/* You can populate this with actual technician data */}
                                </select>
                            </div>

                            {/* Requester Filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Requester</label>
                                <select
                                    value={filters.requester}
                                    onChange={(e) => handleFilterChange('requester', e.target.value)}
                                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">All Requesters</option>
                                    {/* You can populate this with actual requester data */}
                                </select>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {hasActiveFilters && (
                            <div className="mt-4 pt-3 border-t border-gray-200">
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(filters).map(([key, value]) => {
                                        if (!value) return null;
                                        return (
                                            <span
                                                key={key}
                                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                                            >
                                                {key.replace('_', ' ')}: {value}
                                                <button
                                                    onClick={() => handleFilterChange(key, '')}
                                                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                Results Summary
                {!loading && !error && (
                    <div className="mb-4 text-sm text-gray-600">
                        Showing {allTickets.length} of {ticketsTotalCount} tickets
                        {hasActiveFilters && (
                            <span className="ml-2 text-indigo-600">
                                (filtered)
                            </span>
                        )}
                    </div>
                )}

                {loading && <p className="text-center text-gray-500">Loading tickets...</p>}
                {error && <p className="text-center text-red-500">Error loading tickets: {error}</p>}
                {!loading && !error && allTickets.length === 0 && (
                    <p className="px-6 py-4 text-center text-gray-500">
                        {hasActiveFilters ? 'No tickets match your filters.' : 'No tickets found.'}
                    </p>
                )}
                {!loading && !error && allTickets.length > 0 && (
                    <>
                        <TicketsTable tickets={allTickets} getPriorityColor={getPriorityColor} getStatusColor={getStatusColor} />
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
    );
};
