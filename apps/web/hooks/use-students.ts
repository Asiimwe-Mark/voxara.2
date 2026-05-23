import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Student } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth-store'

export function useStudents() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['students', user?.school_id],
    queryFn: async () => {
      if (!user?.school_id) return []
      
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          classes (name, stream)
        `)
        .eq('school_id', user.school_id)
        .eq('is_deleted', false)
        .order('last_name', { ascending: true })

      if (error) throw error
      return data as (Student & { classes: { name: string; stream: string } })[]
    },
    enabled: !!user?.school_id,
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (studentData: Partial<Student>) => {
      if (!user?.school_id) throw new Error('No school ID')

      const { data, error } = await supabase
        .from('students')
        .insert([{ ...studentData, school_id: user.school_id }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Student> }) => {
      const { data: updated, error } = await supabase
        .from('students')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .update({ is_deleted: true })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}
