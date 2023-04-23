-- Adminer 4.8.1 MySQL 8.0.30 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `methods` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `data` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `result` int NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a1196a1956403417fe3a0343390` (`userId`),
  CONSTRAINT `FK_a1196a1956403417fe3a0343390` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `order` int NOT NULL,
  `acl` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `menus` (`id`, `name`, `path`, `order`, `acl`) VALUES
(2,	'用户管理',	'/users',	1,	'read,create,delete,update,manage'),
(3,	'日志管理',	'/logs',	1,	'read,create,delete');

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `profile`;
CREATE TABLE `profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gender` int NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_a24972ebd73b106250713dcddd` (`userId`),
  CONSTRAINT `FK_a24972ebd73b106250713dcddd9` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `role_menus`;
CREATE TABLE `role_menus` (
  `menusId` int NOT NULL,
  `rolesId` int NOT NULL,
  PRIMARY KEY (`menusId`,`rolesId`),
  KEY `IDX_cf82e501e9b61eab5d815ae3b0` (`menusId`),
  KEY `IDX_135e41fb3c98312c5f171fe9f1` (`rolesId`),
  CONSTRAINT `FK_135e41fb3c98312c5f171fe9f1c` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`),
  CONSTRAINT `FK_cf82e501e9b61eab5d815ae3b0a` FOREIGN KEY (`menusId`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `role_menus` (`menusId`, `rolesId`) VALUES
(2,	2),
(3,	2);

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `roles` (`id`, `name`) VALUES
(1,	'管理员'),
(2,	'普通用户'),
(3,	'测试用户'),
(4,	'测试角色1');

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


DROP TABLE IF EXISTS `users_roles`;
CREATE TABLE `users_roles` (
  `rolesId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`rolesId`,`userId`),
  KEY `IDX_21db462422f1f97519a29041da` (`rolesId`),
  KEY `IDX_776b7cf9330802e5ef5a8fb18d` (`userId`),
  CONSTRAINT `FK_21db462422f1f97519a29041da0` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`),
  CONSTRAINT `FK_776b7cf9330802e5ef5a8fb18dc` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- 2022-12-01 09:49:56