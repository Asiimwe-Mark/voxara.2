-- SKULI Seed Data and Helper Functions
-- Migration: 003_seed_data.sql

-- ============================================================================
-- HELPER FUNCTIONS FOR RECEIPT GENERATION
-- ============================================================================

-- Generate unique receipt number
CREATE OR REPLACE FUNCTION generate_receipt_number(p_school_id UUID, p_payment_date TIMESTAMPTZ)
RETURNS VARCHAR(100) AS $$
DECLARE
    school_code VARCHAR(50);
    year_month VARCHAR(7);
    sequence_num INTEGER;
    receipt_num VARCHAR(100);
BEGIN
    -- Get school code
    SELECT code INTO school_code FROM schools WHERE id = p_school_id;
    
    -- Format YYYYMM from payment date
    year_month := TO_CHAR(p_payment_date, 'YYYYMM');
    
    -- Get next sequence number for this month
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(receipt_number FROM LENGTH(receipt_number) - 5) AS INTEGER)
    ), 0) + 1 INTO sequence_num
    FROM fee_payments
    WHERE school_id = p_school_id
    AND receipt_number LIKE CONCAT('SKULI-', school_code, '-', year_month, '-%');
    
    -- Format receipt number: SKULI-{SCHOOL_CODE}-{YYYYMM}-{SEQ}
    receipt_num := CONCAT('SKULI-', school_code, '-', year_month, '-', LPAD(sequence_num::TEXT, 6, '0'));
    
    RETURN receipt_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recalculate fee account balance
CREATE OR REPLACE FUNCTION recalculate_fee_account_balance(p_fee_account_id UUID)
RETURNS VOID AS $$
DECLARE
    total_charged DECIMAL(15,2);
    total_paid DECIMAL(15,2);
    new_balance DECIMAL(15,2);
BEGIN
    -- Calculate total charged from fee structures (simplified - can be extended)
    -- For now, we'll just use existing total_charged field
    
    -- Calculate total paid
    SELECT COALESCE(SUM(amount), 0) INTO total_paid
    FROM fee_payments
    WHERE fee_account_id = p_fee_account_id
    AND payment_status = 'COMPLETED'
    AND is_deleted = false;
    
    -- Update the fee account
    UPDATE fee_accounts
    SET 
        total_paid = total_paid,
        balance = total_charged - total_paid,
        status = CASE 
            WHEN (total_charged - total_paid) <= 0 THEN 'CLOSED'
            WHEN due_date < CURRENT_DATE THEN 'OVERDUE'
            ELSE 'ACTIVE'
        END,
        updated_at = NOW()
    WHERE id = p_fee_account_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-recalculate balance on payment
CREATE OR REPLACE FUNCTION trigger_recalculate_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.payment_status != OLD.payment_status) THEN
        PERFORM recalculate_fee_account_balance(NEW.fee_account_id);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recalculate_balance_on_payment
AFTER INSERT OR UPDATE ON fee_payments
FOR EACH ROW
EXECUTE FUNCTION trigger_recalculate_balance();

-- ============================================================================
-- SEED DATA: SUPER ADMIN USER
-- ============================================================================

-- Note: This creates a placeholder. Actual user should be created via Supabase Auth UI
-- The supabase_user_id should be replaced with actual auth.users ID after signup

INSERT INTO schools (
    id,
    name,
    code,
    email,
    phone,
    address,
    currency,
    timezone,
    subscription_status
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'SKULI Platform',
    'SKULI',
    'admin@skuli.ug',
    '+256700000000',
    'Kampala, Uganda',
    'UGX',
    'Africa/Kampala',
    'active'
) ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- SEED DATA: SAMPLE SCHOOL (FOR TESTING)
-- ============================================================================

INSERT INTO schools (
    id,
    name,
    code,
    email,
    phone,
    address,
    currency,
    timezone
) VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Kampala International School',
    'KIS',
    'info@kis.ac.ug',
    '+256414000000',
    'Plot 42, Kampala Road, Kampala',
    'UGX',
    'Africa/Kampala'
) ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- SEED DATA: SAMPLE CLASSES
-- ============================================================================

INSERT INTO classes (
    school_id,
    name,
    code,
    academic_year,
    capacity
) VALUES
    ('00000000-0000-0000-0000-000000000002', 'Primary 1', 'P1', '2024', 40),
    ('00000000-0000-0000-0000-000000000002', 'Primary 2', 'P2', '2024', 40),
    ('00000000-0000-0000-0000-000000000002', 'Primary 3', 'P3', '2024', 40),
    ('00000000-0000-0000-0000-000000000002', 'Primary 4', 'P4', '2024', 40),
    ('00000000-0000-0000-0000-000000000002', 'Primary 5', 'P5', '2024', 40),
    ('00000000-0000-0000-0000-000000000002', 'Primary 6', 'P6', '2024', 40),
    ('00000000-0000-0000-0000-000000000002', 'Primary 7', 'P7', '2024', 40),
    ('00000000-0000-0000-0000-000000000002', 'Senior 1', 'S1', '2024', 45),
    ('00000000-0000-0000-0000-000000000002', 'Senior 2', 'S2', '2024', 45),
    ('00000000-0000-0000-0000-000000000002', 'Senior 3', 'S3', '2024', 45),
    ('00000000-0000-0000-0000-000000000002', 'Senior 4', 'S4', '2024', 45),
    ('00000000-0000-0000-0000-000000000002', 'Senior 5', 'S5', '2024', 45),
    ('00000000-0000-0000-0000-000000000002', 'Senior 6', 'S6', '2024', 45)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: SAMPLE SUBJECTS
-- ============================================================================

INSERT INTO subjects (
    school_id,
    name,
    code,
    description
) VALUES
    ('00000000-0000-0000-0000-000000000002', 'Mathematics', 'MATH', 'Core mathematics curriculum'),
    ('00000000-0000-0000-0000-000000000002', 'English', 'ENG', 'English language and literature'),
    ('00000000-0000-0000-0000-000000000002', 'Science', 'SCI', 'Integrated science'),
    ('00000000-0000-0000-0000-000000000002', 'Social Studies', 'SST', 'Social studies and RE'),
    ('00000000-0000-0000-0000-000000000002', 'Luganda', 'LUG', 'Local language Luganda'),
    ('00000000-0000-0000-0000-000000000002', 'Physics', 'PHY', 'Advanced physics'),
    ('00000000-0000-0000-0000-000000000002', 'Chemistry', 'CHEM', 'Advanced chemistry'),
    ('00000000-0000-0000-0000-000000000002', 'Biology', 'BIO', 'Advanced biology'),
    ('00000000-0000-0000-0000-000000000002', 'History', 'HIST', 'East African history'),
    ('00000000-0000-0000-0000-000000000002', 'Geography', 'GEO', 'Physical and human geography'),
    ('00000000-0000-0000-0000-000000000002', 'Computer Studies', 'COMP', 'ICT and computing'),
    ('00000000-0000-0000-0000-000000000002', 'Agriculture', 'AGR', 'Agricultural science')
ON CONFLICT (school_id, code) DO NOTHING;

-- ============================================================================
-- SEED DATA: SAMPLE FEE STRUCTURES
-- ============================================================================

INSERT INTO fee_structures (
    school_id,
    class_id,
    name,
    amount,
    frequency,
    category,
    description,
    effective_from,
    effective_to
) VALUES
    -- Primary Tuition Term 1
    ('00000000-0000-0000-0000-000000000002', 
     (SELECT id FROM classes WHERE code = 'P1' LIMIT 1),
     'Primary Tuition - Term 1',
     350000,
     'TERM',
     'TUITION',
     'Term 1 tuition fees for Primary classes',
     '2024-01-15',
     '2024-04-30'),
    
    -- Secondary Tuition Term 1
    ('00000000-0000-0000-0000-000000000002', 
     (SELECT id FROM classes WHERE code = 'S1' LIMIT 1),
     'Secondary Tuition - Term 1',
     550000,
     'TERM',
     'TUITION',
     'Term 1 tuition fees for Secondary classes',
     '2024-01-15',
     '2024-04-30'),
    
    -- Examination Fees
    ('00000000-0000-0000-0000-000000000002', 
     NULL,
     'Examination Fees - Term 1',
     50000,
     'TERM',
     'EXAM',
     'End of term examination fees',
     '2024-01-15',
     '2024-04-30'),
    
    -- Activity Fees
    ('00000000-0000-0000-0000-000000000002', 
     NULL,
     'Sports & Activities',
     30000,
     'TERM',
     'ACTIVITY',
     'Co-curricular activities and sports',
     '2024-01-15',
     '2024-04-30'),
    
    -- Transport (Optional)
    ('00000000-0000-0000-0000-000000000002', 
     NULL,
     'School Transport',
     150000,
     'TERM',
     'TRANSPORT',
     'Bus transport service per term',
     '2024-01-15',
     '2024-04-30')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA: SMS TEMPLATES
-- ============================================================================

-- Create a table for SMS templates
CREATE TABLE IF NOT EXISTS sms_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    template_type VARCHAR(50) NOT NULL CHECK (template_type IN (
        'PAYMENT_RECEIPT',
        'FEE_REMINDER',
        'ABSENCE_NOTIFICATION',
        'ANNOUNCEMENT',
        'REPORT_CARD_READY'
    )),
    subject VARCHAR(255),
    body TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view SMS templates"
ON sms_templates FOR SELECT
USING (
    school_id IS NULL OR 
    EXISTS (SELECT 1 FROM users WHERE users.supabase_user_id = auth.uid() AND users.school_id = sms_templates.school_id)
);

CREATE POLICY "School admins can manage SMS templates"
ON sms_templates FOR ALL
USING (
    school_id IS NULL OR 
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.supabase_user_id = auth.uid() 
        AND users.school_id = sms_templates.school_id
        AND users.role IN ('SUPER_ADMIN', 'SCHOOL_ADMIN')
    )
);

-- Insert default templates
INSERT INTO sms_templates (
    school_id,
    name,
    template_type,
    body,
    variables
) VALUES
    (NULL, 'Payment Receipt', 'PAYMENT_RECEIPT', 
     'Dear Parent, received UGX {{amount}} for {{student_name}}. Receipt: {{receipt_number}}. Balance: UGX {{balance}}. Thank you - {{school_name}}',
     '["amount", "student_name", "receipt_number", "balance", "school_name"]'),
    
    (NULL, 'Fee Reminder', 'FEE_REMINDER',
     'Dear Parent, {{student_name}} has an outstanding balance of UGX {{balance}}. Please pay by {{due_date}}. Contact office for arrangements. - {{school_name}}',
     '["student_name", "balance", "due_date", "school_name"]'),
    
    (NULL, 'Absence Notification', 'ABSENCE_NOTIFICATION',
     'Dear Parent, {{student_name}} was absent on {{date}}. If sick, please send medical note. Contact: {{school_phone}}. - {{school_name}}',
     '["student_name", "date", "school_phone", "school_name"]'),
    
    (NULL, 'Report Card Ready', 'REPORT_CARD_READY',
     'Dear Parent, {{student_name}}''s report card for {{term}} {{year}} is ready. Login to parent portal to view. - {{school_name}}',
     '["student_name", "term", "year", "school_name"]')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Student summary view
CREATE OR REPLACE VIEW student_summaries AS
SELECT 
    s.id,
    s.admission_number,
    s.first_name || ' ' || s.last_name AS full_name,
    s.gender,
    s.date_of_birth,
    c.name AS current_class,
    fa.academic_year,
    fa.term,
    fa.total_charged,
    fa.total_paid,
    fa.balance,
    fa.status AS fee_status
FROM students s
LEFT JOIN classes c ON c.id = s.current_class_id
LEFT JOIN fee_accounts fa ON fa.student_id = s.id 
    AND fa.academic_year = (
        SELECT academic_year FROM fee_accounts 
        WHERE student_id = s.id 
        ORDER BY academic_year DESC, term DESC 
        LIMIT 1
    )
WHERE s.is_deleted = false;

-- Class performance view
CREATE OR REPLACE VIEW class_performance AS
SELECT 
    c.id AS class_id,
    c.name AS class_name,
    c.academic_year,
    COUNT(DISTINCT s.id) AS total_students,
    COUNT(DISTINCT CASE WHEN a.status = 'PRESENT' THEN s.id END) AS present_today,
    COUNT(DISTINCT CASE WHEN a.status = 'ABSENT' THEN s.id END) AS absent_today,
    AVG(m.marks_obtained) AS average_marks
FROM classes c
LEFT JOIN students s ON s.current_class_id = c.id AND s.is_deleted = false
LEFT JOIN attendance a ON a.student_id = s.id AND a.date = CURRENT_DATE AND a.is_deleted = false
LEFT JOIN marks m ON m.class_id = c.id AND m.academic_year = c.academic_year AND m.is_deleted = false
WHERE c.is_deleted = false
GROUP BY c.id, c.name, c.academic_year;

-- Revenue summary view
CREATE OR REPLACE VIEW revenue_summary AS
SELECT 
    DATE_TRUNC('month', payment_date) AS month,
    payment_method,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_amount,
    AVG(amount) AS average_amount
FROM fee_payments
WHERE is_deleted = false AND payment_status = 'COMPLETED'
GROUP BY DATE_TRUNC('month', payment_date), payment_method
ORDER BY month DESC;

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Format currency in UGX
CREATE OR REPLACE FUNCTION format_ugx(amount DECIMAL)
RETURNS TEXT AS $$
BEGIN
    RETURN 'UGX ' || TO_CHAR(amount, 'FM999,999,999,999.00');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Get current academic year and term based on date
CREATE OR REPLACE FUNCTION get_current_academic_period()
RETURNS TABLE(academic_year VARCHAR(20), term VARCHAR(20)) AS $$
DECLARE
    current_month INTEGER;
BEGIN
    current_month := EXTRACT(MONTH FROM CURRENT_DATE);
    
    -- Ugandan academic year typically:
    -- Term 1: Feb-April
    -- Term 2: May-August  
    -- Term 3: Sept-Nov
    
    IF current_month BETWEEN 2 AND 4 THEN
        academic_year := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
        term := 'TERM_1';
    ELSIF current_month BETWEEN 5 AND 8 THEN
        academic_year := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
        term := 'TERM_2';
    ELSIF current_month BETWEEN 9 AND 11 THEN
        academic_year := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
        term := 'TERM_3';
    ELSE
        -- Holiday period - return upcoming term
        IF current_month <= 1 OR current_month = 12 THEN
            academic_year := (EXTRACT(YEAR FROM CURRENT_DATE) + 1)::VARCHAR;
            term := 'TERM_1';
        ELSE
            academic_year := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
            term := 'TERM_3';
        END IF;
    END IF;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_receipt_number IS 'Generates unique receipt number per school per month';
COMMENT ON FUNCTION recalculate_fee_account_balance IS 'Recalculates fee account balance after payment';
COMMENT ON FUNCTION format_ugx IS 'Formats decimal as UGX currency string';
COMMENT ON FUNCTION get_current_academic_period IS 'Returns current academic year and term based on Ugandan calendar';
COMMENT ON VIEW student_summaries IS 'Quick student overview with current fee status';
COMMENT ON VIEW class_performance IS 'Class-level analytics for attendance and performance';
COMMENT ON VIEW revenue_summary IS 'Monthly revenue breakdown by payment method';
