"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export default function Home() {
  const [phone, setPhone] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    // Generate sample QR code
    QRCode.toDataURL('https://pay-swiftly.vercel.app/pay/demo', {
      width: 300,
      margin: 2,
      color: {
        dark: '#047857',
        light: '#FFFDD0'
      }
    }).then(setQrCodeUrl)
  }, [])

  return (
    <div className="min-h-screen bg-cream-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-emerald-700">
              PaySwiftly
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-emerald-700 transition-colors font-medium">Features</a>
              <a href="#vision" className="text-gray-700 hover:text-emerald-700 transition-colors font-medium">Our Vision</a>
              <a href="#founders" className="text-gray-700 hover:text-emerald-700 transition-colors font-medium">Team</a>
              <Link href="/auth" className="text-gray-700 hover:text-emerald-700 transition-colors font-medium">Sign In</Link>
              <Link
                href="/auth"
                className="px-6 py-3 bg-emerald-700 text-white rounded-full font-semibold hover:bg-emerald-800 hover:shadow-lg transition-all"
              >
                Start Earning
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Side by Side */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className={`space-y-8 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-sm">
                🚗 Empowering 10,000+ Drivers Across Kenya
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
                Go <span className="text-emerald-700">Cashless.</span><br />
                Get Paid <span className="text-emerald-700">Instantly.</span>
              </h1>

              <p className="text-xl text-gray-700 leading-relaxed">
                The future of driver payments is here. Accept M-Pesa payments with your unique QR code,
                get automatic payouts in under 2 minutes, and track every shilling you earn.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth"
                  className="px-8 py-4 bg-emerald-700 text-white rounded-full font-semibold hover:bg-emerald-800 hover:shadow-xl hover:scale-105 transition-all"
                >
                  Register as Driver →
                </Link>
                <button className="px-8 py-4 border-2 border-emerald-700 text-emerald-700 rounded-full font-semibold hover:bg-emerald-50 transition-all">
                  Watch Demo
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-700">10K+</div>
                  <div className="text-sm text-gray-600 mt-1">Active Drivers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-700">50M+</div>
                  <div className="text-sm text-gray-600 mt-1">KES Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-700">&lt;2min</div>
                  <div className="text-sm text-gray-600 mt-1">Payout Time</div>
                </div>
              </div>
            </div>

            {/* Right: QR Code Card */}
            <div className={`${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-emerald-700/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-emerald-100">
                  <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-8 text-white mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-sm opacity-90 mb-1">Your QR Code</div>
                        <div className="text-2xl font-bold">Scan to Pay</div>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>

                    {qrCodeUrl && (
                      <div className="bg-cream-200 rounded-xl p-6 mb-6">
                        <img src={qrCodeUrl} alt="QR Code" className="w-full h-auto" />
                      </div>
                    )}

                    <div className="text-center">
                      <div className="font-bold text-lg">Demo Driver</div>
                      <div className="text-sm opacity-90">Boda Boda • Nairobi</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-white">
                          ✓
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Payment Received</div>
                          <div className="text-sm text-gray-600">2 minutes ago</div>
                        </div>
                      </div>
                      <div className="text-emerald-700 font-bold">+KES 450</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Side by Side */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Feature 1 - Image Left */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="order-2 lg:order-1 animate-slide-in-left">
              <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-3xl p-12 text-white shadow-2xl">
                <div className="text-6xl mb-6">📱</div>
                <div className="text-3xl font-bold mb-4">Your Personal Payment Link</div>
                <div className="space-y-3 text-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cream-200 rounded-full"></div>
                    <span>Unique QR code generated instantly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cream-200 rounded-full"></div>
                    <span>Display in your vehicle or share via WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cream-200 rounded-full"></div>
                    <span>Passengers scan and pay in seconds</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 animate-slide-in-right">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Accept Payments <span className="text-emerald-700">Anywhere</span>
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                No more fumbling for change or worrying about carrying cash. Your unique QR code
                makes it easy for passengers to pay you instantly via M-Pesa.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">✓</div>
                  <span className="text-gray-700">No smartphone needed for passengers - works on any phone</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">✓</div>
                  <span className="text-gray-700">Instant payment confirmation via SMS</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">✓</div>
                  <span className="text-gray-700">Works 24/7, even when you're offline</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 2 - Image Right */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="animate-slide-in-left">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Get Paid <span className="text-emerald-700">Automatically</span>
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                No more trips to the bank or waiting days for your money. PaySwiftly automatically
                sends your earnings to your M-Pesa account within 2 minutes of each trip.
              </p>
              <div className="bg-cream-200 rounded-2xl p-6 border-2 border-emerald-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">⚡</div>
                  <div>
                    <div className="font-bold text-gray-900">Lightning Fast Payouts</div>
                    <div className="text-sm text-gray-600">Average payout time: 90 seconds</div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-emerald-700">Only 0.5% Fee</div>
                <div className="text-sm text-gray-600 mt-1">No hidden charges. No monthly fees.</div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-emerald-100">
                <div className="text-sm text-gray-600 mb-2">Today's Earnings</div>
                <div className="text-5xl font-bold text-emerald-700 mb-6">KES 3,450</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                    <div>
                      <div className="font-semibold">Trip #1</div>
                      <div className="text-sm text-gray-600">Westlands → CBD</div>
                    </div>
                    <div className="text-emerald-700 font-bold">+250</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                    <div>
                      <div className="font-semibold">Trip #2</div>
                      <div className="text-sm text-gray-600">Kilimani → Airport</div>
                    </div>
                    <div className="text-emerald-700 font-bold">+800</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-700 text-white rounded-xl">
                    <div>
                      <div className="font-semibold">Auto Payout</div>
                      <div className="text-sm opacity-90">Processing...</div>
                    </div>
                    <div className="font-bold">KES 1,044</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 - Image Left */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 animate-slide-in-left">
              <div className="bg-cream-200 rounded-3xl p-8 border-2 border-emerald-700">
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-600 mb-2">Monthly Overview</div>
                  <div className="text-4xl font-bold text-emerald-700">KES 45,230</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">156</div>
                    <div className="text-sm text-gray-600">Total Trips</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">KES 290</div>
                    <div className="text-sm text-gray-600">Avg per Trip</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-700">+12%</div>
                    <div className="text-sm text-gray-600">vs Last Month</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">22</div>
                    <div className="text-sm text-gray-600">Days Active</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 animate-slide-in-right">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Track Every <span className="text-emerald-700">Shilling</span>
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Your personal dashboard shows exactly how much you've earned, when you earned it,
                and where your money is going. Complete transparency, always.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">✓</div>
                  <span className="text-gray-700">Real-time earnings updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">✓</div>
                  <span className="text-gray-700">Complete transaction history</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">✓</div>
                  <span className="text-gray-700">Monthly performance analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section - Side by Side */}
      <section id="vision" className="py-20 px-6 bg-cream-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-sm mb-6">
                Our Vision
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Building a <span className="text-emerald-700">Cashless Kenya</span>
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                We believe every driver in Kenya deserves access to safe, fast, and transparent digital payments.
                PaySwiftly is more than a payment platform - it's a movement towards financial inclusion and security for drivers.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center text-white flex-shrink-0 text-xl">
                    🎯
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Safety First</div>
                    <div className="text-gray-700">Eliminate the risk of carrying large amounts of cash on the road</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center text-white flex-shrink-0 text-xl">
                    💡
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Financial Empowerment</div>
                    <div className="text-gray-700">Track earnings, plan better, and grow your business with data</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center text-white flex-shrink-0 text-xl">
                    🌍
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Inclusive Growth</div>
                    <div className="text-gray-700">Making digital payments accessible to every driver, everywhere</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="bg-emerald-700 rounded-3xl p-12 text-white shadow-2xl">
                <div className="text-6xl mb-6">🚀</div>
                <div className="text-3xl font-bold mb-4">Our Impact So Far</div>
                <div className="space-y-6">
                  <div>
                    <div className="text-5xl font-bold mb-2">10,000+</div>
                    <div className="text-emerald-100">Drivers empowered across Kenya</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold mb-2">KES 50M+</div>
                    <div className="text-emerald-100">Processed safely every month</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold mb-2">99.9%</div>
                    <div className="text-emerald-100">Uptime - Always available when you need us</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section - Side by Side */}
      <section id="founders" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Meet the <span className="text-emerald-700">Team</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Built by drivers, for drivers. Our team understands the challenges you face every day.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <div className="bg-cream-200 rounded-3xl p-8 border-2 border-emerald-700">
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-5xl font-bold">
                  DK
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">Daudi Kinyua</div>
                  <div className="text-emerald-700 font-semibold mb-4">Founder & CEO</div>
                  <p className="text-gray-700 leading-relaxed">
                    Former boda boda driver turned tech entrepreneur. Daudi built PaySwiftly after experiencing
                    firsthand the challenges of handling cash on the road. His mission is to make digital payments
                    accessible to every driver in Kenya.
                  </p>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <blockquote className="text-2xl text-gray-700 italic leading-relaxed mb-6">
                "I started PaySwiftly because I know what it's like to worry about carrying cash, to lose track of
                earnings, and to wait days for payments. Every driver deserves better. That's why we built this platform -
                to give you the tools to succeed in a digital economy."
              </blockquote>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                <div className="font-bold text-gray-900 mb-4">Our Commitment to You:</div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">✓</div>
                    <span className="text-gray-700">Always transparent - no hidden fees</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">✓</div>
                    <span className="text-gray-700">24/7 support in English and Swahili</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">✓</div>
                    <span className="text-gray-700">Continuous improvement based on your feedback</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-700 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 animate-slide-up">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 10,000+ drivers already earning with PaySwiftly. No setup fees, instant activation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto mb-8">
            <input
              type="tel"
              placeholder="Enter phone (254...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-6 py-4 rounded-full w-full sm:flex-1 text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50"
            />
            <Link
              href="/auth"
              className="px-8 py-4 bg-cream-200 text-emerald-900 rounded-full font-bold hover:bg-white hover:scale-105 transition-all whitespace-nowrap shadow-xl"
            >
              Get Started Free →
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Only 0.5% fee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant payouts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-emerald-400 mb-4">PaySwiftly</div>
              <p className="text-gray-400">Empowering drivers with digital payments across Kenya.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#vision" className="hover:text-emerald-400 transition-colors">Our Vision</a></li>
                <li><a href="#founders" className="hover:text-emerald-400 transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Cookies</a></li>
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
