import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ticketsApi from '../../api/tickets';
import techniciansApi from '../../api/technician';
import { TicketsTable } from './TicketsTable'; // Import reusable table component

// Helper functions (could be moved to a utilities file if shared across many components)
//
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


export const OverviewTab = ({ loading, setLoading, error, setError, overviewStats, setOverviewStats, recentTickets, setRecentTickets }) => {

    const fetchOverviewData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const allTicketsResponse = await ticketsApi.getAllTicketsSimple();
            const totalTicketsCount = allTicketsResponse.data?.total || allTicketsResponse.total || allTicketsResponse.data?.length || 0;

            let openTicketsCount = 0;
            const openStatuses = ['new', 'assigned', 'in_progress', 'on_hold'];
            for (const status of openStatuses) {
                const response = await ticketsApi.getAllTickets({ status: status });
                openTicketsCount += response.data?.total || response.total || response.data?.tickets?.length || 0;
            }

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
                resolvedTodayCount += response.data?.total || response.total || response.data?.tickets?.length || 0;
            }

            const allTechniciansOverviewResponse = await techniciansApi.getAllTechniciansSimple();
            const totalTechniciansCountOverview = allTechniciansOverviewResponse.data?.pagination?.total || allTechniciansOverviewResponse.data?.total || allTechniciansOverviewResponse.total || 0;

            const availableTechniciansResponse = await techniciansApi.getAllTechniciansSimple();
            const availableTechsArray = availableTechniciansResponse.data?.technicians || availableTechniciansResponse.data || [];
            const availableTechsCount = availableTechsArray.filter(tech =>
                tech.status === 'online' || tech.availability_status === 'available'
            ).length;

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
                avgResponseTime: 'N/A' // Still a placeholder
            }));

        } catch (err) {
            console.error("Failed to fetch overview data:", err.response?.data || err.message);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setOverviewStats, setRecentTickets]); // Dependencies for useCallback

    useEffect(() => {
        fetchOverviewData();
    }, [fetchOverviewData]); // Only re-run when fetchOverviewData changes (which is rare due to useCallback)


    return (
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
                    {error && <p className="text-center text-red-500">Error loading recent tickets: {error}</p>}
                    {!loading && !error && recentTickets.length === 0 && (
                        <p className="text-center text-gray-500">No recent tickets found.</p>
                    )}
                    {!loading && !error && recentTickets.length > 0 && (
                        <TicketsTable tickets={recentTickets} getPriorityColor={getPriorityColor} getStatusColor={getStatusColor} />
                    )}
                </div>
            </div>
        </div>
    );
};
