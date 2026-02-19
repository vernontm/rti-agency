-- RTI Agency Seed Data
-- Run this after schema.sql to populate test data

-- Insert sample forms
INSERT INTO forms (id, form_name, form_type, fields_schema) VALUES
('11111111-1111-1111-1111-111111111111', 'Employee Onboarding', 'employee_onboarding', '{
  "fields": [
    {"name": "start_date", "type": "date", "label": "Start Date", "required": true},
    {"name": "department", "type": "select", "label": "Department", "options": ["Sales", "Marketing", "Engineering", "HR"], "required": true},
    {"name": "emergency_contact", "type": "text", "label": "Emergency Contact Name", "required": true},
    {"name": "emergency_phone", "type": "tel", "label": "Emergency Contact Phone", "required": true}
  ]
}'),
('22222222-2222-2222-2222-222222222222', 'Time Off Request', 'time_off_request', '{
  "fields": [
    {"name": "leave_type", "type": "select", "label": "Leave Type", "options": ["Vacation", "Sick", "Personal", "Bereavement"], "required": true},
    {"name": "start_date", "type": "date", "label": "Start Date", "required": true},
    {"name": "end_date", "type": "date", "label": "End Date", "required": true},
    {"name": "reason", "type": "textarea", "label": "Reason", "required": false}
  ]
}'),
('33333333-3333-3333-3333-333333333333', 'Expense Report', 'expense_report', '{
  "fields": [
    {"name": "expense_date", "type": "date", "label": "Expense Date", "required": true},
    {"name": "category", "type": "select", "label": "Category", "options": ["Travel", "Meals", "Supplies", "Equipment", "Other"], "required": true},
    {"name": "amount", "type": "number", "label": "Amount ($)", "required": true},
    {"name": "description", "type": "textarea", "label": "Description", "required": true},
    {"name": "receipt", "type": "file", "label": "Receipt", "required": true}
  ]
}'),
('44444444-4444-4444-4444-444444444444', 'Client Intake', 'client_intake', '{
  "fields": [
    {"name": "company_name", "type": "text", "label": "Company Name", "required": true},
    {"name": "industry", "type": "select", "label": "Industry", "options": ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing", "Other"], "required": true},
    {"name": "contact_name", "type": "text", "label": "Primary Contact", "required": true},
    {"name": "contact_email", "type": "email", "label": "Contact Email", "required": true},
    {"name": "contact_phone", "type": "tel", "label": "Contact Phone", "required": true},
    {"name": "services_needed", "type": "textarea", "label": "Services Needed", "required": true}
  ]
}');

-- Insert sample videos
INSERT INTO videos (id, title, description, video_url, duration_seconds, thumbnail_url, category, is_required) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Welcome to RTI Agency', 'An introduction to our company culture, values, and mission.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 300, 'https://picsum.photos/seed/video1/400/225', 'Onboarding', true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Workplace Safety Essentials', 'Learn about workplace safety protocols and emergency procedures.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 600, 'https://picsum.photos/seed/video2/400/225', 'Safety', true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Customer Service Excellence', 'Best practices for delivering exceptional customer service.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 450, 'https://picsum.photos/seed/video3/400/225', 'Skills', false),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Data Privacy & Security', 'Understanding data protection regulations and best practices.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 720, 'https://picsum.photos/seed/video4/400/225', 'Compliance', true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Effective Communication', 'Improve your workplace communication skills.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 540, 'https://picsum.photos/seed/video5/400/225', 'Skills', false);

-- Insert sample services
INSERT INTO services (id, service_name, description, active) VALUES
('11111111-aaaa-aaaa-aaaa-111111111111', 'Staffing Solutions', 'Full-service staffing for temporary, temp-to-hire, and direct placement positions across various industries.', true),
('22222222-bbbb-bbbb-bbbb-222222222222', 'HR Consulting', 'Expert HR consulting services including policy development, compliance audits, and employee relations.', true),
('33333333-cccc-cccc-cccc-333333333333', 'Payroll Services', 'Comprehensive payroll processing, tax filing, and benefits administration.', true),
('44444444-dddd-dddd-dddd-444444444444', 'Training & Development', 'Custom training programs for employee development and compliance requirements.', true),
('55555555-eeee-eeee-eeee-555555555555', 'Background Checks', 'Thorough background screening services for pre-employment and ongoing verification.', true);

-- Insert sample announcements (need a user ID, so we'll use a placeholder that should be updated)
-- You can run this after creating an admin user:
-- INSERT INTO announcements (title, content, target_audience, created_by, sent_at) VALUES
-- ('Welcome to the New Portal', 'We are excited to launch our new employee portal! Explore the features and let us know your feedback.', 'all', 'YOUR_ADMIN_USER_ID', NOW()),
-- ('Upcoming Training Sessions', 'New training videos have been added to the Training section. Please complete all required trainings by end of month.', 'employees', 'YOUR_ADMIN_USER_ID', NOW()),
-- ('Holiday Schedule Update', 'Please review the updated holiday schedule for the upcoming year in the HR section.', 'all', 'YOUR_ADMIN_USER_ID', NOW());
