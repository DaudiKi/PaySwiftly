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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#dfe9f3] to-[#ffffff] overflow-hidden relative">
            {/* Animated Background Elements - Enhanced for Glass Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-blue-400/40 rounded-full mix-blend-multiply filter blur-[80px] animate-float"></div>
                <div className="absolute top-[30%] right-[10%] w-[30rem] h-[30rem] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[80px] animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-[10%] left-[30%] w-96 h-96 bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[80px] animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <Link
                href="/"
                className="absolute top-6 left-6 px-6 py-2.5 bg-white/40 backdrop-blur-md border border-white/60 text-blue-700 rounded-full font-semibold hover:bg-white/60 transition-all flex items-center gap-2 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] text-sm z-50 group"
            >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
            </Link>

            {/* Main Liquid Glass Container */}
            <div className="relative w-full max-w-4xl min-h-[650px] flex shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] rounded-[3rem] border border-white/50 bg-white/20 backdrop-blur-[20px] overflow-hidden">

                {/* Inner White Glow for Liquid Effect */}
                <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_0_50px_rgba(255,255,255,0.6)] pointer-events-none z-30"></div>

                {/* Login Form Container - Left Side */}
                <div className={`absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center p-12 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-10 ${isLogin ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-[-20%] scale-95 pointer-events-none'
                    }`}>
                    <form onSubmit={handleLoginSubmit} className="w-full flex flex-col items-center text-center">
                        <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 drop-shadow-sm">
                            PaySwiftly
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                        <p className="text-sm text-gray-600 mb-8 font-medium">Access your driver dashboard</p>

                        {error && <div className="w-full p-4 mb-6 text-sm text-red-700 bg-red-50/50 backdrop-blur-sm border border-red-100 rounded-2xl shadow-sm">{error}</div>}

                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={loginData.phone}
                            onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                            className="bg-white/40 border border-white/60 w-full p-4 rounded-2xl mb-4 focus:ring-2 focus:ring-blue-500/50 outline-none backdrop-blur-sm transition-all placeholder:text-gray-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] hover:bg-white/50"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="bg-white/40 border border-white/60 w-full p-4 rounded-2xl mb-4 focus:ring-2 focus:ring-blue-500/50 outline-none backdrop-blur-sm transition-all placeholder:text-gray-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] hover:bg-white/50"
                            required
                        />
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-semibold mb-8 transition-colors">Forgot password?</a>
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-full py-4 rounded-2xl font-bold text-lg shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:ring-4 hover:ring-blue-400/30 hover:-translate-y-0.5 transition-all active:scale-[0.98]">
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Register Form Container - Right Side */}
                <div className={`absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center p-12 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-10 ${!isLogin ? 'opacity-100 translate-x-[100%] scale-100' : 'opacity-0 translate-x-[120%] scale-95 pointer-events-none'
                    }`}>
                    <form onSubmit={handleRegisterSubmit} className="w-full flex flex-col items-center text-center h-full justify-center overflow-y-auto pt-20 pb-10 no-scrollbar">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                        <p className="text-sm text-gray-600 mb-8 font-medium">Join 10,000+ drivers earning more</p>

                        {error && <div className="w-full p-4 mb-6 text-sm text-red-700 bg-red-50/50 backdrop-blur-sm border border-red-100 rounded-2xl shadow-sm">{error}</div>}

                        <div className="grid grid-cols-2 gap-3 w-full mb-3">
                            <input type="text" placeholder="First Name" value={registerData.firstName} onChange={e => setRegisterData({ ...registerData, firstName: e.target.value })} className="bg-white/40 border border-white/60 p-4 rounded-2xl outline-none text-sm backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-blue-500/50" required />
                            <input type="text" placeholder="Last Name" value={registerData.lastName} onChange={e => setRegisterData({ ...registerData, lastName: e.target.value })} className="bg-white/40 border border-white/60 p-4 rounded-2xl outline-none text-sm backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-blue-500/50" required />
                        </div>
                        <input type="email" placeholder="Email Address" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} className="bg-white/40 border border-white/60 w-full p-4 rounded-2xl mb-3 outline-none text-sm backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-blue-500/50" required />
                        <input type="tel" placeholder="Phone Number" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} className="bg-white/40 border border-white/60 w-full p-4 rounded-2xl mb-3 outline-none text-sm backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-blue-500/50" required />

                        <div className="grid grid-cols-2 gap-3 w-full mb-3">
                            <select value={registerData.vehicleType} onChange={e => setRegisterData({ ...registerData, vehicleType: e.target.value })} className="bg-white/40 border border-white/60 p-4 rounded-2xl outline-none text-sm backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-blue-500/50 cursor-pointer">
                                <option value="boda">Boda Boda</option>
                                <option value="taxi">Taxi / Cab</option>
                            </select>
                            <input type="text" placeholder="Vehicle Plate" value={registerData.vehicleNumber} onChange={e => setRegisterData({ ...registerData, vehicleNumber: e.target.value })} className="bg-white/40 border border-white/60 p-4 rounded-2xl outline-none text-sm backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-blue-500/50" required />
                        </div>

                        <input type="password" placeholder="Create Password" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} className="bg-white/40 border border-white/60 w-full p-4 rounded-2xl mb-3 outline-none text-sm backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-blue-500/50" required />
                        <input type="password" placeholder="Confirm Password" value={registerData.confirmPassword} onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} className="bg-white/40 border border-white/60 w-full p-4 rounded-2xl mb-6 outline-none text-sm backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-blue-500/50" required />

                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-full py-4 rounded-2xl font-bold text-lg shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:ring-4 hover:ring-blue-400/30 hover:-translate-y-0.5 transition-all active:scale-[0.98]">
                            {loading ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>
                </div>

                {/* Sliding Overlay - The "Liquid" Bubble */}
                <div className={`absolute top-2 bottom-2 left-0 w-[calc(50%-1rem)] ml-2 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-20 rounded-[2.5rem] overflow-hidden ${isLogin ? 'translate-x-[calc(100%+1rem)]' : 'translate-x-0'
                    }`}>
                    {/* Glass Surface of the Overlay */}
                    <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-[2.5rem]"></div>

                    {/* Inner Content Container */}
                    <div className={`relative h-full w-[200%] flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isLogin ? 'translate-x-[-50%]' : 'translate-x-0'
                        }`}>

                        {/* Panel Left (For Register Mode) */}
                        <div className="w-1/2 h-full flex flex-col justify-center items-center px-8 text-center relative">
                            {/* Decorative Blobs */}
                            <div className="absolute top-[-50%] left-[-20%] w-60 h-60 bg-blue-500/30 rounded-full blur-[40px] mix-blend-overlay"></div>

                            <h2 className="text-3xl font-bold mb-4 text-blue-900 relative z-10">Have an Account?</h2>
                            <p className="mb-8 text-blue-800/80 font-medium relative z-10">
                                Log in to track your earnings, view payouts, and manage your account.
                            </p>
                            <button
                                onClick={() => setIsLogin(true)}
                                className="px-10 py-3 rounded-2xl font-bold text-blue-600 bg-white/80 backdrop-blur-3xl border border-white shadow-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.8)] hover:bg-white transition-all hover:scale-110 active:scale-95 relative z-10"
                            >
                                Sign In
                            </button>
                        </div>

                        {/* Panel Right (For Login Mode) */}
                        <div className="w-1/2 h-full flex flex-col justify-center items-center px-8 text-center relative">
                            {/* Decorative Blobs */}
                            <div className="absolute bottom-[-20%] right-[-20%] w-60 h-60 bg-purple-500/30 rounded-full blur-[40px] mix-blend-overlay"></div>

                            <h2 className="text-3xl font-bold mb-4 text-blue-900 relative z-10">New Here?</h2>
                            <p className="mb-8 text-blue-800/80 font-medium relative z-10">
                                Register now to start accepting digital payments instantly!
                            </p>
                            <button
                                onClick={() => setIsLogin(false)}
                                className="px-10 py-3 rounded-2xl font-bold text-blue-600 bg-white/80 backdrop-blur-3xl border border-white shadow-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.8)] hover:bg-white transition-all hover:scale-110 active:scale-95 relative z-10"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            )
}
