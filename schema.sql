-- Drop existing tables to ensure clean setup
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS penalties;
DROP TABLE IF EXISTS earnings;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS availability;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS plans;
DROP TABLE IF EXISTS trainers;
DROP TABLE IF EXISTS users;

-- 1. users
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    plan_type ENUM('PLUS', 'PRO'),
    plan_expiry DATE,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. trainers
CREATE TABLE trainers (
    trainer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    demo_video_url VARCHAR(255),
    bio TEXT,
    specialisation VARCHAR(255),
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    is_approved BOOLEAN DEFAULT FALSE,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. plans
CREATE TABLE plans (
    plan_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plan_name ENUM('PLUS', 'PRO') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_days INT NOT NULL,
    daily_hours INT NOT NULL,
    max_trainers INT NOT NULL,
    call_type ENUM('AUDIO', 'VIDEO') NOT NULL
);

-- 4. subscriptions
CREATE TABLE subscriptions (
    sub_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(plan_id) ON DELETE CASCADE
);

-- 5. availability
CREATE TABLE availability (
    avail_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trainer_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id) ON DELETE CASCADE
);

-- 6. bookings
CREATE TABLE bookings (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    trainer_id BIGINT NOT NULL,
    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'RESCHEDULED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id) ON DELETE CASCADE
);

-- 7. sessions
CREATE TABLE sessions (
    session_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    trainer_id BIGINT NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_mins INT DEFAULT 0,
    status ENUM('COMPLETED', 'MISSED', 'RESCHEDULED') DEFAULT 'COMPLETED',
    call_type ENUM('AUDIO', 'VIDEO') NOT NULL,
    agora_channel VARCHAR(100),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id) ON DELETE CASCADE
);

-- 8. payments
CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(plan_id) ON DELETE CASCADE
);

-- 9. earnings
CREATE TABLE earnings (
    earning_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trainer_id BIGINT NOT NULL,
    session_id BIGINT NOT NULL,
    gross_amount DECIMAL(10,2) NOT NULL,
    commission_percent DECIMAL(5,2) DEFAULT 16.00,
    commission_amount DECIMAL(10,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL,
    penalty_deduction DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

-- 10. penalties
CREATE TABLE penalties (
    penalty_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trainer_id BIGINT NOT NULL,
    session_id BIGINT NOT NULL,
    reason VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

-- 11. ratings
CREATE TABLE ratings (
    rating_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    trainer_id BIGINT NOT NULL,
    session_id BIGINT NOT NULL,
    stars INT CHECK (stars BETWEEN 1 AND 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

-- 12. notifications
CREATE TABLE notifications (
    notif_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_type ENUM('USER', 'TRAINER') NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data

-- Plans
INSERT INTO plans (plan_name, price, duration_days, daily_hours, max_trainers, call_type) VALUES 
('PLUS', 300.00, 5, 1, 2, 'AUDIO'),
('PRO', 500.00, 5, 2, 5, 'VIDEO');

-- Users
-- Password is 'password123' hashed using BCrypt (cost 10)
INSERT INTO users (name, email, password_hash, phone, role) VALUES 
('Alice Smith', 'alice@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '1234567890', 'USER'),
('Bob Johnson', 'bob@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '0987654321', 'USER');

-- Admin
INSERT INTO users (name, email, password_hash, phone, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '1111111111', 'ADMIN');

-- Trainers
INSERT INTO trainers (name, email, password_hash, phone, bio, specialisation, rating_avg, is_approved) VALUES 
('Emma Wilson', 'emma@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '5551234567', 'Experienced IELTS trainer.', 'IELTS, Business English', 4.8, TRUE),
('Michael Brown', 'michael@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '5557654321', 'Native speaker from London.', 'Conversational English', 4.5, TRUE),
('Sarah Davis', 'sarah@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '5559998888', 'Focuses on grammar and vocabulary.', 'Grammar, TOEFL', 4.9, TRUE);

-- Availability for trainers
INSERT INTO availability (trainer_id, day_of_week, start_time, end_time, is_available) VALUES 
(1, 'MONDAY', '09:00:00', '17:00:00', TRUE),
(1, 'TUESDAY', '09:00:00', '17:00:00', TRUE),
(1, 'WEDNESDAY', '09:00:00', '17:00:00', TRUE),
(2, 'MONDAY', '10:00:00', '15:00:00', TRUE),
(2, 'FRIDAY', '10:00:00', '15:00:00', TRUE),
(3, 'SATURDAY', '08:00:00', '12:00:00', TRUE),
(3, 'SUNDAY', '08:00:00', '12:00:00', TRUE);
