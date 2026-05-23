'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Users, Mail, Phone } from 'lucide-react';

const mockParents = [
  { id: '1', name: 'Mr. Okello Patrick', email: 'okello@example.com', phone: '+256 701 234 567', students: ['Okello John'], balance: 'UGX 450,000' },
  { id: '2', name: 'Ms. Akello Grace', email: 'akello@example.com', phone: '+256 772 345 678', students: ['Akello Mary'], balance: 'UGX 0' },
  { id: '3', name: 'Dr. Ochieng David', email: 'ochieng@example.com', phone: '+256 753 456 789', students: ['Ochieng David Jr'], balance: 'UGX 1,200,000' },
  { id: '4', name: 'Mrs. Namukwaya Sarah', email: 'namukwaya@example.com', phone: '+256 704 567 890', students: ['Namukwaya Sarah'], balance: 'UGX 300,000' },
  { id: '5', name: 'Mr. Mugisha Peter', email: 'mugisha@example.com', phone: '+256 775 678 901', students: ['Mugisha Peter Jr'], balance: 'UGX 0' },
];

export default function ParentsPage() {
  const [parents, setParents] = useState(mockParents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredParents = parents.filter(parent =>
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.phone.includes(searchTerm) ||
    parent.students.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this parent?')) {
      setParents(parents.filter(p => p.id !== id));
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
            <h1 className="text-2xl font-bold text-[#0A1628]">Parents & Guardians</h1>
            <p className="text-gray-600">Manage parent accounts and contact information</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#F5A623] hover:bg-[#E59613]">
            <Plus className="w-4 h-4 mr-2" />
            Add Parent
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
            placeholder="Search by name, email, phone, or student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F5A623] focus:border-transparent outline-none"
          />
        </motion.div>

        {/* Parents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredParents.map((parent, index) => (
            <motion.div
              key={parent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#0A1628]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0A1628]" />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(parent.id)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#0A1628] mb-2">{parent.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{parent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{parent.phone}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Linked Students:</p>
                <div className="flex flex-wrap gap-2">
                  {parent.students.map((student, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#0A1628]/10 text-[#0A1628] rounded-full text-sm font-medium">
                      {student}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Outstanding Balance:</span>
                <span className={`font-bold ${
                  parent.balance === 'UGX 0' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {parent.balance}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-[#0A1628] text-[#0A1628] hover:bg-[#0A1628]/10">
                  View Profile
                </Button>
                <Button size="sm" className="flex-1 bg-[#F5A623] hover:bg-[#E59613]">
                  Send SMS
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredParents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No parents found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
