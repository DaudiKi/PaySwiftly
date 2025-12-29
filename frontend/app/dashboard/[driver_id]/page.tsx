"use client"

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/utils/api'
import { Driver } from '@/types'

export default function DriverDashboard({ params }: { params: Promise<{ driver_id: string }> }) {
    const resolvedParams = use(params)
    const driverId = resolvedParams.driver_id
    const router = useRouter()

    const [driver, setDriver] = useState<Driver | null>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadData = async () => {
            try {
                const [driverData, transactionsData] = await Promise.all([
                    api.getDriver(driverId),
                    api.getDriverTransactions(driverId)
                ])
                setDriver(driverData)
                setTransactions(transactionsData)
            } catch (err: any) {
                setError(err.message || 'Failed to load dashboard data')
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [driverId])

    const handleLogout = () => {
        localStorage.removeItem('auth_token')
        router.push('/')
    }

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-[#dfe9f3] to-[#ffffff] flex items-center justify-center text-blue-900 font-medium">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="text-sm tracking-wider uppercase opacity-70">Loading Dashboard...</div>
            </div>
        </div>
    )

    if (!driver) return (
        <div className="min-h-screen bg-gradient-to-br from-[#dfe9f3] to-[#ffffff] flex items-center justify-center text-red-500 font-medium">
            Driver not found
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#dfe9f3] to-[#ffffff] text-gray-800 pb-20 relative overflow-x-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-float"></div>
                <div className="absolute bottom-[0%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Header */}
            <div className="bg-white/40 border-b border-white/60 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
                <div className="flex justify-between items-center max-w-5xl mx-auto px-6 py-4">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                            PaySwiftly
                        </h1>
                        <p className="text-xs text-blue-900/60 font-medium uppercase tracking-wider">Driver Dashboard</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-bold text-gray-800">{driver.name}</p>
                            <p className="text-xs text-gray-500">{driver.vehicle_number || 'No Vehicle'}</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/50">
                            {driver.name.charAt(0)}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-red-50 text-gray-500 hover:text-red-500 border border-white/60 transition-all hover:scale-105 active:scale-95 shadow-sm"
                            title="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 py-8 space-y-8 relative z-10">

                {/* Welcome & Earnings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Liquid Balance Card */}
                    <div className="relative group perspective-1000">
                        <div className="absolute inset-0 bg-blue-600/30 rounded-[2.5rem] blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(37,99,235,0.3)] border border-white/20 text-white h-full flex flex-col justify-between group-hover:-translate-y-1 transition-transform duration-500">

                            {/* Inner Gloss */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                            <div className="relative z-10">
                                <p className="text-blue-100 font-medium tracking-wide mb-1 opacity-80">Current Balance</p>
                                <h2 className="text-5xl font-bold tracking-tight drop-shadow-md">
                                    <span className="text-3xl opacity-70 font-medium mr-1">KES</span>
                                    {driver.balance.toLocaleString()}
                                </h2>
                            </div>

                            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                                <div>
                                    <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Total Earnings</p>
                                    <p className="text-xl font-semibold">KES {driver.total_earnings.toLocaleString()}</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 text-sm font-medium shadow-inner">
                                    Active Now
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Card */}
                    <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] flex flex-col justify-center items-center text-center relative overflow-hidden group hover:bg-white/50 transition-colors duration-500">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        <div className="relative z-10">
                            <h3 className="text-gray-800 font-bold text-lg mb-1">Receive Payments</h3>
                            <p className="text-gray-500 text-sm mb-6">Show this QR code to passengers</p>

                            {driver.qr_code_url ? (
                                <div className="bg-white p-4 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] mb-4 transform group-hover:scale-105 transition-transform duration-500 border border-gray-100">
                                    <img
                                        src={driver.qr_code_url}
                                        alt="Payment QR Code"
                                        className="w-48 h-48 object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-56 h-56 bg-gray-100/50 rounded-3xl flex items-center justify-center text-gray-400 mb-6 border-2 border-dashed border-gray-300">
                                    No QR Code
                                </div>
                            )}

                            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold border border-blue-100 shadow-sm group-hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-shadow">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Scan to Pay
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-6">
                    <Link href={`/pay/${driverId}`} className="group bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-[2rem] text-center hover:bg-white/70 transition-all hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(37,99,235,0.15)] flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:rotate-6 transition-transform">👁️</div>
                        <span className="text-base font-bold text-gray-700">Public Profile</span>
                    </Link>
                    <button className="group bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-[2rem] text-center hover:bg-white/70 transition-all hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(37,99,235,0.15)] flex flex-col items-center justify-center gap-3 cursor-not-allowed opacity-70 grayscale hover:grayscale-0">
                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">💸</div>
                        <span className="text-base font-bold text-gray-700">Withdraw <span className="text-xs font-normal text-gray-400 block">(Coming Soon)</span></span>
                    </button>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white/30 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        Recent Activity
                        <span className="text-xs font-normal text-gray-500 bg-white/50 px-2 py-1 rounded-lg border border-white/50">Last 10 trips</span>
                    </h3>

                    {transactions.length === 0 ? (
                        <div className="text-center py-12 rounded-3xl bg-white/20 border border-white/30 border-dashed">
                            <div className="text-4xl mb-3 opacity-30">📭</div>
                            <p className="text-gray-500 font-medium">No trips yet. Time to hit the road!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="group bg-white/60 hover:bg-white/90 border border-white/60 p-5 rounded-2xl flex justify-between items-center transition-all hover:shadow-lg hover:translate-x-1">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${tx.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {tx.status === 'completed' ? '✓' : '⧖'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">Trip Payment</p>
                                            <p className="text-xs text-gray-500 font-medium tracking-wide">
                                                {new Date(tx.created_at).toLocaleDateString()} • {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">+ {tx.amount_paid}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {tx.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}
