-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 21, 2021 at 04:52 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_lou_geh`
--

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `sup_code` varchar(11) NOT NULL,
  `sup_name` varchar(25) NOT NULL,
  `sup_desc` varchar(52) NOT NULL,
  `sup_address` varchar(225) NOT NULL,
  `sup_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `sup_code`, `sup_name`, `sup_desc`, `sup_address`, `sup_created`) VALUES
(1, '001', 'g3-asahi', 'Gensan Asahi', 'General Santos', '2021-10-20 15:52:30'),
(2, '002', 'g3-Asus', 'Gensan Asus', 'Polomolok South Cotabato', '2021-10-20 15:52:41'),
(3, '003', 'g3-Acer', 'Gensan Acer', 'Polomolok South Cotabato', '2021-10-20 18:33:26'),
(4, '004', 'g3-MSI', 'Gensan MSI', 'Calumpang General Santos', '2021-10-20 18:33:26');

-- --------------------------------------------------------

--
-- Table structure for table `tb_customers`
--

CREATE TABLE `tb_customers` (
  `id` int(11) NOT NULL,
  `cust_name` varchar(50) NOT NULL,
  `cust_address` varchar(50) NOT NULL,
  `cust_ctn` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_customers`
--

INSERT INTO `tb_customers` (`id`, `cust_name`, `cust_address`, `cust_ctn`) VALUES
(1, 'eqweq', 'qweqw', 'ee234'),
(2, 'eqweq', 'qweqw', 'ee234'),
(3, 'eqweq', 'qweqw', 'ee234'),
(4, 'eqweq', 'qweqw', 'ee234'),
(5, 'eqwe', 'qwe', 'qweqe'),
(6, 'eqwe', 'qwe', 'qweqe'),
(7, 'rwer', 'werw', '345345'),
(8, 'eqwe', 'qeqwe', '234234'),
(9, 'eqweqwe', 'wewttwr', '54645'),
(10, 'eqweqwe', 'wewttwr', '54645'),
(11, 'qweqweqe', 'twetwwetwet', '445645'),
(12, 'qweqweqe', 'twetwwetwet', '445645'),
(13, 'eqweqw', 'eqweqwe', '234234'),
(14, 'eqweqw', 'eqweqwe', '234234'),
(15, 'ewrwr', 'dqwqwe', '35345'),
(16, 'qeqe', 'qweqe', '4234'),
(17, 'qeqe', 'qweqe', '4234'),
(18, 'qeqe', 'qweqe', '4234'),
(19, 'testing wow', '018 dadiangas east gsc', '09215530411'),
(20, 'qweqwe', 'eq234234', '346346'),
(21, 'etetertet', 'qweqw 4234', '23423424'),
(22, 'etetertet', 'qweqw 4234', '23423424'),
(23, 'qrqwqweqw', 'qeqweqe232', '2325235'),
(24, 'etwrwrwer', '3453453qeqweq', '234234'),
(25, 'eqeqweqw', 'twetwet435346', '565798'),
(26, 'qweqwe', '35234qwqw', 'eqweqwe'),
(27, 'qwetqwqe', 'srwrw 52342', '7987324'),
(28, 'qwetqwqe', 'srwrw 52342', '7987324'),
(29, 'qwetqwqe', 'srwrw 52342', '7987324'),
(30, 'qweqeqe twew', 'qweq werr', '525235'),
(31, 'qeqweqe', '4234 qweqe', '564645'),
(32, 'qeqweqe', '4234 qweqe', '564645'),
(33, 'eqweqwe', '44234 qeqe', '345345'),
(34, 'eqweqwe', '44234 qeqe', '345345'),
(35, 'eqweqwe', '44234 qeqe', '345345'),
(36, 'Test Tow4', 'qeqwe', '0956487'),
(37, 'Test Tow46', 'qeqwe', '0956487');

-- --------------------------------------------------------

--
-- Table structure for table `tb_items`
--

CREATE TABLE `tb_items` (
  `id` int(11) NOT NULL,
  `item_bcode` varchar(11) NOT NULL,
  `item_code` varchar(11) NOT NULL,
  `sup_code` varchar(11) NOT NULL,
  `item_product_desc` varchar(50) NOT NULL,
  `item_stock` int(11) NOT NULL,
  `item_srp` double NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_items`
--

INSERT INTO `tb_items` (`id`, `item_bcode`, `item_code`, `sup_code`, `item_product_desc`, `item_stock`, `item_srp`, `created_at`) VALUES
(1, '1110202021', 'elc-fan', '001', 'Electric Fan Asahi', 799, 500, '2021-10-20 19:00:46'),
(2, '1210202021', 'ips-mon', '002', 'IPS Monitor Asus', 99938, 10000, '2021-10-20 19:00:46');

-- --------------------------------------------------------

--
-- Table structure for table `tb_or`
--

CREATE TABLE `tb_or` (
  `id` int(11) NOT NULL,
  `or_cnt` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_or`
--

INSERT INTO `tb_or` (`id`, `or_cnt`) VALUES
(1, 78);

-- --------------------------------------------------------

--
-- Table structure for table `tb_trans`
--

CREATE TABLE `tb_trans` (
  `id` int(11) NOT NULL,
  `tran_code` varchar(25) NOT NULL,
  `tran_c_name` varchar(50) NOT NULL DEFAULT '0',
  `tran_desc` varchar(55) NOT NULL,
  `item_code` varchar(11) NOT NULL,
  `item_qty` int(11) NOT NULL,
  `tran_OR` varchar(11) NOT NULL,
  `tran_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_trans`
--

INSERT INTO `tb_trans` (`id`, `tran_code`, `tran_c_name`, `tran_desc`, `item_code`, `item_qty`, `tran_OR`, `tran_created`) VALUES
(30, 'g32842021', 'etwrwrwer', 'elc-fan Paid in Cash', 'elc-fan', 1, 'g32842021', '2021-10-21 15:57:28'),
(31, 'g32842021', 'etwrwrwer', 'ips-mon Paid in Cash', 'ips-mon', 2, 'g32842021', '2021-10-21 15:57:28'),
(32, 'g32842021', 'etwrwrwer', 'ips-mon Paid in Cash', 'ips-mon', 2, 'g32842021', '2021-10-21 15:57:28'),
(33, 'g35642021', 'eqeqweqw', 'elc-fan Paid in Cash', 'elc-fan', 2, 'g35642021', '2021-10-21 16:23:56'),
(34, 'g35642021', 'eqeqweqw', 'elc-fan Paid in Cash', 'elc-fan', 2, 'g35642021', '2021-10-21 16:23:56'),
(35, 'g32942021', 'qweqwe', 'elc-fan Paid in Cash', 'elc-fan', 3, 'g32942021', '2021-10-21 16:24:29'),
(36, 'g32942021', 'qweqwe', 'elc-fan Paid in Cash', 'elc-fan', 3, 'g32942021', '2021-10-21 16:24:29'),
(37, 'g32942021', 'qweqwe', 'elc-fan Paid in Cash', 'elc-fan', 3, 'g32942021', '2021-10-21 16:24:29'),
(38, 'g32542021', 'qwetqwqe', 'ips-mon Paid in Cash', 'ips-mon', 1, 'Arrayg32542', '2021-10-21 16:28:25'),
(39, 'g32542021', 'qwetqwqe', 'elc-fan Paid in Cash', 'elc-fan', 2, 'Arrayg32542', '2021-10-21 16:28:25'),
(40, 'g32542021', 'qwetqwqe', 'elc-fan Paid in Cash', 'elc-fan', 2, 'Arrayg32542', '2021-10-21 16:28:25'),
(41, 'g32142021', 'qweqeqe twew', 'elc-fan Paid in Cash', 'elc-fan', 2, 'Arrayg32142', '2021-10-21 16:30:21'),
(42, 'g32142021', 'qweqeqe twew', 'elc-fan Paid in Cash', 'elc-fan', 2, 'Arrayg32142', '2021-10-21 16:30:21'),
(43, 'g32142021', 'qweqeqe twew', 'ips-mon Paid in Cash', 'ips-mon', 1, 'Arrayg32142', '2021-10-21 16:30:21'),
(44, 'g33742021', 'qeqweqe', 'elc-fan Paid in Cash', 'elc-fan', 2, 'Arrayg33742', '2021-10-21 16:30:37'),
(45, 'g33742021', 'qeqweqe', 'elc-fan Paid in Cash', 'elc-fan', 2, 'Arrayg33742', '2021-10-21 16:30:37'),
(46, 'g34242021', 'eqweqwe', 'elc-fan Paid in Cash', 'elc-fan', 2, '71g34242021', '2021-10-21 16:33:42'),
(47, 'g34242021', 'eqweqwe', 'elc-fan Paid in Cash', 'elc-fan', 2, '71g34242021', '2021-10-21 16:33:42'),
(48, 'g34242021', 'eqweqwe', 'ips-mon Paid in Cash', 'ips-mon', 2, '71g34242021', '2021-10-21 16:33:42'),
(49, 'g34242021', 'eqweqwe', 'ips-mon Paid in Cash', 'ips-mon', 2, '72g34242021', '2021-10-21 16:33:42'),
(50, 'g35442021', 'Test Tow4', 'elc-fan Paid in Cash', 'elc-fan', 3, '73g35442021', '2021-10-21 16:43:54'),
(51, 'g35442021', 'Test Tow4', 'elc-fan Paid in Cash', 'elc-fan', 3, '74g35442021', '2021-10-21 16:43:54'),
(52, 'g35442021', 'Test Tow4', 'elc-fan Paid in Cash', 'elc-fan', 3, '75g35442021', '2021-10-21 16:43:54'),
(53, 'g3442021', 'Test Tow46', 'ips-mon Paid in Cash', 'ips-mon', 3, '76g3442021', '2021-10-21 16:44:04'),
(54, 'g3442021', 'Test Tow46', 'ips-mon Paid in Cash', 'ips-mon', 3, '77g3442021', '2021-10-21 16:44:04'),
(55, 'g3442021', 'Test Tow46', 'ips-mon Paid in Cash', 'ips-mon', 3, '78g3442021', '2021-10-21 16:44:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_customers`
--
ALTER TABLE `tb_customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_items`
--
ALTER TABLE `tb_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_or`
--
ALTER TABLE `tb_or`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_trans`
--
ALTER TABLE `tb_trans`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tb_customers`
--
ALTER TABLE `tb_customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `tb_items`
--
ALTER TABLE `tb_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tb_or`
--
ALTER TABLE `tb_or`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tb_trans`
--
ALTER TABLE `tb_trans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
