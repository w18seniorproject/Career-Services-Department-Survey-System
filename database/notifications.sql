CREATE TABLE `notifications` (
  `acctName` varchar(20) NOT NULL,
  `count` int(11) NOT NULL,
  `notifications` text COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

ALTER TABLE `notifications`
  ADD PRIMARY KEY (`acctName`);