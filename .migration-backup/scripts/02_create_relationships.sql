-- Create foreign key relationships between tables
-- This connects admin, usuarios, bci_sessions, brain_pulses, generated_image, and images

-- Foreign key from bci_sessions to usuarios (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_bci_sessions_user_id'
  ) THEN
    ALTER TABLE bci_sessions
    ADD CONSTRAINT fk_bci_sessions_user_id
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Foreign key from brain_pulses to usuarios
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_brain_pulses_user_id'
  ) THEN
    ALTER TABLE brain_pulses
    ADD CONSTRAINT fk_brain_pulses_user_id
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Foreign key from brain_pulses to bci_sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_brain_pulses_session_id'
  ) THEN
    ALTER TABLE brain_pulses
    ADD CONSTRAINT fk_brain_pulses_session_id
    FOREIGN KEY (session_id) REFERENCES bci_sessions(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Foreign key from generated_image to usuarios
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_generated_image_user_id'
  ) THEN
    ALTER TABLE generated_image
    ADD CONSTRAINT fk_generated_image_user_id
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Foreign key from generated_image to bci_sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_generated_image_session_id'
  ) THEN
    ALTER TABLE generated_image
    ADD CONSTRAINT fk_generated_image_session_id
    FOREIGN KEY (session_id) REFERENCES bci_sessions(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Foreign key from images to usuarios
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_images_user_id'
  ) THEN
    ALTER TABLE images
    ADD CONSTRAINT fk_images_user_id
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add admin_id to usuarios table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' AND column_name = 'admin_id'
  ) THEN
    ALTER TABLE usuarios
    ADD COLUMN admin_id uuid REFERENCES admin(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_usuarios_admin_id ON usuarios(admin_id);
CREATE INDEX IF NOT EXISTS idx_bci_sessions_user_id ON bci_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_brain_pulses_user_id ON brain_pulses(user_id);
CREATE INDEX IF NOT EXISTS idx_brain_pulses_session_id ON brain_pulses(session_id);
CREATE INDEX IF NOT EXISTS idx_generated_image_user_id ON generated_image(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_image_session_id ON generated_image(session_id);
CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);

-- Insert default admin user if it doesn't exist
INSERT INTO admin (id, email, full_name, permissions, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'systemnoosfera@gmail.com',
  'Sistema Noósfera Admin',
  ARRAY['read_users', 'read_images', 'read_sessions', 'read_pulses', 'manage_users', 'manage_images'],
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
