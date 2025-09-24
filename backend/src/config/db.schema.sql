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

INSERT IGNORE INTO
    `skills`
VALUES (
        1,
        'react',
        'React.Js is a frontend library used in creating SPA\'s.',
        1
    ),
    (
        2,
        'node',
        'Node.js is a runtime environment for javascript. Let\'s us build backend server using javascript.',
        1
    ),
    (
        3,
        'sql',
        'Structured query language. Helps us talk with relational databases',
        1
    ),
    (5, 'Python', 'gg', 1);

INSERT IGNORE INTO
    `questions`
VALUES (
        1,
        1,
        'Which hook is used to manage state in React?',
        'easy',
        1
    ),
    (
        2,
        1,
        'What does useEffect hook do in React?',
        'easy',
        1
    ),
    (
        3,
        1,
        'What is JSX in React?',
        'easy',
        1
    ),
    (
        4,
        1,
        'Which method is used to pass data from parent to child component?',
        'easy',
        1
    ),
    (
        5,
        1,
        'What is the virtual DOM in React?',
        'medium',
        1
    ),
    (
        6,
        1,
        'What is the purpose of useMemo in React?',
        'medium',
        1
    ),
    (
        7,
        1,
        'How do you prevent re-renders in functional components?',
        'medium',
        1
    ),
    (
        8,
        1,
        'What is a controlled component in React?',
        'medium',
        1
    ),
    (
        9,
        1,
        'What is the default behavior of useEffect when no dependencies are provided?',
        'medium',
        1
    ),
    (
        10,
        1,
        'How does React handle form inputs?',
        'medium',
        1
    ),
    (
        11,
        2,
        'What is Node.js primarily used for?',
        'easy',
        1
    ),
    (
        12,
        2,
        'Which module is used to create a server in Node.js?',
        'easy',
        1
    ),
    (
        13,
        2,
        'What does npm stand for?',
        'easy',
        1
    ),
    (
        14,
        2,
        'How do you read a file asynchronously in Node.js?',
        'easy',
        1
    ),
    (
        15,
        2,
        'What is an event loop in Node.js?',
        'medium',
        1
    ),
    (
        16,
        2,
        'How do you handle exceptions in async code?',
        'medium',
        1
    ),
    (
        17,
        2,
        'What is middleware in Express.js?',
        'medium',
        1
    ),
    (
        18,
        2,
        'What is the purpose of the package.json file?',
        'easy',
        1
    ),
    (
        19,
        2,
        'Which object is used to manage streams in Node.js?',
        'medium',
        1
    ),
    (
        20,
        2,
        'How does Node.js achieve non-blocking I/O?',
        'medium',
        1
    ),
    (
        21,
        3,
        'What does SQL stand for?',
        'easy',
        1
    ),
    (
        22,
        3,
        'Which command is used to remove all records from a table in SQL?',
        'easy',
        1
    ),
    (
        23,
        3,
        'What is a primary key in SQL?',
        'easy',
        1
    ),
    (
        24,
        3,
        'What is the use of the SELECT statement?',
        'easy',
        1
    ),
    (
        25,
        3,
        'What is a JOIN in SQL?',
        'medium',
        1
    ),
    (
        26,
        3,
        'What is the difference between WHERE and HAVING?',
        'medium',
        1
    ),
    (
        27,
        3,
        'What is normalization in databases?',
        'medium',
        1
    ),
    (
        28,
        3,
        'What is a foreign key in SQL?',
        'medium',
        1
    ),
    (
        29,
        3,
        'What does the GROUP BY clause do?',
        'medium',
        1
    ),
    (
        30,
        3,
        'What is a subquery in SQL?',
        'medium',
        1
    ),
    (
        32,
        5,
        'What is python?',
        'easy',
        1
    );

INSERT IGNORE INTO
    `question_options`
VALUES (1, 1, 'A', 'useState', 1),
    (2, 1, 'B', 'useEffect', 0),
    (3, 1, 'C', 'useRef', 0),
    (4, 1, 'D', 'useMemo', 0),
    (
        5,
        2,
        'A',
        'Side effects in components',
        1
    ),
    (
        6,
        2,
        'B',
        'Creating components',
        0
    ),
    (
        7,
        2,
        'C',
        'Managing props',
        0
    ),
    (8, 2, 'D', 'Styling', 0),
    (
        9,
        3,
        'A',
        'JavaScript XML',
        1
    ),
    (
        10,
        3,
        'B',
        'A database query language',
        0
    ),
    (
        11,
        3,
        'C',
        'CSS preprocessor',
        0
    ),
    (
        12,
        3,
        'D',
        'Routing system',
        0
    ),
    (13, 4, 'A', 'Props', 1),
    (14, 4, 'B', 'State', 0),
    (15, 4, 'C', 'Refs', 0),
    (16, 4, 'D', 'Hooks', 0),
    (
        17,
        5,
        'A',
        'A lightweight copy of the real DOM',
        1
    ),
    (
        18,
        5,
        'B',
        'The server-side DOM',
        0
    ),
    (19, 5, 'C', 'CSS engine', 0),
    (
        20,
        5,
        'D',
        'State manager',
        0
    ),
    (
        21,
        6,
        'A',
        'Optimize performance by memoizing values',
        1
    ),
    (
        22,
        6,
        'B',
        'Manage lifecycle',
        0
    ),
    (
        23,
        6,
        'C',
        'Add event listeners',
        0
    ),
    (
        24,
        6,
        'D',
        'Make API calls',
        0
    ),
    (
        25,
        7,
        'A',
        'useMemo and React.memo',
        1
    ),
    (26, 7, 'B', 'useState', 0),
    (27, 7, 'C', 'useEffect', 0),
    (28, 7, 'D', 'useReducer', 0),
    (
        29,
        8,
        'A',
        'Component that is controlled by React state',
        1
    ),
    (
        30,
        8,
        'B',
        'Component that uses DOM refs',
        0
    ),
    (
        31,
        8,
        'C',
        'Uncontrolled component',
        0
    ),
    (
        32,
        8,
        'D',
        'External form',
        0
    ),
    (
        33,
        9,
        'A',
        'Runs on every render',
        1
    ),
    (
        34,
        9,
        'B',
        'Runs only once',
        0
    ),
    (35, 9, 'C', 'Does not run', 0),
    (
        36,
        9,
        'D',
        'Runs on state only',
        0
    ),
    (
        37,
        10,
        'A',
        'Through state and onChange handlers',
        1
    ),
    (
        38,
        10,
        'B',
        'Using refs only',
        0
    ),
    (
        39,
        10,
        'C',
        'Without handlers',
        0
    ),
    (40, 10, 'D', 'With props', 0),
    (
        41,
        11,
        'A',
        'Server-side JavaScript runtime',
        1
    ),
    (
        42,
        11,
        'B',
        'Front-end framework',
        0
    ),
    (43, 11, 'C', 'Database', 0),
    (44, 11, 'D', 'CSS library', 0),
    (45, 12, 'A', 'http', 1),
    (46, 12, 'B', 'fs', 0),
    (47, 12, 'C', 'url', 0),
    (48, 12, 'D', 'path', 0),
    (
        49,
        13,
        'A',
        'Node Package Manager',
        1
    ),
    (
        50,
        13,
        'B',
        'New Project Module',
        0
    ),
    (
        51,
        13,
        'C',
        'Next Page Model',
        0
    ),
    (
        52,
        13,
        'D',
        'Network Protocol Module',
        0
    ),
    (53, 14, 'A', 'fs.readFile', 1),
    (
        54,
        14,
        'B',
        'fs.readFileSync',
        0
    ),
    (55, 14, 'C', 'fs.load', 0),
    (56, 14, 'D', 'fs.get', 0),
    (
        57,
        15,
        'A',
        'Handles async operations and callbacks',
        1
    ),
    (
        58,
        15,
        'B',
        'Loop through arrays',
        0
    ),
    (
        59,
        15,
        'C',
        'For running threads',
        0
    ),
    (
        60,
        15,
        'D',
        'For file watching',
        0
    ),
    (
        61,
        16,
        'A',
        'try...catch and .catch',
        1
    ),
    (
        62,
        16,
        'B',
        'Only try...catch',
        0
    ),
    (
        63,
        16,
        'C',
        'async/await without try',
        0
    ),
    (
        64,
        16,
        'D',
        'None of these',
        0
    ),
    (
        65,
        17,
        'A',
        'Function that handles requests and responses',
        1
    ),
    (66, 17, 'B', 'HTML parser', 0),
    (67, 17, 'C', 'Static file', 0),
    (
        68,
        17,
        'D',
        'Error handler only',
        0
    ),
    (
        69,
        18,
        'A',
        'Holds metadata about the project',
        1
    ),
    (
        70,
        18,
        'B',
        'Stores compiled code',
        0
    ),
    (
        71,
        18,
        'C',
        'Defines user schema',
        0
    ),
    (
        72,
        18,
        'D',
        'Contains routing rules',
        0
    ),
    (
        73,
        19,
        'A',
        'Stream module',
        1
    ),
    (74, 19, 'B', 'http module', 0),
    (75, 19, 'C', 'fs module', 0),
    (76, 19, 'D', 'net module', 0),
    (
        77,
        20,
        'A',
        'Event loop with callbacks',
        1
    ),
    (
        78,
        20,
        'B',
        'Multi-threading',
        0
    ),
    (
        79,
        20,
        'C',
        'Blocking I/O',
        0
    ),
    (
        80,
        20,
        'D',
        'Polling only',
        0
    ),
    (
        81,
        21,
        'A',
        'Structured Query Language',
        1
    ),
    (
        82,
        21,
        'B',
        'Sequential Query Logic',
        0
    ),
    (
        83,
        21,
        'C',
        'System Query Language',
        0
    ),
    (
        84,
        21,
        'D',
        'Standard Queue Language',
        0
    ),
    (85, 22, 'A', 'TRUNCATE', 1),
    (86, 22, 'B', 'DELETE', 0),
    (87, 22, 'C', 'DROP', 0),
    (88, 22, 'D', 'REMOVE', 0),
    (
        89,
        23,
        'A',
        'Unique identifier for table rows',
        1
    ),
    (
        90,
        23,
        'B',
        'Duplicate key',
        0
    ),
    (91, 23, 'C', 'Foreign key', 0),
    (92, 23, 'D', 'Index only', 0),
    (
        93,
        24,
        'A',
        'To retrieve data from tables',
        1
    ),
    (
        94,
        24,
        'B',
        'To delete data',
        0
    ),
    (
        95,
        24,
        'C',
        'To modify schema',
        0
    ),
    (
        96,
        24,
        'D',
        'To create views',
        0
    ),
    (
        97,
        25,
        'A',
        'Combine rows from multiple tables',
        1
    ),
    (
        98,
        25,
        'B',
        'Group results',
        0
    ),
    (99, 25, 'C', 'Sort rows', 0),
    (
        100,
        25,
        'D',
        'Filter data',
        0
    ),
    (
        101,
        26,
        'A',
        'WHERE filters rows, HAVING filters groups',
        1
    ),
    (
        102,
        26,
        'B',
        'Both do same',
        0
    ),
    (
        103,
        26,
        'C',
        'HAVING for sorting',
        0
    ),
    (
        104,
        26,
        'D',
        'WHERE after GROUP BY',
        0
    ),
    (
        105,
        27,
        'A',
        'Process to reduce redundancy',
        1
    ),
    (
        106,
        27,
        'B',
        'Adding redundancy',
        0
    ),
    (
        107,
        27,
        'C',
        'Encrypting data',
        0
    ),
    (
        108,
        27,
        'D',
        'Indexing tables',
        0
    ),
    (
        109,
        28,
        'A',
        'Establishes link between tables',
        1
    ),
    (
        110,
        28,
        'B',
        'Primary key alias',
        0
    ),
    (
        111,
        28,
        'C',
        'Duplicate checker',
        0
    ),
    (
        112,
        28,
        'D',
        'Triggers events',
        0
    ),
    (
        113,
        29,
        'A',
        'Groups rows with same values',
        1
    ),
    (
        114,
        29,
        'B',
        'Filters rows',
        0
    ),
    (
        115,
        29,
        'C',
        'Deletes duplicates',
        0
    ),
    (
        116,
        29,
        'D',
        'Sorts columns',
        0
    ),
    (
        117,
        30,
        'A',
        'Query inside another query',
        1
    ),
    (
        118,
        30,
        'B',
        'Multiple tables only',
        0
    ),
    (
        119,
        30,
        'C',
        'Outer query alias',
        0
    ),
    (
        120,
        30,
        'D',
        'Stored procedure',
        0
    );