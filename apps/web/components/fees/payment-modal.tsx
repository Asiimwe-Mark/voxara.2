'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCreatePayment, useSendSMSReceipt } from '@/hooks/use-fees'
import { formatUGX, generateReceiptNumber } from '@/lib/utils'
import { FeeAccount } from '@/lib/supabase'

interface PaymentModalProps {
  feeAccount: FeeAccount & {
    students: { first_name: string; last_name: string; admission_number: string; parent_phone: string }
  }
  onSuccess: () => void
  onClose: () => void
}

export function PaymentModal({ feeAccount, onSuccess, onClose }: PaymentModalProps) {
  const [amount, setAmount] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobile_money'>('cash')
  const [reference, setReference] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [notes, setNotes] = useState('')
  const [isSendingSMS, setIsSendingSMS] = useState(true)

  const createPayment = useCreatePayment()
  const sendSMS = useSendSMSReceipt()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const paymentData = {
        fee_account_id: feeAccount.id,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        payment_reference: reference || `CASH-${Date.now()}`,
        receipt_number: generateReceiptNumber(feeAccount.school_id, Date.now()),
        paid_by: paidBy,
        notes: notes || undefined,
        sms_sent: isSendingSMS,
      }

      await createPayment.mutateAsync(paymentData)

      // Send SMS receipt
      if (isSendingSMS && feeAccount.students.parent_phone) {
        const message = `SKULI Receipt: ${paymentData.receipt_number}. Student: ${feeAccount.students.first_name} ${feeAccount.students.last_name}. Amount: ${formatUGX(parseFloat(amount))}. New Balance: ${formatUGX(feeAccount.balance - parseFloat(amount))}. Thank you!`
        
        try {
          await sendSMS.mutateAsync({
            phoneNumber: feeAccount.students.parent_phone,
            message
          })
        } catch (smsError) {
          console.error('Failed to send SMS:', smsError)
          // Don't fail the payment if SMS fails
        }
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#0A1628]">Record Payment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <p className="text-gray-900 font-medium">
              {feeAccount.students.first_name} {feeAccount.students.last_name}
            </p>
            <p className="text-sm text-gray-500">{feeAccount.students.admission_number}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Current Balance</label>
            <p className="text-lg font-bold text-[#F5A623]">{formatUGX(feeAccount.balance)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount *</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
              placeholder="Enter amount in UGX"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method *</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'mobile_money')}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#F5A623]"
              required
            >
              <option value="cash">Cash</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {paymentMethod === 'mobile_money' ? 'Transaction ID' : 'Receipt Reference'} *
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#F5A623]"
              placeholder={paymentMethod === 'mobile_money' ? 'e.g., MM123456789' : 'Optional'}
              required={paymentMethod === 'mobile_money'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Paid By *</label>
            <input
              type="text"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#F5A623]"
              placeholder="Name of person making payment"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#F5A623]"
              rows={2}
              placeholder="Optional notes"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="send-sms"
              checked={isSendingSMS}
              onChange={(e) => setIsSendingSMS(e.target.checked)}
              className="rounded border-gray-300 text-[#F5A623] focus:ring-[#F5A623]"
            />
            <label htmlFor="send-sms" className="text-sm text-gray-700">
              Send SMS receipt to parent ({feeAccount.students.parent_phone})
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={createPayment.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#0A1628] hover:bg-[#0A1628]/90"
              disabled={createPayment.isPending || !amount || !paidBy}
            >
              {createPayment.isPending ? 'Processing...' : 'Complete Payment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
