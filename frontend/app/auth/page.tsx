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
            {/* Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
                <div className="absolute -bottom-40 right-0 w-80 h-80 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Main Container */}
            <div className="relative w-full max-w-4xl h-[600px] bg-white/40 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden">

                {/* LOGIN FORM (Left Side) */}
                <div className={`absolute top-0 left-0 h-full w-1/2 p-10 flex flex-col justify-center transition-all duration-700 ease-in-out ${isLogin ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}>
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                            <p className="text-gray-600">Welcome back to PaySwiftly</p>
                        </div>
                        {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm">{error}</div>}

                        <input
                            type="tel"
                            placeholder="Phone (254...)"
                            value={loginData.phone}
                            onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-white/70 rounded-xl border border-white/70 focus:ring-2 focus:ring-blue-500/50 outline-none"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="w-full px-4 py-3 bg-white/70 rounded-xl border border-white/70 focus:ring-2 focus:ring-blue-500/50 outline-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-500/30"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* REGISTER FORM (Right Side - but physically on Left technically if using translateX swap? No, let's keep it simple: 
                    If Overlay is on Left, Register is visible on Right. 
                    If Overlay is on Right, Login is visible on Left.
                    So Register Form should be positioned at LEFT: 50% fixed.
                */}
                <div className={`absolute top-0 left-1/2 h-full w-1/2 p-10 flex flex-col justify-center transition-all duration-700 ease-in-out ${!isLogin ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}>
                    <form onSubmit={handleRegisterSubmit} className="space-y-3 h-full overflow-y-auto pt-4">
                        <div className="mb-4">
                            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                            <p className="text-gray-600">Join 10,000+ drivers today</p>
                        </div>
                        {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm">{error}</div>}

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                placeholder="First Name"
                                value={registerData.firstName}
                                onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                                className="w-full px-3 py-2.5 bg-white/70 rounded-xl border border-white/70 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                required
                            />
                            <input
                                placeholder="Last Name"
                                value={registerData.lastName}
                                onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                                className="w-full px-3 py-2.5 bg-white/70 rounded-xl border border-white/70 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                required
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white/70 rounded-xl border border-white/70 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone (254...)"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white/70 rounded-xl border border-white/70 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            required
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <select
                                value={registerData.vehicleType}
                                onChange={(e) => setRegisterData({ ...registerData, vehicleType: e.target.value })}
                                className="w-full px-3 py-2.5 bg-white/70 rounded-xl border border-white/70 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            >
                                <option value="boda">Boda Boda</option>
                                <option value="taxi">Taxi</option>
                            </select>
                            <input
                                placeholder="Plate Re.g"
                                value={registerData.vehicleNumber}
                                onChange={(e) => setRegisterData({ ...registerData, vehicleNumber: e.target.value })}
                                className="w-full px-3 py-2.5 bg-white/70 rounded-xl border border-white/70 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                required
                            />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white/70 rounded-xl border border-white/70 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white/70 rounded-xl border border-white/70 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-500/30"
                        >
                            {loading ? 'Creating...' : 'Register'}
                        </button>
                    </form>
                </div>

                {/* SLIDING OVERLAY */}
                <div
                    className={`absolute top-0 left-0 h-full w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white z-50 transition-transform duration-700 ease-in-out flex flex-col justify-center items-center text-center p-12 ${isLogin ? 'translate-x-[100%]' : 'translate-x-0'
                        }`}
                >
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.5-4.17M 5.581 3c.345.92.583 1.905.702 2.92m-1.319 8.874c.487.822 1.056 1.583 1.686 2.27" />
                            </svg>
                        </div>

                        {isLogin ? (
                            <>
                                <h2 className="text-3xl font-bold mb-4">New Here?</h2>
                                <p className="mb-8 text-blue-100">Sign up and start accepting digital payments in minutes.</p>
                                <button
                                    onClick={() => { setIsLogin(false); setError(''); }}
                                    className="px-8 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all"
                                >
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                                <p className="mb-8 text-blue-100">To keep connected with us please login with your personal info.</p>
                                <button
                                    onClick={() => { setIsLogin(true); setError(''); }}
                                    className="px-8 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all"
                                >
                                    Sign In
                                </button>
                            </>
                        )}
                    </div>
                    {/* Overlay Background Shapes */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
                </div>

            </div>

            <Link
                href="/"
                className="absolute top-6 left-6 px-5 py-2.5 bg-white/70 backdrop-blur-md border border-white/70 text-blue-600 rounded-full font-semibold hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg text-sm z-50"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
            </Link>
        </div>
    )
}
