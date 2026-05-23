'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatUGX, formatDate } from '@/lib/utils';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

// Mock data
const mockClasses = [
  { id: 'c1', name: 'Senior 1 Blue', students: 45 },
  { id: 'c2', name: 'Senior 2 Red', students: 42 },
  { id: 'c3', name: 'Senior 3 Green', students: 38 },
];

const mockStudents = [
  { id: 's1', name: 'John Mukasa', classId: 'c1', status: 'present' },
  { id: 's2', name: 'Sarah Namukasa', classId: 'c1', status: 'absent' },
  { id: 's3', name: 'David Kato', classId: 'c1', status: 'late' },
  { id: 's4', name: 'Grace Akello', classId: 'c1', status: 'present' },
  { id: 's5', name: 'Peter Okello', classId: 'c1', status: 'present' },
];

const today = new Date().toISOString().split('T')[0];

export default function AttendancePage() {
  const { user } = useAuthStore();
  const [selectedClass, setSelectedClass] = useState(mockClasses[0].id);
  const [date, setDate] = useState(today);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({
    s1: 'present',
    s2: 'absent',
    s3: 'late',
    s4: 'present',
    s5: 'present',
  });

  const filteredStudents = mockStudents.filter(s => s.classId === selectedClass);

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const summary = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    late: Object.values(attendance).filter(s => s === 'late').length,
  };

  const total = filteredStudents.length;
  const percentage = total > 0 ? ((summary.present + summary.late) / total) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Daily Attendance</h1>
            <p className="text-slate-600">Mark and track student attendance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-none outline-none text-sm"
              />
            </div>
            <Button className="bg-[#0A1628] hover:bg-[#1a2638]">
              Save Attendance
            </Button>
          </div>
        </div>

        {/* Class Selection & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Select Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockClasses.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedClass === cls.id
                        ? 'bg-[#0A1628] text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-medium">{cls.name}</div>
                    <div className="text-xs opacity-70">{cls.students} students</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-700">{summary.present}</div>
                  <div className="text-xs text-emerald-600 mt-1 flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Present
                  </div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{summary.absent}</div>
                  <div className="text-xs text-red-600 mt-1 flex items-center justify-center gap-1">
                    <XCircle className="h-3 w-3" /> Absent
                  </div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-700">{summary.late}</div>
                  <div className="text-xs text-amber-600 mt-1 flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3" /> Late
                  </div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{percentage.toFixed(0)}%</div>
                  <div className="text-xs text-blue-600 mt-1">Attendance Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {mockClasses.find(c => c.id === selectedClass)?.name} - {formatDate(date)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#0A1628] flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">Student ID: {student.id.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkAttendance(student.id, 'present')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        attendance[student.id] === 'present'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleMarkAttendance(student.id, 'late')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        attendance[student.id] === 'late'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                    >
                      Late
                    </button>
                    <button
                      onClick={() => handleMarkAttendance(student.id, 'absent')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        attendance[student.id] === 'absent'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Marked: {Object.keys(attendance).length} / {total} students
              </p>
              <div className="flex gap-3">
                <Button variant="outline">Clear All</Button>
                <Button className="bg-[#0A1628] hover:bg-[#1a2638]">
                  Save & Send SMS to Parents
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-[#F5A623] mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900">View History</h3>
                <p className="text-sm text-slate-600 mt-1">Check past attendance records</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="h-8 w-8 text-[#F5A623] mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900">Late Arrivals</h3>
                <p className="text-sm text-slate-600 mt-1">Track habitual latecomers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="h-8 w-8 text-[#F5A623] mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900">Reports</h3>
                <p className="text-sm text-slate-600 mt-1">Generate attendance reports</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
