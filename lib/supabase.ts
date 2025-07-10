import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  membership_level: 'Bronze' | 'Silver' | 'Gold'
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  subtitle: string
  description: string
  price: number
  original_price: number
  weight: string
  image_url: string
  badge: string
  cook_time: string
  serves: string
  origin: string
  discount: string
  rating: number
  category: 'carnes' | 'complementos'
  stock: number
  active: boolean
  created_at: string
}

export interface Order {
  id: number
  user_id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled'
  total: number
  delivery_address: string
  delivery_phone: string
  delivery_notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}