-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 24, 2018 at 03:56 PM
-- Server version: 5.7.22-0ubuntu0.16.04.1
-- PHP Version: 7.0.28-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `csdss`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `pass` text,
  `email` varchar(256) NOT NULL,
  `acctName` varchar(100) DEFAULT NULL,
  `profpic` text,
  `active` BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `bans`
--

CREATE TABLE `bans` (
  `email` varchar(256) NOT NULL,
  `desc` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `recNum` int(11) NOT NULL,
  `acctName` varchar(100),
  `surName` varchar(256),
  `comment` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pins`
--

CREATE TABLE `pins` (
  `pin` int(11) NOT NULL,
  `surName` varchar(256) DEFAULT NULL,
  `groupName` varchar(256) DEFAULT NULL,
  `acctName` varchar(100) NOT NULL,
  `surText` varchar(256) DEFAULT NULL,
  `live` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `surName` varchar(256) NOT NULL,
  `qNum` int(11) NOT NULL,
  `qType` varchar(20) DEFAULT NULL,
  `qText` text,
  `qChoices` varchar(256) DEFAULT NULL,
  `qAns` varchar(256) DEFAULT NULL,
  `qWeight` int(11) DEFAULT NULL,
  `rLevel` int(11) DEFAULT NULL,
  `rName` text,
  `acctName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `acctName` varchar(100) NOT NULL,
  `surName` varchar(256) NOT NULL,
  `groupName` varchar(256) NOT NULL,
  `recNum` int(11) NOT NULL,
  `surResults` text,
  `rLevel` int(11) DEFAULT NULL,
  `time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `secReqs`
--

CREATE TABLE `secReqs` (
  `acctName` varchar(100) CHARACTER SET latin1 NOT NULL,
  `surName` varchar(256) CHARACTER SET latin1 NOT NULL,
  `rLevel` int(11) NOT NULL,
  `minScore` int(11) NOT NULL,
  `resources` text COLLATE utf8mb4_bin,
  `resourceMarkup` text COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `acctName` varchar(100) NOT NULL,
  `tokenHash` varchar(64) NOT NULL,
  `expiration` datetime NOT NULL,
  `tokenUsed` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `acctName` varchar(100) NOT NULL,
  `count` int(11) NOT NULL,
  `notifications` text COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Indexes for dumped tables
--

-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
	ADD PRIMARY KEY (`tokenHash`);

-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`recNum`);

--
-- Indexes for table `bans`
--
ALTER TABLE `bans`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pins`
--
ALTER TABLE `pins`
  ADD PRIMARY KEY (`pin`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`surName`,`qNum`,`acctName`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`recNum`,`surName`,`groupName`,`acctName`);

--
-- Indexes for table `secReqs`
--
ALTER TABLE `secReqs`
  ADD PRIMARY KEY (`acctName`,`surName`,`rLevel`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`acctName`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `recNum` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `recNum` int(11) NOT NULL AUTO_INCREMENT;


--
-- Events
--
CREATE EVENT `deleteExpired` ON SCHEDULE EVERY 1 DAY STARTS '2018-04-25 00:00:00.000000' ON COMPLETION PRESERVE ENABLE 
DO DELETE FROM tokens WHERE expiration < NOW();


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
