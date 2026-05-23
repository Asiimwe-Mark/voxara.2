'use client';

import { useAuthStore } from '@/store/auth-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatUGX, formatDate } from '@/lib/utils';
import { Download, MessageCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

// Mock data - replace with actual fetch in real implementation
const mockStudent = {
  id: '1',
  name: 'Amanda Nakato',
  class: 'Senior 3 Blue',
  admissionNumber: 'ADM-2024-0042',
  photoUrl: null,
};

const mockFeeAccount = {
  id: 'fa-1',
  totalCharged: 1200000,
  totalPaid: 850000,
  balance: 350000,
  status: 'PARTIAL',
  dueDate: '2024-06-15',
};

const mockPayments = [
  {
    id: 'p-1',
    amount: 500000,
    date: '2024-03-10T10:30:00Z',
    method: 'MTN_MOBILE_MONEY',
    receiptNumber: 'SKULI-SK-2403-001',
    status: 'COMPLETED',
  },
  {
    id: 'p-2',
    amount: 350000,
    date: '2024-04-05T14:15:00Z',
    method: 'CASH',
    receiptNumber: 'SKULI-SK-2404-012',
    status: 'COMPLETED',
  },
];

const mockAttendanceSummary = {
  totalDays: 45,
  present: 42,
  absent: 3,
  late: 2,
  percentage: 93.3,
};

const mockAnnouncements = [
  {
    id: 'a-1',
    title: 'Term 2 Opening Date',
    message: 'School reopens on 5th May 2024. All fees must be cleared by 15th May.',
    date: '2024-04-20T08:00:00Z',
    priority: 'HIGH',
  },
  {
    id: 'a-2',
    title: 'Sports Day Notice',
    message: 'Annual sports day will be held on 25th May. Parents are invited.',
    date: '2024-04-18T12:00:00Z',
    priority: 'NORMAL',
  },
];

export default function ParentPortalPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'fees' | 'attendance' | 'announcements'>('fees');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PARTIAL':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes('MTN')) return '🟡';
    if (method.includes('AIRTEL')) return '🔴';
    if (method.includes('CASH')) return '💵';
    return '💳';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Parent Portal</h1>
            <p className="text-slate-600">Welcome, {user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-semibold text-slate-900">{mockStudent.name}</p>
              <p className="text-sm text-slate-600">{mockStudent.class}</p>
              <p className="text-xs text-slate-500">{mockStudent.admissionNumber}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#0A1628] flex items-center justify-center text-white font-bold text-lg">
              {mockStudent.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Fee Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatUGX(mockFeeAccount.balance)}</div>
              <div className="flex items-center mt-2 gap-2">
                <Badge className={getStatusColor(mockFeeAccount.status)}>
                  {mockFeeAccount.status}
                </Badge>
                <span className="text-xs text-slate-500">
                  Due: {formatDate(mockFeeAccount.dueDate)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{mockAttendanceSummary.percentage}%</div>
              <div className="text-xs text-slate-500 mt-2">
                {mockAttendanceSummary.present}/{mockAttendanceSummary.totalDays} days present
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{mockAnnouncements.length}</div>
              <div className="text-xs text-slate-500 mt-2">
                {mockAnnouncements.filter(a => a.priority === 'HIGH').length} urgent
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'fees', label: 'Fees & Payments' },
              { id: 'attendance', label: 'Attendance' },
              { id: 'announcements', label: 'Announcements' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-[#F5A623] text-[#F5A623]'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            {/* Fee Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Current Term Fees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">Total Charged</span>
                    <span className="font-semibold text-slate-900">{formatUGX(mockFeeAccount.totalCharged)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">Total Paid</span>
                    <span className="font-semibold text-emerald-600">{formatUGX(mockFeeAccount.totalPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-amber-50 px-4 rounded-lg">
                    <span className="font-semibold text-amber-900">Balance Due</span>
                    <span className="font-bold text-amber-700 text-lg">{formatUGX(mockFeeAccount.balance)}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 bg-[#0A1628] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#1a2638] transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Pay with Mobile Money
                  </button>
                  <button className="flex-1 border border-slate-300 text-slate-700 px-4 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Statement
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getPaymentMethodIcon(payment.method)}</div>
                        <div>
                          <p className="font-semibold text-slate-900">{formatUGX(payment.amount)}</p>
                          <p className="text-xs text-slate-500">
                            {payment.receiptNumber} • {formatDate(payment.date)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'attendance' && (
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary - Term 2 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-700">{mockAttendanceSummary.present}</div>
                  <div className="text-xs text-emerald-600 mt-1">Present</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{mockAttendanceSummary.absent}</div>
                  <div className="text-xs text-red-600 mt-1">Absent</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-700">{mockAttendanceSummary.late}</div>
                  <div className="text-xs text-amber-600 mt-1">Late</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{mockAttendanceSummary.percentage}%</div>
                  <div className="text-xs text-blue-600 mt-1">Attendance Rate</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-3">Recent Absences</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">15 April 2024</span>
                    <Badge className="bg-red-100 text-red-800">Absent</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">10 April 2024</span>
                    <Badge className="bg-red-100 text-red-800">Absent</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">5 April 2024</span>
                    <Badge className="bg-amber-100 text-amber-800">Late</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {mockAnnouncements.map((announcement) => (
              <Card key={announcement.id} className={announcement.priority === 'HIGH' ? 'border-red-200 bg-red-50' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{announcement.title}</CardTitle>
                    <Badge className={announcement.priority === 'HIGH' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'}>
                      {announcement.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-2">{announcement.message}</p>
                  <p className="text-xs text-slate-500">{formatDate(announcement.date)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
