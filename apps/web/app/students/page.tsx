'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useStudents } from '@/hooks/use-students'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'

export default function StudentsPage() {
  const { data: students, isLoading, error } = useStudents()
  const [searchTerm, setSearchTerm] = useState('')

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#0A1628] border-t-[#F5A623] mx-auto"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Failed to load students. Please try again.</p>
        </div>
      </DashboardLayout>
    )
  }

  const filteredStudents = students?.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0A1628]">Students</h1>
            <p className="text-gray-600">Manage student records</p>
          </div>
          <button className="bg-[#0A1628] text-white px-4 py-2 rounded-md hover:bg-[#0A1628]/90 transition-colors">
            Add Student
          </button>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search by name or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
          />
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents?.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.admission_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(student.date_of_birth)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {student.gender}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.classes?.name || 'N/A'}
                        {student.classes?.stream && ` - ${student.classes.stream}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {student.parent_phone}
                      </div>
                      <div className="text-xs text-gray-400">
                        {student.parent_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStudents?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? 'No students match your search.' : 'No students found. Add your first student to get started.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-[#0A1628]">{students?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Active Students</p>
            <p className="text-2xl font-bold text-green-600">
              {students?.filter(s => s.is_active).length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Inactive Students</p>
            <p className="text-2xl font-bold text-gray-600">
              {students?.filter(s => !s.is_active).length || 0}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
