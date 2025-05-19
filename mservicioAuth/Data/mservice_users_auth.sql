-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-05-2025 a las 01:43:41
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mservice_users_auth`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` text NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'juanperez', 'juan@demo.com', '$2a$11$fzP3emZC7mX8X3iit2XwNu02e7pbnwHvOfJ0sTPXEarSv8S1A5ibK', 'admin', '2025-05-16 14:26:17'),
(3, 'Mac Tornima', 'mac@demo.com', '$2a$11$uvCbQZdH6FrkDqGIRVHK9OzYy294eXuLb11QPkVJUl6YnHV57NJDe', 'user', '2025-05-16 15:05:00'),
(4, 'Jarco', 'jarco@demo.com', '$2a$11$RXdIM7bogE/OFkYnzP2tL.kPwDeMWbTFcPOcIgXJEWLZV.PvrRgwW', 'user', '2025-05-16 15:33:37'),
(5, 'NuevoAdmin', 'adin2@demo.com', '$2a$11$LoHxuqhgC3H7FvjOsY/dW.lIOu/VpjZTShzoPTm8IbRqjRjgNbu2C', 'admin', '2025-05-16 17:26:45'),
(6, 'Nuevo User', 'user2@demo.com', '$2a$11$0C0hOBAXXVtIFZE5y7hSIu7R5pQnpt8dAbKaAKpIV0oBc10Xn1gxa', 'user', '2025-05-16 17:27:24'),
(7, 'Nuevo usar faldo admin 3', 'userfalso3@demo.com', '$2a$11$IuH124givoJNZzV9H1owleh4.nfNqZNUNuJeWKOeJCcXUGXqD/y2S', 'user', '2025-05-16 17:29:42'),
(8, 'marcelo', 'marcelo@demo.com', '$2a$11$JBtV7VoMOHRs.RpiUyz5NeVp05HaEfOKz43aBWMRi3wQPZ5QZr/ey', 'user', '2025-05-18 13:30:06'),
(9, 'Marcelo Admin', 'marceloAdmin@demo.com', '$2a$11$AALuf.sN6CKUHT4Ure7ereiDVmmVIMMGOEIlVQvRqzC5d0Y1aBQ7C', 'admin', '2025-05-18 13:30:59'),
(10, 'Mario Castañeda', 'mario@demo.com', '$2a$11$Hj4mRI0Jarf4bvhWGEewYu4W9dDu42Ff4RH02ruFR57DNC22yKabe', 'user', '2025-05-18 20:37:06');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
