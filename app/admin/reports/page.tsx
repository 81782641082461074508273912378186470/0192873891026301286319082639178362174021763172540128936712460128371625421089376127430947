'use client';

import React, { useState, useEffect } from 'react';
import { MdBugReport, MdRefresh, MdFilterList } from 'react-icons/md';
import { FaLightbulb } from 'react-icons/fa';
import { BiSupport } from 'react-icons/bi';

interface Report {
  _id: string;
  reportId: string;
  type: 'bug' | 'feature' | 'support';
  description: string;
  systemInfo: {
    platform: string;
    appVersion: string;
    timestamp: string;
  };
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const ReportsAdmin = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: '',
    status: '',
    priority: '',
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const typeIcons = {
    bug: MdBugReport,
    feature: FaLightbulb,
    support: BiSupport,
  };

  const typeColors = {
    bug: 'text-red-500',
    feature: 'text-blue-500',
    support: 'text-green-500',
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-500',
    in_progress: 'bg-blue-500/20 text-blue-500',
    resolved: 'bg-green-500/20 text-green-500',
    closed: 'bg-gray-500/20 text-gray-500',
  };

  const priorityColors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-orange-500',
    urgent: 'text-red-500',
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filter.type) queryParams.append('type', filter.type);
      if (filter.status) queryParams.append('status', filter.status);
      if (filter.priority) queryParams.append('priority', filter.priority);

      const response = await fetch(`/api/reports?${queryParams}`);
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (reportId: string, updates: Partial<Report>) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId, ...updates }),
      });

      if (response.ok) {
        fetchReports();
        setSelectedReport(null);
        setAdminNotes('');
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const formatDate = (dateString: string) => {
    return (
      new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <MdBugReport className="text-blue-500" />
              Reports Admin
            </h1>
            <p className="text-gray-400 mt-2">Manage user reports and support requests</p>
          </div>
          <button
            onClick={fetchReports}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors">
            <MdRefresh className="text-lg" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MdFilterList className="text-gray-400" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option value="">All Types</option>
              <option value="bug">Bug Reports</option>
              <option value="feature">Feature Requests</option>
              <option value="support">Support</option>
            </select>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filter.priority}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center">
              <MdBugReport className="text-4xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No reports found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Report ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {reports.map((report) => {
                    const TypeIcon = typeIcons[report.type];
                    return (
                      <tr key={report._id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{report.reportId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <TypeIcon className={`text-lg ${typeColors[report.type]}`} />
                            <span className="text-sm capitalize">{report.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              statusColors[report.status]
                            }`}>
                            {report.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm capitalize ${priorityColors[report.priority]}`}>
                            {report.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(report.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => {
                              setSelectedReport(report);
                              setAdminNotes(report.adminNotes || '');
                            }}
                            className="text-blue-500 hover:text-blue-400 mr-4">
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Report Details</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Report ID
                    </label>
                    <p className="text-white">{selectedReport.reportId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                    <p className="text-white capitalize">{selectedReport.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select
                      value={selectedReport.status}
                      onChange={(e) =>
                        setSelectedReport({
                          ...selectedReport,
                          status: e.target.value as Report['status'],
                        })
                      }
                      className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                    <select
                      value={selectedReport.priority}
                      onChange={(e) =>
                        setSelectedReport({
                          ...selectedReport,
                          priority: e.target.value as Report['priority'],
                        })
                      }
                      className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <p className="text-white bg-gray-700 rounded p-3 whitespace-pre-wrap">
                    {selectedReport.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    System Information
                  </label>
                  <div className="bg-gray-700 rounded p-3 text-sm">
                    <p>Platform: {selectedReport.systemInfo.platform}</p>
                    <p>App Version: {selectedReport.systemInfo.appVersion}</p>
                    <p>Timestamp: {formatDate(selectedReport.systemInfo.timestamp)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add admin notes..."
                    className="w-full h-32 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      updateReport(selectedReport.reportId, {
                        status: selectedReport.status,
                        priority: selectedReport.priority,
                        adminNotes: adminNotes,
                      })
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Update Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsAdmin;
