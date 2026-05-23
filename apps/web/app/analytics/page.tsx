'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { formatUGX, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  School,
  CreditCard,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Mock analytics data
const revenueData = [
  { month: 'Aug', revenue: 125000000, expenses: 85000000 },
  { month: 'Sep', revenue: 142000000, expenses: 92000000 },
  { month: 'Oct', revenue: 158000000, expenses: 98000000 },
  { month: 'Nov', revenue: 175000000, expenses: 105000000 },
  { month: 'Dec', revenue: 195000000, expenses: 115000000 },
  { month: 'Jan', revenue: 210000000, expenses: 125000000 },
];

const studentEnrollment = [
  { term: 'Term 1', students: 4250, growth: 8.5 },
  { term: 'Term 2', students: 4580, growth: 7.8 },
  { term: 'Term 3', students: 4920, growth: 7.4 },
];

const feeCollectionRate = [
  { month: 'Aug', rate: 78 },
  { month: 'Sep', rate: 82 },
  { month: 'Oct', rate: 85 },
  { month: 'Nov', rate: 88 },
  { month: 'Dec', rate: 91 },
  { month: 'Jan', rate: 93 },
];

const topSchools = [
  { name: 'Kampala International School', revenue: 45000000, students: 1250, collectionRate: 96 },
  { name: 'Jinja Progressive Academy', revenue: 31000000, students: 920, collectionRate: 94 },
  { name: 'Entebbe Parents School', revenue: 22000000, students: 680, collectionRate: 92 },
  { name: 'Gulu Modern College', revenue: 25000000, students: 780, collectionRate: 89 },
  { name: 'Mbarara Heights School', revenue: 18000000, students: 540, collectionRate: 85 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = revenueData.reduce((sum, item) => sum + item.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  const stats = [
    {
      title: 'Total Revenue',
      value: formatUGX(totalRevenue),
      icon: DollarSign,
      change: '+18.5%',
      trend: 'up',
      color: 'text-green-600',
    },
    {
      title: 'Net Profit',
      value: formatUGX(netProfit),
      icon: TrendingUp,
      change: `+${profitMargin}% margin`,
      trend: 'up',
      color: 'text-blue-600',
    },
    {
      title: 'Active Students',
      value: '4,920',
      icon: Users,
      change: '+7.4%',
      trend: 'up',
      color: 'text-amber-600',
    },
    {
      title: 'Avg Collection Rate',
      value: '93%',
      icon: CreditCard,
      change: '+5.2%',
      trend: 'up',
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
            <h1 className="text-2xl font-bold text-[#0A1628]">Analytics Dashboard</h1>
            <p className="text-gray-600">Platform performance and insights</p>
          </div>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
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
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-[#0A1628]">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Revenue vs Expenses */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#0A1628]">Revenue vs Expenses</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {revenueData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">{item.month}</span>
                    <div className="flex gap-4">
                      <span className="text-green-600">Rev: {formatUGX(item.revenue)}</span>
                      <span className="text-red-600">Exp: {formatUGX(item.expenses)}</span>
                    </div>
                  </div>
                  <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                      style={{ width: `${(item.revenue / 250000000) * 100}%` }}
                    />
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-70"
                      style={{ width: `${(item.expenses / 250000000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full opacity-70" />
                <span>Expenses</span>
              </div>
            </div>
          </div>

          {/* Fee Collection Rate */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#0A1628]">Fee Collection Rate</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {feeCollectionRate.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-12">{item.month}</span>
                  <div className="flex-1 relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#F5A623] to-[#E0951F] flex items-center justify-end pr-3"
                      style={{ width: `${item.rate}%` }}
                    >
                      <span className="text-xs font-bold text-white">{item.rate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Average collection rate improved by 15% over the last 6 months
            </p>
          </div>
        </motion.div>

        {/* Student Enrollment & Top Schools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Student Enrollment */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#0A1628]">Student Enrollment</h2>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {studentEnrollment.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-[#0A1628]">{item.term}</h3>
                    <p className="text-sm text-gray-600">Academic Year 2024/2025</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#0A1628]">{item.students.toLocaleString()}</p>
                    <p className="text-sm text-green-600">+{item.growth}% growth</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Schools */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#0A1628]">Top Performing Schools</h2>
              <School className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {topSchools.map((school, index) => (
                <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#0A1628]">{school.name}</h3>
                    <p className="text-sm text-gray-600">{school.students.toLocaleString()} students</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#0A1628]">{formatUGX(school.revenue)}</p>
                    <p className="text-xs text-green-600">{school.collectionRate}% collected</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-[#0A1628] mb-6">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Revenue Growth</h3>
              </div>
              <p className="text-3xl font-bold text-blue-900 mb-1">+18.5%</p>
              <p className="text-sm text-blue-700">Year-over-year increase in total revenue</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-green-900">Collection Efficiency</h3>
              </div>
              <p className="text-3xl font-bold text-green-900 mb-1">93%</p>
              <p className="text-sm text-green-700">Average fee collection rate across all schools</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-amber-600" />
                <h3 className="font-semibold text-amber-900">Student Retention</h3>
              </div>
              <p className="text-3xl font-bold text-amber-900 mb-1">96.2%</p>
              <p className="text-sm text-amber-700">Students returning for next academic year</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
