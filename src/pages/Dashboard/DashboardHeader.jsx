import React from 'react';
import logo from "../../assets/logosaas.png"; // Adjust path as necessary

export const DashboardHeader = ({ user }) => { // Accept user prop
    const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
    const userName = user?.name || 'Guest';

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <img src={logo} alt="Logo" className="h-8 w-8 mr-3" />
                        <h1 className="text-xl font-semibold text-gray-900">ITSM Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-500 hover:text-gray-700">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                            </svg>
                        </button>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">{userInitials}</span> {/* Display dynamic initials */}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{userName}</span> {/* Display dynamic name */}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
