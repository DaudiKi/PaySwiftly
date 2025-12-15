
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/utils/api';
import { Driver, PaymentInitiateResponse } from '@/types';

export default function PaymentPage({ params }: { params: Promise<{ driver_id: string }> }) {
    // Unwrap params using React.use()
    const resolvedParams = use(params);
    const driverId = resolvedParams.driver_id;

    const [driver, setDriver] = useState<Driver | null>(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState<PaymentInitiateResponse | null>(null);

    useEffect(() => {
        fetchAPI<Driver>(`/api/driver/${driverId}`)
            .then(setDriver)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [driverId]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError('');

        try {
            const response = await fetchAPI<PaymentInitiateResponse>('/api/pay', {
                method: 'POST',
                body: JSON.stringify({
                    driver_id: driverId,
                    amount: parseFloat(amount),
                    passenger_phone: phone,
                    passenger_email: 'guest@example.com', // Optional
                    passenger_name: 'Guest Passenger'      // Optional
                }),
            });
            setSuccess(response);
        } catch (err: any) {
            setError(err.message || 'Payment failed');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-brand-primary">Loading...</div>;
    if (!driver) return <div className="flex h-screen items-center justify-center text-red-500">Driver not found</div>;

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 text-4xl">
                        ✓
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Request Sent!</h2>
                    <p className="text-gray-600">
                        Please check your phone <strong>{phone}</strong> and enter your M-Pesa PIN to complete the payment of
                        <span className="font-bold text-gray-900"> KES {amount}</span>.
                    </p>
                    <div className="text-sm text-gray-400 pt-4">
                        Transaction ID: {success.transaction_id}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-dark to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-brand-primary/90 p-6 text-white text-center">
                    <h1 className="text-xl font-bold tracking-wide uppercase">Pay Your Driver</h1>
                    <p className="text-brand-primary-foreground/80 text-sm mt-1">Secure Fast Payment</p>
                </div>

                {/* Driver Info */}
                <div className="p-6 space-y-2 text-center border-b border-white/10">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                        🚗
                    </div>
                    <h2 className="text-xl font-semibold text-white">{driver.name}</h2>
                    <p className="text-gray-300 text-sm">{driver.vehicle_type} • {driver.vehicle_number}</p>
                </div>

                {/* Form */}
                <form onSubmit={handlePayment} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Amount (KES)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-lg font-mono"
                            placeholder="e.g. 500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">M-Pesa Phone Number</label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-mono"
                            placeholder="07..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-brand-accent hover:bg-emerald-400 text-brand-dark font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Processing...' : `Pay KES ${amount || '0'}`}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        Secured by IntaSend
                    </p>
                </form>
            </div>
        </div>
    );
}
