'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, FileText, Download } from 'lucide-react';

// Mock data - will be replaced with Supabase queries
const initialMarks = [
  { id: '1', studentName: 'Okello John', subject: 'Mathematics', examType: 'Term 1', marks: 85, grade: 'A', remarks: 'Excellent' },
  { id: '2', studentName: 'Akello Mary', subject: 'English', examType: 'Term 1', marks: 78, grade: 'B+', remarks: 'Very Good' },
  { id: '3', studentName: 'Ochieng David', subject: 'Biology', examType: 'Term 1', marks: 92, grade: 'A+', remarks: 'Outstanding' },
  { id: '4', studentName: 'Namukwaya Sarah', subject: 'History', examType: 'Term 1', marks: 65, grade: 'C', remarks: 'Good' },
  { id: '5', studentName: 'Mugisha Peter', subject: 'Computer Studies', examType: 'Term 1', marks: 88, grade: 'A', remarks: 'Excellent' },
];

const gradingScale = [
  { min: 90, max: 100, grade: 'A+', remark: 'Outstanding' },
  { min: 80, max: 89, grade: 'A', remark: 'Excellent' },
  { min: 75, max: 79, grade: 'B+', remark: 'Very Good' },
  { min: 70, max: 74, grade: 'B', remark: 'Good' },
  { min: 65, max: 69, grade: 'C+', remark: 'Above Average' },
  { min: 60, max: 64, grade: 'C', remark: 'Average' },
  { min: 55, max: 59, grade: 'D+', remark: 'Below Average' },
  { min: 50, max: 54, grade: 'D', remark: 'Pass' },
  { min: 0, max: 49, grade: 'F', remark: 'Fail' },
];

export default function MarksPage() {
  const [marks, setMarks] = useState(initialMarks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  const filteredMarks = marks.filter(mark => {
    const matchesSearch = mark.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mark.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || mark.studentName.includes(selectedClass);
    const matchesSubject = selectedSubject === 'all' || mark.subject === selectedSubject;
    return matchesSearch && matchesClass && matchesSubject;
  });

  const getGrade = (marks: number) => {
    const scale = gradingScale.find(s => marks >= s.min && marks <= s.max);
    return scale ? scale.grade : 'F';
  };

  const getRemarks = (marks: number) => {
    const scale = gradingScale.find(s => marks >= s.min && marks <= s.max);
    return scale ? scale.remark : 'Fail';
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
            <h1 className="text-2xl font-bold text-[#0A1628]">Marks Entry</h1>
            <p className="text-gray-600">Enter and manage student examination marks</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-[#0A1628] text-[#0A1628] hover:bg-[#0A1628]/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setIsEntryModalOpen(true)} className="bg-[#F5A623] hover:bg-[#E59613]">
              <Plus className="w-4 h-4 mr-2" />
              Enter Marks
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search student or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent outline-none"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Classes</option>
            <option value="Senior 1">Senior 1</option>
            <option value="Senior 2">Senior 2</option>
            <option value="Senior 3">Senior 3</option>
            <option value="Senior 4">Senior 4</option>
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
            <option value="Biology">Biology</option>
            <option value="History">History</option>
            <option value="Computer Studies">Computer Studies</option>
          </select>
        </motion.div>

        {/* Marks Table */}
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Subject</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Exam</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Marks</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Grade</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Remarks</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarks.map((mark, index) => (
                  <motion.tr
                    key={mark.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">{mark.studentName}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{mark.subject}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium">
                        {mark.examType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-bold ${
                        mark.marks >= 80 ? 'text-green-600' :
                        mark.marks >= 60 ? 'text-blue-600' :
                        mark.marks >= 50 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {mark.marks}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        mark.marks >= 80 ? 'bg-green-100 text-green-800' :
                        mark.marks >= 60 ? 'bg-blue-100 text-blue-800' :
                        mark.marks >= 50 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {mark.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{mark.remarks}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEntryModalOpen(true)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
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
          
          {filteredMarks.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No marks entries found</p>
            </div>
          )}
        </motion.div>

        {/* Grading Scale Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-bold text-[#0A1628] mb-4">Grading Scale</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {gradingScale.map((scale) => (
              <div key={scale.grade} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#0A1628]">{scale.grade}</div>
                <div className="text-sm text-gray-600">{scale.min}-{scale.max}%</div>
                <div className="text-xs text-gray-500 mt-1">{scale.remark}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
