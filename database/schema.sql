-- =====================================================================
-- AI Career Guidance System - MySQL Relational Schema
-- Compatible with MySQL 8.0+ / MariaDB
-- =====================================================================

CREATE DATABASE IF NOT EXISTS ai_career_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ai_career_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    reset_token VARCHAR(100) NULL,
    reset_token_expires DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    education_level VARCHAR(100) NULL DEFAULT 'Bachelor of Computer Science / IT',
    interests TEXT NULL,
    bio TEXT NULL,
    avatar_url VARCHAR(255) NULL,
    preferred_work_env VARCHAR(100) NULL DEFAULT 'Remote & Hybrid',
    career_goals TEXT NULL,
    notification_email BOOLEAN DEFAULT TRUE,
    notification_in_app BOOLEAN DEFAULT TRUE,
    theme_preference VARCHAR(20) DEFAULT 'light',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL DEFAULT 'technical',
    INDEX idx_skills_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. User Skills Table
CREATE TABLE IF NOT EXISTS user_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level VARCHAR(30) DEFAULT 'Beginner',
    CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_skill (user_id, skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Careers Table
CREATE TABLE IF NOT EXISTS careers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    education_req VARCHAR(255) DEFAULT "Bachelor's degree in Computer Science, IT, or related field",
    difficulty VARCHAR(50) DEFAULT 'Intermediate',
    growth_outlook VARCHAR(255) DEFAULT 'Rapid Growth',
    typical_responsibilities TEXT NULL,
    prerequisites TEXT NULL,
    example_projects TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_careers_category (category),
    INDEX idx_careers_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Career Skills Table
CREATE TABLE IF NOT EXISTS career_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    career_id INT NOT NULL,
    skill_id INT NOT NULL,
    skill_type VARCHAR(20) DEFAULT 'required',
    weight FLOAT DEFAULT 1.0,
    CONSTRAINT fk_career_skills_career FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
    CONSTRAINT fk_career_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Assessment Questions Table
CREATE TABLE IF NOT EXISTS assessment_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    order_num INT DEFAULT 0,
    INDEX idx_aq_section (section)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Assessment Options Table
CREATE TABLE IF NOT EXISTS assessment_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_text TEXT NOT NULL,
    score_weight FLOAT DEFAULT 1.0,
    trait_tags VARCHAR(255) NULL,
    CONSTRAINT fk_assessment_options_question FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Assessment Attempts Table
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_score FLOAT NOT NULL,
    section_scores TEXT NOT NULL,
    strengths TEXT NULL,
    improvement_areas TEXT NULL,
    suggested_next_steps TEXT NULL,
    completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assessment_attempts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Assessment Answers Table
CREATE TABLE IF NOT EXISTS assessment_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    option_id INT NOT NULL,
    CONSTRAINT fk_answers_attempt FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_question FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_option FOREIGN KEY (option_id) REFERENCES assessment_options(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Career Recommendations Table
CREATE TABLE IF NOT EXISTS career_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    career_id INT NOT NULL,
    compatibility_score FLOAT NOT NULL,
    rank_order INT NOT NULL,
    match_reason TEXT NOT NULL,
    matching_skills TEXT NULL,
    missing_skills TEXT NULL,
    actionable_steps TEXT NULL,
    calculated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_recommendations_career FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    description TEXT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'Beginner',
    duration VARCHAR(50) DEFAULT '6 weeks',
    course_url VARCHAR(500) NOT NULL,
    is_free BOOLEAN DEFAULT TRUE,
    rating FLOAT DEFAULT 4.8,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Career Courses Junction Table
CREATE TABLE IF NOT EXISTS career_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    career_id INT NOT NULL,
    course_id INT NOT NULL,
    CONSTRAINT fk_career_courses_career FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
    CONSTRAINT fk_career_courses_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Saved Courses Table
CREATE TABLE IF NOT EXISTS saved_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    status VARCHAR(30) DEFAULT 'saved',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_courses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_courses_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_saved_course (user_id, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Learning Roadmaps Table
CREATE TABLE IF NOT EXISTS learning_roadmaps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    career_id INT NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_roadmaps_career FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Roadmap Steps Table
CREATE TABLE IF NOT EXISTS roadmap_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roadmap_id INT NOT NULL,
    stage_number INT NOT NULL,
    stage_title VARCHAR(150) NOT NULL,
    topics TEXT NOT NULL,
    skills_covered TEXT NULL,
    practical_exercises TEXT NULL,
    mini_project TEXT NULL,
    capstone_project TEXT NULL,
    resource_url VARCHAR(500) NULL,
    checklist TEXT NULL,
    CONSTRAINT fk_roadmap_steps_roadmap FOREIGN KEY (roadmap_id) REFERENCES learning_roadmaps(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. User Roadmap Progress Table
CREATE TABLE IF NOT EXISTS user_roadmap_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    step_id INT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at DATETIME NULL,
    CONSTRAINT fk_roadmap_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_roadmap_progress_step FOREIGN KEY (step_id) REFERENCES roadmap_steps(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_step (user_id, step_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Saved Careers Table
CREATE TABLE IF NOT EXISTS saved_careers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    career_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_careers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_careers_career FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_saved_career (user_id, career_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Career Comparisons Table
CREATE TABLE IF NOT EXISTS career_comparisons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    comparison_title VARCHAR(200) DEFAULT 'Career Comparison',
    career_ids TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comparisons_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Learning Goals Table
CREATE TABLE IF NOT EXISTS learning_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    target_date VARCHAR(50) NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
