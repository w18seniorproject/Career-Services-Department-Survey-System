SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `csdss`
--

INSERT INTO `accounts` (`pass`, `email`, `acctName`) VALUES
('$2y$10$QMhHeAYMUnYyDJXzgp9m7OhUCUWaF0fPwXhqSoZZgZZOLhPRj4lTS', 'test@test.com', 'testUser'),
('$2y$10$lOb8YJCOX18ZwyzjTVjRveGLJxEbY5FOeoYATW.E/TzvrGNpg9uYS', 'user@example.com', 'test2');


INSERT INTO `bans` (`email`, `desc`) VALUES
('badperson@example.com', 'Didn\'t read the terms and conditions'),
('evilmaniac@test.com', 'Defiled the rarest of Pepes');



INSERT INTO `pins` (`pin`, `surName`, `groupName`, `acctName`, `surText`) VALUES
(0, 'Happy Fun Land', 'Fools', 'test2', 'Hahahahahahahahahahaha!'),
(1234, 'Test Survey', 'Arbitrary Group', 'testUser', 'Welcome to the Test Survey. Please have a look around and make sure everything works.');



INSERT INTO `questions` (`surName`, `qNum`, `qType`, `qText`, `qChoices`, `qAns`, `qWeight`, `rLevel`, `rName`, `acctName`) VALUES
('Test Survey', 1, 'mc', 'How many suns does Tatooine have?', 'One,Two,Seven,Nine,Twenty-Three', 'Two', 2, 1, 'Star Wars', 'testUser'),
('Test Survey', 2, 'chk', 'Please select all real characters.', 'Han Yolo,Lucien Cloudhopper,Princess Leia,Anakin,Mr. Bean', 'Princess Leia,Anakin', 2, 1, 'Star Wars', 'testUser'),
('Test Survey', 3, 's', 'This system is working well so far.', NULL, 'sta', 2, 2, 'General Questions', 'testUser'),
('Test Survey', 4, 'tf', 'We have a long way to go, still though.', NULL, 't', 1, 2, 'General Questions', 'testUser');


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
