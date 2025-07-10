import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { items, delivery_address, delivery_phone, delivery_notes } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }

    // Calculate total
    const total = items.reduce((sum: number, item: any) => {
      return sum + (item.unit_price * item.quantity)
    }, 0)

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          total,
          delivery_address,
          delivery_phone,
          delivery_notes
        }
      ])
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}