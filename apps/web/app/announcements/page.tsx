'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Bell, 
  Users, 
  Send,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Mock announcements data
const mockAnnouncements = [
  {
    id: '1',
    title: 'End of Term Examinations',
    content: 'Final examinations for Term 1 will commence on 15th March 2025. All students are expected to complete their revision.',
    author: 'Head Teacher',
    audience: 'all',
    priority: 'high',
    status: 'published',
    createdAt: '2025-01-25',
    expiresAt: '2025-03-15',
    views: 1250,
  },
  {
    id: '2',
    title: 'School Fees Payment Reminder',
    content: 'Parents are reminded that the deadline for Term 1 fee payment is 31st January 2025. Late payments will attract a penalty.',
    author: 'Bursar',
    audience: 'parents',
    priority: 'high',
    status: 'published',
    createdAt: '2025-01-20',
    expiresAt: '2025-01-31',
    views: 890,
  },
  {
    id: '3',
    title: 'Sports Day Event',
    content: 'The annual sports day will be held on 22nd February 2025. Parents are welcome to attend and support their children.',
    author: 'Games Master',
    audience: 'all',
    priority: 'medium',
    status: 'published',
    createdAt: '2025-01-18',
    expiresAt: '2025-02-22',
    views: 654,
  },
  {
    id: '4',
    title: 'Teacher Training Workshop',
    content: 'All teaching staff are required to attend the digital literacy workshop scheduled for 5th February 2025 in the staff room.',
    author: 'Deputy Head',
    audience: 'teachers',
    priority: 'medium',
    status: 'draft',
    createdAt: '2025-01-28',
    expiresAt: null,
    views: 0,
  },
  {
    id: '5',
    title: 'New Library Books Arrived',
    content: 'The library has received new books for both primary and secondary sections. Students can start borrowing from Monday.',
    author: 'Librarian',
    audience: 'students',
    priority: 'low',
    status: 'published',
    createdAt: '2025-01-26',
    expiresAt: '2025-02-28',
    views: 432,
  },
];

const audiences = ['All', 'all', 'parents', 'teachers', 'students'];
const priorities = ['All', 'high', 'medium', 'low'];
const statuses = ['All', 'published', 'draft', 'archived'];

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredAnnouncements = mockAnnouncements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = selectedAudience === 'All' || announcement.audience === selectedAudience;
    const matchesPriority = selectedPriority === 'All' || announcement.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'All' || announcement.status === selectedStatus;
    return matchesSearch && matchesAudience && matchesPriority && matchesStatus;
  });

  const stats = [
    {
      title: 'Total Announcements',
      value: mockAnnouncements.length.toString(),
      icon: MessageSquare,
      change: 'This term',
      color: 'text-blue-600',
    },
    {
      title: 'Published',
      value: mockAnnouncements.filter(a => a.status === 'published').length.toString(),
      icon: CheckCircle,
      change: 'Active now',
      color: 'text-green-600',
    },
    {
      title: 'Drafts',
      value: mockAnnouncements.filter(a => a.status === 'draft').length.toString(),
      icon: Clock,
      change: 'Pending review',
      color: 'text-amber-600',
    },
    {
      title: 'Total Views',
      value: mockAnnouncements.reduce((sum, a) => sum + a.views, 0).toLocaleString(),
      icon: Eye,
      change: 'Across all',
      color: 'text-purple-600',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-[#0A1628]">Announcements</h1>
            <p className="text-gray-600">Communicate with students, parents, and staff</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="bg-[#F5A623] hover:bg-[#E0951F]">
            <Plus className="w-4 h-4 mr-2" />
            Create Announcement
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-[#0A1628]">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
              >
                {audiences.map(audience => (
                  <option key={audience} value={audience}>
                    {audience === 'All' ? 'All Audiences' : audience.charAt(0).toUpperCase() + audience.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority === 'All' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Announcements List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredAnnouncements.map((announcement) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[#0A1628]">{announcement.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                      announcement.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      announcement.status === 'published' ? 'bg-green-100 text-green-800' :
                      announcement.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{announcement.content}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="capitalize">{announcement.audience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Posted: {formatDate(announcement.createdAt)}</span>
                    </div>
                    {announcement.expiresAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Expires: {formatDate(announcement.expiresAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{announcement.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="View Details">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                  {announcement.status === 'draft' && (
                    <button className="p-2 hover:bg-green-100 rounded-lg" title="Publish">
                      <Send className="w-4 h-4 text-green-600" />
                    </button>
                  )}
                  <button className="p-2 hover:bg-red-100 rounded-lg" title="Delete">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredAnnouncements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-12 text-center"
          >
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No announcements found</h3>
            <p className="text-gray-500">Try adjusting your filters or create a new announcement</p>
          </motion.div>
        )}
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#0A1628]">Create New Announcement</h2>
              <p className="text-sm text-gray-600">Share important information with your school community</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Enter announcement title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent">
                  <option value="all">All (Students, Parents, Staff)</option>
                  <option value="parents">Parents Only</option>
                  <option value="teachers">Teachers Only</option>
                  <option value="students">Students Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows={5}
                  placeholder="Write your announcement message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-700">
                  This announcement will be sent via SMS to all selected recipients upon publishing
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Save as Draft</Button>
              <Button onClick={() => setShowCreateModal(false)} className="bg-[#F5A623] hover:bg-[#E0951F]">
                <Send className="w-4 h-4 mr-2" />
                Publish & Send SMS
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
