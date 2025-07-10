'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { User, ShoppingBag, Heart, Settings, LogOut, Package, Clock, Star, Crown, Gift, Calendar, ChevronRight, Eye, Edit2 } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useOrders } from '@/hooks/useOrders'
import { useRouter } from 'next/navigation'

const Dashboard = () => {
  const { user, profile, signOut, loading: authLoading } = useAuthContext()
  const { orders, loading: ordersLoading, getOrderStats } = useOrders()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [mounted, setMounted] = useState(false)

  const orderStats = getOrderStats()

  useEffect(() => {
    setMounted(true)
  }, [])

  const membershipInfo = {
    tier: profile?.membership_level || 'Bronze',
    points: 0, // Will be added when points system is implemented
    nextTier: 'Silver',
    pointsToNext: 500
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Handle SSR/SSG compatibility
  if (!mounted) {
    return (
      <div className="min-h-screen bg-ritual-stone-950 flex items-center justify-center">
        <p className="text-ritual-stone-400">Cargando...</p>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login')
    return null
  }

  // Show loading while auth is checking
  if (authLoading) {
    return (
      <div className="min-h-screen bg-ritual-stone-950 flex items-center justify-center">
        <p className="text-ritual-stone-400">Verificando autenticación...</p>
      </div>
    )
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-ritual-gold-500 to-ritual-gold-600 rounded-xl p-6 text-ritual-stone-900">
        <h2 className="text-2xl font-bold mb-2">¡Bienvenido, {profile?.name || user?.email}!</h2>
        <p className="opacity-90">Tu próximo ritual parrillero te está esperando</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-ritual-stone-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ritual-stone-400 text-sm">Órdenes Totales</p>
              <p className="text-2xl font-bold text-ritual-gold-400">{orderStats.total}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-ritual-gold-400" />
          </div>
        </div>

        <div className="bg-ritual-stone-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ritual-stone-400 text-sm">Total Gastado</p>
              <p className="text-2xl font-bold text-ritual-gold-400">S/ {orderStats.totalSpent.toFixed(2)}</p>
            </div>
            <Crown className="w-8 h-8 text-ritual-gold-400" />
          </div>
        </div>

        <div className="bg-ritual-stone-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ritual-stone-400 text-sm">Membresía</p>
              <p className="text-2xl font-bold text-ritual-gold-400 capitalize">{membershipInfo.tier}</p>
            </div>
            <Gift className="w-8 h-8 text-ritual-gold-400" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-ritual-stone-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Órdenes Recientes</h3>
          <button 
            onClick={() => setActiveTab('orders')}
            className="text-ritual-gold-400 hover:text-ritual-gold-300 flex items-center gap-1"
          >
            Ver todas <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {ordersLoading ? (
            <div className="text-center py-8">
              <p className="text-ritual-stone-400">Cargando órdenes...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-ritual-stone-400">No tienes órdenes aún</p>
              <button 
                onClick={() => router.push('/')}
                className="text-ritual-gold-400 hover:text-ritual-gold-300 mt-2"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            orders.slice(0, 2).map((order) => (
              <div key={order.id} className="border border-ritual-stone-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">#{order.id.slice(-8)}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' 
                      ? 'bg-green-900 text-green-300' 
                      : order.status === 'processing'
                      ? 'bg-yellow-900 text-yellow-300'
                      : order.status === 'shipped'
                      ? 'bg-blue-900 text-blue-300'
                      : 'bg-gray-900 text-gray-300'
                  }`}>
                    {order.status === 'delivered' ? 'Entregado' : 
                     order.status === 'processing' ? 'En preparación' :
                     order.status === 'shipped' ? 'Enviado' :
                     order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                  </span>
                </div>
                <p className="text-ritual-stone-400 text-sm mb-2">
                  {new Date(order.created_at).toLocaleDateString('es-PE')}
                </p>
                <p className="text-ritual-gold-400 font-bold">S/ {order.total_amount.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Historial de Órdenes</h2>
      {ordersLoading ? (
        <div className="text-center py-12">
          <p className="text-ritual-stone-400">Cargando órdenes...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-ritual-stone-600 mx-auto mb-4" />
          <p className="text-xl text-ritual-stone-400 mb-2">No tienes órdenes aún</p>
          <p className="text-ritual-stone-500 mb-6">¡Comienza tu primer ritual parrillero!</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-ritual-gold-500 hover:bg-ritual-gold-600 text-ritual-stone-900 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Explorar Productos
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-ritual-stone-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">#{order.id.slice(-8)}</h3>
                  <p className="text-ritual-stone-400">
                    {new Date(order.created_at).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' 
                      ? 'bg-green-900 text-green-300' 
                      : order.status === 'processing'
                      ? 'bg-yellow-900 text-yellow-300'
                      : order.status === 'shipped'
                      ? 'bg-blue-900 text-blue-300'
                      : order.status === 'pending'
                      ? 'bg-orange-900 text-orange-300'
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {order.status === 'delivered' ? 'Entregado' : 
                     order.status === 'processing' ? 'En preparación' :
                     order.status === 'shipped' ? 'Enviado' :
                     order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                  </span>
                  <p className="text-ritual-gold-400 font-bold mt-2">S/ {order.total_amount.toFixed(2)}</p>
                </div>
              </div>
              {order.order_items && order.order_items.length > 0 && (
                <div className="border-t border-ritual-stone-700 pt-4">
                  <h4 className="font-medium mb-3">Productos:</h4>
                  <div className="space-y-3">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          {item.product?.image_url && (
                            <Image
                              src={item.product.image_url}
                              alt={item.product.name || 'Producto'}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <span>{item.product?.name || 'Producto'} x{item.quantity}</span>
                        </div>
                        <span className="text-ritual-gold-400 font-medium">S/ {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mi Perfil</h2>
      <div className="bg-ritual-stone-800 rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input 
              type="text" 
              value={profile?.name || ''} 
              className="w-full px-4 py-2 bg-ritual-stone-700 border border-ritual-stone-600 rounded-lg focus:outline-none focus:border-ritual-gold-400"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              className="w-full px-4 py-2 bg-ritual-stone-700 border border-ritual-stone-600 rounded-lg focus:outline-none focus:border-ritual-gold-400"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Teléfono</label>
            <input 
              type="tel" 
              value={profile?.phone || ''} 
              className="w-full px-4 py-2 bg-ritual-stone-700 border border-ritual-stone-600 rounded-lg focus:outline-none focus:border-ritual-gold-400"
              readOnly
            />
          </div>
          <div className="pt-4">
            <button className="bg-ritual-gold-500 hover:bg-ritual-gold-600 text-ritual-stone-900 px-6 py-2 rounded-lg font-medium transition-colors">
              Editar Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ritual-stone-950">
      {/* Header */}
      <header className="bg-ritual-stone-900 border-b border-ritual-stone-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-3"
              >
                <Image 
                  src="/img/ritual.png" 
                  alt="RITUAL" 
                  width={40} 
                  height={40} 
                  className="object-contain"
                />
                <span className="text-2xl font-bold text-ritual-gold-400">RITUAL</span>
              </button>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-ritual-stone-400 hover:text-ritual-stone-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-ritual-stone-800 rounded-xl p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-ritual-gold-500 text-ritual-stone-900' 
                      : 'text-ritual-stone-300 hover:bg-ritual-stone-700'
                  }`}
                >
                  <User className="w-5 h-5" />
                  Resumen
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-ritual-gold-500 text-ritual-stone-900' 
                      : 'text-ritual-stone-300 hover:bg-ritual-stone-700'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  Mis Órdenes
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-ritual-gold-500 text-ritual-stone-900' 
                      : 'text-ritual-stone-300 hover:bg-ritual-stone-700'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Mi Perfil
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'profile' && renderProfile()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard