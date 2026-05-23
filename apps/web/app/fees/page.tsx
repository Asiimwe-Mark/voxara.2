'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useFeeAccounts } from '@/hooks/use-fees'
import { formatUGX, formatDate } from '@/lib/utils'
import { PaymentModal } from '@/components/fees/payment-modal'
import { useState } from 'react'
import { FeeAccount } from '@/lib/supabase'

export default function FeesPage() {
  const { data: feeAccounts, isLoading, error } = useFeeAccounts()
  const [selectedAccount, setSelectedAccount] = useState<FeeAccount | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#0A1628] border-t-[#F5A623] mx-auto"></div>
            <p className="text-gray-600">Loading fees...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Failed to load fee accounts. Please try again.</p>
        </div>
      </DashboardLayout>
    )
  }

  const handlePaymentClick = (account: FeeAccount) => {
    setSelectedAccount(account as any)
    setShowPaymentModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0A1628]">Fee Management</h1>
            <p className="text-gray-600">Track and collect school fees</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Total Accounts</p>
            <p className="text-2xl font-bold text-[#0A1628]">{feeAccounts?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Paid</p>
            <p className="text-2xl font-bold text-green-600">
              {feeAccounts?.filter(a => a.status === 'paid').length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Partial</p>
            <p className="text-2xl font-bold text-yellow-600">
              {feeAccounts?.filter(a => a.status === 'partial').length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-2xl font-bold text-red-600">
              {feeAccounts?.filter(a => a.status === 'overdue').length || 0}
            </p>
          </div>
        </div>

        {/* Fee Accounts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#0A1628]">Fee Accounts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee Structure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feeAccounts?.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {account.students.first_name} {account.students.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {account.students.admission_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {account.fee_structures.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatUGX(account.total_amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600">
                        {formatUGX(account.paid_amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-bold ${account.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatUGX(account.balance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(account.status)}`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(account.due_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handlePaymentClick(account)}
                        disabled={account.status === 'paid'}
                        className={`text-[#0A1628] hover:text-[#F5A623] ${
                          account.status === 'paid' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {account.status === 'paid' ? 'Paid' : 'Pay'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {feeAccounts?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No fee accounts found. Create fee structures to get started.</p>
            </div>
          )}
        </div>
      </div>

      {showPaymentModal && selectedAccount && (
        <PaymentModal
          feeAccount={selectedAccount as any}
          onSuccess={() => {
            setShowPaymentModal(false)
            setSelectedAccount(null)
          }}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedAccount(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}
