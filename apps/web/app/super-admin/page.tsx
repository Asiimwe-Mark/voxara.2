'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { formatUGX, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Download,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  School,
  Calendar
} from 'lucide-react';

// Mock schools data
const mockSchools = [
  {
    id: '1',
    name: 'Kampala International School',
    code: 'KIS001',
    location: 'Kampala',
    students: 1250,
    teachers: 85,
    monthlyRevenue: 45000000,
    status: 'active',
    subscriptionPlan: 'Enterprise',
    joinedDate: '2024-03-15',
  },
  {
    id: '2',
    name: 'Entebbe Parents School',
    code: 'EPS002',
    location: 'Entebbe',
    students: 680,
    teachers: 42,
    monthlyRevenue: 22000000,
    status: 'active',
    subscriptionPlan: 'Professional',
    joinedDate: '2024-06-20',
  },
  {
    id: '3',
    name: 'Jinja Progressive Academy',
    code: 'JPA003',
    location: 'Jinja',
    students: 920,
    teachers: 58,
    monthlyRevenue: 31000000,
    status: 'active',
    subscriptionPlan: 'Enterprise',
    joinedDate: '2024-08-10',
  },
  {
    id: '4',
    name: 'Mbarara Heights School',
    code: 'MHS004',
    location: 'Mbarara',
    students: 540,
    teachers: 35,
    monthlyRevenue: 18000000,
    status: 'suspended',
    subscriptionPlan: 'Basic',
    joinedDate: '2024-11-05',
  },
  {
    id: '5',
    name: 'Gulu Modern College',
    code: 'GMC005',
    location: 'Gulu',
    students: 780,
    teachers: 48,
    monthlyRevenue: 25000000,
    status: 'active',
    subscriptionPlan: 'Professional',
    joinedDate: '2025-01-12',
  },
];

const plans = ['All', 'Basic', 'Professional', 'Enterprise'];
const statuses = ['All', 'active', 'suspended', 'pending'];

export default function SuperAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredSchools = mockSchools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === 'All' || school.subscriptionPlan === selectedPlan;
    const matchesStatus = selectedStatus === 'All' || school.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const totalSchools = mockSchools.length;
  const activeSchools = mockSchools.filter(s => s.status === 'active').length;
  const totalStudents = mockSchools.reduce((sum, s) => sum + s.students, 0);
  const totalRevenue = mockSchools.reduce((sum, s) => sum + s.monthlyRevenue, 0);

  const stats = [
    {
      title: 'Total Schools',
      value: totalSchools.toString(),
      icon: Building2,
      change: '+3 this month',
      color: 'text-blue-600',
    },
    {
      title: 'Active Schools',
      value: activeSchools.toString(),
      icon: School,
      change: `${totalSchools - activeSchools} suspended`,
      color: 'text-green-600',
    },
    {
      title: 'Total Students',
      value: totalStudents.toLocaleString(),
      icon: Users,
      change: 'Across all schools',
      color: 'text-amber-600',
    },
    {
      title: 'Monthly Revenue',
      value: formatUGX(totalRevenue),
      icon: DollarSign,
      change: 'Recurring MRR',
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
            <h1 className="text-2xl font-bold text-[#0A1628]">Super Admin Dashboard</h1>
            <p className="text-gray-600">Platform-wide management and analytics</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-[#F5A623] hover:bg-[#E0951F]">
            <Plus className="w-4 h-4 mr-2" />
            Add School
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

        {/* Platform Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#0A1628] mb-4">Subscription Distribution</h2>
            <div className="space-y-4">
              {['Enterprise', 'Professional', 'Basic'].map(plan => {
                const count = mockSchools.filter(s => s.subscriptionPlan === plan).length;
                const percentage = (count / totalSchools) * 100;
                return (
                  <div key={plan}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{plan}</span>
                      <span className="text-gray-600">{count} schools</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          plan === 'Enterprise' ? 'bg-purple-600' :
                          plan === 'Professional' ? 'bg-blue-600' :
                          'bg-amber-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#0A1628] mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'New school registered', school: 'Gulu Modern College', time: '2 days ago' },
                { action: 'Payment received', school: 'Kampala International School', time: '3 days ago' },
                { action: 'School suspended', school: 'Mbarara Heights School', time: '1 week ago' },
                { action: 'Plan upgraded', school: 'Jinja Progressive Academy', time: '2 weeks ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-[#F5A623] mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0A1628]">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.school}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, code, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
              >
                {plans.map(plan => (
                  <option key={plan} value={plan}>{plan}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Schools Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#0A1628]">Registered Schools</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Teachers</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Revenue</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[#0A1628]">{school.name}</div>
                        <div className="text-sm text-gray-500">{school.code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{school.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">{school.students.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">{school.teachers.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-[#0A1628]">{formatUGX(school.monthlyRevenue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        school.subscriptionPlan === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                        school.subscriptionPlan === 'Professional' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {school.subscriptionPlan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        school.status === 'active' ? 'bg-green-100 text-green-800' :
                        school.status === 'suspended' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded" title="View Details">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded" title="Edit">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded" title="More">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSchools.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No schools found</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add School Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#0A1628]">Register New School</h2>
              <p className="text-sm text-gray-600">Add a new school to the SKULI platform</p>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-center py-8">School registration form would go here</p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={() => setShowAddModal(false)} className="bg-[#F5A623] hover:bg-[#E0951F]">
                Register School
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
