'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuthStore } from '@/store/auth-store'
import { formatUGX } from '@/lib/utils'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    pendingFees: 0,
    todayAttendance: 0,
  })

  // Mock stats - will be replaced with real API calls
  useEffect(() => {
    // In production, fetch real stats from Supabase
    setStats({
      totalStudents: 245,
      totalRevenue: 15750000,
      pendingFees: 3200000,
      todayAttendance: 98,
    })
  }, [])

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toString(),
      icon: '👨‍🎓',
      color: 'text-[#0A1628]',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Revenue Collected',
      value: formatUGX(stats.totalRevenue),
      icon: '💰',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Fees',
      value: formatUGX(stats.pendingFees),
      icon: '⏳',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: "Today's Attendance",
      value: `${stats.todayAttendance}%`,
      icon: '✅',
      color: 'text-[#0A1628]',
      bgColor: 'bg-purple-50',
    },
  ]

  const recentActivities = [
    { id: 1, type: 'payment', description: 'Fee payment received', time: '2 mins ago', amount: formatUGX(150000) },
    { id: 2, type: 'student', description: 'New student enrolled', time: '1 hour ago', amount: null },
    { id: 3, type: 'sms', description: 'SMS receipts sent', time: '3 hours ago', amount: null },
    { id: 4, type: 'payment', description: 'Mobile Money payment', time: '5 hours ago', amount: formatUGX(200000) },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0A1628]">
              Welcome back, {user?.full_name || 'User'}!
            </h1>
            <p className="text-gray-600">{user?.school_name || 'School'} Dashboard</p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-UG', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                </div>
                <div className="text-3xl">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/fees"
            className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#F5A623] hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0A1628] rounded-lg flex items-center justify-center text-white text-xl group-hover:bg-[#F5A623] transition-colors">
                💳
              </div>
              <div>
                <h3 className="font-semibold text-[#0A1628]">Collect Fees</h3>
                <p className="text-sm text-gray-600">Record payments & send receipts</p>
              </div>
            </div>
          </a>

          <a
            href="/students"
            className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#F5A623] hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0A1628] rounded-lg flex items-center justify-center text-white text-xl group-hover:bg-[#F5A623] transition-colors">
                👥
              </div>
              <div>
                <h3 className="font-semibold text-[#0A1628]">Manage Students</h3>
                <p className="text-sm text-gray-600">View & update student records</p>
              </div>
            </div>
          </a>

          <a
            href="/attendance"
            className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#F5A623] hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0A1628] rounded-lg flex items-center justify-center text-white text-xl group-hover:bg-[#F5A623] transition-colors">
                📅
              </div>
              <div>
                <h3 className="font-semibold text-[#0A1628]">Take Attendance</h3>
                <p className="text-sm text-gray-600">Mark daily attendance</p>
              </div>
            </div>
          </a>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#0A1628]">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                    activity.type === 'student' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'payment' ? '💰' : activity.type === 'student' ? '👤' : '📱'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="text-sm font-semibold text-green-600">{activity.amount}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fee Collection Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0A1628] mb-4">Fee Collection Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Expected</span>
              <span className="font-semibold">{formatUGX(stats.totalRevenue + stats.pendingFees)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Collected</span>
              <span className="font-semibold text-green-600">{formatUGX(stats.totalRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">{formatUGX(stats.pendingFees)}</span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#0A1628] h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(stats.totalRevenue / (stats.totalRevenue + stats.pendingFees)) * 100}%` 
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((stats.totalRevenue / (stats.totalRevenue + stats.pendingFees)) * 100)}% collected
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
