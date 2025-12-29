"use client"

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [phone, setPhone] = useState('')

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
      title: 'QR Code Payments',
      description: 'Unique QR code for instant M-Pesa payments. Passengers scan and pay in seconds.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Instant Payouts',
      description: 'Automatic transfers to your M-Pesa within 2 minutes. No waiting, no hassle.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Real-Time Analytics',
      description: 'Track earnings, view transaction history, and monitor your daily performance.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cream-50 to-emerald-100 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-40 w-96 h-96 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-emerald-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-md bg-white/40 border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              PaySwiftly
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">How it Works</a>
              <Link href="/auth" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Sign In</Link>
              <Link
                href="/auth"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <div className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-full text-emerald-700 font-semibold text-sm shadow-lg">
                  🚗 For Boda Boda & Taxi Drivers
                </div>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-900">Accept</span>{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  digital payments
                </span>{' '}
                <span className="text-gray-900">effortlessly</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Stop carrying cash. Get paid instantly via M-Pesa with your unique QR code.
                Automatic payouts, real-time tracking, complete security.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-105 transition-all"
                >
                  Start Earning Now
                </Link>
                <button className="px-8 py-4 bg-white/60 backdrop-blur-md border border-white/40 text-gray-900 rounded-full font-semibold hover:bg-white/80 transition-all">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white"></div>
                  ))}
                </div>
                <div>
                  <div className="font-bold text-gray-900">10,000+ Drivers</div>
                  <div className="text-sm text-gray-600">Already earning with PaySwiftly</div>
                </div>
              </div>
            </div>

            {/* Right Glass Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl p-8 shadow-2xl">
                {/* Earnings Card */}
                <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/60 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600 font-medium">Today's Earnings</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                      +15 trips
                    </span>
                  </div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-2">
                    KES 3,450
                  </div>
                  <div className="text-sm text-gray-600">Total: KES 45,230 this month</div>
                </div>

                {/* QR Code Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12"></div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm font-semibold opacity-90">SCAN TO PAY</div>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>

                    <div className="bg-white rounded-xl p-4 mb-4">
                      <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-5xl mb-2">⚡</div>
                          <div className="text-xs font-semibold">QR CODE</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-bold text-lg">John Kamau</div>
                      <div className="text-sm opacity-90">Boda Boda • KAA 123B</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-gray-900">Everything you need to</span>{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                get paid
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for drivers in Kenya
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl bg-white/40 border border-white/60 rounded-2xl p-8 hover:bg-white/60 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl p-12 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10,000+', label: 'Active Drivers' },
                { value: 'KES 50M+', label: 'Processed Monthly' },
                { value: '<2min', label: 'Payout Time' },
                { value: '0.5%', label: 'Platform Fee' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/90 to-emerald-700/90 border border-white/40 rounded-3xl p-12 shadow-2xl text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24"></div>

            <div className="relative">
              <h2 className="text-5xl font-bold mb-6">
                Ready to go cashless?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of drivers already earning with PaySwiftly
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                <input
                  type="tel"
                  placeholder="Enter phone number (254...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-6 py-4 rounded-full w-full sm:flex-1 text-gray-900 bg-white/90 backdrop-blur-md border border-white/60 focus:outline-none focus:ring-4 focus:ring-white/50 placeholder-gray-500"
                />
                <Link
                  href="/auth"
                  className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-black hover:scale-105 transition-all whitespace-nowrap shadow-xl"
                >
                  Get Started Free
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Instant activation</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-white/40 border-t border-white/60 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4">
                PaySwiftly
              </div>
              <p className="text-gray-600">Digital payment platform for drivers in Kenya.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#features" className="hover:text-emerald-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/40 pt-8 text-center text-gray-600">
            <p>&copy; 2025 PaySwiftly. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
    </div>
  )
}
