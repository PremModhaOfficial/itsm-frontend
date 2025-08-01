import React from "react";
import { motion } from "framer-motion";
import Tag from "../components/Tag";

export const TechAutomation = () => {
  return (
    <div className="antialiased bg-[#EAEEFE]">
      {/* Hero Section */}
      <section className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183ec2,#eaeefe_100%)] overflow-x-clip justify-items-center">
        <div className="container">
          <div className="md:flex items-center">
            <div className="md:w-[478px]">
              <div className="tag">Auto Maintenance Automation</div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tigher bg-gradient-to-b from-black to-[#001e80] text-transparent bg-clip-text mt-6">
                Intelligent Ticket Assignment & Technician Evaluation
              </h1>
              <p className="text-xl text-[#010d3e] tracking-tight mt-6">
                Automated system for intelligent ticket assignment based on technician skills, workload, and performance scoring. Optimize your auto maintenance operations with data-driven insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Automated Ticket Assignment Section */}
      <section className="py-24 bg-white justify-items-center">
        <div className="container">
          <div className="section-heading">
            <div className="flex justify-center">
              <Tag>Assignment Engine</Tag>
            </div>
            <h2 className="section-title mt-5">Automated Ticket Assignment Logic</h2>
            <p className="section-description mt-5">
              Intelligent ticket routing based on technician capabilities, current workload, and ticket priority metrics.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Assignment Factors */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">⚙️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Assignment Engine</h3>
              </div>
              <p className="text-gray-600">
                Core assignment logic processes technician skills, availability, and ticket metadata to optimize workload distribution.
              </p>
            </div>

            {/* Technician Skills */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">🔧</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Skill Matching</h3>
              </div>
              <p className="text-gray-600">
                Match tickets to technicians based on specialized skills, certifications, and historical performance in specific categories.
              </p>
            </div>

            {/* Workload Balancing */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">⚖️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Workload Optimization</h3>
              </div>
              <p className="text-gray-600">
                Real-time workload monitoring ensures balanced ticket distribution and prevents technician overload.
              </p>
            </div>

            {/* Priority Handling */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl">🚨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Priority Processing</h3>
              </div>
              <p className="text-gray-600">
                High-priority tickets automatically routed to available technicians with appropriate skill sets and capacity.
              </p>
            </div>

            {/* Availability Tracking */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Availability Management</h3>
              </div>
              <p className="text-gray-600">
                Track technician availability, shift schedules, and current assignments to optimize ticket routing.
              </p>
            </div>

            {/* Assignment Rules */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Assignment Rules</h3>
              </div>
              <p className="text-gray-600">
                Configurable rules engine allows customization of assignment criteria based on business requirements and SLAs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technician Evaluation & Scoring Section */}
      <section className="py-24 bg-gray-50 justify-items-center">
        <div className="container">
          <div className="section-heading">
            <div className="flex justify-center">
              <Tag>Scoring Engine</Tag>
            </div>
            <h2 className="section-title mt-5">Technician Evaluation & Performance Scoring</h2>
            <p className="section-description mt-5">
              Comprehensive performance evaluation using the TechnicianScore model with weighted metrics and real-time scoring.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Scoring Model */}
            <div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">TechnicianScore Model</h3>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Performance Factors</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Ticket severity and urgency handling
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Resolution time efficiency
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Customer satisfaction impact
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      SLA compliance rate
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Weighted Scoring Logic</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p><strong>Resolution Time:</strong> 30% weight</p>
                    <p><strong>Customer Impact:</strong> 25% weight</p>
                    <p><strong>SLA Compliance:</strong> 20% weight</p>
                    <p><strong>Ticket Complexity:</strong> 15% weight</p>
                    <p><strong>Quality Score:</strong> 10% weight</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scoring Example */}
            <div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">Scoring Example</h3>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Sample Technician Score</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Resolution Time</span>
                    <span className="font-semibold text-green-600">92/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Customer Impact</span>
                    <span className="font-semibold text-blue-600">88/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">SLA Compliance</span>
                    <span className="font-semibold text-purple-600">95/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ticket Complexity</span>
                    <span className="font-semibold text-orange-600">85/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quality Score</span>
                    <span className="font-semibold text-indigo-600">90/100</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900">Overall Score</span>
                    <span className="text-green-600">89.2/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Insights & Analytics Dashboard Section */}
      <section className="py-24 bg-white justify-items-center">
        <div className="container">
          <div className="section-heading">
            <div className="flex justify-center">
              <Tag>Admin Analytics</Tag>
            </div>
            <h2 className="section-title mt-5">Admin Insights & Analytics Dashboard</h2>
            <p className="section-description mt-5">
              Comprehensive analytics and insights powered by AdminAnalyticsModule for data-driven decision making.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Resolution Quality */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Resolution Quality</h3>
              </div>
              <p className="text-gray-600">
                Track resolution quality metrics, customer satisfaction scores, and first-time fix rates across all technicians.
              </p>
            </div>

            {/* SLA Breaches */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl">⏰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">SLA Breaches</h3>
              </div>
              <p className="text-gray-600">
                Monitor SLA compliance, identify breach patterns, and implement preventive measures to maintain service standards.
              </p>
            </div>

            {/* Performance Trends */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Performance Trends</h3>
              </div>
              <p className="text-gray-600">
                Analyze performance trends over time, identify improvement areas, and track technician development progress.
              </p>
            </div>

            {/* Category Breakdown */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">🏷️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Category Breakdown</h3>
              </div>
              <p className="text-gray-600">
                Detailed breakdown of technician performance by ticket category, skill specialization, and workload distribution.
              </p>
            </div>

            {/* High-Severity Response */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">🚨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">High-Severity Response</h3>
              </div>
              <p className="text-gray-600">
                Monitor response times and resolution efficiency for high-priority and critical severity tickets.
              </p>
            </div>

            {/* Technician Performance */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Technician Performance</h3>
              </div>
              <p className="text-gray-600">
                Individual technician performance metrics, skill assessments, and capacity utilization analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section className="py-24 bg-gray-50 justify-items-center">
        <div className="container">
          <div className="section-heading">
            <div className="flex justify-center">
              <Tag>Architecture</Tag>
            </div>
            <h2 className="section-title mt-5">System Architecture Overview</h2>
            <p className="section-description mt-5">
              Integrated system components working together to provide intelligent ticket assignment and performance evaluation.
            </p>
          </div>

          <div className="mt-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Background Queue */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 text-2xl">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Background Assignment Queue</h3>
                  <p className="text-sm text-gray-600">
                    Processes incoming tickets and applies assignment logic based on technician availability and skills.
                  </p>
                </div>

                {/* Assignment Engine */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl">⚙️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignment Engine</h3>
                  <p className="text-sm text-gray-600">
                    Core logic engine that matches tickets to technicians using skill-based algorithms and workload balancing.
                  </p>
                </div>

                {/* Scoring Engine */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 text-2xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Scoring Engine</h3>
                  <p className="text-sm text-gray-600">
                    TechnicianScore model evaluates performance using weighted metrics and real-time data analysis.
                  </p>
                </div>

                {/* Analytics Pipeline */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-600 text-2xl">📈</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Pipeline</h3>
                  <p className="text-sm text-gray-600">
                    AdminAnalyticsModule collects and processes data for insights, reporting, and performance optimization.
                  </p>
                </div>
              </div>

              {/* API Services */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Key Services & APIs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Assignment API</h4>
                    <p className="text-sm text-gray-600">REST endpoints for ticket assignment and technician management</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Scoring API</h4>
                    <p className="text-sm text-gray-600">Performance evaluation and scoring calculation services</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Analytics API</h4>
                    <p className="text-sm text-gray-600">Data collection and reporting services for admin insights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center justify-items-center">
        <div className="container">
          <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#f87bff,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
            <img src="/src/assets/logosaas.png" height={40} alt="SaaS logo" className="relative" />
          </div>

          <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
            <a href="#" className="hover:text-white transition-all">About</a>
            <a href="#" className="hover:text-white transition-all">Features</a>
            <a href="#" className="hover:text-white transition-all">Customers</a>
            <a href="#" className="hover:text-white transition-all">Pricing</a>
            <a href="#" className="hover:text-white transition-all">Help</a>
            <a href="#" className="hover:text-white transition-all">Careers</a>
          </nav>

          <p className="mt-6">
            &copy; 2025 Auto Maintenance Automation System, All rights reserved.
            <br />
            <span className="text-sm">
              Intelligent ticket assignment and technician evaluation platform
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}; 