import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/contexts/AuthContext'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: {
    id: string
    name: string
    image_url: string
  }
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  delivery_address: string
  delivery_date?: string
  notes?: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export function useOrders() {
  const { user } = useAuthContext()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Fetch orders with order items and product details
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            products (
              id,
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (ordersError) {
        throw ordersError
      }

      // Transform the data to match our interface
      const transformedOrders: Order[] = ordersData.map(order => ({
        id: order.id,
        user_id: order.user_id,
        status: order.status,
        total_amount: parseFloat(order.total_amount),
        delivery_address: order.delivery_address,
        delivery_date: order.delivery_date,
        notes: order.notes,
        created_at: order.created_at,
        updated_at: order.updated_at,
        order_items: order.order_items?.map((item: any) => ({
          id: item.id,
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: parseFloat(item.price),
          product: item.products
        }))
      }))

      setOrders(transformedOrders)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const refreshOrders = () => {
    fetchOrders()
  }

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status)
  }

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalSpent: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((total, order) => total + order.total_amount, 0)
    }
  }

  return {
    orders,
    loading,
    error,
    refreshOrders,
    getOrdersByStatus,
    getOrderStats
  }
}