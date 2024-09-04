CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(255) UNIQUE NOT NULL,
  _status VARCHAR(50) DEFAULT 'Not Started',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  google_id VARCHAR(255) UNIQUE,
  oauth_provider VARCHAR(50) DEFAULT 'google',
  profile_picture_url TEXT,
  country VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE conversations (
  conversation_id SERIAL PRIMARY KEY,
  employee_id VARCHAR(255) NOT NULL REFERENCES employees(employee_id),
  start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  message_id SERIAL PRIMARY KEY,
  conversation_id INT NOT NULL REFERENCES conversations(conversation_id),
  sender VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
