SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;

SET FOREIGN_KEY_CHECKS = 0;

-- users
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `role` ENUM('admin', 'user') DEFAULT 'user',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- skills
CREATE TABLE IF NOT EXISTS `skills` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `is_active` TINYINT(1) DEFAULT '1',
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- questions
CREATE TABLE IF NOT EXISTS `questions` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `skill_id` INT NOT NULL,
    `text` TEXT NOT NULL,
    `difficulty` ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    `is_active` TINYINT(1) DEFAULT '1',
    PRIMARY KEY (`id`),
    KEY `skill_id` (`skill_id`),
    CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- question_options
CREATE TABLE IF NOT EXISTS `question_options` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `question_id` INT NOT NULL,
    `label` VARCHAR(2) NOT NULL,
    `text` TEXT NOT NULL,
    `is_correct` TINYINT(1) DEFAULT '0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `question_id` (`question_id`, `label`),
    CONSTRAINT `question_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- quiz_attempts
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
    `id` CHAR(36) NOT NULL DEFAULT(uuid()),
    `user_id` CHAR(36) NOT NULL,
    `quiz_id` CHAR(36) NOT NULL,
    `started_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `completed_at` TIMESTAMP NULL DEFAULT NULL,
    `score_pct` CHAR(50) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- quiz_answers
CREATE TABLE IF NOT EXISTS `quiz_answers` (
    `id` CHAR(36) NOT NULL DEFAULT(uuid()),
    `attempt_id` CHAR(36) NOT NULL,
    `question_id` CHAR(36) NOT NULL,
    `selected_option_id` CHAR(36) DEFAULT NULL,
    `is_correct` TINYINT(1) DEFAULT NULL,
    `answered_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_attempt_question` (`attempt_id`, `question_id`),
    CONSTRAINT `fk_answers_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;