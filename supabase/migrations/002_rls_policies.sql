-- SKULI Row Level Security (RLS) Policies
-- Migration: 002_rls_policies.sql

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get current user's school_id
CREATE OR REPLACE FUNCTION get_current_school_id()
RETURNS UUID AS $$
DECLARE
    school_id UUID;
BEGIN
    SELECT u.school_id INTO school_id
    FROM users u
    WHERE u.supabase_user_id = auth.uid();
    RETURN school_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get current user's role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
DECLARE
    user_role_val user_role;
BEGIN
    SELECT u.role INTO user_role_val
    FROM users u
    WHERE u.supabase_user_id = auth.uid();
    RETURN user_role_val;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is SUPER_ADMIN
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_current_user_role() = 'SUPER_ADMIN';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user belongs to school
CREATE OR REPLACE FUNCTION belongs_to_school(target_school_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF is_super_admin() THEN
        RETURN TRUE;
    END IF;
    RETURN get_current_school_id() = target_school_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SCHOOLS POLICIES
-- ============================================================================

-- SUPER_ADMIN can see all schools
CREATE POLICY "Super admins can view all schools"
ON schools FOR SELECT
USING (is_super_admin());

-- School members can view their own school
CREATE POLICY "Users can view their own school"
ON schools FOR SELECT
USING (belongs_to_school(id));

-- Only SUPER_ADMIN can insert schools
CREATE POLICY "Super admins can create schools"
ON schools FOR INSERT
WITH CHECK (is_super_admin());

-- Only SUPER_ADMIN can update schools
CREATE POLICY "Super admins can update schools"
ON schools FOR UPDATE
USING (is_super_admin());

-- ============================================================================
-- USERS POLICIES
-- ============================================================================

-- Users can view others in their school
CREATE POLICY "Users can view school members"
ON users FOR SELECT
USING (belongs_to_school(school_id));

-- Users can view their own record
CREATE POLICY "Users can view themselves"
ON users FOR SELECT
USING (supabase_user_id = auth.uid());

-- SCHOOL_ADMIN can insert users in their school
CREATE POLICY "School admins can create users"
ON users FOR INSERT
WITH CHECK (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN')
);

-- SCHOOL_ADMIN can update users in their school (but not SUPER_ADMIN)
CREATE POLICY "School admins can update users"
ON users FOR UPDATE
USING (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN')
);

-- Users can update their own profile
CREATE POLICY "Users can update themselves"
ON users FOR UPDATE
USING (supabase_user_id = auth.uid())
WITH CHECK (
    role = OLD.role AND -- Prevent role self-escalation
    school_id = OLD.school_id -- Prevent school self-change
);

-- ============================================================================
-- CLASSES POLICIES
-- ============================================================================

CREATE POLICY "School members can view classes"
ON classes FOR SELECT
USING (belongs_to_school(school_id));

CREATE POLICY "School admins can create classes"
ON classes FOR INSERT
WITH CHECK (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN')
);

CREATE POLICY "School admins can update classes"
ON classes FOR UPDATE
USING (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN')
);

-- ============================================================================
-- STUDENTS POLICIES
-- ============================================================================

CREATE POLICY "School members can view students"
ON students FOR SELECT
USING (belongs_to_school(school_id));

CREATE POLICY "School admins and teachers can create students"
ON students FOR INSERT
WITH CHECK (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'BURSAR')
);

CREATE POLICY "School admins and bursars can update students"
ON students FOR UPDATE
USING (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'BURSAR')
);

-- ============================================================================
-- PARENTS POLICIES
-- ============================================================================

CREATE POLICY "School members can view parents"
ON parents FOR SELECT
USING (belongs_to_school(school_id));

-- Parents can view their own record
CREATE POLICY "Parents can view themselves"
ON parents FOR SELECT
USING (user_id IN (
    SELECT id FROM users WHERE supabase_user_id = auth.uid()
));

CREATE POLICY "School admins can create parents"
ON parents FOR INSERT
WITH CHECK (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'BURSAR')
);

-- ============================================================================
-- STUDENT-PARENT RELATIONSHIPS
-- ============================================================================

CREATE POLICY "School members can view student-parent relationships"
ON student_parents FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM students s 
        WHERE s.id = student_parents.student_id 
        AND belongs_to_school(s.school_id)
    )
);

-- ============================================================================
-- SUBJECTS POLICIES
-- ============================================================================

CREATE POLICY "School members can view subjects"
ON subjects FOR SELECT
USING (belongs_to_school(school_id));

CREATE POLICY "School admins can create subjects"
ON subjects FOR INSERT
WITH CHECK (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN')
);

-- ============================================================================
-- FEE STRUCTURES POLICIES
-- ============================================================================

CREATE POLICY "School members can view fee structures"
ON fee_structures FOR SELECT
USING (belongs_to_school(school_id));

CREATE POLICY "School admins and bursars can manage fee structures"
ON fee_structures FOR ALL
USING (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'BURSAR')
);

-- ============================================================================
-- FEE ACCOUNTS POLICIES
-- ============================================================================

CREATE POLICY "School members can view fee accounts"
ON fee_accounts FOR SELECT
USING (belongs_to_school(school_id));

-- Parents can view their children's fee accounts
CREATE POLICY "Parents can view children fee accounts"
ON fee_accounts FOR SELECT
USING (
    student_id IN (
        SELECT sp.student_id 
        FROM student_parents sp
        JOIN parents p ON p.id = sp.parent_id
        JOIN users u ON u.id = p.user_id
        WHERE u.supabase_user_id = auth.uid()
    )
);

CREATE POLICY "School admins and bursars can manage fee accounts"
ON fee_accounts FOR ALL
USING (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'BURSAR')
);

-- ============================================================================
-- FEE PAYMENTS POLICIES
-- ============================================================================

CREATE POLICY "School members can view payments"
ON fee_payments FOR SELECT
USING (belongs_to_school(school_id));

-- Parents can view their children's payments
CREATE POLICY "Parents can view children payments"
ON fee_payments FOR SELECT
USING (
    fee_account_id IN (
        SELECT fa.id 
        FROM fee_accounts fa
        JOIN student_parents sp ON sp.student_id = fa.student_id
        JOIN parents p ON p.id = sp.parent_id
        JOIN users u ON u.id = p.user_id
        WHERE u.supabase_user_id = auth.uid()
    )
);

CREATE POLICY "School admins and bursars can create payments"
ON fee_payments FOR INSERT
WITH CHECK (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'BURSAR')
);

CREATE POLICY "School admins and bursars can update payments"
ON fee_payments FOR UPDATE
USING (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'BURSAR')
);

-- ============================================================================
-- ATTENDANCE POLICIES
-- ============================================================================

CREATE POLICY "School members can view attendance"
ON attendance FOR SELECT
USING (belongs_to_school(school_id));

-- Parents can view their children's attendance
CREATE POLICY "Parents can view children attendance"
ON attendance FOR SELECT
USING (
    student_id IN (
        SELECT sp.student_id 
        FROM student_parents sp
        JOIN parents p ON p.id = sp.parent_id
        JOIN users u ON u.id = p.user_id
        WHERE u.supabase_user_id = auth.uid()
    )
);

CREATE POLICY "Teachers and admins can mark attendance"
ON attendance FOR ALL
USING (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')
);

-- ============================================================================
-- MARKS POLICIES
-- ============================================================================

CREATE POLICY "School members can view marks"
ON marks FOR SELECT
USING (belongs_to_school(school_id));

-- Parents can view their children's marks
CREATE POLICY "Parents can view children marks"
ON marks FOR SELECT
USING (
    student_id IN (
        SELECT sp.student_id 
        FROM student_parents sp
        JOIN parents p ON p.id = sp.parent_id
        JOIN users u ON u.id = p.user_id
        WHERE u.supabase_user_id = auth.uid()
    )
);

CREATE POLICY "Teachers and admins can manage marks"
ON marks FOR ALL
USING (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')
);

-- ============================================================================
-- REPORT CARDS POLICIES
-- ============================================================================

CREATE POLICY "School members can view report cards"
ON report_cards FOR SELECT
USING (belongs_to_school(school_id));

-- Parents can view their children's report cards
CREATE POLICY "Parents can view children report cards"
ON report_cards FOR SELECT
USING (
    student_id IN (
        SELECT sp.student_id 
        FROM student_parents sp
        JOIN parents p ON p.id = sp.parent_id
        JOIN users u ON u.id = p.user_id
        WHERE u.supabase_user_id = auth.uid()
    )
);

CREATE POLICY "School admins and teachers can manage report cards"
ON report_cards FOR ALL
USING (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')
);

-- ============================================================================
-- SMS LOGS POLICIES
-- ============================================================================

CREATE POLICY "School members can view SMS logs"
ON sms_logs FOR SELECT
USING (belongs_to_school(school_id));

CREATE POLICY "System can insert SMS logs"
ON sms_logs FOR INSERT
WITH CHECK (belongs_to_school(school_id));

-- ============================================================================
-- AUDIT LOGS POLICIES
-- ============================================================================

-- Only SUPER_ADMIN and SCHOOL_ADMIN can view audit logs
CREATE POLICY "Admins can view audit logs"
ON audit_logs FOR SELECT
USING (
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN') AND
    (school_id IS NULL OR belongs_to_school(school_id))
);

-- System inserts audit logs (no user restriction on insert)
CREATE POLICY "System can insert audit logs"
ON audit_logs FOR INSERT
WITH CHECK (TRUE);

-- ============================================================================
-- SUBSCRIPTIONS POLICIES
-- ============================================================================

CREATE POLICY "School members can view subscriptions"
ON subscriptions FOR SELECT
USING (belongs_to_school(school_id));

CREATE POLICY "Super admins can manage subscriptions"
ON subscriptions FOR ALL
USING (is_super_admin());

-- ============================================================================
-- ANNOUNCEMENTS POLICIES
-- ============================================================================

CREATE POLICY "School members can view active announcements"
ON announcements FOR SELECT
USING (
    belongs_to_school(school_id) AND
    (is_active = true OR get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN'))
);

CREATE POLICY "School admins can manage announcements"
ON announcements FOR ALL
USING (
    belongs_to_school(school_id) AND 
    get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN')
);

-- ============================================================================
-- TRIGGER: Auto-create audit log on mutations
-- ============================================================================

CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (
            school_id,
            user_id,
            action,
            entity_type,
            entity_id,
            new_values,
            ip_address,
            user_agent
        ) VALUES (
            NEW.school_id,
            (SELECT id FROM users WHERE supabase_user_id = auth.uid()),
            'CREATE',
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(NEW),
            COALESCE(
                NULLIF(current_setting('request.headers', TRUE), '')::jsonb->>'x-forwarded-for',
                current_setting('request.headers', TRUE)::jsonb->>'cf-connecting-ip'
            )::inet,
            current_setting('request.headers', TRUE)::jsonb->>'user-agent'
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (
            school_id,
            user_id,
            action,
            entity_type,
            entity_id,
            old_values,
            new_values,
            ip_address,
            user_agent
        ) VALUES (
            COALESCE(NEW.school_id, OLD.school_id),
            (SELECT id FROM users WHERE supabase_user_id = auth.uid()),
            'UPDATE',
            TG_TABLE_NAME,
            COALESCE(NEW.id, OLD.id),
            to_jsonb(OLD),
            to_jsonb(NEW),
            COALESCE(
                NULLIF(current_setting('request.headers', TRUE), '')::jsonb->>'x-forwarded-for',
                current_setting('request.headers', TRUE)::jsonb->>'cf-connecting-ip'
            )::inet,
            current_setting('request.headers', TRUE)::jsonb->>'user-agent'
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (
            school_id,
            user_id,
            action,
            entity_type,
            entity_id,
            old_values,
            ip_address,
            user_agent
        ) VALUES (
            OLD.school_id,
            (SELECT id FROM users WHERE supabase_user_id = auth.uid()),
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            to_jsonb(OLD),
            COALESCE(
                NULLIF(current_setting('request.headers', TRUE), '')::jsonb->>'x-forwarded-for',
                current_setting('request.headers', TRUE)::jsonb->>'cf-connecting-ip'
            )::inet,
            current_setting('request.headers', TRUE)::jsonb->>'user-agent'
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit log trigger to critical tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT tablename FROM pg_tables 
             WHERE schemaname = 'public' 
             AND tablename IN (
                 'schools', 'users', 'students', 'parents', 'classes',
                 'fee_structures', 'fee_accounts', 'fee_payments',
                 'attendance', 'marks', 'report_cards', 'announcements'
             )
    LOOP
        EXECUTE format('
            CREATE TRIGGER audit_%s_changes
            AFTER INSERT OR UPDATE OR DELETE ON %s
            FOR EACH ROW
            EXECUTE FUNCTION create_audit_log()',
            t, t
        );
    END LOOP;
END $$;

COMMENT ON FUNCTION get_current_school_id IS 'Helper to get current user''s school ID';
COMMENT ON FUNCTION get_current_user_role IS 'Helper to get current user''s role';
COMMENT ON FUNCTION is_super_admin IS 'Check if current user is SUPER_ADMIN';
COMMENT ON FUNCTION belongs_to_school IS 'Check if user belongs to target school';
COMMENT ON FUNCTION create_audit_log IS 'Auto-create audit log on data mutations';
