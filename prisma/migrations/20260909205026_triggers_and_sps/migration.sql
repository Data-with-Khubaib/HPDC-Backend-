-- Function and Trigger for Application Submitted
CREATE OR REPLACE FUNCTION log_application_submitted()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_user_name text;
  v_email text;
BEGIN
  SELECT u.id, u.name, u.email INTO v_user_id, v_user_name, v_email
  FROM "Companies" c
  JOIN "Users" u ON c.user_id = u.id
  WHERE c.id = NEW.company_id;

  INSERT INTO "All_Activity_Log" (id, user_id, application_id, user_name, action_text, created_at)
  VALUES (gen_random_uuid(), v_user_id, NEW.id, v_user_name, 'Application submitted by ' || NEW.company_name, NOW());

  INSERT INTO "Activity_Timeline" (id, application_id, email, action_text, created_at)
  VALUES (gen_random_uuid(), NEW.id, v_email, 'Application submitted by ' || NEW.company_name, NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_application_submitted
AFTER INSERT ON "Application"
FOR EACH ROW
EXECUTE FUNCTION log_application_submitted();

-- Function and Trigger for Application Status Changed
CREATE OR REPLACE FUNCTION log_application_status_changed()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_user_name text;
  v_email text;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    SELECT u.id, u.name, u.email INTO v_user_id, v_user_name, v_email
    FROM "Companies" c
    JOIN "Users" u ON c.user_id = u.id
    WHERE c.id = NEW.company_id;

    INSERT INTO "All_Activity_Log" (id, user_id, application_id, user_name, action_text, created_at)
    VALUES (gen_random_uuid(), v_user_id, NEW.id, v_user_name, 'Application status changed to ' || NEW.status, NOW());

    INSERT INTO "Activity_Timeline" (id, application_id, email, action_text, created_at)
    VALUES (gen_random_uuid(), NEW.id, v_email, 'Application status changed to ' || NEW.status, NOW());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_application_status_changed
AFTER UPDATE OF status ON "Application"
FOR EACH ROW
EXECUTE FUNCTION log_application_status_changed();

-- Function and Trigger for Comment Added
CREATE OR REPLACE FUNCTION log_comment_added()
RETURNS TRIGGER AS $$
DECLARE
  v_user_name text;
  v_email text;
BEGIN
  SELECT name, email INTO v_user_name, v_email
  FROM "Users"
  WHERE id = NEW.sender_id;

  INSERT INTO "All_Activity_Log" (id, user_id, application_id, user_name, action_text, created_at)
  VALUES (gen_random_uuid(), NEW.sender_id, NEW.application_id, v_user_name, 'Comment added by ' || v_user_name, NOW());

  INSERT INTO "Activity_Timeline" (id, application_id, email, action_text, created_at)
  VALUES (gen_random_uuid(), NEW.application_id, v_email, 'Comment added by ' || v_user_name, NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comment_added
AFTER INSERT ON "application_comments"
FOR EACH ROW
EXECUTE FUNCTION log_comment_added();

-- Function and Trigger for Condition Added
CREATE OR REPLACE FUNCTION log_condition_added()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_user_name text;
  v_email text;
BEGIN
  -- We'll assume admin adds the condition, but we need to log it. The condition doesn't have sender_id.
  -- We'll associate the timeline event with the company email, and the All Activity log with the company?
  -- Actually, let's just fetch the company user associated with the application.
  SELECT u.id, u.name, u.email INTO v_user_id, v_user_name, v_email
  FROM "Application" a
  JOIN "Companies" c ON a.company_id = c.id
  JOIN "Users" u ON c.user_id = u.id
  WHERE a.id = NEW.application_id;

  INSERT INTO "All_Activity_Log" (id, user_id, application_id, user_name, action_text, created_at)
  VALUES (gen_random_uuid(), v_user_id, NEW.application_id, v_user_name, 'Conditional approval reason recorded', NOW());

  INSERT INTO "Activity_Timeline" (id, application_id, email, action_text, created_at)
  VALUES (gen_random_uuid(), NEW.application_id, v_email, 'Conditional approval reason recorded', NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_condition_added
AFTER INSERT ON "Application_Conditions"
FOR EACH ROW
EXECUTE FUNCTION log_condition_added();

-- Function and Trigger for Certificate Issued
CREATE OR REPLACE FUNCTION log_certificate_issued()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_user_name text;
  v_company_name text;
BEGIN
  SELECT u.id, u.name, c.company_name INTO v_user_id, v_user_name, v_company_name
  FROM "Companies" c
  JOIN "Users" u ON c.user_id = u.id
  WHERE c.id = NEW.company_id;

  INSERT INTO "All_Activity_Log" (id, user_id, application_id, user_name, action_text, created_at)
  VALUES (gen_random_uuid(), v_user_id, NEW.application_id, v_user_name, 'Certificate issued for ' || v_company_name, NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_certificate_issued
AFTER INSERT ON "Certificates"
FOR EACH ROW
EXECUTE FUNCTION log_certificate_issued();

-- Function and Trigger for Certificate Paid
CREATE OR REPLACE FUNCTION log_certificate_paid()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_user_name text;
  v_company_name text;
BEGIN
  IF NEW.paid = true AND OLD.paid = false THEN
    SELECT u.id, u.name, c.company_name INTO v_user_id, v_user_name, v_company_name
    FROM "Companies" c
    JOIN "Users" u ON c.user_id = u.id
    WHERE c.id = NEW.company_id;

    INSERT INTO "All_Activity_Log" (id, user_id, application_id, user_name, action_text, created_at)
    VALUES (gen_random_uuid(), v_user_id, NEW.application_id, v_user_name, 'Certification fee paid by ' || v_company_name, NOW());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_certificate_paid
AFTER UPDATE OF paid ON "Certificates"
FOR EACH ROW
EXECUTE FUNCTION log_certificate_paid();

-- Stored Procedure for Company Dashboard
CREATE OR REPLACE FUNCTION sp_get_company_dashboard(p_company_id uuid)
RETURNS TABLE (
  TotalApplication INT,
  RejectedApplication INT,
  ActiveCertificates INT,
  SuspendCertificates INT,
  WithdrawnCertificates INT,
  ExpiredCertificates INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INT FROM "Application" WHERE company_id = p_company_id) AS TotalApplication,
    (SELECT COUNT(*)::INT FROM "Application" WHERE company_id = p_company_id AND status = 'rejected') AS RejectedApplication,
    (SELECT COUNT(*)::INT FROM "Certificates" WHERE company_id = p_company_id AND status = 'active' AND paid = true) AS ActiveCertificates,
    (SELECT COUNT(*)::INT FROM "Certificates" WHERE company_id = p_company_id AND status = 'suspended') AS SuspendCertificates,
    (SELECT COUNT(*)::INT FROM "Application" WHERE company_id = p_company_id AND status = 'withdrawn') AS WithdrawnCertificates,
    (SELECT COUNT(*)::INT FROM "Certificates" WHERE company_id = p_company_id AND expiry < CURRENT_DATE) AS ExpiredCertificates;
END;
$$ LANGUAGE plpgsql;

-- Stored Procedure for Admin Dashboard
CREATE OR REPLACE FUNCTION sp_get_admin_dashboard()
RETURNS TABLE (
  TotalApplication INT,
  RejectedApplication INT,
  ActiveCertificates INT,
  SuspendCertificates INT,
  WithdrawnCertificates INT,
  ExpiredCertificates INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INT FROM "Application") AS TotalApplication,
    (SELECT COUNT(*)::INT FROM "Application" WHERE status = 'rejected') AS RejectedApplication,
    (SELECT COUNT(*)::INT FROM "Certificates" WHERE status = 'active' AND paid = true) AS ActiveCertificates,
    (SELECT COUNT(*)::INT FROM "Certificates" WHERE status = 'suspended') AS SuspendCertificates,
    (SELECT COUNT(*)::INT FROM "Application" WHERE status = 'withdrawn') AS WithdrawnCertificates,
    (SELECT COUNT(*)::INT FROM "Certificates" WHERE expiry < CURRENT_DATE) AS ExpiredCertificates;
END;
$$ LANGUAGE plpgsql;