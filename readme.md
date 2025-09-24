# Mastero – Skill Assessment & Reporting Portal

A full-stack web application where users can register, take skill-based quizzes, and view performance reports.  
Admins can manage users, questions, and generate reports for individuals and groups.

---

## 🚀 Features

### Backend (Node.js + Express + MySQL)

- JWT-based authentication
- Role-based access control (`admin`, `user`)
- CRUD APIs:
  - Users
  - Skills
  - Questions
  - Quiz Attempts & Answers
- Performance Reports:
  - User-wise performance
  - Skill gap identification
  - Time-based reports
- Pagination + Filtering support
- Secure API endpoints
- MySQL schema with proper foreign keys & indexing

### Frontend (React)

- Login/Register
- User Dashboard:
  - Take quiz by selecting a skill
  - View past performance
- Admin Panel:
  - Add/Edit/Delete Questions
  - View user reports (tables + charts)
- React Router + Secure API integration

---

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'user') DEFAULT 'user',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
);

-- Skills
CREATE TABLE IF NOT EXISTS `skills` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `is_active` TINYINT(1) DEFAULT '1',
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
);

-- Questions
CREATE TABLE IF NOT EXISTS `questions` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `skill_id` INT NOT NULL,
    `text` TEXT NOT NULL,
    `difficulty` ENUM('easy','medium','hard') DEFAULT 'medium',
    `is_active` TINYINT(1) DEFAULT '1',
    PRIMARY KEY (`id`),
    KEY `skill_id` (`skill_id`),
    CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
);

-- Question Options
CREATE TABLE IF NOT EXISTS `question_options` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `question_id` INT NOT NULL,
    `label` VARCHAR(2) NOT NULL,
    `text` TEXT NOT NULL,
    `is_correct` TINYINT(1) DEFAULT '0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `question_id` (`question_id`,`label`),
    CONSTRAINT `question_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
);

-- Quiz Attempts
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
    `id` CHAR(36) NOT NULL DEFAULT(uuid()),
    `user_id` CHAR(36) NOT NULL,
    `quiz_id` CHAR(36) NOT NULL,
    `started_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `completed_at` TIMESTAMP NULL DEFAULT NULL,
    `score_pct` CHAR(50) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

-- Quiz Answers
CREATE TABLE IF NOT EXISTS `quiz_answers` (
    `id` CHAR(36) NOT NULL DEFAULT(uuid()),
    `attempt_id` CHAR(36) NOT NULL,
    `question_id` CHAR(36) NOT NULL,
    `selected_option_id` CHAR(36) DEFAULT NULL,
    `is_correct` TINYINT(1) DEFAULT NULL,
    `answered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_attempt_question` (`attempt_id`,`question_id`),
    CONSTRAINT `fk_answers_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts` (`id`) ON DELETE CASCADE
);

```

⚡ Getting Started
1️⃣ Clone Repo
bash
Copy code
git clone https://github.com/your-username/mastero.git
cd mastero
2️⃣ Setup Backend
bash
Copy code
cd backend
npm install
Create .env file inside backend/

env
Copy code
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=mastero
JWT_SECRET=supersecretkey
Run migrations / apply schema in MySQL

bash
Copy code
mysql -u root -p mastero < schema.sql
Start backend

bash
Copy code
npm start
3️⃣ Setup Frontend
bash
Copy code
cd frontend
npm install
npm start
4️⃣ Start Both Together
At project root (mastero/):

bash
Copy code
npm run dev

```

```
