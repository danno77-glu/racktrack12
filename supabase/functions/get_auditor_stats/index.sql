-- Function to count completed audits for a given auditor
    CREATE OR REPLACE FUNCTION get_completed_audits(auditor_name_param TEXT)
    RETURNS INTEGER AS $$
    BEGIN
      RETURN (
        SELECT COUNT(*)
        FROM audits au
        WHERE au.auditor_name = auditor_name_param
      );
    END;
    $$ LANGUAGE plpgsql;

    -- Function to count booked audits for a given auditor
    CREATE OR REPLACE FUNCTION get_booked_audits(auditor_id_param UUID)
    RETURNS INTEGER AS $$
    BEGIN
      RETURN (
        SELECT COUNT(*)
        FROM scheduled_audits sa
        WHERE sa.auditor_id = auditor_id_param
          AND sa.booking_date >= CURRENT_DATE
          AND sa.completed = FALSE
      );
    END;
    $$ LANGUAGE plpgsql;

    -- Function to count outstanding audits for a given auditor
    CREATE OR REPLACE FUNCTION get_outstanding_audits(auditor_name_param TEXT)
    RETURNS INTEGER AS $$
    BEGIN
      RETURN (
        SELECT COUNT(*)
        FROM customers c
        WHERE c.default_auditor = auditor_name_param
          AND (c.next_audit_due < CURRENT_DATE OR c.next_audit_due IS NULL)
          AND NOT EXISTS (
            SELECT 1
            FROM scheduled_audits sa
            WHERE sa.customer_id = c.id
            AND sa.completed = FALSE
          )
          AND NOT EXISTS (
            SELECT 1
            FROM audits au
            WHERE au.customer_id = c.id AND au.auditor_name = auditor_name_param
          )
      );
    END;
    $$ LANGUAGE plpgsql;

    -- Main function to get auditor statistics
    CREATE OR REPLACE FUNCTION get_auditor_stats()
    RETURNS TABLE (
      auditor_id UUID,
      auditor_name TEXT,
      completed_audits INTEGER,
      booked_audits INTEGER,
      outstanding_audits INTEGER
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT
        a.id AS auditor_id,
        a.name AS auditor_name,
        get_completed_audits(a.name) AS completed_audits,
        get_booked_audits(a.id) AS booked_audits,
        get_outstanding_audits(a.name) AS outstanding_audits
      FROM
        auditors a;
    END;
    $$ LANGUAGE plpgsql;
