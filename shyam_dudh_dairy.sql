-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2024 at 08:43 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shyam_dudh_dairy`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `mobile_no` varchar(10) NOT NULL,
  `organization` varchar(80) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `user_id`, `name`, `mobile_no`, `organization`, `email`) VALUES
(10, 6, 'Harsh', '6353466496', 'anomaly', 'harsh@gmail.com'),
(11, 7, 'Pranav', '6353466496', 'tcs', 'pranav@gmail.com'),
(12, 7, 'Vishal', '6353466496', 'opera', 'vishal@gmail.com'),
(13, 6, 'Vansh', '6353466496', 'amazon', 'vansh@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

CREATE TABLE `purchase` (
  `purchase_id` int(10) NOT NULL,
  `customer_id` int(10) NOT NULL,
  `litre` int(10) NOT NULL,
  `fat` int(10) NOT NULL,
  `fat_price` int(10) NOT NULL,
  `discount` int(10) NOT NULL,
  `amount` int(10) NOT NULL,
  `purchase_date` date NOT NULL DEFAULT current_timestamp(),
  `due_date` date NOT NULL,
  `remainder_type` varchar(10) NOT NULL,
  `payment_status` varchar(15) NOT NULL,
  `additional_notes` varchar(500) NOT NULL,
  `report` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase`
--

INSERT INTO `purchase` (`purchase_id`, `customer_id`, `litre`, `fat`, `fat_price`, `discount`, `amount`, `purchase_date`, `due_date`, `remainder_type`, `payment_status`, `additional_notes`, `report`) VALUES
(14, 10, 10, 10, 20, 0, 2000, '2024-08-07', '2024-08-24', 'every day', 'pending', 'bhai dudh roj chahiye', ''),
(15, 11, 5, 10, 10, 0, 500, '2024-08-07', '2024-07-24', 'every day', 'pending', 'bhai dudh roj chahiye', ''),
(17, 12, 20, 10, 10, 0, 2000, '2024-08-07', '2024-08-02', 'every day', 'pending', 'bhai dudh roj chahiye', ''),
(18, 13, 15, 10, 10, 0, 1500, '2024-08-07', '2024-08-02', 'every day', 'pending', 'bhai dudh roj chahiye', ''),
(19, 10, 10, 10, 10, 0, 1000, '2024-08-07', '2024-08-22', 'every day', 'pending', 'bhai dudh roj chahiye', ''),
(20, 10, 10, 10, 10, 0, 1000, '2024-08-07', '2024-08-24', 'every day', 'pending', 'bhai dudh roj chahiye', '');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `standard_price` float NOT NULL,
  `location` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `name`, `email`, `password`, `standard_price`, `location`) VALUES
(6, 'Darshan Solanki', 'darshan@gmail.com', '$2b$10$Zc5LS4KTUHjKo05oo8XiRuakJFGnw1Kb4zEbsPAI94PnSh89kQ2Q2', 12.9, 'Anjar'),
(7, 'Harsh', 'harsh@gmail.com', '$2b$10$8sObp.cme5dK8Q4rHYvnaOdiowVQS6J9f9ySqQ1vvH3N2dci2VZKu', 13, 'gandhidham'),
(8, 'Vansh', 'vansh@gmail.com', '$2b$10$JFph5SzvLHgCXmXkv1Y8X.FoWgyw4peDPgFVEXtWpMyw4POFhiViW', 10, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`purchase_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `purchase_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
