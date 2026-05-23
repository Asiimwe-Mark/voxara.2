'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';

// Mock data - will be replaced with Supabase queries
const initialSubjects = [
  { id: '1', name: 'Mathematics', code: 'MATH', teacher: 'Mr. Okello', class: 'Senior 1', isCore: true },
  { id: '2', name: 'English', code: 'ENG', teacher: 'Ms. Akello', class: 'Senior 1', isCore: true },
  { id: '3', name: 'Biology', code: 'BIO', teacher: 'Dr. Ochieng', class: 'Senior 2', isCore: true },
  { id: '4', name: 'History', code: 'HIST', teacher: 'Mr. Mugisha', class: 'Senior 3', isCore: false },
  { id: '5', name: 'Computer Studies', code: 'COMP', teacher: 'Ms. Namukwaya', class: 'Senior 1', isCore: false },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);

  const filteredSubjects = subjects.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-[#0A1628]">Subjects</h1>
            <p className="text-gray-600">Manage academic subjects and assignments</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#F5A623] hover:bg-[#E59613]">
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent outline-none"
          />
        </motion.div>

        {/* Subjects Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Subject</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Code</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Teacher</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Class</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((subject, index) => (
                  <motion.tr
                    key={subject.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0A1628]/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-[#0A1628]" />
                        </div>
                        <span className="font-medium text-gray-900">{subject.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium">
                        {subject.code}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{subject.teacher}</td>
                    <td className="py-4 px-6 text-gray-700">{subject.class}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        subject.isCore 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subject.isCore ? 'Core' : 'Optional'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingSubject(subject);
                            setIsModalOpen(true);
                          }}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(subject.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSubjects.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No subjects found</p>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
