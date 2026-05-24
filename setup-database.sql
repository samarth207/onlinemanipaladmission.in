-- Run this once in your Hostinger phpMyAdmin to create the required tables.

CREATE TABLE IF NOT EXISTS `leads` (
  `id`             INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  `name`           VARCHAR(200)      NOT NULL,
  `email`          VARCHAR(255)      NOT NULL,
  `mobile_number`  VARCHAR(30)       NOT NULL,
  `course_name`    VARCHAR(200)      DEFAULT NULL,
  `institution`    VARCHAR(200)      DEFAULT NULL,
  `lead_form_name` VARCHAR(200)      DEFAULT NULL,
  `source_page`    VARCHAR(500)      DEFAULT NULL,
  `utm_source`     VARCHAR(200)      DEFAULT NULL,
  `utm_medium`     VARCHAR(200)      DEFAULT NULL,
  `utm_campaign`   VARCHAR(200)      DEFAULT NULL,
  `utm_content`    VARCHAR(200)      DEFAULT NULL,
  `utm_keyword`    VARCHAR(200)      DEFAULT NULL,
  `referer_url`    VARCHAR(500)      DEFAULT NULL,
  `user_country`   VARCHAR(100)      DEFAULT NULL,
  `ip_address`     VARCHAR(45)       DEFAULT NULL,
  `created_at`     DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id`           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_name`    VARCHAR(200)  NOT NULL,
  `mobile_number` VARCHAR(30)  NOT NULL,
  `user_email`   VARCHAR(255)  NOT NULL,
  `course_name`  VARCHAR(200)  DEFAULT NULL,
  `review`       TEXT          NOT NULL,
  `image_path`   VARCHAR(500)  DEFAULT NULL,
  `status`       ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
