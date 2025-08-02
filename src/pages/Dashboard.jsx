import React, { useState, useEffect } from 'react';
import { DashboardHeader } from './Dashboard/DashboardHeader';
import { DashboardNavTabs } from './Dashboard/DashboardNavTabs';
import { OverviewTab } from './Dashboard/OverviewTab';
import { TicketsTab } from './Dashboard/TicketsTab';
import { TechniciansTab } from './Dashboard/TechniciansTab';

export const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true); // Shared loading state
    const [error, setError] = useState(null);   // Shared error state

    // States that might be needed across tabs (like overview stats)
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
    const [recentTickets, setRecentTickets] = useState([]);


    // This handles tab changes. Note: Individual tab components will manage their own pagination state (currentPage).
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        // No need to reset currentPage here explicitly.
        // When a new tab component is mounted, its useEffect will run,
        // fetching data for its initial currentPage (defaulting to 1).
    };

    return (
        <div className="antialiased bg-gray-50 min-h-screen">
            <DashboardHeader />
            <DashboardNavTabs activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {activeTab === 'overview' && (
                    <OverviewTab
                        loading={loading}
                        setLoading={setLoading}
                        error={error}
                        setError={setError}
                        overviewStats={overviewStats}
                        setOverviewStats={setOverviewStats}
                        recentTickets={recentTickets}
                        setRecentTickets={setRecentTickets}
                    />
                )}

                {activeTab === 'tickets' && (
                    <TicketsTab
                        loading={loading}
                        setLoading={setLoading}
                        error={error}
                        setError={setError}
                    />
                )}

                {activeTab === 'technicians' && (
                    <TechniciansTab
                        loading={loading}
                        setLoading={setLoading}
                        error={error}
                        setError={setError}
                        overviewStats={overviewStats} // Pass overviewStats and its setter to update from within TechniciansTab
                        setOverviewStats={setOverviewStats}
                    />
                )}

                {/* Removed 'Reports' tab content */}
            </main>
        </div>
    );
};
