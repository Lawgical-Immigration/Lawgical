CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  _status VARCHAR(50) DEFAULT 'Not Started',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  email VARCHAR(100) NOT NULL,
  country VARCHAR(50) NOT NULL
);

CREATE TABLE conversations (
  conversation_id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employees(employee_id),
  startTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  message_id SERIAL PRIMARY KEY,
  conversation_id INT NOT NULL REFERENCES conversations(conversation_id),
  sender VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  startTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

