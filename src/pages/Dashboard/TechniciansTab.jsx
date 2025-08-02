import React, { useState, useEffect, useCallback } from 'react';
import techniciansApi from '../../api/technician';
import skillsApi from '../../api/skills';
import { TechniciansTable } from './TechniciansTable';
import { Pagination } from './DashboardPagination';

// Helper functions (could be moved to a utilities file if shared across many components)
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

export const TechniciansTab = ({ loading, setLoading, error, setError, overviewStats, setOverviewStats }) => {
    const [allTechnicians, setAllTechnicians] = useState([]);
    const [techniciansCurrentPage, setTechniciansCurrentPage] = useState(1);
    const [techniciansTotalCount, setTechniciansTotalCount] = useState(0);
    const techniciansLimit = 10;

    const [expandedSkills, setExpandedSkills] = useState({}); // Moved here for local state management

    const toggleSkills = (technicianId) => {
        setExpandedSkills(prev => ({
            ...prev,
            [technicianId]: !prev[technicianId]
        }));
    };

    const fetchTechnicians = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const techsResponse = await techniciansApi.getAllTechnicians({
                limit: techniciansLimit,
                offset: (techniciansCurrentPage - 1) * techniciansLimit,
                include: 'skills,user'
            });

            const rawTechniciansData = techsResponse.data?.technicians || [];

            const transformedTechnicians = await Promise.all(rawTechniciansData.map(async (tech) => {
                let fullSkillsData = [];
                if (tech.skills && tech.skills.length > 0) {
                    fullSkillsData = await Promise.all(
                        tech.skills.map(async (skillIdAndPercentage) => {
                            try {
                                const skillResponse = await skillsApi.getSkillById(skillIdAndPercentage.id);
                                const skillDetails = skillResponse.data || skillResponse;
                                return {
                                    id: skillDetails.id,
                                    name: skillDetails.name,
                                    percentage: skillIdAndPercentage.percentage
                                };
                            } catch (skillErr) {
                                console.warn(`Failed to fetch skill ${skillIdAndPercentage.id} for technician ${tech.id}:`, skillErr);
                                return {
                                    id: skillIdAndPercentage.id,
                                    name: `Skill ID ${skillIdAndPercentage.id} (Name N/A)`,
                                    percentage: skillIdAndPercentage.percentage
                                };
                            }
                        })
                    );
                }

                return {
                    id: tech.id,
                    name: tech.user?.name || tech.name,
                    role: tech.user?.department || tech.specialization || 'IT Technician',
                    avatar: (tech.user?.name || tech.name)?.split(' ').map(n => n[0]).join('').toUpperCase() || '??',
                    skills: fullSkillsData,
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
                };
            }));

            setAllTechnicians(transformedTechnicians);
            setTechniciansTotalCount(techsResponse.data?.pagination?.total || techsResponse.data?.total || techsResponse.total || 0);

            // Update overview stats relevant to technicians tab
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
                totalTechniciansOverview: techsResponse.data?.pagination?.total || techsResponse.data?.total || techsResponse.total || 0,
                availableTechsOverview: availableTechs,
                totalTicketsResolvedOverall: totalTicketsResolvedByAllTechnicians,
                avgTechnicianRating: avgRating
            }));

        } catch (err) {
            console.error("Failed to fetch technicians:", err.response?.data || err.message);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [techniciansCurrentPage, techniciansLimit, setLoading, setError, setOverviewStats]); // Dependencies for useCallback

    useEffect(() => {
        fetchTechnicians();
    }, [fetchTechnicians]); // Only re-run when fetchTechnicians changes

    const handleTechniciansPageChange = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(techniciansTotalCount / techniciansLimit)) {
            setTechniciansCurrentPage(newPage);
        }
    };

    return (
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
                    {error && <p className="text-center text-red-500 py-4">Error loading technicians: {error}</p>}
                    {!loading && !error && allTechnicians.length === 0 ? (
                        <p className="px-6 py-4 text-center text-gray-500">No technicians found.</p>
                    ) : (
                        <>
                            <TechniciansTable technicians={allTechnicians} getTechnicianAvailabilityColor={getTechnicianAvailabilityColor} />
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
    );
};
