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

                {/* Balances Overview - Updated for Batch Payouts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pending Balance Card */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="px-2 py-1 bg-amber-500/20 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                    Pending
                                </span>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-gray-800 mb-1">
                                    KES {driver.pending_balance ? parseFloat(driver.pending_balance.toString()).toFixed(2) : '0.00'}
                                </p>
                                <p className="text-sm text-gray-600 font-medium mb-2">Awaiting Payout</p>
                                {driver.pending_balance >= 100 ? (
                                    <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Eligible for payout!
                                    </p>
                                ) : (
                                    <p className="text-xs text-amber-600 font-semibold">
                                        Need KES {(100 - (driver.pending_balance || 0)).toFixed(2)} more
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Paid Out Balance Card */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="px-2 py-1 bg-green-500/20 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                    Paid
                                </span>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-gray-800 mb-1">
                                    KES {driver.paid_balance ? parseFloat(driver.paid_balance.toString()).toFixed(2) : '0.00'}
                                </p>
                                <p className="text-sm text-gray-600 font-medium mb-2">Total Paid Out</p>
                                {driver.last_payout_date ? (
                                    <p className="text-xs text-green-600 font-semibold">
                                        Last: {new Date(driver.last_payout_date).toLocaleDateString()}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-500 font-semibold">No payouts yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Total Earnings Card */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl ring-1 ring-white/20">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-bold text-white uppercase tracking-wide ring-1 ring-white/20">
                                    Lifetime
                                </span>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white mb-1 drop-shadow-lg">
                                    KES {driver.total_earnings ? parseFloat(driver.total_earnings.toString()).toFixed(2) : '0.00'}
                                </p>
                                <p className="text-sm text-blue-100/90 font-medium mb-2">Total Earned</p>
                                <p className="text-xs text-blue-200/70 font-semibold">All-time across all rides</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payout Information Banner */}
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-blue-200/50 shadow-md">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">💰 About Payouts</h3>
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                Earnings accumulate in your <span className="font-semibold text-amber-600">Pending Balance</span>. Once you reach <span className="font-bold text-gray-800">KES 100</span>, you'll receive a payout via M-PESA.
                            </p>
                            {driver.pending_balance >= 100 ? (
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-green-100 border border-green-300 rounded-xl">
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-bold text-green-700">
                                        You're eligible for payout! Payment will be processed in the next batch.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100 border border-amber-300 rounded-xl">
                                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-semibold text-amber-700">
                                        Keep driving! You need KES {(100 - (driver.pending_balance || 0)).toFixed(2)} more to reach the minimum payout.
                                    </p>
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
