import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, FeeAccount, FeePayment } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth-store'

export function useFeeAccounts() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['fee-accounts', user?.school_id],
    queryFn: async () => {
      if (!user?.school_id) return []

      const { data, error } = await supabase
        .from('fee_accounts')
        .select(`
          *,
          students (first_name, last_name, admission_number),
          fee_structures (name, amount)
        `)
        .eq('school_id', user.school_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as (FeeAccount & { 
        students: { first_name: string; last_name: string; admission_number: string }
        fee_structures: { name: string; amount: number }
      })[]
    },
    enabled: !!user?.school_id,
  })
}

export function useFeePayments() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['fee-payments', user?.school_id],
    queryFn: async () => {
      if (!user?.school_id) return []

      const { data, error } = await supabase
        .from('fee_payments')
        .select(`
          *,
          fee_accounts (
            student_id,
            students (first_name, last_name, admission_number)
          )
        `)
        .eq('school_id', user.school_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as (FeePayment & { 
        fee_accounts: { 
          student_id: string
          students: { first_name: string; last_name: string; admission_number: string }
        }
      })[]
    },
    enabled: !!user?.school_id,
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (paymentData: Partial<FeePayment>) => {
      if (!user?.school_id) throw new Error('No school ID')

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('fee_payments')
        .insert([{ 
          ...paymentData, 
          school_id: user.school_id,
          status: 'completed'
        }])
        .select()
        .single()

      if (paymentError) throw paymentError

      // Update fee account balance
      const { error: updateError } = await supabase.rpc(
        'recalculate_fee_account_balance',
        { account_id: paymentData.fee_account_id }
      )

      if (updateError) throw updateError

      return payment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-payments'] })
      queryClient.invalidateQueries({ queryKey: ['fee-accounts'] })
    },
  })
}

export function useSendSMSReceipt() {
  return useMutation({
    mutationFn: async ({ phoneNumber, message }: { phoneNumber: string; message: string }) => {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: { phone: phoneNumber, message }
      })

      if (error) throw error
      return data
    },
  })
}
