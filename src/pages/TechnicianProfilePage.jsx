import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Star,
  Clock,
  Activity,
  Calendar,
  CheckCircle,
  User,
  TrendingUp,
} from 'lucide-react';
import Button from '../components/Button';
import Avatar from '../components/Avatar';

export const TechnicianProfilePage = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);

  // Mock data based on the Sequelize schema
  const technician = {
    id: parseInt(id),
    name: "Sarah Johnson",
    user_id: 101,
    assigned_tickets_total: 8,
    assigned_tickets: [1, 2, 3, 4, 5, 6, 7, 8],
    skills: [
      { id: 1, name: "Network Troubleshooting", percentage: 95 },
      { id: 2, name: "Hardware Repair", percentage: 88 },
      { id: 3, name: "Software Installation", percentage: 92 },
      { id: 4, name: "System Administration", percentage: 85 },
      { id: 5, name: "Cloud Services", percentage: 78 },
      { id: 6, name: "Security Protocols", percentage: 90 },
      { id: 7, name: "Database Management", percentage: 82 }
    ],
    workload: 75,
    availability_status: "available",
    skill_level: "senior",
    specialization: "Network Infrastructure & Security",
    is_active: true,
    created_at: "2023-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z"
  };

  useEffect(() => {
    setEditForm({
      name: technician.name,
      specialization: technician.specialization,
      availability_status: technician.availability_status,
      skill_level: technician.skill_level
    });
  }, [technician]);

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-red-100 text-red-800',
      in_meeting: 'bg-blue-100 text-blue-800',
      on_break: 'bg-yellow-100 text-yellow-800',
      end_of_shift: 'bg-gray-100 text-gray-800',
      focus_mode: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSkillLevelColor = (level) => {
    const colors = {
      junior: 'bg-blue-100 text-blue-800',
      mid: 'bg-green-100 text-green-800',
      senior: 'bg-purple-100 text-purple-800',
      expert: 'bg-orange-100 text-orange-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getWorkloadColor = (workload) => {
    if (workload >= 80) return 'text-red-600';
    if (workload >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getWorkloadBarColor = (workload) => {
    if (workload >= 80) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (workload >= 60) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-green-500 to-green-600';
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving changes:', editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: technician.name,
      specialization: technician.specialization,
      availability_status: technician.availability_status,
      skill_level: technician.skill_level
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewPerformance = () => {
    // Navigate to the performance page
    window.location.href = `/technician/${id}/performance`;
  };

  const handleExportReport = () => {
    // Create a comprehensive report for export
    const reportData = {
      technician: {
        name: technician.name,
        id: technician.id,
        user_id: technician.user_id,
        specialization: technician.specialization,
        skill_level: technician.skill_level,
        availability_status: technician.availability_status,
        workload: technician.workload,
        assigned_tickets_total: technician.assigned_tickets_total,
        active_tickets: technician.assigned_tickets.length,
        skills: technician.skills,
        created_at: technician.created_at,
        updated_at: technician.updated_at
      },
      metrics: {
        averageSkillLevel: (technician.skills.reduce((sum, skill) => sum + skill.percentage, 0) / technician.skills.length).toFixed(1),
        highLevelSkills: technician.skills.filter(skill => skill.percentage >= 80).length,
        workloadStatus: technician.workload >= 80 ? 'High' : technician.workload >= 60 ? 'Moderate' : 'Optimal'
      }
    };

    // Create downloadable JSON file
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${technician.name.replace(/\s+/g, '_')}_performance_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('Performance report exported:', reportData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:scale-105"
              >
                <ArrowLeft size={20} />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gradient-to-b from-gray-300 to-transparent"></div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Technician Profile
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Save size={16} />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    className="flex items-center gap-2 hover:bg-gray-100 transition-all duration-200"
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Edit size={16} />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start gap-8">
                <div className="relative">
                  <Avatar className="size-32 ring-4 ring-white/50 shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl">
                      {technician.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </Avatar>
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${getStatusColor(technician.availability_status).replace('bg-', 'bg-').replace('text-', '')}`}></div>
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                        <input
                          type="text"
                          name="specialization"
                          value={editForm.specialization}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
                        {technician.name}
                      </h2>
                      <p className="text-lg text-gray-600 mb-6 font-medium">{technician.specialization}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getStatusColor(technician.availability_status)}`}>
                          {technician.availability_status.replace('_', ' ')}
                        </span>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getSkillLevelColor(technician.skill_level)}`}>
                          {technician.skill_level}
                        </span>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${technician.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {technician.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Star size={16} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Skills & Expertise
                  </h3>
                </div>
                <Button
                  onClick={handleViewPerformance}
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white border-0 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                >
                  <TrendingUp size={18} className="animate-pulse" />
                  View Performance
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {technician.skills.map((skill) => (
                  <div key={skill.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-200 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors duration-200">{skill.name}</span>
                      <span className="text-lg font-bold text-blue-600">{skill.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-2">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out"
                        style={{ width: `${skill.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {skill.percentage >= 90 ? 'Expert Level' : 
                       skill.percentage >= 80 ? 'Advanced Level' : 
                       skill.percentage >= 70 ? 'Intermediate Level' : 'Beginner Level'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Current Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Activity size={16} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Current Stats
                </h3>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Workload</span>
                    <span className={`text-lg font-bold ${getWorkloadColor(technician.workload)}`}>
                      {technician.workload}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ease-out ${getWorkloadBarColor(technician.workload)}`}
                      style={{ width: `${technician.workload}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {technician.workload >= 80 ? 'High workload - Consider redistributing' : 
                     technician.workload >= 60 ? 'Moderate workload' : 'Optimal workload'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 text-center">
                    <div className="text-2xl font-bold text-blue-600">{technician.assigned_tickets_total}</div>
                    <div className="text-sm text-gray-600">Assigned Tickets</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100 text-center">
                    <div className="text-2xl font-bold text-green-600">{technician.skills.length}</div>
                    <div className="text-sm text-gray-600">Skills</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-purple-600" />
                    <div>
                      <div className="text-sm font-semibold text-gray-700">Member Since</div>
                      <div className="font-medium text-gray-900">
                        {new Date(technician.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg flex items-center justify-center">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Profile Details
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-blue-600" />
                    <div>
                      <div className="text-xs font-semibold text-gray-700">User ID</div>
                      <div className="text-sm font-medium text-gray-900">#{technician.user_id}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-green-600" />
                    <div>
                      <div className="text-xs font-semibold text-gray-700">Last Updated</div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(technician.updated_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600" />
                    <div>
                      <div className="text-xs font-semibold text-gray-700">Profile Status</div>
                      <div className="text-sm font-medium text-gray-900">
                        {technician.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Tickets - Full Screen Width */}
        <div className="mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6 w-full">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Assigned Tickets
                  </h3>
                  <p className="text-gray-600 font-medium">Total: {technician.assigned_tickets_total} tickets</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full text-sm font-semibold shadow-md">
                  Active: {technician.assigned_tickets.length}
                </div>
                <div className="bg-blue-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold shadow-md">
                  Completed: 0
                </div>
                <div className="bg-orange-100 text-orange-700 px-6 py-3 rounded-full text-sm font-semibold shadow-md">
                  Pending: 2
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {technician.assigned_tickets.map((ticketId) => (
                <div key={ticketId} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                      <div>
                        <span className="font-semibold text-gray-900 text-lg">Ticket #{ticketId}</span>
                        <div className="text-sm text-gray-600 mt-1">
                          Network connectivity issue - Priority: Medium
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                        In Progress
                      </span>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Created</div>
                        <div className="text-sm font-medium text-gray-900">2h ago</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Due</div>
                        <div className="text-sm font-medium text-gray-900">6h</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>Category: Network</span>
                      <span>•</span>
                      <span>Assigned: Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Medium Priority</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {technician.assigned_tickets.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl font-medium">No tickets currently assigned</p>
                <p className="text-gray-400 text-sm mt-2">This technician has no active tickets at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};





