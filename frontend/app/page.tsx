
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-100">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tighter text-brand-primary">
            PaySwiftly<span className="text-brand-accent">.</span>
          </div>
          <div className="space-x-4">
            <Link href="#" className="font-medium text-gray-600 hover:text-brand-primary">Drivers</Link>
            <Link href="#" className="font-medium text-gray-600 hover:text-brand-primary">About</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-brand-dark leading-tight">
            The modern way to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
              get paid instantly.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto">
            QR code payments for drivers. Seamless M-Pesa integration. Automatic payouts.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
            <Link href="/register" className="bg-brand-primary hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105">
              Register as Driver
            </Link>
            <Link href="/demo" className="bg-white border-2 border-gray-200 hover:border-brand-primary text-gray-700 font-bold py-4 px-8 rounded-full transition-all">
              View Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-2xl bg-gray-50 border border-gateway-100 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-12 mt-20">
        <div className="container mx-auto px-6 text-center text-gray-400">
          &copy; {new Date().getFullYear()} PaySwiftly. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: '⚡',
    title: 'Instant M-Pesa',
    desc: 'Passengers pay via M-Pesa STK push. No cash, no hassle.'
  },
  {
    icon: '💸',
    title: 'Auto Payouts',
    desc: 'Drivers receive funds directly to their M-Pesa/Bank automatically.'
  },
  {
    icon: '📊',
    title: 'Real-time Stats',
    desc: 'Track every shilling with our beautiful driver dashboard.'
  }
];
