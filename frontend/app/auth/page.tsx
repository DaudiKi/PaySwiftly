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

    const [loginData, setLoginData] = useState({ phone: '', password: '' })
    const [registerData, setRegisterData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        vehicleType: 'boda', vehicleNumber: '', password: '', confirmPassword: ''
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
                <div className="absolute -bottom-40 right-0 w-80 h-80 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Compact Glass Container */}
            <div className="relative w-full max-w-4xl">
                <div className="relative backdrop-blur-2xl bg-white/40 border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid md:grid-cols-2 min-h-[600px]">
                        {/* Info Panel */}
                        <div className={`relative p-10 flex items-center justify-center transition-all duration-700 ${isLogin ? 'order-1' : 'order-2'
                            }`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-700/90 backdrop-blur-xl"></div>
                            <div className="relative text-white text-center z-10">
                                <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold mb-3">
                                    {isLogin ? 'Welcome Back!' : 'Join PaySwiftly'}
                                </h2>
                                <p className="mb-6 text-blue-100">
                                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                                </p>
                                <button
                                    onClick={() => { setIsLogin(!isLogin); setError('') }}
                                    className="px-6 py-2.5 bg-white/20 backdrop-blur-md border-2 border-white/40 text-white rounded-full hover:bg-white/30 transition-all font-semibold"
                                >
                                    {isLogin ? 'Register' : 'Sign In'}
                                </button>
                            </div>
                        </div>

                        {/* Form Panel */}
                        <div className={`relative p-10 transition-all duration-700 ${isLogin ? 'order-2' : 'order-1'}`}>
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-xl"></div>

                            <div className="relative z-10">
                                {isLogin ? (
                                    <div key="login" className="animate-fade-in">
                                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                            PaySwiftly
                                        </Link>
                                        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-1">Sign In</h2>
                                        <p className="text-gray-600 text-sm mb-6">Welcome back to your dashboard</p>

                                        {error && (
                                            <div className="mb-4 p-3 bg-red-100/80 backdrop-blur-md border border-red-200/50 text-red-700 rounded-xl text-sm">
                                                {error}
                                            </div>
                                        )}

                                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    placeholder="254712345678"
                                                    value={loginData.phone}
                                                    onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-white/70 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    value={loginData.password}
                                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-white/70 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                                    required
                                                />
                                            </div>

                                            <div className="text-right">
                                                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50"
                                            >
                                                {loading ? 'Signing in...' : 'Sign In'}
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div key="register" className="animate-fade-in max-h-[500px] overflow-y-auto pr-2">
                                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                            PaySwiftly
                                        </Link>
                                        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-1">Register</h2>
                                        <p className="text-gray-600 text-sm mb-6">Start accepting payments today</p>

                                        {error && (
                                            <div className="mb-4 p-3 bg-red-100/80 backdrop-blur-md border border-red-200/50 text-red-700 rounded-xl text-sm">
                                                {error}
                                            </div>
                                        )}

                                        <form onSubmit={handleRegisterSubmit} className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="John"
                                                        value={registerData.firstName}
                                                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                                                        className="w-full px-3 py-2.5 bg-white/70 backdrop-blur-md border border-white/70 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Kamau"
                                                        value={registerData.lastName}
                                                        onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                                                        className="w-full px-3 py-2.5 bg-white/70 backdrop-blur-md border border-white/70 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={registerData.email}
                                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                                    className="w-full px-3 py-2.5 bg-white/70 backdrop-blur-md border border-white/70 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    placeholder="254712345678"
                                                    value={registerData.phone}
                                                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                                    className="w-full px-3 py-2.5 bg-white/70 backdrop-blur-md border border-white/70 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Vehicle Type</label>
                                                    <select
                                                        value={registerData.vehicleType}
                                                        onChange={(e) => setRegisterData({ ...registerData, vehicleType: e.target.value })}
                                                        className="w-full px-3 py-2.5 bg-white/70 backdrop-blur-md border border-white/70 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                                    >
                                                        <option value="boda">Boda Boda</option>
                                                        <option value="taxi">Taxi</option>
                                                        <option value="uber">Uber</option>
                                                        <option value="bolt">Bolt</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Vehicle Number</label>
                                                    <input
                                                        type="text"
                                                        placeholder="KAA 123B"
                                                        value={registerData.vehicleNumber}
                                                        onChange={(e) => setRegisterData({ ...registerData, vehicleNumber: e.target.value })}
                                                        className="w-full px-3 py-2.5 bg-white/70 backdrop-blur-md border border-white/70 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Min 8 characters"
                                                    value={registerData.password}
                                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                                    className="w-full px-3 py-2.5 bg-white/70 backdrop-blur-md border border-white/70 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                                    required
                                                    minLength={8}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Re-enter password"
                                                    value={registerData.confirmPassword}
                                                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                                    className="w-full px-3 py-2.5 bg-white/70 backdrop-blur-md border border-white/70 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                                    required
                                                    minLength={8}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 mt-4"
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

            <Link
                href="/"
                className="absolute top-6 left-6 px-5 py-2.5 bg-white/70 backdrop-blur-md border border-white/70 text-blue-600 rounded-full font-semibold hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg text-sm"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
            </Link>
        </div>
    )
}
