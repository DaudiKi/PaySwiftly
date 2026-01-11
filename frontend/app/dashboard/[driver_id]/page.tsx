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
    const [showHistory, setShowHistory] = useState(false)

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

    // Auto-refresh driver balances every 30 seconds
    useEffect(() => {
        const refreshInterval = setInterval(async () => {
            try {
                const freshDriver = await api.getDriver(driverId)
                setDriver(freshDriver)
            } catch (err) {
                console.error('Failed to refresh driver data:', err)
            }
        }, 30000) // 30 seconds

        return () => clearInterval(refreshInterval)
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

                {/* Balances Overview - Theme Consistent */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pending Balance Card - Blue Theme */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
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
                                    <p className="text-xs text-blue-600 font-semibold">
                                        Need KES {(100 - (driver.pending_balance || 0)).toFixed(2)} more
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Paid Out Balance Card - Indigo Theme */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                    Paid
                                </span>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-gray-800 mb-1">
                                    KES {driver.paid_balance ? parseFloat(driver.paid_balance.toString()).toFixed(2) : '0.00'}
                                </p>
                                <p className="text-sm text-gray-600 font-medium mb-2">Total Paid Out</p>
                                {driver.last_payout_date ? (
                                    <p className="text-xs text-indigo-600 font-semibold">
                                        Last: {new Date(driver.last_payout_date).toLocaleDateString()}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-500 font-semibold">No payouts yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Total Earnings Card - Blue Gradient */}
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
                                <p className="text-xs text-blue-200/70 font-semibold">All-time earnings</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payout Information Banner - Blue Theme */}
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-blue-200/50 shadow-md">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                About Payouts
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                Earnings accumulate in your <span className="font-semibold text-blue-600">Pending Balance</span>. Once you reach <span className="font-bold text-gray-800">KES 100</span>, you'll receive a payout via M-PESA.
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
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-100 border border-blue-300 rounded-xl">
                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-semibold text-blue-700">
                                        Keep driving! You need KES {(100 - (driver.pending_balance || 0)).toFixed(2)} more to reach the minimum payout.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* QR Code - Prominently Displayed */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-8 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Your Payment QR Code
                        </h3>
                        <p className="text-gray-600 mb-6">Show this to passengers for instant payments</p>

                        {driver.qr_code_url ? (
                            <div className="flex justify-center mb-4">
                                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                                    <img
                                        src={driver.qr_code_url}
                                        alt="Payment QR Code"
                                        className="w-64 h-64 object-contain"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center mb-4">
                                <div className="w-64 h-64 bg-gray-100/50 rounded-3xl flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                                    No QR Code Available
                                </div>
                            </div>
                        )}

                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-sm font-bold border border-blue-200 shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Scan to Pay
                        </div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl border border-white/60 shadow-lg">
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        Welcome Back, {driver.name.split(' ')[0]}!
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Track your earnings and payment history in real-time.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700">{driver.phone}</p>
                                <p className="text-xs text-gray-500">Registered Phone</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700">{driver.vehicle_number || 'Not Set'}</p>
                                <p className="text-xs text-gray-500">Vehicle Number</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-6">
                    <Link href={`/pay/${driverId}`} className="group bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-2xl text-center hover:bg-white/70 transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <span className="text-base font-bold text-gray-700">Public Profile</span>
                    </Link>
                    <button
                        onClick={() => setShowHistory(true)}
                        className="group bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-2xl text-center hover:bg-white/70 transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col items-center justify-center gap-3"
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">📋</div>
                        <span className="text-base font-bold text-gray-700">Transaction History</span>
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

            {/* Transaction History Modal */}
            {showHistory && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowHistory(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Transaction History</h2>
                                    <p className="text-blue-100 text-sm mt-1">All your payment transactions</p>
                                </div>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {transactions.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">No transactions yet</p>
                                    <p className="text-gray-400 text-sm mt-1">Your transaction history will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {transactions.map((transaction, index) => {
                                        const date = new Date(transaction.created_at)
                                        const isCompleted = transaction.collection_status === 'completed'
                                        const isPending = transaction.collection_status === 'pending'
                                        const isFailed = transaction.collection_status === 'failed'

                                        return (
                                            <div
                                                key={transaction.id || index}
                                                className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-4 rounded-2xl border border-gray-200/50 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isCompleted ? 'bg-green-100 text-green-600' :
                                                                isPending ? 'bg-blue-100 text-blue-600' :
                                                                    'bg-red-100 text-red-600'
                                                                }`}>
                                                                {isCompleted ? '✓' : isPending ? '⏳' : '✗'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-800">
                                                                    KES {transaction.amount ? parseFloat(transaction.amount.toString()).toFixed(2) : '0.00'}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {date.toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-13">
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-100 text-green-700' :
                                                                isPending ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-red-100 text-red-700'
                                                                }`}>
                                                                {transaction.collection_status?.toUpperCase() || 'UNKNOWN'}
                                                            </span>
                                                            {transaction.driver_amount && (
                                                                <span className="text-xs text-gray-600">
                                                                    Your Share: <span className="font-semibold text-indigo-600">KES {parseFloat(transaction.driver_amount.toString()).toFixed(2)}</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        {transaction.platform_fee && (
                                                            <p className="text-xs text-gray-500">
                                                                Fee: KES {parseFloat(transaction.platform_fee.toString()).toFixed(2)}
                                                            </p>
                                                        )}
                                                        {transaction.id && (
                                                            <p className="text-xs text-gray-400 mt-1 font-mono">
                                                                #{transaction.id.slice(0, 8)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 p-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Total Transactions: <span className="font-bold text-gray-800">{transactions.length}</span></span>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
