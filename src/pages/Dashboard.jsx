import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from './Dashboard/DashboardHeader';
import { DashboardNavTabs } from './Dashboard/DashboardNavTabs';
import { OverviewTab } from './Dashboard/OverviewTab';
import { TicketsTab } from './Dashboard/TicketsTab';
import { TechniciansTab } from './Dashboard/TechniciansTab';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null); // State to store logged-in user info

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

    // Effect to load user info from localStorage
    useEffect(() => {
        const userString = localStorage.getItem('user');
        
        if (userString) {
            try {
                const userData = JSON.parse(userString);
                setLoggedInUser(userData);
                
                // Redirect to role-specific page if user is not on the correct page
                const currentPath = window.location.pathname;
                const userRole = userData.role?.toLowerCase() || 'user';
                const expectedPath = `/${userRole}`;
                
                console.log("Dashboard - Current path:", currentPath);
                console.log("Dashboard - User role:", userRole);
                console.log("Dashboard - Expected path:", expectedPath);
                
                if (currentPath !== expectedPath && currentPath !== '/dashboard') {
                    // Only redirect if not already on dashboard (allow dashboard access for all roles)
                    console.log("Dashboard - Redirecting to:", expectedPath);
                    navigate(expectedPath);
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
                // Handle legacy string format
                const legacyUser = { name: userString, role: 'User' };
                setLoggedInUser(legacyUser);
            }
        } else {
            // Optionally redirect to login if no user is found
            // navigate('/login');
        }
    }, [navigate]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className="antialiased bg-gray-50 min-h-screen">
            <DashboardHeader user={loggedInUser} /> {/* Pass loggedInUser to Header */}
            <DashboardNavTabs activeTab={activeTab} onTabChange={handleTabChange} />

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
                        overviewStats={overviewStats}
                        setOverviewStats={setOverviewStats}
                    />
                )}
            </main>
        </div>
    );
};
