'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatUGX } from '@/lib/utils';
import { 
  Settings, 
  Users, 
  DollarSign, 
  School, 
  MessageSquare, 
  CreditCard,
  Building,
  Phone,
  Mail,
  Save
} from 'lucide-react';

// Mock data
const mockSchool = {
  id: 'sch-1',
  name: "St. Mary's College Kisubi",
  code: 'SK',
  email: 'info@smack.ac.ug',
  phone: '+256 414 123 456',
  address: 'Entebbe Road, Wakiso District',
  currency: 'UGX',
  academicYear: '2024',
  currentTerm: 'TERM_2',
  logoUrl: null,
};

const mockFeeStructures = [
  { id: 'fs-1', name: 'Senior 1-2 Tuition', amount: 600000, classGroup: 'JUNIOR' },
  { id: 'fs-2', name: 'Senior 3-4 Tuition', amount: 750000, classGroup: 'MIDDLE' },
  { id: 'fs-3', name: 'Senior 5-6 Tuition', amount: 900000, classGroup: 'SENIOR' },
  { id: 'fs-4', name: 'Boarding Fees', amount: 300000, classGroup: 'ALL' },
  { id: 'fs-5', name: 'Lunch Program', amount: 150000, classGroup: 'ALL' },
];

const mockUsers = [
  { id: 'u-1', name: 'Fr. Charles Mukasa', email: 'admin@smack.ac.ug', role: 'SCHOOL_ADMIN' },
  { id: 'u-2', name: 'Mrs. Sarah Namaganda', email: 'bursar@smack.ac.ug', role: 'BURSAR' },
  { id: 'u-3', name: 'Mr. John Kizito', email: 'teacher@smack.ac.ug', role: 'TEACHER' },
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'school' | 'fees' | 'users' | 'sms'>('school');
  const [schoolData, setSchoolData] = useState(mockSchool);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSchool = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('School settings saved successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600">Configure your school system preferences</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'school', label: 'School Info', icon: School },
              { id: 'fees', label: 'Fee Structures', icon: DollarSign },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'sms', label: 'SMS Settings', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? 'border-[#F5A623] text-[#F5A623]'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'school' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
                <CardDescription>Basic details about your institution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      School Name
                    </label>
                    <input
                      type="text"
                      value={schoolData.name}
                      onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      School Code
                    </label>
                    <input
                      type="text"
                      value={schoolData.code}
                      onChange={(e) => setSchoolData({ ...schoolData, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                      placeholder="e.g., SK"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={schoolData.email}
                      onChange={(e) => setSchoolData({ ...schoolData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={schoolData.phone}
                      onChange={(e) => setSchoolData({ ...schoolData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                      placeholder="+256 ..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Physical Address
                    </label>
                    <textarea
                      value={schoolData.address}
                      onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleSaveSchool}
                    disabled={isSaving}
                    className="bg-[#0A1628] hover:bg-[#1a2638]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Configuration</CardTitle>
                <CardDescription>Current academic year and term settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Academic Year
                    </label>
                    <select
                      value={schoolData.academicYear}
                      onChange={(e) => setSchoolData({ ...schoolData, academicYear: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                    >
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Current Term
                    </label>
                    <select
                      value={schoolData.currentTerm}
                      onChange={(e) => setSchoolData({ ...schoolData, currentTerm: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                    >
                      <option value="TERM_1">Term 1 (Jan - Apr)</option>
                      <option value="TERM_2">Term 2 (May - Aug)</option>
                      <option value="TERM_3">Term 3 (Sep - Nov)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={schoolData.currency}
                      onChange={(e) => setSchoolData({ ...schoolData, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                    >
                      <option value="UGX">UGX - Ugandan Shilling</option>
                      <option value="USD">USD - US Dollar</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Fee Structures</h2>
              <Button className="bg-[#0A1628] hover:bg-[#1a2638]">
                Add New Fee Item
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {mockFeeStructures.map((fee) => (
                    <div
                      key={fee.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#F5A623]/10 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-[#F5A623]" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{fee.name}</p>
                          <Badge variant="outline" className="mt-1">
                            {fee.classGroup}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">{formatUGX(fee.amount)}</p>
                        <div className="flex gap-2 mt-2">
                          <button className="text-xs text-blue-600 hover:underline">Edit</button>
                          <button className="text-xs text-red-600 hover:underline">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">System Users</h2>
              <Button className="bg-[#0A1628] hover:bg-[#1a2638]">
                Invite User
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {mockUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#0A1628] flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={
                          user.role === 'SCHOOL_ADMIN' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'BURSAR' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {user.role.replace('_', ' ')}
                        </Badge>
                        <button className="text-sm text-blue-600 hover:underline">Edit</button>
                        {user.role !== 'SCHOOL_ADMIN' && (
                          <button className="text-sm text-red-600 hover:underline">Remove</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'sms' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Africa's Talking Integration</CardTitle>
                <CardDescription>Configure SMS gateway for notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Your Africa's Talking username"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    placeholder="sk_live_..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Sender ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., SKULI"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                  />
                  <p className="text-xs text-slate-500 mt-1">This will appear as the sender name on SMS</p>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <Button variant="outline">Test Connection</Button>
                  <Button className="bg-[#0A1628] hover:bg-[#1a2638]">
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMS Automation Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Payment Receipt SMS', desc: 'Send immediately after payment recording' },
                  { name: 'Absence Notification', desc: 'Send to parents at 9 AM daily' },
                  { name: 'Fee Reminder SMS', desc: 'Weekly reminders for outstanding balance' },
                  { name: 'Report Card Ready', desc: 'Notify when termly reports available' },
                ].map((rule, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{rule.name}</p>
                      <p className="text-sm text-slate-500">{rule.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A1628]"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
