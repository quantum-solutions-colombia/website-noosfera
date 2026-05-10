-- Crear tabla de admin
CREATE TABLE IF NOT EXISTS admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  permissions TEXT[] DEFAULT ARRAY['all'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Crear tabla de imágenes
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_name VARCHAR(255),
  image_type VARCHAR(50),
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_data JSONB
);

-- Crear tabla de sesiones BCI
CREATE TABLE IF NOT EXISTS bci_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  device_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  disconnected_at TIMESTAMP WITH TIME ZONE,
  total_pulses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de pulsos cerebrales
CREATE TABLE IF NOT EXISTS brain_pulses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES bci_sessions(id) ON DELETE CASCADE,
  pulse_value FLOAT NOT NULL,
  wave_type VARCHAR(50),
  frequency FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla generated_image para compatibilidad
CREATE TABLE IF NOT EXISTS generated_image (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  session_id UUID REFERENCES bci_sessions(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  processing_time_ms INTEGER,
  generation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimización
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_plan ON usuarios(plan);
CREATE INDEX idx_images_user_id ON images(user_id);
CREATE INDEX idx_bci_sessions_user_id ON bci_sessions(user_id);
CREATE INDEX idx_brain_pulses_user_id ON brain_pulses(user_id);
CREATE INDEX idx_brain_pulses_session_id ON brain_pulses(session_id);
CREATE INDEX idx_generated_image_user_id ON generated_image(user_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bci_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_pulses ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_image ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Admin solo puede ver su propia información
CREATE POLICY "Admin can view own data"
ON admin FOR SELECT
USING (auth.uid()::text = id::text);

-- Usuarios solo pueden ver su propia información
CREATE POLICY "Users can view own data"
ON usuarios FOR SELECT
USING (auth.uid()::text = id::text);

-- Usuarios solo pueden ver sus imágenes
CREATE POLICY "Users can view own images"
ON images FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Usuarios solo pueden ver sus sesiones BCI
CREATE POLICY "Users can view own BCI sessions"
ON bci_sessions FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Usuarios solo pueden ver sus pulsos cerebrales
CREATE POLICY "Users can view own brain pulses"
ON brain_pulses FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Usuarios solo pueden ver sus imágenes generadas
CREATE POLICY "Users can view own generated images"
ON generated_image FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Insertar admin por defecto
INSERT INTO admin (email, full_name, permissions)
VALUES ('systemnoosfera@gmail.com', 'System Admin Noösfera', ARRAY['all', 'manage_users', 'manage_content', 'view_analytics'])
ON CONFLICT (email) DO NOTHING;
