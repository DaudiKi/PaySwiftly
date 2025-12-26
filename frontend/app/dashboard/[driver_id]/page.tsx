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

    if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Loading Dashboard...</div>
    if (!driver) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-red-500">Driver not found</div>

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-20">
            {/* Header */}
            <div className="bg-white/5 border-b border-white/10 p-6 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex justify-between items-center max-w-4xl mx-auto">
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            PaySwiftly
                        </h1>
                        <p className="text-sm text-gray-400">Driver Dashboard</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold">
                            {driver.name.charAt(0)}
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto p-4 space-y-6">

                {/* Welcome & Earnings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-blue-200 text-sm mb-1">Current Balance</p>
                            <h2 className="text-4xl font-bold text-white tracking-tight">
                                KES {driver.balance.toLocaleString()}
                            </h2>
                            <p className="text-gray-400 text-xs mt-2">Total Earnings: KES {driver.total_earnings.toLocaleString()}</p>
                        </div>
                        {/* Decorative glow */}
                        <div className="absolute right-[-20%] top-[-20%] w-40 h-40 bg-blue-500/20 blur-3xl rounded-full"></div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                        <p className="text-gray-400 text-sm mb-2">Show to Passenger</p>
                        {driver.qr_code_url ? (
                            <div className="bg-white p-2 rounded-xl">
                                {/* Using img because NEXT_PUBLIC_API_URL might point to Supabase storage which is an external domain */}
                                <img
                                    src={driver.qr_code_url}
                                    alt="Payment QR Code"
                                    className="w-48 h-48 object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-48 h-48 bg-white/10 rounded-xl flex items-center justify-center text-gray-500">
                                No QR Code
                            </div>
                        )}
                        <p className="text-xs text-brand-primary mt-3 font-mono bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                            Scan to Pay
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Link href={`/pay/${driverId}`} className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-colors">
                        <span className="text-2xl mb-1 block">👁️</span>
                        <span className="text-sm text-gray-300">View Public Page</span>
                    </Link>
                    <button className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-colors opacity-50 cursor-not-allowed">
                        <span className="text-2xl mb-1 block">💸</span>
                        <span className="text-sm text-gray-300">Withdraw (Soon)</span>
                    </button>
                </div>

                {/* Recent Transactions */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Recent Trips</h3>
                    {transactions.length === 0 ? (
                        <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-gray-500">No trips yet. Start driving!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {tx.status === 'completed' ? '✓' : '⧖'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Payment Received</p>
                                            <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white">+ KES {tx.amount_paid}</p>
                                        <p className={`text-xs ${tx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                                            }`}>
                                            {tx.status.toUpperCase()}
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
