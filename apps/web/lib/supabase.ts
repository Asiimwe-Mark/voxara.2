import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Student = {
  id: string
  school_id: string
  admission_number: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: 'Male' | 'Female'
  class_id: string
  parent_email: string
  parent_phone: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type FeeStructure = {
  id: string
  school_id: string
  name: string
  amount: number
  class_id: string
  academic_year: string
  term: string
  is_active: boolean
  created_at: string
}

export type FeeAccount = {
  id: string
  school_id: string
  student_id: string
  fee_structure_id: string
  total_amount: number
  paid_amount: number
  balance: number
  status: 'pending' | 'partial' | 'paid' | 'overdue'
  due_date: string
  created_at: string
  updated_at: string
}

export type FeePayment = {
  id: string
  school_id: string
  fee_account_id: string
  amount: number
  payment_method: 'cash' | 'mobile_money' | 'bank_transfer'
  payment_reference: string
  receipt_number: string
  paid_by: string
  notes?: string
  status: 'pending' | 'completed' | 'failed'
  sms_sent: boolean
  created_at: string
  updated_at: string
}

export type Attendance = {
  id: string
  school_id: string
  student_id: string
  class_id: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
  marked_by: string
  created_at: string
}

export type SMSLog = {
  id: string
  school_id: string
  recipient: string
  message: string
  status: 'queued' | 'sent' | 'delivered' | 'failed'
  provider: 'africa_talking'
  cost: number
  sent_at?: string
  delivered_at?: string
  error_message?: string
  created_at: string
}
