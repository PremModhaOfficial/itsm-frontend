import React, { useState, useEffect, useCallback } from 'react';
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

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const ticketsResponse = await ticketsApi.getAllTickets({
                limit: ticketsLimit,
                offset: (ticketsCurrentPage - 1) * ticketsLimit,
                include: 'requester,assigned_technician'
            });
            setAllTickets(ticketsResponse.data?.tickets || []);
            setTicketsTotalCount(ticketsResponse.data?.pagination?.total || ticketsResponse.data?.total || ticketsResponse.total || 0);
        } catch (err) {
            console.error("Failed to fetch tickets:", err.response?.data || err.message);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [ticketsCurrentPage, ticketsLimit, setLoading, setError]); // Dependencies for useCallback

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]); // Only re-run when fetchTickets changes

    const handleTicketsPageChange = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(ticketsTotalCount / ticketsLimit)) {
            setTicketsCurrentPage(newPage);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">All Tickets</h3>
                {loading && <p className="text-center text-gray-500">Loading tickets...</p>}
                {error && <p className="text-center text-red-500">Error loading tickets: {error}</p>}
                {!loading && !error && allTickets.length === 0 && (
                    <p className="px-6 py-4 text-center text-gray-500">No tickets found.</p>
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
