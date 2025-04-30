-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-04-2025 a las 18:21:55
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
-- Base de datos: `libros`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro`
--

CREATE TABLE `libro` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `autor` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_publicacion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libro`
--

INSERT INTO `libro` (`id`, `nombre`, `autor`, `descripcion`, `fecha_publicacion`) VALUES
(1, 'El Hobbit', 'J.R.R. Tolkien', 'La aventura de Bilbo Baggins para recuperar un tesoro, enfrentando dragones, orcos y más.', '1937-09-21'),
(2, 'La sombra del viento Actualizado', 'Carlos Ruiz Zafón', 'Un joven encuentra un libro en el Cementerio de los Libros Olvidados que cambiará su vida.', '2001-06-01'),
(3, 'Don Quijote de la Mancha', 'Miguel de Cervantes', 'Las aventuras de un caballero loco, Don Quijote, y su fiel escudero Sancho Panza.', '1605-01-16'),
(4, 'Cien años de soledad', 'Gabriel García Márquez', 'La historia de la familia Buendía en el mítico pueblo de Macondo, llena de magia y realismo.', '1967-06-05'),
(6, '20 años de soledad boom', 'Gabriel García Márquez', 'La historia de la familia Buendía en el mítico pueblo de Macondo, llena de magia y realismo.', '1967-06-05');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `libro`
--
ALTER TABLE `libro`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `libro`
--
ALTER TABLE `libro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
