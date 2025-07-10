-- Step 1: Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  membership_level TEXT DEFAULT 'Bronze' CHECK (membership_level IN ('Bronze', 'Silver', 'Gold')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 2: Create products table
CREATE TABLE IF NOT EXISTS public.products (
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

-- Step 3: Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
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

-- Step 4: Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);