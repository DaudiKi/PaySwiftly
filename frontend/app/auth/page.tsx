"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchAPI } from '@/utils/api'

export default function Auth() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Login form state
    const [loginData, setLoginData] = useState({
        phone: '',
        password: ''
    })

    // Registration form state
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        vehicleType: 'boda',
        vehicleNumber: '',
        password: '',
        confirmPassword: ''
    })

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetchAPI<any>('/api/login', {
                method: 'POST',
                body: JSON.stringify(loginData)
            })

            localStorage.setItem('auth_token', response.token)
            router.push(`/dashboard/${response.driver_id}`)
        } catch (err: any) {
            setError(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (registerData.password !== registerData.confirmPassword) {
                setError('Passwords do not match')
                setLoading(false)
                return
            }

            if (registerData.password.length < 8) {
                setError('Password must be at least 8 characters')
                setLoading(false)
                return
            }

            const response = await fetchAPI<any>('/api/register_driver', {
                method: 'POST',
                body: JSON.stringify({
                    name: `${registerData.firstName} ${registerData.lastName}`.trim(),
                    phone: registerData.phone,
                    email: registerData.email,
                    vehicle_type: registerData.vehicleType,
                    vehicle_number: registerData.vehicleNumber,
                    password: registerData.password
                })
            })

            router.push(`/dashboard/${response.driver_id}`)
        } catch (err: any) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cream-100 via-cream-200 to-emerald-50 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-cream-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Glass Container */}
            <div className="relative w-full max-w-6xl">
                <div className="relative backdrop-blur-2xl bg-white/30 border border-white/40 rounded-[3rem] shadow-2xl overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        {/* Left Panel - Sliding Info */}
                        <div className={`relative p-12 flex items-center justify-center transition-all duration-700 ${isLogin ? 'order-1' : 'order-2'
                            }`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/90 to-emerald-900/90 backdrop-blur-xl"></div>
                            <div className="relative text-white text-center z-10">
                                <div className="mb-8">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-4xl font-bold mb-4">
                                    {isLogin ? 'Welcome Back!' : 'Join PaySwiftly'}
                                </h2>
                                <p className="mb-8 text-emerald-100 text-lg">
                                    {isLogin
                                        ? "Don't have an account? Register now and start earning."
                                        : 'Already have an account? Sign in to continue.'}
                                </p>
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin)
                                        setError('')
                                    }}
                                    className="px-8 py-3 bg-white/20 backdrop-blur-md border-2 border-white/40 text-white rounded-full hover:bg-white/30 transition-all font-semibold"
                                >
                                    {isLogin ? 'Register' : 'Sign In'}
                                </button>
                            </div>
                        </div>

                        {/* Right Panel - Forms */}
                        <div className={`relative p-12 transition-all duration-700 ${isLogin ? 'order-2' : 'order-1'
                            }`}>
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl"></div>

                            <div className="relative z-10">
                                {/* Login Form */}
                                {isLogin ? (
                                    <div className="animate-fade-in">
                                        <div className="mb-8">
                                            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
                                                PaySwiftly
                                            </Link>
                                            <h2 className="text-3xl font-bold text-gray-900 mt-4">Sign In</h2>
                                            <p className="text-gray-600 mt-2">Welcome back to your dashboard</p>
                                        </div>

                                        {error && (
                                            <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-md border border-red-200/50 text-red-700 rounded-2xl text-sm">
                                                {error}
                                            </div>
                                        )}

                                        <form onSubmit={handleLoginSubmit} className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    placeholder="254712345678"
                                                    value={loginData.phone}
                                                    onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                                                    className="w-full px-5 py-4 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    value={loginData.password}
                                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                    className="w-full px-5 py-4 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                                    required
                                                />
                                            </div>

                                            <div className="text-right">
                                                <a href="#" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium">
                                                    Forgot password?
                                                </a>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all font-semibold shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? 'Signing in...' : 'Sign In'}
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    /* Registration Form */
                                    <div className="animate-fade-in">
                                        <div className="mb-8">
                                            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
                                                PaySwiftly
                                            </Link>
                                            <h2 className="text-3xl font-bold text-gray-900 mt-4">Register</h2>
                                            <p className="text-gray-600 mt-2">Start accepting digital payments today</p>
                                        </div>

                                        {error && (
                                            <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-md border border-red-200/50 text-red-700 rounded-2xl text-sm">
                                                {error}
                                            </div>
                                        )}

                                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="John"
                                                        value={registerData.firstName}
                                                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Kamau"
                                                        value={registerData.lastName}
                                                        onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={registerData.email}
                                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    placeholder="254712345678"
                                                    value={registerData.phone}
                                                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type</label>
                                                    <select
                                                        value={registerData.vehicleType}
                                                        onChange={(e) => setRegisterData({ ...registerData, vehicleType: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                                    >
                                                        <option value="boda">Boda Boda</option>
                                                        <option value="taxi">Taxi</option>
                                                        <option value="uber">Uber</option>
                                                        <option value="bolt">Bolt</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Number</label>
                                                    <input
                                                        type="text"
                                                        placeholder="KAA 123B"
                                                        value={registerData.vehicleNumber}
                                                        onChange={(e) => setRegisterData({ ...registerData, vehicleNumber: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Min 8 characters"
                                                    value={registerData.password}
                                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                                    required
                                                    minLength={8}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Re-enter password"
                                                    value={registerData.confirmPassword}
                                                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                                    required
                                                    minLength={8}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all font-semibold shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                            >
                                                {loading ? 'Creating Account...' : 'Register'}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Home Link */}
            <Link
                href="/"
                className="absolute top-8 left-8 px-6 py-3 bg-white/60 backdrop-blur-md border border-white/60 text-emerald-700 rounded-full font-semibold hover:bg-white/80 transition-all flex items-center gap-2 shadow-lg"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </Link>
        </div>
    )
}
