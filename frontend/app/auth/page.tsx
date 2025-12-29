"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchAPI } from '@/utils/api'

export default function Auth() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Form states
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
                return
            }
            if (registerData.password.length < 8) {
                setError('Password must be at least 8 characters')
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
                <div className="absolute -bottom-40 right-0 w-80 h-80 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
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

            {/* Main Container */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-4xl min-h-[600px] flex">

                {/* Login Form Container - Left Side */}
                <div className={`absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center p-10 transition-all duration-700 ease-in-out z-10 ${isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20%] pointer-events-none'
                    }`}>
                    <form onSubmit={handleLoginSubmit} className="w-full flex flex-col items-center text-center">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                            PaySwiftly
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign in</h1>
                        <p className="text-sm text-gray-500 mb-6">Welcome back to your dashboard</p>

                        {error && <div className="w-full p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

                        <input
                            type="tel"
                            placeholder="Phone (254...)"
                            value={loginData.phone}
                            onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                            className="bg-gray-100 border-none w-full p-3 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="bg-gray-100 border-none w-full p-3 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <a href="#" className="text-xs text-gray-500 hover:text-blue-600 mb-6">Forgot your password?</a>
                        <button className="bg-blue-600 text-white px-10 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-blue-700 transition-transform active:scale-95 shadow-lg">
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Register Form Container - Right Side (Visually) but technically absolute */}
                <div className={`absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center p-10 transition-all duration-700 ease-in-out z-10 ${!isLogin ? 'opacity-100 translate-x-[100%]' : 'opacity-0 translate-x-[120%] pointer-events-none'
                    }`}>
                    <form onSubmit={handleRegisterSubmit} className="w-full flex flex-col items-center text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                        <p className="text-sm text-gray-500 mb-6">Use your phone number to register</p>

                        {error && <div className="w-full p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

                        <div className="grid grid-cols-2 gap-2 w-full mb-2">
                            <input type="text" placeholder="First Name" value={registerData.firstName} onChange={e => setRegisterData({ ...registerData, firstName: e.target.value })} className="bg-gray-100 p-3 rounded-lg outline-none text-sm" required />
                            <input type="text" placeholder="Last Name" value={registerData.lastName} onChange={e => setRegisterData({ ...registerData, lastName: e.target.value })} className="bg-gray-100 p-3 rounded-lg outline-none text-sm" required />
                        </div>
                        <input type="email" placeholder="Email" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} className="bg-gray-100 w-full p-3 rounded-lg mb-2 outline-none text-sm" required />
                        <input type="tel" placeholder="Phone" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} className="bg-gray-100 w-full p-3 rounded-lg mb-2 outline-none text-sm" required />

                        <div className="grid grid-cols-2 gap-2 w-full mb-2">
                            <select value={registerData.vehicleType} onChange={e => setRegisterData({ ...registerData, vehicleType: e.target.value })} className="bg-gray-100 p-3 rounded-lg outline-none text-sm">
                                <option value="boda">Boda</option>
                                <option value="taxi">Taxi</option>
                            </select>
                            <input type="text" placeholder="Plate No." value={registerData.vehicleNumber} onChange={e => setRegisterData({ ...registerData, vehicleNumber: e.target.value })} className="bg-gray-100 p-3 rounded-lg outline-none text-sm" required />
                        </div>

                        <input type="password" placeholder="Password" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} className="bg-gray-100 w-full p-3 rounded-lg mb-2 outline-none text-sm" required />
                        <input type="password" placeholder="Confirm Password" value={registerData.confirmPassword} onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} className="bg-gray-100 w-full p-3 rounded-lg mb-4 outline-none text-sm" required />

                        <button className="bg-blue-600 text-white px-10 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-blue-700 transition-transform active:scale-95 shadow-lg">
                            {loading ? 'Creating...' : 'Sign Up'}
                        </button>
                    </form>
                </div>

                {/* Overlay Container - The Sliding Panel */}
                <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-20 rounded-[2rem] ${isLogin ? 'translate-x-0' : '-translate-x-full'
                    }`}>
                    {/* The Gradient Background that slides inside the overlay */}
                    <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative -left-full h-full w-[200%] transition-transform duration-700 ease-in-out flex justify-center items-center ${isLogin ? 'translate-x-[0%]' : 'translate-x-[50%]'
                        }`}>

                        {/* Panel Left (Visible when isLogin is FALSE -> Register Mode) */}
                        <div className="w-1/2 h-full flex flex-col justify-center items-center px-8 text-center">
                            <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
                            <p className="mb-8 text-blue-100">
                                To keep connected with us please login with your personal info
                            </p>
                            <button
                                onClick={() => setIsLogin(true)}
                                className="bg-transparent border border-white text-white px-10 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-white/20 transition-all"
                            >
                                Sign In
                            </button>
                        </div>

                        {/* Panel Right (Visible when isLogin is TRUE -> Login Mode) */}
                        <div className="w-1/2 h-full flex flex-col justify-center items-center px-8 text-center">
                            <h1 className="text-3xl font-bold mb-4">Hello, Driver!</h1>
                            <p className="mb-8 text-blue-100">
                                Enter your personal details and start your journey with us
                            </p>
                            <button
                                onClick={() => setIsLogin(false)}
                                className="bg-transparent border border-white text-white px-10 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-white/20 transition-all"
                            >
                                Sign Up
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
