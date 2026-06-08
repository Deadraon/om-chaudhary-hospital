-- ============================================
-- Om Chaudhary Hospital & Trauma Centre
-- Database Schema for Cloudflare D1
-- ============================================

-- Users table (all roles: super_admin, doctor, receptionist, patient)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('super_admin', 'doctor', 'receptionist', 'patient')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

-- Doctors
CREATE TABLE IF NOT EXISTS doctors (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  speciality TEXT,
  experience TEXT,
  phone TEXT,
  department_id TEXT,
  photo_r2_key TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  doctor_id TEXT,
  department_id TEXT,
  preferred_date TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  message TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  dob TEXT,
  blood_group TEXT,
  address TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Staff
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  email TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  check_in TEXT,
  check_out TEXT,
  status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'half_day', 'on_leave')),
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, date)
);

-- Lab Reports
CREATE TABLE IF NOT EXISTS lab_reports (
  id TEXT PRIMARY KEY,
  patient_id TEXT,
  title TEXT NOT NULL,
  r2_file_key TEXT,
  uploaded_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- ============================================
-- Seed Data
-- ============================================

-- Default departments
INSERT OR IGNORE INTO departments (id, name, description) VALUES
  ('dept-emergency', 'Emergency & Trauma', 'Round-the-clock emergency and trauma care with state-of-the-art equipment and experienced doctors.'),
  ('dept-cardiology', 'Cardiology', 'Comprehensive heart care including diagnostics, interventional procedures, and cardiac rehabilitation.'),
  ('dept-orthopedics', 'Orthopedics', 'Expert bone, joint, and spine care with advanced surgical and non-surgical treatment options.'),
  ('dept-neurology', 'Neurology', 'Specialized care for brain, spinal cord, and nervous system disorders.'),
  ('dept-pediatrics', 'Pediatrics', 'Compassionate healthcare for infants, children, and adolescents.'),
  ('dept-gynecology', 'Gynecology & Obstetrics', 'Complete women health services including maternity care and gynecological treatments.'),
  ('dept-ent', 'ENT (Ear, Nose, Throat)', 'Diagnosis and treatment of ear, nose, and throat conditions.'),
  ('dept-ophthalmology', 'Ophthalmology', 'Complete eye care including cataract surgery, LASIK, and retinal treatments.'),
  ('dept-dermatology', 'Dermatology', 'Skin, hair, and nail care with advanced cosmetic and medical dermatology.'),
  ('dept-radiology', 'Radiology & Imaging', 'Advanced diagnostic imaging including X-ray, CT scan, MRI, and ultrasound.'),
  ('dept-pathology', 'Pathology & Lab', 'Accurate and timely diagnostic laboratory services.'),
  ('dept-general', 'General Medicine', 'Primary healthcare and internal medicine for all age groups.');

-- Default super admin (password: Admin@123)
-- bcrypt hash for "Admin@123" with 12 rounds
INSERT OR IGNORE INTO users (id, name, email, password_hash, role, created_at) VALUES
  ('admin-001', 'Super Admin', 'admin@omchaudharyhospital.com', '$2a$12$LJ3m4ys3GZHkswMZPCHmqOKDRR8OlEi6Mce0cR2LvCAXyuVphkWW', 'super_admin', datetime('now'));
