'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { formatUGX, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Download,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

// Mock payroll data
const mockPayroll = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Mukasa',
    role: 'Senior Teacher',
    department: 'Sciences',
    basicSalary: 1500000,
    allowances: 300000,
    deductions: 150000,
    netSalary: 1650000,
    status: 'paid',
    paymentDate: '2025-01-28',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Sarah Nakato',
    role: 'Head Teacher',
    department: 'Administration',
    basicSalary: 2500000,
    allowances: 500000,
    deductions: 250000,
    netSalary: 2750000,
    status: 'pending',
    paymentDate: null,
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'David Okello',
    role: 'Bursar',
    department: 'Finance',
    basicSalary: 1800000,
    allowances: 400000,
    deductions: 180000,
    netSalary: 2020000,
    status: 'paid',
    paymentDate: '2025-01-28',
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'Grace Akello',
    role: 'Teacher',
    department: 'Arts',
    basicSalary: 1200000,
    allowances: 200000,
    deductions: 120000,
    netSalary: 1280000,
    status: 'processing',
    paymentDate: null,
  },
];

const departments = ['All', 'Sciences', 'Arts', 'Administration', 'Finance', 'Support Staff'];
const statuses = ['All', 'paid', 'pending', 'processing'];

export default function PayrollPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredPayroll = mockPayroll.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || employee.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalPayroll = mockPayroll.reduce((sum, emp) => sum + emp.netSalary, 0);
  const paidAmount = mockPayroll.filter(e => e.status === 'paid').reduce((sum, emp) => sum + emp.netSalary, 0);
  const pendingAmount = mockPayroll.filter(e => e.status !== 'paid').reduce((sum, emp) => sum + emp.netSalary, 0);

  const stats = [
    {
      title: 'Total Employees',
      value: mockPayroll.length.toString(),
      icon: Users,
      change: '+2 this month',
      color: 'text-blue-600',
    },
    {
      title: 'Total Payroll',
      value: formatUGX(totalPayroll),
      icon: DollarSign,
      change: 'Monthly',
      color: 'text-amber-600',
    },
    {
      title: 'Paid This Month',
      value: formatUGX(paidAmount),
      icon: CreditCard,
      change: `${mockPayroll.filter(e => e.status === 'paid').length} employees`,
      color: 'text-green-600',
    },
    {
      title: 'Pending Payments',
      value: formatUGX(pendingAmount),
      icon: TrendingUp,
      change: `${mockPayroll.filter(e => e.status !== 'paid').length} employees`,
      color: 'text-orange-600',
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
            <h1 className="text-2xl font-bold text-[#0A1628]">Payroll Management</h1>
            <p className="text-gray-600">Manage employee salaries and payments</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-[#F5A623] hover:bg-[#E0951F]">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
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
                placeholder="Search by name or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
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

        {/* Payroll Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#0A1628]">Employee Salaries</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Payslips
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayroll.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[#0A1628]">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">{formatUGX(employee.basicSalary)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">+{formatUGX(employee.allowances)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">-{formatUGX(employee.deductions)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0A1628]">{formatUGX(employee.netSalary)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === 'paid' ? 'bg-green-100 text-green-800' :
                        employee.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
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
          {filteredPayroll.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No employees found</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Employee Modal */}
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
              <h2 className="text-xl font-bold text-[#0A1628]">Add New Employee</h2>
              <p className="text-sm text-gray-600">Enter employee details and salary information</p>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-center py-8">Employee registration form would go here</p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={() => setShowAddModal(false)} className="bg-[#F5A623] hover:bg-[#E0951F]">
                Save Employee
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
