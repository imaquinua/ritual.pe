'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'

const LoginPage = () => {
  const router = useRouter()
  const { user, signIn, signUp } = useAuthContext()
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginForm.email || !loginForm.password) {
      alert('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    const { error } = await signIn(loginForm.email, loginForm.password)

    if (error) {
      alert(`Error: ${error.message}`)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    if (registerForm.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    const { error } = await signUp(
      registerForm.email, 
      registerForm.password, 
      { 
        name: registerForm.name, 
        phone: registerForm.phone 
      }
    )

    if (error) {
      alert(`Error: ${error.message}`)
    } else {
      alert('¡Cuenta creada! Revisa tu email para confirmar tu cuenta.')
      setIsRegister(false)
      setRegisterForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
    }
    setLoading(false)
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ritual-stone-950 via-ritual-stone-900 to-ritual-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-ritual-stone-400 hover:text-ritual-gold-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>
          
          <div className="flex items-center justify-center mb-6">
            <Image 
              src="/img/ritual.png" 
              alt="RITUAL" 
              width={120} 
              height={40} 
              className="h-12 w-auto"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-ritual-gold-400 mb-2">
            {isRegister ? 'Únete al Ritual' : 'Bienvenido de vuelta'}
          </h1>
          <p className="text-ritual-stone-400">
            {isRegister 
              ? 'Crea tu cuenta y comienza tu aventura parrillera'
              : 'Inicia sesión para continuar tu ritual parrillero'
            }
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-ritual-stone-800 rounded-2xl p-8 shadow-2xl border border-ritual-stone-700">
          {isRegister ? (
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-ritual-stone-300 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-ritual-stone-700 border border-ritual-stone-600 rounded-lg focus:outline-none focus:border-ritual-gold-400 text-ritual-stone-100 placeholder-ritual-stone-400"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ritual-stone-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ritual-stone-400" />
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-ritual-stone-700 border border-ritual-stone-600 rounded-lg focus:outline-none focus:border-ritual-gold-400 text-ritual-stone-100 placeholder-ritual-stone-400"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ritual-stone-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-ritual-stone-700 border border-ritual-stone-600 rounded-lg focus:outline-none focus:border-ritual-gold-400 text-ritual-stone-100 placeholder-ritual-stone-400"
                  placeholder="+51 999 999 999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ritual-stone-300 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ritual-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    className="w-full pl-12 pr-12 py-3 bg-ritual-stone-700 border border-ritual-stone-600 rounded-lg focus:outline-none focus:border-ritual-gold-400 text-ritual-stone-100 placeholder-ritual-stone-400"
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ritual-stone-400 hover:text-ritual-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ritual-stone-300 mb-2">
                  Confirmar contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ritual-stone-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    className="w-full pl-12 pr-12 py-3 bg-ritual-stone-700 border border-ritual-stone-600 rounded-lg focus:outline-none focus:border-ritual-gold-400 text-ritual-stone-100 placeholder-ritual-stone-400"
                    placeholder="Confirma tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ritual-stone-400 hover:text-ritual-stone-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-ritual-gold-500 to-ritual-gold-600 hover:from-ritual-gold-600 hover:to-ritual-gold-700 text-ritual-stone-900 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-ritual-stone-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ritual-stone-400" />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-ritual-stone-700 border border-ritual-stone-600 rounded-lg focus:outline-none focus:border-ritual-gold-400 text-ritual-stone-100 placeholder-ritual-stone-400"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ritual-stone-300 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ritual-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full pl-12 pr-12 py-3 bg-ritual-stone-700 border border-ritual-stone-600 rounded-lg focus:outline-none focus:border-ritual-gold-400 text-ritual-stone-100 placeholder-ritual-stone-400"
                    placeholder="Tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ritual-stone-400 hover:text-ritual-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-ritual-gold-500 to-ritual-gold-600 hover:from-ritual-gold-600 hover:to-ritual-gold-700 text-ritual-stone-900 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>
          )}

          {/* Toggle between login/register */}
          <div className="mt-6 text-center">
            <p className="text-ritual-stone-400">
              {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="ml-2 text-ritual-gold-400 hover:text-ritual-gold-300 font-medium transition-colors"
              >
                {isRegister ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-ritual-stone-500 text-sm">
            Al continuar, aceptas nuestros términos de servicio y política de privacidad
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage