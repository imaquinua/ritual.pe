'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingCart, User, Search, Play, Star, Clock, Truck, Shield, ChefHat, Flame, MessageCircle, X, Plus, Minus, Menu, Crown, Gift, Calendar, Award, Mail, Phone, Eye, EyeOff } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useProducts } from '@/hooks/useProducts'
import type { Product } from '@/lib/supabase'

interface CartItem {
  product: Product
  quantity: number
}

const RitualEcommerce = () => {
  const router = useRouter()
  
  // Auth context
  const { user, profile, loading: authLoading, signUp, signIn, signOut } = useAuthContext()
  
  // Products from Supabase
  const { products, loading: productsLoading, error: productsError } = useProducts()
  
  // Debug logging
  useEffect(() => {
    console.log('🔍 Debug Info:')
    console.log('Products loading:', productsLoading)
    console.log('Products error:', productsError)
    console.log('Products count:', products.length)
    console.log('Products data:', products)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Has Supabase Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }, [products, productsLoading, productsError])
  
  // Local state
  const [currentSlide, setCurrentSlide] = useState(0)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showChispa, setShowChispa] = useState(false)
  const [chatMessages, setChatMessages] = useState<{type: 'user' | 'chispa', text: string}[]>([])
  const [userMessage, setUserMessage] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  // Separate products by category
  const carnes = products.filter(product => product.category === 'carnes')
  const complementos = products.filter(product => product.category === 'complementos')

  const heroSlides = [
    {
      image: "/img/cortes/foto11.jpg",
      title: "EL ARTE DEL RITUAL",
      subtitle: "Donde cada corte cuenta una historia de excelencia"
    },
    {
      image: "/img/cortes/foto12.jpg",
      title: "MAESTRÍA EN CADA CORTE",
      subtitle: "Selección curada para paladares exigentes"
    },
    {
      image: "/img/cortes/foto13.jpg",
      title: "TRADICIÓN PREMIUM",
      subtitle: "Del rancho a tu mesa, sin compromisos"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const chispaResponses = {
    greeting: "¡Hola! Soy Chispa, tu maestro parrillero personal. He ayudado a más de 10,000 amantes de la parrilla a encontrar su corte perfecto. ¿Para cuántas personas será tu ritual?",
    recommendation: "Excelente elección. Para 6-8 personas, la Picaña Premium es perfecta. Su corte en forma de corazón garantiza jugosidad excepcional. ¿Te armo el pack completo?",
    cooking: "La Picaña requiere técnica: sella 4 minutos por lado a fuego alto, luego cocina 20 minutos a fuego medio. El punto perfecto es 54°C interno.",
    delivery: "Tu pedido llegará en cadena de frío premium en 2-3 horas. Perfecto timing para preparar las brasas.",
    tomahawk: "El Tomahawk es espectacular. Necesitas parrilla grande y técnica reversa: horno 120°C por 1 hora, luego sella 2 min por lado. ¡Impresionante!",
    lomo: "El Lomo Fino es pura elegancia. Temperatura ambiente 30 min antes, sella 2 min por lado, fuego medio 10-12 min. Punto perfecto a 52°C."
  }

  const handleChispaChat = async (message: string) => {
    if (!message.trim()) return
    
    setChatMessages(prev => [...prev, { type: 'user', text: message }])
    setUserMessage('')
    
    // Add typing indicator
    setChatMessages(prev => [...prev, { type: 'chispa', text: 'Chispa está pensando...' }])
    
    try {
      console.log('Calling chat API with message:', message)
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })
      
      console.log('API response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('API response data:', data)
      
      // Remove typing indicator and add real response
      setChatMessages(prev => {
        const messages = prev.slice(0, -1) // Remove typing indicator
        return [...messages, { type: 'chispa', text: data.response || 'Lo siento, no pude procesar tu consulta.' }]
      })
      
    } catch (error) {
      console.error('Error calling chat API:', error)
      
      // More detailed fallback message based on error type
      let fallbackMessage = '¡Hola! Soy Chispa, tu maestro parrillero. ¿En qué puedo ayudarte con tu ritual?'
      
      if (error instanceof Error) {
        if (error.message.includes('500')) {
          fallbackMessage = 'Disculpa, tengo problemas técnicos. Pero puedo ayudarte: ¿necesitas consejos de parrilla?'
        } else if (error.message.includes('404')) {
          fallbackMessage = 'Hay un problema de configuración. Mientras tanto, pregúntame sobre técnicas de parrilla.'
        }
      }
      
      // Fallback to basic response on error
      setChatMessages(prev => {
        const messages = prev.slice(0, -1) // Remove typing indicator
        return [...messages, { type: 'chispa', text: fallbackMessage }]
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    
    const { data, error } = await signUp(
      registerForm.email, 
      registerForm.password, 
      { 
        name: registerForm.name, 
        phone: registerForm.phone 
      }
    )

    if (error) {
      alert(`Error: ${error.message}`)
      return
    }

    alert('¡Cuenta creada! Revisa tu email para confirmar tu cuenta.')
    setShowRegister(false)
    setRegisterForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { data, error } = await signIn(loginForm.email, loginForm.password)

    if (error) {
      alert(`Error: ${error.message}`)
      return
    }

    setShowLogin(false)
    setLoginForm({ email: '', password: '' })
  }

  const handleLogout = async () => {
    await signOut()
  }

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(prev => prev.filter(item => item.product.id !== productId))
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-ritual-stone-950 text-ritual-stone-100 font-sans">
      {/* Header */}
      <header className="bg-ritual-stone-950/95 backdrop-blur-premium fixed top-0 w-full z-50 border-b border-ritual-gold/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-12">
              <div className="flex items-center">
                <Image
                  src="/img/logo.png"
                  alt="RITUAL"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </div>
              <nav className="hidden lg:flex space-x-8">
                <a href="#cortes" className="text-ritual-stone-300 hover:text-ritual-gold transition-all duration-300 font-medium">Cortes Nobles</a>
                <a href="#complementos" className="text-ritual-stone-300 hover:text-ritual-gold transition-all duration-300 font-medium">Accesorios</a>
                <a href="#experiencia" className="text-ritual-stone-300 hover:text-ritual-gold transition-all duration-300 font-medium">Experiencia</a>
                <a href="#club" className="text-ritual-stone-300 hover:text-ritual-gold transition-all duration-300 font-medium">Club Exclusivo</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-6">
              <Search className="w-6 h-6 text-ritual-stone-400 hover:text-ritual-gold cursor-pointer transition-colors duration-300" />
              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center space-x-2 text-ritual-stone-200 hover:text-ritual-gold transition-colors duration-300"
                  >
                    <Crown className="w-5 h-5 text-ritual-gold" />
                    <span className="font-medium">{profile?.name || user.email}</span>
                    <span className="text-xs bg-ritual-gold text-ritual-stone-950 px-2 py-1 rounded-full font-bold">
                      {profile?.membership_level || 'Bronze'}
                    </span>
                  </button>
                  <button 
                    onClick={signOut}
                    className="text-ritual-stone-400 hover:text-ritual-gold transition-colors duration-300 text-sm"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => router.push('/login')}
                    className="text-ritual-stone-400 hover:text-ritual-gold transition-colors duration-300 text-sm font-medium"
                  >
                    Iniciar Sesión
                  </button>
                  <button 
                    onClick={() => router.push('/login')}
                    className="bg-ritual-gold text-ritual-stone-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-ritual-gold/90 transition-colors duration-300"
                  >
                    Registrarse
                  </button>
                </div>
              )}
              <button 
                onClick={() => setShowCart(true)}
                className="relative p-2 text-ritual-stone-400 hover:text-ritual-gold transition-colors duration-300"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ritual-red text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-ritual-stone-400 hover:text-ritual-gold transition-colors duration-300"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ritual-stone-950/90 via-ritual-stone-950/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ritual-stone-950/80 to-transparent z-10" />
        
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-2000 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <Image
              src={slide.image}
              alt="Ritual Hero"
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <div className="max-w-4xl animate-slide-up">
              <h1 className="text-6xl lg:text-8xl font-bold mb-8 tracking-wider leading-tight">
                <span className="text-ritual-stone-100 block">EL ARTE DEL</span>
                <span className="text-gradient block">RITUAL</span>
              </h1>
              <p className="text-2xl text-ritual-stone-300 mb-12 leading-relaxed max-w-2xl">
                Donde cada corte cuenta una historia de excelencia, tradición y pasión por la parrilla perfecta.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => document.getElementById('cortes')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-ritual-red to-ritual-red/80 hover:from-ritual-red/90 hover:to-ritual-red text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl btn-premium"
                >
                  Descubrir Colección
                </button>
                <button className="bg-transparent border-2 border-ritual-gold text-ritual-gold hover:bg-ritual-gold hover:text-ritual-stone-950 px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 btn-premium">
                  <Play className="w-6 h-6 inline mr-3" />
                  Ver en Acción
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-4">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentSlide ? 'bg-ritual-gold w-16' : 'bg-ritual-stone-600 hover:bg-ritual-stone-400 w-12'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-gradient-to-r from-ritual-stone-900 to-ritual-stone-800 py-16 border-y border-ritual-gold/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ritual-gold to-ritual-gold/80 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 float-animation">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Delivery Premium</h3>
              <p className="text-ritual-stone-400 text-sm">Cadena de frío garantizada</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ritual-gold to-ritual-gold/80 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 float-animation">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Garantía Absoluta</h3>
              <p className="text-ritual-stone-400 text-sm">Satisfacción o devolución</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ritual-gold to-ritual-gold/80 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 float-animation">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Asesoría Experta</h3>
              <p className="text-ritual-stone-400 text-sm">Maestros parrilleros 24/7</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ritual-gold to-ritual-gold/80 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 float-animation">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Entrega Express</h3>
              <p className="text-ritual-stone-400 text-sm">2-3 horas máximo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="cortes" className="py-24 bg-ritual-stone-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 tracking-wider">
              <span className="text-ritual-stone-100">CORTES</span>
              <span className="text-gradient"> NOBLES</span>
            </h2>
            <p className="text-xl text-ritual-stone-400 max-w-3xl mx-auto leading-relaxed">
              Una selección curada de los cortes más excepcionales, 
              cada uno con su propia historia de excelencia y tradición.
            </p>
          </div>

          {/* Debug Info */}
          <div className="bg-yellow-900 p-4 mb-8 rounded-lg text-black">
            <h3 className="font-bold">🔍 DEBUG INFO:</h3>
            <p>Loading: {productsLoading ? 'SÍ' : 'NO'}</p>
            <p>Error: {productsError || 'Ninguno'}</p>
            <p>Total Products: {products.length}</p>
            <p>Carnes: {carnes.length}</p>
            <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurada' : 'NO CONFIGURADA'}</p>
            <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configurada' : 'NO CONFIGURADA'}</p>
          </div>

          {productsLoading ? (
            <div className="text-center py-16">
              <p className="text-ritual-stone-400 text-lg">Cargando productos...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-16">
              <p className="text-red-400 text-lg">Error: {productsError}</p>
              <p className="text-ritual-stone-400 text-sm mt-2">Revisa la consola para más detalles</p>
            </div>
          ) : carnes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-yellow-400 text-lg">No se encontraron productos de carnes</p>
              <p className="text-ritual-stone-400 text-sm mt-2">Total productos cargados: {products.length}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {carnes.map((product) => (
                <div key={product.id} className="group card-hover">
                  <div className="bg-gradient-to-br from-ritual-stone-900 to-ritual-stone-800 rounded-2xl overflow-hidden border border-ritual-stone-700 hover:border-ritual-gold/50 transition-all duration-500 shadow-xl">
                    <div className="relative overflow-hidden">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={400}
                        height={320}
                        className="w-full h-80 object-cover image-zoom"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-ritual-red to-ritual-red/80 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          {product.badge}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          -{product.discount}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold">{product.name}</h3>
                        <div className="flex items-center text-ritual-gold">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="ml-2 text-sm font-semibold">{product.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-ritual-gold text-lg mb-4 font-medium">{product.subtitle}</p>
                      <p className="text-ritual-stone-400 mb-6 leading-relaxed">{product.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div className="bg-ritual-stone-800 p-3 rounded-lg">
                          <span className="text-ritual-stone-400 block">Peso</span>
                          <span className="text-white font-semibold">{product.weight}</span>
                        </div>
                        <div className="bg-ritual-stone-800 p-3 rounded-lg">
                          <span className="text-ritual-stone-400 block">Rinde</span>
                          <span className="text-white font-semibold">{product.serves}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <span className="text-3xl font-bold text-white">S/ {product.price}</span>
                          <span className="text-ritual-stone-500 line-through ml-3 text-lg">S/ {product.original_price}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-gradient-to-r from-ritual-red to-ritual-red/80 hover:from-ritual-red/90 hover:to-ritual-red text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg btn-premium"
                      >
                        Agregar al Ritual
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Complementos */}
      <section id="complementos" className="py-24 bg-gradient-to-br from-ritual-stone-900 to-ritual-stone-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-wider">
              <span className="text-ritual-stone-100">COMPLETA TU</span>
              <span className="text-gradient"> RITUAL</span>
            </h2>
            <p className="text-xl text-ritual-stone-400">Accesorios premium para la experiencia perfecta</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {complementos.map((item) => (
              <div key={item.id} className="bg-ritual-stone-950 rounded-xl p-8 text-center border border-ritual-stone-700 hover:border-ritual-gold/50 transition-all duration-300 transform hover:scale-105 group card-hover">
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover image-zoom"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.name}</h3>
                <p className="text-ritual-stone-400 text-sm mb-4">{item.description}</p>
                <p className="text-ritual-gold font-bold text-2xl mb-6">S/ {item.price}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-gradient-to-r from-ritual-gold to-ritual-gold/80 hover:from-ritual-gold/90 hover:to-ritual-gold text-ritual-stone-950 px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 btn-premium"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Club Exclusivo Section */}
      <section id="club" className="py-24 bg-gradient-to-br from-ritual-stone-950 via-ritual-stone-900 to-ritual-stone-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 tracking-wider">
              <span className="text-ritual-stone-100">CLUB</span>
              <span className="text-gradient"> EXCLUSIVO</span>
            </h2>
            <p className="text-xl text-ritual-stone-400 max-w-3xl mx-auto leading-relaxed">
              Únete a la élite de los maestros parrilleros. Beneficios únicos, acceso prioritario y experiencias exclusivas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Bronze Membership */}
            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 rounded-2xl p-8 border border-amber-600/30 hover:border-amber-500 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-amber-400">BRONZE</h3>
              <p className="text-center text-ritual-stone-300 mb-6">El inicio de tu ritual</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-ritual-stone-300">
                  <Award className="w-5 h-5 text-amber-500 mr-3" />
                  5% descuento en todos los cortes
                </li>
                <li className="flex items-center text-ritual-stone-300">
                  <Gift className="w-5 h-5 text-amber-500 mr-3" />
                  Recetas exclusivas mensuales
                </li>
                <li className="flex items-center text-ritual-stone-300">
                  <Calendar className="w-5 h-5 text-amber-500 mr-3" />
                  Acceso a eventos virtuales
                </li>
              </ul>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-400 mb-4">GRATIS</p>
                <p className="text-sm text-ritual-stone-400">Con tu primera compra</p>
              </div>
            </div>

            {/* Silver Membership */}
            <div className="bg-gradient-to-br from-slate-700/20 to-slate-600/20 rounded-2xl p-8 border border-slate-500/30 hover:border-slate-400 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-400">SILVER</h3>
              <p className="text-center text-ritual-stone-300 mb-6">Eleva tu experiencia</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-ritual-stone-300">
                  <Award className="w-5 h-5 text-slate-400 mr-3" />
                  10% descuento en todos los cortes
                </li>
                <li className="flex items-center text-ritual-stone-300">
                  <Gift className="w-5 h-5 text-slate-400 mr-3" />
                  Envío gratuito en pedidos +S/200
                </li>
                <li className="flex items-center text-ritual-stone-300">
                  <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                  Masterclass presenciales
                </li>
                <li className="flex items-center text-ritual-stone-300">
                  <Flame className="w-5 h-5 text-slate-400 mr-3" />
                  Consultoría personal con Chispa
                </li>
              </ul>
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-400 mb-4">S/ 89</p>
                <p className="text-sm text-ritual-stone-400">Por mes</p>
              </div>
            </div>

            {/* Gold Membership */}
            <div className="bg-gradient-to-br from-ritual-gold/20 to-yellow-600/20 rounded-2xl p-8 border border-ritual-gold/50 hover:border-ritual-gold transition-all duration-300 transform hover:scale-105 ring-2 ring-ritual-gold/20">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-ritual-gold to-yellow-600 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-ritual-gold">GOLD</h3>
              <p className="text-center text-ritual-stone-300 mb-6">La experiencia suprema</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-ritual-stone-300">
                  <Award className="w-5 h-5 text-ritual-gold mr-3" />
                  20% descuento en todos los cortes
                </li>
                <li className="flex items-center text-ritual-stone-300">
                  <Gift className="w-5 h-5 text-ritual-gold mr-3" />
                  Envío gratuito siempre
                </li>
                <li className="flex items-center text-ritual-stone-300">
                  <Calendar className="w-5 h-5 text-ritual-gold mr-3" />
                  Eventos exclusivos VIP
                </li>
                <li className="flex items-center text-ritual-stone-300">
                  <Flame className="w-5 h-5 text-ritual-gold mr-3" />
                  Línea directa con maestros
                </li>
                <li className="flex items-center text-ritual-stone-300">
                  <Star className="w-5 h-5 text-ritual-gold mr-3" />
                  Cortes premium limitados
                </li>
              </ul>
              <div className="text-center">
                <p className="text-3xl font-bold text-ritual-gold mb-4">S/ 199</p>
                <p className="text-sm text-ritual-stone-400">Por mes</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-6">¿Listo para unirte a la élite?</h3>
            <p className="text-ritual-stone-400 mb-8 max-w-2xl mx-auto">
              Cada nivel del Club Exclusivo te acerca más a la maestría parrillera. 
              Beneficios únicos, conocimiento experto y una comunidad apasionada te esperan.
            </p>
            <button 
              onClick={() => setShowRegister(true)}
              className="bg-gradient-to-r from-ritual-gold to-yellow-600 hover:from-ritual-gold/90 hover:to-yellow-500 text-ritual-stone-950 px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Comenzar Mi Ritual
            </button>
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-ritual-stone-950/80 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-gradient-to-br from-ritual-stone-900 to-ritual-stone-800 shadow-2xl border-l border-ritual-gold/20 animate-slide-up">
            <div className="flex flex-col h-full">
              <div className="p-8 border-b border-ritual-stone-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Tu Ritual</h2>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-ritual-stone-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-ritual-stone-400 text-lg">Tu carrito está vacío</p>
                    <p className="text-ritual-stone-500 text-sm mt-2">Agrega algunos cortes premium para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center space-x-4 bg-ritual-stone-950 p-6 rounded-xl border border-ritual-stone-700">
                        <Image
                          src={item.product.image_url || "/img/cortes/foto1.jpg"}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{item.product.name}</h3>
                          <p className="text-ritual-gold font-semibold">S/ {item.product.price}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-10 h-10 bg-ritual-stone-700 hover:bg-ritual-stone-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-10 h-10 bg-ritual-stone-700 hover:bg-ritual-stone-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cartItems.length > 0 && (
                <div className="p-8 border-t border-ritual-stone-700">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-3xl font-bold text-ritual-gold">S/ {totalPrice}</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-ritual-red to-ritual-red/80 hover:from-ritual-red/90 hover:to-ritual-red text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 btn-premium">
                    Finalizar Ritual
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chispa AI Assistant */}
      <div className="fixed bottom-8 right-8 z-40">
        {!showChispa ? (
          <button
            onClick={() => setShowChispa(true)}
            className="relative group float-animation"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-ritual-gold via-orange-500 to-ritual-red rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-110">
              <Flame className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-ritual-stone-900 text-white px-3 py-1 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Chispa - Tu Maestro Parrillero
            </div>
          </button>
        ) : (
          <div className="bg-gradient-to-br from-ritual-stone-900 to-ritual-stone-800 rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col border border-ritual-gold/30 animate-slide-up">
            <div className="bg-gradient-to-r from-ritual-gold to-orange-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Flame className="w-8 h-8 text-white animate-bounce" />
                  <div>
                    <span className="font-bold text-white text-lg">Chispa</span>
                    <p className="text-amber-100 text-sm">Maestro Parrillero IA</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowChispa(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Chat Debug Info */}
              <div className="bg-yellow-900 p-3 mb-4 rounded-lg text-black text-sm">
                <p><strong>🔥 CHISPA DEBUG:</strong></p>
                <p>OpenAI Key: {process.env.OPENAI_API_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA'}</p>
                <p>API Endpoint: /api/chat</p>
                <p>Mensajes: {chatMessages.length}</p>
              </div>

              {chatMessages.length === 0 && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-16 h-16 bg-gradient-to-br from-ritual-gold to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-ritual-stone-300">¡Hola! Soy Chispa, tu maestro parrillero personal. ¿En qué puedo ayudarte hoy?</p>
                </div>
              )}
              
              {chatMessages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'} animate-fade-in`}>
                  <div className={`inline-block p-4 rounded-xl max-w-xs ${
                    message.type === 'user' 
                      ? 'bg-ritual-gold text-white' 
                      : 'bg-ritual-stone-700 text-ritual-stone-100'
                  }`}>
                    {message.type === 'chispa' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Flame className="w-4 h-4 text-ritual-gold" />
                        <span className="text-xs text-ritual-gold font-bold">CHISPA</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-ritual-stone-700">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userMessage.trim() && handleChispaChat(userMessage)}
                  placeholder="Pregúntame sobre cortes, cocción, maridajes..."
                  className="flex-1 bg-ritual-stone-800 text-white p-3 rounded-lg border border-ritual-stone-600 text-sm focus:border-ritual-gold focus:outline-none"
                />
                <button
                  onClick={() => userMessage.trim() && handleChispaChat(userMessage)}
                  className="bg-gradient-to-r from-ritual-gold to-orange-600 hover:from-ritual-gold/90 hover:to-orange-500 text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-ritual-stone-950/90 backdrop-blur-sm" onClick={() => setShowRegister(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-ritual-stone-900 to-ritual-stone-800 rounded-2xl shadow-2xl w-full max-w-md border border-ritual-gold/20 animate-slide-up">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-ritual-gold">Crear Cuenta</h2>
                  <button 
                    onClick={() => setShowRegister(false)}
                    className="p-2 hover:bg-ritual-stone-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <label className="block text-ritual-stone-300 text-sm font-medium mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                      className="w-full bg-ritual-stone-800 text-white p-3 rounded-lg border border-ritual-stone-600 focus:border-ritual-gold focus:outline-none transition-colors"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-ritual-stone-300 text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      className="w-full bg-ritual-stone-800 text-white p-3 rounded-lg border border-ritual-stone-600 focus:border-ritual-gold focus:outline-none transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-ritual-stone-300 text-sm font-medium mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      required
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                      className="w-full bg-ritual-stone-800 text-white p-3 rounded-lg border border-ritual-stone-600 focus:border-ritual-gold focus:outline-none transition-colors"
                      placeholder="+51 999 999 999"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-ritual-stone-300 text-sm font-medium mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                        className="w-full bg-ritual-stone-800 text-white p-3 rounded-lg border border-ritual-stone-600 focus:border-ritual-gold focus:outline-none transition-colors pr-12"
                        placeholder="Contraseña segura"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-ritual-stone-400 hover:text-ritual-gold transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-ritual-stone-300 text-sm font-medium mb-2">
                      Confirmar Contraseña
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      className="w-full bg-ritual-stone-800 text-white p-3 rounded-lg border border-ritual-stone-600 focus:border-ritual-gold focus:outline-none transition-colors"
                      placeholder="Confirma tu contraseña"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-ritual-gold to-yellow-600 hover:from-ritual-gold/90 hover:to-yellow-500 text-ritual-stone-950 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                  >
                    Crear Cuenta
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-ritual-stone-400 text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <button 
                      onClick={() => {setShowRegister(false); setShowLogin(true)}}
                      className="text-ritual-gold hover:text-ritual-gold/80 transition-colors"
                    >
                      Iniciar Sesión
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-ritual-stone-950/90 backdrop-blur-sm" onClick={() => setShowLogin(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-ritual-stone-900 to-ritual-stone-800 rounded-2xl shadow-2xl w-full max-w-md border border-ritual-gold/20 animate-slide-up">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-ritual-gold">Iniciar Sesión</h2>
                  <button 
                    onClick={() => setShowLogin(false)}
                    className="p-2 hover:bg-ritual-stone-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-ritual-stone-300 text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      className="w-full bg-ritual-stone-800 text-white p-3 rounded-lg border border-ritual-stone-600 focus:border-ritual-gold focus:outline-none transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-ritual-stone-300 text-sm font-medium mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        className="w-full bg-ritual-stone-800 text-white p-3 rounded-lg border border-ritual-stone-600 focus:border-ritual-gold focus:outline-none transition-colors pr-12"
                        placeholder="Tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-ritual-stone-400 hover:text-ritual-gold transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-ritual-gold to-yellow-600 hover:from-ritual-gold/90 hover:to-yellow-500 text-ritual-stone-950 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                  >
                    Iniciar Sesión
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-ritual-stone-400 text-sm">
                    ¿No tienes cuenta?{' '}
                    <button 
                      onClick={() => {setShowLogin(false); setShowRegister(true)}}
                      className="text-ritual-gold hover:text-ritual-gold/80 transition-colors"
                    >
                      Crear Cuenta
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-ritual-stone-900 py-16 border-t border-ritual-gold/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <Image
                  src="/img/logo.png"
                  alt="RITUAL"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-ritual-stone-400 text-lg leading-relaxed mb-6 max-w-md">
                El arte del ritual parrillero. Cortes premium para los verdaderos maestros de la brasa. 
                Cada corte cuenta una historia de excelencia y tradición.
              </p>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-ritual-stone-800 rounded-lg flex items-center justify-center hover:bg-ritual-gold transition-colors cursor-pointer">
                  <span className="text-xl">📧</span>
                </div>
                <div className="w-12 h-12 bg-ritual-stone-800 rounded-lg flex items-center justify-center hover:bg-ritual-gold transition-colors cursor-pointer">
                  <span className="text-xl">📱</span>
                </div>
                <div className="w-12 h-12 bg-ritual-stone-800 rounded-lg flex items-center justify-center hover:bg-ritual-gold transition-colors cursor-pointer">
                  <span className="text-xl">📍</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Productos</h4>
              <ul className="space-y-3 text-ritual-stone-400">
                <li><a href="#" className="hover:text-ritual-gold transition-colors">Cortes Premium</a></li>
                <li><a href="#" className="hover:text-ritual-gold transition-colors">Accesorios</a></li>
                <li><a href="#" className="hover:text-ritual-gold transition-colors">Carbón Selecto</a></li>
                <li><a href="#" className="hover:text-ritual-gold transition-colors">Salsas Artesanales</a></li>
                <li><a href="#" className="hover:text-ritual-gold transition-colors">Gift Cards</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Soporte</h4>
              <ul className="space-y-3 text-ritual-stone-400">
                <li><a href="#" className="hover:text-ritual-gold transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-ritual-gold transition-colors">Envíos Premium</a></li>
                <li><a href="#" className="hover:text-ritual-gold transition-colors">Devoluciones</a></li>
                <li><a href="#" className="hover:text-ritual-gold transition-colors">Garantía</a></li>
                <li><a href="#" className="hover:text-ritual-gold transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-ritual-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-ritual-stone-500 text-sm">
              © 2025 Ritual.pe. Todos los derechos reservados. Hecho con pasión para los amantes de la parrilla.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0 text-sm">
              <a href="#" className="text-ritual-stone-400 hover:text-ritual-gold transition-colors">Términos de Servicio</a>
              <a href="#" className="text-ritual-stone-400 hover:text-ritual-gold transition-colors">Política de Privacidad</a>
              <a href="#" className="text-ritual-stone-400 hover:text-ritual-gold transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default RitualEcommerce