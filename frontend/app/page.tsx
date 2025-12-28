"use client"

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [phone, setPhone] = useState('')

  const features = [
    {
      icon: '📱',
      title: 'QR Code Payments',
      description: 'Get your unique QR code. Passengers scan and pay directly to your account via M-Pesa - no cash needed.'
    },
    {
      icon: '⚡',
      title: 'Instant M-Pesa Collection',
      description: 'Receive payments through M-Pesa STK Push. Passengers enter their PIN and you get paid instantly.'
    },
    {
      icon: '💰',
      title: 'Automatic Payouts',
      description: 'Your earnings are automatically sent to your M-Pesa account within minutes of each trip. No waiting, no hassle.'
    },
    {
      icon: '📊',
      title: 'Track Your Earnings',
      description: 'See your daily, weekly, and monthly earnings in real-time. View complete transaction history on your dashboard.'
    },
    {
      icon: '🔒',
      title: 'Secure Transactions',
      description: 'Bank-level security powered by IntaSend. All payments are encrypted and protected.'
    },
    {
      icon: '🆓',
      title: 'Low Platform Fee',
      description: 'Only 0.5% platform fee. No hidden charges, no monthly subscriptions. You keep more of what you earn.'
    }
  ]

  const stats = [
    { value: '10,000+', label: 'Active Drivers' },
    { value: 'KES 50M+', label: 'Processed Monthly' },
    { value: '<2min', label: 'Payout Time' },
    { value: '0.5%', label: 'Platform Fee' }
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Register as a Driver',
      description: 'Sign up with your phone number, vehicle details, and create a password. Get verified instantly.'
    },
    {
      step: '2',
      title: 'Get Your QR Code',
      description: 'Receive your unique payment QR code. Display it in your vehicle or share the link with passengers.'
    },
    {
      step: '3',
      title: 'Accept Payments',
      description: 'Passengers scan your QR code, enter the amount, and pay via M-Pesa. You receive a notification instantly.'
    },
    {
      step: '4',
      title: 'Get Paid Automatically',
      description: 'Your earnings (minus 0.5% fee) are automatically sent to your M-Pesa account within 2 minutes.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Pay<span className="text-blue-600">Swiftly</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#for-drivers" className="text-gray-600 hover:text-gray-900 transition-colors">For Drivers</a>
            <Link href="/auth" className="text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
            <Link
              href="/auth"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Start Earning
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🚗 For Boda Boda & Taxi Drivers
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
              Accept <span className="text-blue-600">digital payments</span> from passengers
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Stop carrying cash. Get paid instantly via M-Pesa with your unique QR code. Automatic payouts, real-time tracking, and complete transaction history.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/auth"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all"
              >
                Register as Driver
              </Link>
              <a
                href="#how-it-works"
                className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all"
              >
                See How It Works
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">No cash handling</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Instant payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Track all earnings</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Only 0.5% fee</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-3xl rotate-12"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-black rounded-2xl -rotate-12"></div>
            <div className="absolute top-1/2 right-0 w-16 h-16 bg-blue-600 rounded-xl rotate-45"></div>
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Today's Earnings</span>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">+15 trips</span>
                </div>
                <div className="text-4xl font-bold mb-2">KES 3,450</div>
                <div className="text-sm text-gray-500">Total: KES 45,230 this month</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-6 text-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div className="text-sm font-semibold">SCAN TO PAY</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center">
                      <div className="text-white text-xs text-center">
                        <div className="text-4xl mb-2">📱</div>
                        <div>QR CODE</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">John Kamau</div>
                    <div className="text-sm opacity-75">Boda Boda • KAA 123B</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Everything you need to accept digital payments
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for boda boda and taxi drivers in Kenya
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">How PaySwiftly Works</h2>
            <p className="text-xl text-gray-600">Get started in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Drivers Section */}
      <section id="for-drivers" className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                      💵
                    </div>
                    <div>
                      <div className="font-semibold">Trip Payment</div>
                      <div className="text-sm text-gray-500">Westlands to CBD</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+KES 250</div>
                    <div className="text-xs text-gray-500">2 min ago</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                      💵
                    </div>
                    <div>
                      <div className="font-semibold">Trip Payment</div>
                      <div className="text-sm text-gray-500">Kilimani to Airport</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+KES 800</div>
                    <div className="text-xs text-gray-500">15 min ago</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      📤
                    </div>
                    <div>
                      <div className="font-semibold">Auto Payout</div>
                      <div className="text-sm text-gray-500">To M-Pesa 0712***456</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">KES 1,044</div>
                    <div className="text-xs text-gray-500">Processing...</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Available Balance</div>
                    <div className="text-3xl font-bold text-gray-900">KES 3,450</div>
                  </div>
                  <div className="text-5xl">💰</div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-5xl font-bold mb-6">
              Built for drivers, by drivers
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We understand the challenges of handling cash on the road. PaySwiftly makes it easy to accept digital payments and get paid instantly.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold text-lg">No more cash risks</div>
                  <p className="text-gray-600">Stop worrying about carrying large amounts of cash or getting robbed.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold text-lg">Track every shilling</div>
                  <p className="text-gray-600">See exactly how much you've earned with complete transaction history.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold text-lg">Get paid faster</div>
                  <p className="text-gray-600">Automatic payouts to your M-Pesa within 2 minutes of each trip.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-xl">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                JK
              </div>
              <div>
                <div className="font-bold text-xl">John Kamau</div>
                <div className="text-gray-600">Boda Boda Driver, Nairobi</div>
                <div className="text-sm text-gray-500 mt-1">Using PaySwiftly for 6 months</div>
              </div>
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed italic">
              "PaySwiftly changed my business completely. I don't carry cash anymore, and I get paid instantly after every trip. My passengers love how easy it is to pay with M-Pesa. I've increased my earnings by 30% because more people can pay digitally."
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to start accepting digital payments?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 10,000+ drivers already using PaySwiftly. Register now and get your QR code in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <input
              type="tel"
              placeholder="Enter your phone number (254...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-6 py-4 rounded-full w-full sm:w-96 text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <Link
              href="/auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap"
            >
              Register Free
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
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
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">Pay<span className="text-blue-400">Swiftly</span></div>
              <p className="text-gray-400">Digital payment platform for boda boda and taxi drivers in Kenya.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#for-drivers" className="hover:text-white transition-colors">For Drivers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PaySwiftly. All rights reserved. Powered by IntaSend.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
