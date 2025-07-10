-- Insertar productos
INSERT INTO public.products (name, subtitle, description, price, original_price, weight, image_url, badge, cook_time, serves, origin, discount, rating, category, stock, active) VALUES
('Picaña Premium', 'El Legendario Corte Brasileño', 'Corte brasileño de excelencia. Jugosidad excepcional con un sabor profundo que conquista desde el primer bocado.', 299.00, 349.00, '2.2kg', '/img/cortes/foto1.jpg', 'BESTSELLER', '25-30 min', '6-8 personas', 'Angus Argentino Premium', '15%', 4.9, 'carnes', 25, true),
('Bife Ancho', 'Ribeye de Autor', 'Veteado perfecto que garantiza una experiencia sensorial única. El corte preferido por los conocedores.', 299.00, 349.00, '2.2kg', '/img/cortes/foto3.jpg', 'PREMIUM', '20-25 min', '6-8 personas', 'Hereford Premium', '15%', 4.8, 'carnes', 30, true),
('Bife Angosto', 'New York Strip Selecto', 'Equilibrio magistral entre terneza y sabor. Un clásico reinventado para paladares exigentes.', 299.00, 349.00, '2.2kg', '/img/cortes/foto4.jpg', 'FAVORITO', '18-22 min', '6-8 personas', 'Angus Selecto', '15%', 4.7, 'carnes', 20, true),
('Tomahawk', 'El Rey de la Parrilla', 'Imponente corte con hueso que impresiona por su presentación y sabor excepcional.', 450.00, 520.00, '3.5kg', '/img/cortes/foto5.jpg', 'EXCLUSIVO', '35-40 min', '8-10 personas', 'Wagyu Premium', '13%', 5.0, 'carnes', 8, true),
('Lomo Fino', 'Filet Mignon Supremo', 'La máxima expresión de terneza. Corte noble para momentos especiales.', 380.00, 420.00, '1.8kg', '/img/cortes/foto6.jpg', 'NOBLE', '15-20 min', '4-6 personas', 'Angus Premium', '10%', 4.9, 'carnes', 15, true),
('Asado de Tira', 'Tradición Parrillera', 'Corte tradicional que despierta los sentidos. Perfecto para reuniones familiares.', 220.00, 260.00, '2.8kg', '/img/cortes/foto7.jpg', 'TRADICIONAL', '30-35 min', '8-10 personas', 'Criollo Premium', '15%', 4.6, 'carnes', 40, true),
('Chimichurri de Autor', 'Receta Secreta Premium', 'Receta secreta con hierbas seleccionadas para realzar el sabor de tus cortes.', 35.00, 45.00, '250ml', '/img/cortes/foto8.jpg', 'ARTESANAL', 'Listo para usar', '4-6 personas', 'Receta tradicional', '22%', 4.8, 'complementos', 100, true),
('Carbón Premium Oak', 'Roble Americano Selecto', 'Carbón de roble americano de primera calidad para una combustión perfecta y sabor único.', 45.00, 55.00, '5kg', '/img/cortes/foto9.jpg', 'PREMIUM', 'Encendido rápido', '2-3 asados', 'Roble americano', '18%', 4.9, 'complementos', 50, true),
('Kit Maestro Parrillero', 'Herramientas Profesionales', 'Set completo de herramientas profesionales de acero inoxidable para el ritual perfecto.', 189.00, 230.00, '3.2kg', '/img/cortes/foto10.jpg', 'COMPLETO', 'Uso permanente', 'Uso ilimitado', 'Acero inoxidable', '18%', 5.0, 'complementos', 20, true);

-- Nota: Los perfiles se crearán automáticamente cuando los usuarios se registren
-- Las órdenes y order_items se crearán cuando los usuarios hagan pedidos

-- Verificar que se insertaron correctamente
SELECT * FROM public.products;