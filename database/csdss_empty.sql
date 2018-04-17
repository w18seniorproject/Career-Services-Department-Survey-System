-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 08, 2018 at 07:40 AM
-- Server version: 10.1.26-MariaDB
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
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
  `email` varchar(30) NOT NULL,
  `acctName` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `bans`
--

CREATE TABLE `bans` (
  `email` varchar(30) NOT NULL,
  `desc` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pins`
--

CREATE TABLE `pins` (
  `pin` int(11) NOT NULL,
  `surName` varchar(30) DEFAULT NULL,
  `groupName` varchar(20) DEFAULT NULL,
  `acctName` varchar(20) NOT NULL,
  `surText` varchar(256) DEFAULT NULL,
  `live` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `surName` varchar(30) NOT NULL,
  `qNum` int(11) NOT NULL,
  `qType` varchar(20) DEFAULT NULL,
  `qText` text,
  `qChoices` varchar(256) DEFAULT NULL,
  `qAns` varchar(256) DEFAULT NULL,
  `qWeight` int(11) DEFAULT NULL,
  `rLevel` int(11) DEFAULT NULL,
  `rName` text,
  `acctName` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `acctName` varchar(20) NOT NULL,
  `surName` varchar(30) NOT NULL,
  `groupName` varchar(20) NOT NULL,
  `recNum` int(11) NOT NULL,
  `surResults` text,
  `rLevel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `secreqs`
--

CREATE TABLE `secreqs` (
  `acctName` varchar(20) CHARACTER SET latin1 NOT NULL,
  `surName` varchar(30) CHARACTER SET latin1 NOT NULL,
  `rLevel` int(11) NOT NULL,
  `minScore` int(11) NOT NULL,
  `resources` text,
  `resourceMarkup` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `acctName` varchar(20) NOT NULL,
  `tokenHash` varchar(64) NOT NULL,
  `expiration` datetime NOT NULL,
  `tokenUsed` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`email`);

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
-- Indexes for table `secreqs`
--
ALTER TABLE `secreqs`
  ADD PRIMARY KEY (`acctName`,`surName`,`rLevel`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `recNum` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
