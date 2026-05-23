'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Printer, Students, BookOpen } from 'lucide-react';

const mockStudents = [
  { id: '1', name: 'Okello John', class: 'Senior 1', admissionNo: 'SKL-2024-001' },
  { id: '2', name: 'Akello Mary', class: 'Senior 1', admissionNo: 'SKL-2024-002' },
  { id: '3', name: 'Ochieng David', class: 'Senior 2', admissionNo: 'SKL-2024-003' },
  { id: '4', name: 'Namukwaya Sarah', class: 'Senior 2', admissionNo: 'SKL-2024-004' },
  { id: '5', name: 'Mugisha Peter', class: 'Senior 3', admissionNo: 'SKL-2024-005' },
];

const mockReportData = {
  '1': {
    term: 'Term 1, 2024',
    marks: [
      { subject: 'Mathematics', marks: 85, grade: 'A', remarks: 'Excellent', position: 2 },
      { subject: 'English', marks: 78, grade: 'B+', remarks: 'Very Good', position: 5 },
      { subject: 'Biology', marks: 92, grade: 'A+', remarks: 'Outstanding', position: 1 },
      { subject: 'History', marks: 65, grade: 'C', remarks: 'Good', position: 12 },
      { subject: 'Computer Studies', marks: 88, grade: 'A', remarks: 'Excellent', position: 3 },
    ],
    totalMarks: 408,
    average: 81.6,
    overallGrade: 'A',
    overallPosition: 3,
    totalStudents: 45,
    teacherComment: 'John is an outstanding student with excellent performance in sciences.',
    headTeacherComment: 'Keep up the good work. Continue to excel in all subjects.',
    attendance: { present: 88, absent: 2, late: 3 },
  }
};

export default function ReportsPage() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('Term 1, 2024');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredStudents = selectedClass === 'all' 
    ? mockStudents 
    : mockStudents.filter(s => s.class === selectedClass);

  const handleGenerateReport = async (student: any) => {
    setIsGenerating(true);
    // Simulate PDF generation - in production this would call Edge Function
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSelectedStudent(student);
    setIsGenerating(false);
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
            <h1 className="text-2xl font-bold text-[#0A1628]">Report Cards</h1>
            <p className="text-gray-600">Generate and manage student academic reports</p>
          </div>
          <Button className="bg-[#F5A623] hover:bg-[#E59613]">
            <Download className="w-4 h-4 mr-2" />
            Bulk Export
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
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
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent outline-none bg-white"
          >
            <option value="Term 1, 2024">Term 1, 2024</option>
            <option value="Term 2, 2024">Term 2, 2024</option>
            <option value="Term 3, 2024">Term 3, 2024</option>
          </select>
          <div className="flex items-center justify-end">
            <Button variant="outline" className="w-full border-[#0A1628] text-[#0A1628] hover:bg-[#0A1628]/10">
              <Printer className="w-4 h-4 mr-2" />
              Print All
            </Button>
          </div>
        </motion.div>

        {/* Student List */}
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Admission No</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Student Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Class</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Term</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm text-gray-600">{student.admissionNo}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0A1628]/10 flex items-center justify-center">
                          <Students className="w-5 h-5 text-[#0A1628]" />
                        </div>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium">
                        {student.class}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{selectedTerm}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateReport(student)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateReport(student)}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Report Preview Modal */}
        {selectedStudent && mockReportData[selectedStudent.id as keyof typeof mockReportData] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Report Card Header */}
              <div className="bg-[#0A1628] text-white p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">SKULI SCHOOL</h2>
                  <p className="text-gray-300">Academic Report Card</p>
                  <p className="text-sm mt-2">{mockReportData[selectedStudent.id as keyof typeof mockReportData].term}</p>
                </div>
              </div>

              {/* Student Info */}
              <div className="p-6 border-b border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Student Name</p>
                    <p className="font-bold text-[#0A1628]">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Admission No</p>
                    <p className="font-mono text-[#0A1628]">{selectedStudent.admissionNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Class</p>
                    <p className="font-bold text-[#0A1628]">{selectedStudent.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Overall Position</p>
                    <p className="font-bold text-[#F5A623]">
                      {mockReportData[selectedStudent.id as keyof typeof mockReportData].overallPosition}/{mockReportData[selectedStudent.id as keyof typeof mockReportData].totalStudents}
                    </p>
                  </div>
                </div>
              </div>

              {/* Marks Table */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#0A1628] mb-4">Subject Performance</h3>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Marks</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Grade</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Remarks</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockReportData[selectedStudent.id as keyof typeof mockReportData].marks.map((subject, idx) => (
                      <tr key={idx} className="border-b border-gray-50">
                        <td className="py-3 px-4 font-medium">{subject.subject}</td>
                        <td className="py-3 px-4 text-center font-bold">{subject.marks}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-sm font-bold ${
                            subject.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                            subject.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                            subject.grade.startsWith('C') ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {subject.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{subject.remarks}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{subject.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Marks</p>
                    <p className="text-2xl font-bold text-[#0A1628]">{mockReportData[selectedStudent.id as keyof typeof mockReportData].totalMarks}/500</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Average</p>
                    <p className="text-2xl font-bold text-[#F5A623]">{mockReportData[selectedStudent.id as keyof typeof mockReportData].average}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Overall Grade</p>
                    <p className="text-2xl font-bold text-[#0A1628]">{mockReportData[selectedStudent.id as keyof typeof mockReportData].overallGrade}</p>
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="font-bold text-[#0A1628] mb-2">Class Teacher's Comment:</p>
                    <p className="text-gray-700 italic">{mockReportData[selectedStudent.id as keyof typeof mockReportData].teacherComment}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#0A1628] mb-2">Head Teacher's Comment:</p>
                    <p className="text-gray-700 italic">{mockReportData[selectedStudent.id as keyof typeof mockReportData].headTeacherComment}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                  Close
                </Button>
                <Button className="bg-[#0A1628] hover:bg-[#0A1628]/90">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button className="bg-[#F5A623] hover:bg-[#E59613]">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isGenerating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-[#F5A623] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-700">Generating report card...</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
