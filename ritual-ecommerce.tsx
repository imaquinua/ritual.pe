import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Play, Star, Clock, Truck, Shield, ChefHat, Flame, MessageCircle, X, Plus, Minus } from 'lucide-react';

const RitualEcommerce = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showChispa, setShowChispa] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const products = [
    {
      id: 1,
      name: "Picaña Premium",
      subtitle: "El Legendario Corte Brasileño",
      price: 299,
      originalPrice: 349,
      weight: "2.2kg",
      description: "Corte brasileño de excelencia. Jugosidad excepcional con un sabor profundo que conquista desde el primer bocado.",
      image: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop",
      badge: "BESTSELLER",
      cookTime: "25-30 min",
      serves: "6-8 personas",
      origin: "Angus Argentino Premium",
      discount: "15%",
      rating: 4.9
    },
    {
      id: 2,
      name: "Bife Ancho",
      subtitle: "Ribeye de Autor",
      price: 299,
      originalPrice: 349,
      weight: "2.2kg",
      description: "Veteado perfecto que garantiza una experiencia sensorial única. El corte preferido por los conocedores.",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      badge: "PREMIUM",
      cookTime: "20-25 min",
      serves: "6-8 personas",
      origin: "Hereford Premium",
      discount: "15%",
      rating: 4.8
    },
    {
      id: 3,
      name: "Bife Angosto",
      subtitle: "New York Strip Selecto",
      price: 299,
      originalPrice: 349,
      weight: "2.2kg",
      description: "Equilibrio magistral entre terneza y sabor. Un clásico reinventado para paladares exigentes.",
      image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&h=600&fit=crop",
      badge: "FAVORITO",
      cookTime: "18-22 min",
      serves: "6-8 personas",
      origin: "Angus Selecto",
      discount: "15%",
      rating: 4.7
    }
  ];

  const complementos = [
    { 
      id: 6, 
      name: "Chimichurri de Autor", 
      price: 35, 
      image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=300&h=300&fit=crop",
      description: "Receta secreta con hierbas seleccionadas"
    },
    { 
      id: 7, 
      name: "Carbón Premium Oak", 
      price: 45, 
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=300&fit=crop",
      description: "Carbón de roble americano, combustión perfecta"
    },
    { 
      id: 8, 
      name: "Kit Maestro Parrillero", 
      price: 189, 
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
      description: "Herramientas profesionales para el ritual perfecto"
    }
  ];

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop",
      title: "EL ARTE DEL RITUAL",
      subtitle: "Donde cada corte cuenta una historia de excelencia"
    },
    {
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1920&h=1080&fit=crop",
      title: "MAESTRÍA EN CADA CORTE",
      subtitle: "Selección curada para paladares exigentes"
    },
    {
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1920&h=1080&fit=crop",
      title: "TRADICIÓN PREMIUM",
      subtitle: "Del rancho a tu mesa, sin compromisos"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const chispaResponses = {
    greeting: "¡Hola! Soy Chispa, tu maestro parrillero personal. He ayudado a más de 10,000 amantes de la parrilla a encontrar su corte perfecto. ¿Para cuántas personas será tu ritual?",
    recommendation: "Excelente elección. Para 6-8 personas, la Picaña Premium es perfecta. Su corte en forma de corazón garantiza jugosidad excepcional. ¿Te armo el pack completo?",
    cooking: "La Picaña requiere técnica: sella 4 minutos por lado a fuego alto, luego cocina 20 minutos a fuego medio. El punto perfecto es 54°C interno.",
    delivery: "Tu pedido llegará en cadena de frío premium en 2-3 horas. Perfecto timing para preparar las brasas."
  };

  const handleChispaChat = (message: string) => {
    if (!message.trim()) return;
    
    setChatMessages(prev => [...prev, { type: 'user', text: message }]);
    
    setTimeout(() => {
      let response = chispaResponses.greeting;
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('recomend') || lowerMessage.includes('mejor')) {
        response = chispaResponses.recommendation;
      } else if (lowerMessage.includes('cocin') || lowerMessage.includes('punto')) {
        response = chispaResponses.cooking;
      } else if (lowerMessage.includes('deliver') || lowerMessage.includes('llega')) {
        response = chispaResponses.delivery;
      }
      
      setChatMessages(prev => [...prev, { type: 'chispa', text: response }]);
    }, 1500);
    
    setUserMessage('');
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-serif">
      {/* Header */}
      <header className="bg-stone-950/95 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-12">
              <div className="text-3xl font-bold tracking-wider">
                <span className="text-stone-100">RITUAL</span>
                <span className="text-amber-600">.pe</span>
              </div>
              <nav className="hidden lg:flex space-x-8">
                <a href="#cortes" className="text-stone-300 hover:text-amber-500 transition-all duration-300">Cortes Nobles</a>
                <a href="#complementos" className="text-stone-300 hover:text-amber-500 transition-all duration-300">Accesorios</a>
                <a href="#podcast" className="text-stone-300 hover:text-amber-500 transition-all duration-300">Podcast</a>
                <a href="#club" className="text-stone-300 hover:text-amber-500 transition-all duration-300">Club Exclusivo</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-6">
              <Search className="w-6 h-6 text-stone-400 hover:text-amber-500 cursor-pointer transition-colors duration-300" />
              <User className="w-6 h-6 text-stone-400 hover:text-amber-500 cursor-pointer transition-colors duration-300" />
              <button 
                onClick={() => setShowCart(true)}
                className="relative p-2 text-stone-400 hover:text-amber-500 transition-colors duration-300"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent z-10" />
        
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.image} 
              alt="Ritual Hero" 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <div className="max-w-4xl">
              <h1 className="text-6xl lg:text-8xl font-bold mb-8 tracking-wider leading-tight">
                <span className="text-stone-100 block">EL ARTE DEL</span>
                <span className="text-amber-600 block">RITUAL</span>
              </h1>
              <p className="text-2xl text-stone-300 mb-12 leading-relaxed max-w-2xl">
                Donde cada corte cuenta una historia de excelencia, tradición y pasión por la parrilla perfecta.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <button className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-10 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl">
                  Descubrir Colección
                </button>
                <button className="bg-transparent border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-stone-950 px-10 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
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
              className={`w-12 h-1 rounded-full transition-all duration-500 ${
                index === currentSlide ? 'bg-amber-600 w-16' : 'bg-stone-600 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-gradient-to-r from-stone-900 to-stone-800 py-16 border-y border-amber-900/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Delivery Premium</h3>
              <p className="text-stone-400 text-sm">Cadena de frío garantizada</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Garantía Absoluta</h3>
              <p className="text-stone-400 text-sm">Satisfacción o devolución</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Asesoría Experta</h3>
              <p className="text-stone-400 text-sm">Maestros parrilleros 24/7</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Entrega Express</h3>
              <p className="text-stone-400 text-sm">2-3 horas máximo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="cortes" className="py-24 bg-stone-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 tracking-wider">
              <span className="text-stone-100">CORTES</span>
              <span className="text-amber-600"> NOBLES</span>
            </h2>
            <p className="text-xl text-stone-400 max-w-3xl mx-auto leading-relaxed">
              Una selección curada de los cortes más excepcionales, 
              cada uno con su propia historia de excelencia y tradición.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-amber-600/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        {product.badge}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        -{product.discount}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold">{product.name}</h3>
                      <div className="flex items-center text-amber-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="ml-2 text-sm font-semibold">{product.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-amber-600 text-lg mb-4">{product.subtitle}</p>
                    <p className="text-stone-400 mb-6 leading-relaxed">{product.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="bg-stone-800 p-3 rounded-lg">
                        <span className="text-stone-400 block">Peso</span>
                        <span className="text-white font-semibold">{product.weight}</span>
                      </div>
                      <div className="bg-stone-800 p-3 rounded-lg">
                        <span className="text-stone-400 block">Rinde</span>
                        <span className="text-white font-semibold">{product.serves}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-3xl font-bold text-white">S/ {product.price}</span>
                        <span className="text-stone-500 line-through ml-3 text-lg">S/ {product.originalPrice}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Agregar al Ritual
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complementos */}
      <section id="complementos" className="py-24 bg-gradient-to-br from-stone-900 to-stone-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-wider">
              <span className="text-stone-100">COMPLETA TU</span>
              <span className="text-amber-600"> RITUAL</span>
            </h2>
            <p className="text-xl text-stone-400">Accesorios premium para la experiencia perfecta</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {complementos.map((item) => (
              <div key={item.id} className="bg-stone-950 rounded-xl p-8 text-center border border-stone-700 hover:border-amber-600/50 transition-all duration-300 transform hover:scale-105 group">
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.name}</h3>
                <p className="text-stone-400 text-sm mb-4">{item.description}</p>
                <p className="text-amber-600 font-bold text-2xl mb-6">S/ {item.price}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-gradient-to-br from-stone-900 to-stone-800 shadow-2xl border-l border-amber-900/20">
            <div className="flex flex-col h-full">
              <div className="p-8 border-b border-stone-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Tu Ritual</h2>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-stone-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-stone-400 text-lg">Tu carrito está vacío</p>
                    <p className="text-stone-500 text-sm mt-2">Agrega algunos cortes premium para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 bg-stone-950 p-6 rounded-xl border border-stone-700">
                        <img 
                          src={item.image || "/api/placeholder/80/80"} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-lg" 
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className="text-amber-600 font-semibold">S/ {item.price}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 bg-stone-700 hover:bg-stone-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 bg-stone-700 hover:bg-stone-600 rounded-full flex items-center justify-center transition-colors"
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
                <div className="p-8 border-t border-stone-700">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-3xl font-bold text-amber-600">S/ {totalPrice}</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105">
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
            className="relative group"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-amber-600 via-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-110">
              <Flame className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-stone-900 text-white px-3 py-1 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Chispa - Tu Maestro Parrillero
            </div>
          </button>
        ) : (
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col border border-amber-900/30">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 rounded-t-2xl">
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
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-stone-300">¡Hola! Soy Chispa, tu maestro parrillero personal. ¿En qué puedo ayudarte hoy?</p>
                </div>
              )}
              
              {chatMessages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-4 rounded-xl max-w-xs ${
                    message.type === 'user' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-stone-700 text-stone-100'
                  }`}>
                    {message.type === 'chispa' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-amber-400 font-bold">CHISPA</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-stone-700">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userMessage.trim() && handleChispaChat(userMessage)}
                  placeholder="Pregúntame sobre cortes, cocción, maridajes..."
                  className="flex-1 bg-stone-800 text-white p-3 rounded-lg border border-stone-600 text-sm focus:border-amber-500 focus:outline-none"
                />
                <button
                  onClick={() => userMessage.trim() && handleChispaChat(userMessage)}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 py-16 border-t border-amber-900/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-6 tracking-wider">
                <span className="text-stone-100">RITUAL</span>
                <span className="text-amber-600">.pe</span>
              </h3>
              <p className="text-stone-400 text-lg leading-relaxed mb-6 max-w-md">
                El arte del ritual parrillero. Cortes premium para los verdaderos maestros de la brasa. 
                Cada corte cuenta una historia de excelencia y tradición.
              </p>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer">
                  <span className="text-xl">📧</span>
                </div>
                <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer">
                  <span className="text-xl">📱</span>
                </div>
                <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer">
                  <span className="text-xl">📍</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Productos</h4>
              <ul className="space-y-3 text-stone-400">
                <li><a href="#" className="hover:text-amber-500 transition-colors">Cortes Premium</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Accesorios</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Carbón Selecto</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Salsas Artesanales</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Gift Cards</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Soporte</h4>
              <ul className="space-y-3 text-stone-400">
                <li><a href="#" className="hover:text-amber-500 transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Envíos Premium</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Devoluciones</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Garantía</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-stone-500 text-sm">
              © 2025 Ritual.pe. Todos los derechos reservados. Hecho con pasión para los amantes de la parrilla.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0 text-sm">
              <a href="#" className="text-stone-400 hover:text-amber-500 transition-colors">Términos de Servicio</a>
              <a href="#" className="text-stone-400 hover:text-amber-500 transition-colors">Política de Privacidad</a>
              <a href="#" className="text-stone-400 hover:text-amber-500 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RitualEcommerce;