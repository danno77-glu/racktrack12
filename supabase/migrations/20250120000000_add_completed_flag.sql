-- Add a completed column to the scheduled_audits table
    ALTER TABLE scheduled_audits
    ADD COLUMN completed BOOLEAN DEFAULT FALSE NOT NULL;

    -- Update the updated_at trigger function
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Update the trigger for scheduled_audits
    CREATE TRIGGER update_scheduled_audits_updated_at
      BEFORE UPDATE ON scheduled_audits
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
