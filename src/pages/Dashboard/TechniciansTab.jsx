import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, Filter, X } from 'lucide-react';
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
    
    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        skill_level: '',
        availability_status: '',
        specialization: '',
        department: ''
    });
    const [sortConfig, setSortConfig] = useState({
        field: 'name',
        direction: 'asc'
    });

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
            // Build query parameters
            const queryParams = {
                limit: techniciansLimit,
                offset: (techniciansCurrentPage - 1) * techniciansLimit,
                include: 'skills,user'
            };

            // Add filters
            if (filters.skill_level) queryParams.skill_level = filters.skill_level;
            if (filters.availability_status) queryParams.availability_status = filters.availability_status;
            if (filters.specialization) queryParams.specialization = filters.specialization;
            if (filters.department) queryParams.department = filters.department;

            // Add sorting
            if (sortConfig.field) {
                queryParams.sort_by = sortConfig.field;
                queryParams.sort_order = sortConfig.direction;
            }

            const techsResponse = await techniciansApi.getAllTechnicians(queryParams);

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
    }, [techniciansCurrentPage, techniciansLimit, filters, sortConfig, setLoading, setError, setOverviewStats]); // Dependencies for useCallback

    useEffect(() => {
        fetchTechnicians();
    }, [fetchTechnicians]); // Only re-run when fetchTechnicians changes

    const handleTechniciansPageChange = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(techniciansTotalCount / techniciansLimit)) {
            setTechniciansCurrentPage(newPage);
        }
    };

    // Filter and sort handlers
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setTechniciansCurrentPage(1); // Reset to first page when filtering
    };

    const handleSort = (field) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        setTechniciansCurrentPage(1); // Reset to first page when sorting
    };

    const clearFilters = () => {
        setFilters({
            skill_level: '',
            availability_status: '',
            specialization: '',
            department: ''
        });
        setTechniciansCurrentPage(1);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="space-y-6">
            {/* Stats Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
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

                </div>
            </div>

            {/* Technicians Table */}
            <div className="flex justify-center">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-7xl">
                    {/* Header with Filter Toggle */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">All Technicians</h3>
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
                                    onClick={() => handleSort('name')}
                                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        sortConfig.field === 'name' 
                                            ? 'bg-indigo-100 text-indigo-700' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Name
                                    {sortConfig.field === 'name' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleSort('skill_level')}
                                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        sortConfig.field === 'skill_level' 
                                            ? 'bg-indigo-100 text-indigo-700' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Experience
                                    {sortConfig.field === 'skill_level' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleSort('availability_status')}
                                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        sortConfig.field === 'availability_status' 
                                            ? 'bg-indigo-100 text-indigo-700' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Status
                                    {sortConfig.field === 'availability_status' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                    )}
                                </button>
                                {/* <button
                                    onClick={() => handleSort('assigned_tickets_total')}
                                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        sortConfig.field === 'assigned_tickets_total' 
                                            ? 'bg-indigo-100 text-indigo-700' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Tickets
                                    {sortConfig.field === 'assigned_tickets_total' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                    )}
                                </button> */}
                            </div>
                        </div>

                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-medium text-gray-900">Filter Technicians</h4>
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
                                    {/* Skill Level Filter */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Experience Level</label>
                                        <select
                                            value={filters.skill_level}
                                            onChange={(e) => handleFilterChange('skill_level', e.target.value)}
                                            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">All Levels</option>
                                            <option value="junior">Junior (1-3 years)</option>
                                            <option value="mid">Mid-Level (4-7 years)</option>
                                            <option value="senior">Senior (8+ years)</option>
                                            <option value="expert">Expert (10+ years)</option>
                                        </select>
                                    </div>

                                    {/* Availability Status Filter */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Availability</label>
                                        <select
                                            value={filters.availability_status}
                                            onChange={(e) => handleFilterChange('availability_status', e.target.value)}
                                            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="available">Available</option>
                                            <option value="busy">Busy</option>
                                            <option value="in_meeting">In Meeting</option>
                                            <option value="on_break">On Break</option>
                                            <option value="focus_mode">Focus Mode</option>
                                            <option value="end_of_shift">End of Shift</option>
                                        </select>
                                    </div>

                                    {/* Specialization Filter */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Specialization</label>
                                        <select
                                            value={filters.specialization}
                                            onChange={(e) => handleFilterChange('specialization', e.target.value)}
                                            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">All Specializations</option>
                                            <option value="Infrastructure">Infrastructure</option>
                                            <option value="Network">Network</option>
                                            <option value="Security">Security</option>
                                            <option value="Software">Software</option>
                                            <option value="Database">Database</option>
                                            <option value="Cloud">Cloud</option>
                                        </select>
                                    </div>

                                    {/* Department Filter */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                                        <select
                                            value={filters.department}
                                            onChange={(e) => handleFilterChange('department', e.target.value)}
                                            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">All Departments</option>
                                            <option value="IT Support">IT Support</option>
                                            <option value="Network Administration">Network Administration</option>
                                            <option value="Database Administration">Database Administration</option>
                                            <option value="Security">Security</option>
                                            <option value="Infrastructure">Infrastructure</option>
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

                        {/* Results Summary */}
                        {!loading && !error && (
                            <div className="mt-4 text-sm text-gray-600">
                                Showing {allTechnicians.length} of {techniciansTotalCount} technicians
                                {hasActiveFilters && (
                                    <span className="ml-2 text-indigo-600">
                                        (filtered)
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Table Content */}
                    <div className="px-6 py-4">
                        {loading && <p className="text-center text-gray-500 py-4">Loading technicians...</p>}
                        {error && <p className="text-center text-red-500 py-4">Error loading technicians: {error}</p>}
                        {!loading && !error && allTechnicians.length === 0 ? (
                            <p className="px-6 py-4 text-center text-gray-500">
                                {hasActiveFilters ? 'No technicians match your filters.' : 'No technicians found.'}
                            </p>
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
        </div>
    );
};
