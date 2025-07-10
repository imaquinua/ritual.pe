import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'

export function useProducts(category?: 'carnes' | 'complementos') {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [category])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      // Transform the data to match our frontend interface
      const transformedProducts: Product[] = data.map(item => ({
        id: item.id,
        name: item.name,
        subtitle: item.subtitle,
        description: item.description,
        price: parseFloat(item.price),
        original_price: parseFloat(item.original_price),
        weight: item.weight,
        image_url: item.image_url,
        badge: item.badge,
        cook_time: item.cook_time,
        serves: item.serves,
        origin: item.origin,
        discount: item.discount,
        rating: parseFloat(item.rating),
        category: item.category,
        stock: item.stock,
        active: item.active,
        created_at: item.created_at
      }))

      setProducts(transformedProducts)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const refreshProducts = () => {
    fetchProducts()
  }

  return {
    products,
    loading,
    error,
    refreshProducts
  }
}

// Hook específico para carnes
export function useCarnes() {
  return useProducts('carnes')
}

// Hook específico para complementos
export function useComplementos() {
  return useProducts('complementos')
}