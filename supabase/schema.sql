-- Enable Row Level Security
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-jwt-secret';

-- Create custom users table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  membership_level TEXT DEFAULT 'Bronze' CHECK (membership_level IN ('Bronze', 'Silver', 'Gold')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create products table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  weight TEXT NOT NULL,
  image_url TEXT NOT NULL,
  badge TEXT NOT NULL,
  cook_time TEXT NOT NULL,
  serves TEXT NOT NULL,
  origin TEXT NOT NULL,
  discount TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('carnes', 'complementos')),
  stock INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on products (readable by all, editable by admins only)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (active = true);

-- Create orders table
CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_phone TEXT NOT NULL,
  delivery_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create order_items table
CREATE TABLE public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" 
ON public.order_items FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));

CREATE POLICY "Users can create own order items" 
ON public.order_items FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample products
INSERT INTO public.products (name, subtitle, description, price, original_price, weight, image_url, badge, cook_time, serves, origin, discount, rating, category) VALUES
('Picaña Premium', 'El Legendario Corte Brasileño', 'Corte brasileño de excelencia. Jugosidad excepcional con un sabor profundo que conquista desde el primer bocado.', 299.00, 349.00, '2.2kg', '/img/cortes/foto1.jpg', 'BESTSELLER', '25-30 min', '6-8 personas', 'Angus Argentino Premium', '15%', 4.9, 'carnes'),
('Bife Ancho', 'Ribeye de Autor', 'Veteado perfecto que garantiza una experiencia sensorial única. El corte preferido por los conocedores.', 299.00, 349.00, '2.2kg', '/img/cortes/foto3.jpg', 'PREMIUM', '20-25 min', '6-8 personas', 'Hereford Premium', '15%', 4.8, 'carnes'),
('Bife Angosto', 'New York Strip Selecto', 'Equilibrio magistral entre terneza y sabor. Un clásico reinventado para paladares exigentes.', 299.00, 349.00, '2.2kg', '/img/cortes/foto4.jpg', 'FAVORITO', '18-22 min', '6-8 personas', 'Angus Selecto', '15%', 4.7, 'carnes'),
('Tomahawk', 'El Rey de la Parrilla', 'Imponente corte con hueso que impresiona por su presentación y sabor excepcional.', 450.00, 520.00, '3.5kg', '/img/cortes/foto5.jpg', 'EXCLUSIVO', '35-40 min', '8-10 personas', 'Wagyu Premium', '13%', 5.0, 'carnes'),
('Lomo Fino', 'Filet Mignon Supremo', 'La máxima expresión de terneza. Corte noble para momentos especiales.', 380.00, 420.00, '1.8kg', '/img/cortes/foto6.jpg', 'NOBLE', '15-20 min', '4-6 personas', 'Angus Premium', '10%', 4.9, 'carnes'),
('Asado de Tira', 'Tradición Parrillera', 'Corte tradicional que despierta los sentidos. Perfecto para reuniones familiares.', 220.00, 260.00, '2.8kg', '/img/cortes/foto7.jpg', 'TRADICIONAL', '30-35 min', '8-10 personas', 'Criollo Premium', '15%', 4.6, 'carnes'),
('Chimichurri de Autor', 'Receta Secreta Premium', 'Receta secreta con hierbas seleccionadas', 35.00, 45.00, '250ml', '/img/cortes/foto8.jpg', 'ARTESANAL', 'Listo para usar', '4-6 personas', 'Receta tradicional', '22%', 4.8, 'complementos'),
('Carbón Premium Oak', 'Roble Americano Selecto', 'Carbón de roble americano, combustión perfecta', 45.00, 55.00, '5kg', '/img/cortes/foto9.jpg', 'PREMIUM', 'Encendido rápido', '2-3 asados', 'Roble americano', '18%', 4.9, 'complementos'),
('Kit Maestro Parrillero', 'Herramientas Profesionales', 'Herramientas profesionales para el ritual perfecto', 189.00, 230.00, '3.2kg', '/img/cortes/foto10.jpg', 'COMPLETO', 'Uso permanente', 'Uso ilimitado', 'Acero inoxidable', '18%', 5.0, 'complementos');