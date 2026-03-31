export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-fuchsia-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Simple, transparent pricing
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Start free with 10 images daily. Upgrade for unlimited access and full resolution.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-6">
          
          {/* Free Tier */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col">
            <div className="flex-1">
              <div className="text-gray-500 font-medium mb-2">Free</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-400">/forever</span>
              </div>
              <p className="text-gray-500 text-sm mb-8">Perfect for trying out the service</p>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  10 images per day
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Standard resolution
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Watermark included
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  No batch processing
                </li>
              </ul>
            </div>
            
            <button className="mt-8 w-full py-3 px-6 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition">
              Get Started
            </button>
          </div>

          {/* Day Pass */}
          <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl shadow-xl border-2 border-amber-200 p-8 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm">
              QUICK ACCESS
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-600">☀️</span>
                <span className="text-amber-600 font-medium">Day Pass</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900">$1</span>
                <span className="text-gray-400">/24 hours</span>
              </div>
              <p className="text-gray-500 text-sm mb-8">Need more today? Get instant access</p>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <strong>Unlimited</strong> images
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No watermark
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Full resolution
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  No batch processing
                </li>
              </ul>
            </div>
            
            <button className="mt-8 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-amber-200 transition">
              Buy Day Pass
            </button>
          </div>

          {/* Monthly - Featured */}
          <div className="bg-gradient-to-b from-violet-50 to-white rounded-3xl shadow-2xl border-2 border-violet-300 p-8 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
              BEST VALUE
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-violet-600">⭐</span>
                <span className="text-violet-600 font-medium">Monthly</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900">$9.9</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-500 text-sm mb-8">Full access, cancel anytime</p>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <strong>Unlimited</strong> images
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No watermark
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Full resolution
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Batch processing
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
            </div>
            
            <button className="mt-8 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-violet-200 transition">
              Subscribe Monthly
            </button>
          </div>

          {/* Yearly */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-emerald-600">🎯</span>
                <span className="text-gray-700 font-medium">Yearly</span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-gray-900">$99</span>
                <span className="text-gray-400">/year</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Save $19.8</span>
                <span className="text-gray-400 text-sm">($8.25/mo)</span>
              </div>
              <p className="text-gray-500 text-sm mb-8">Best long-term value</p>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Monthly
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  2 months free
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Billed annually
                </li>
              </ul>
            </div>
            
            <button className="mt-8 w-full py-3 px-6 rounded-xl border-2 border-violet-200 text-violet-600 font-semibold hover:bg-violet-50 transition">
              Subscribe Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Compare Plans</h2>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-gray-500 font-medium">Feature</th>
                <th className="text-center py-4 px-4 text-gray-500 font-medium">Free</th>
                <th className="text-center py-4 px-4 text-gray-500 font-medium">Day</th>
                <th className="text-center py-4 px-4 text-gray-500 font-medium">Monthly</th>
                <th className="text-center py-4 px-4 text-gray-500 font-medium">Yearly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="py-4 px-6 text-gray-700">Daily images</td>
                <td className="text-center py-4 px-4 text-gray-600">10</td>
                <td className="text-center py-4 px-4 text-gray-600">∞</td>
                <td className="text-center py-4 px-4 text-gray-600">∞</td>
                <td className="text-center py-4 px-4 text-gray-600">∞</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="py-4 px-6 text-gray-700">Watermark</td>
                <td className="text-center py-4 px-4"><span className="text-red-400">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-400">✓</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-400">✓</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-400">✓</span></td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-gray-700">Output resolution</td>
                <td className="text-center py-4 px-4 text-gray-600">720p</td>
                <td className="text-center py-4 px-4 text-gray-600">4K</td>
                <td className="text-center py-4 px-4 text-gray-600">4K</td>
                <td className="text-center py-4 px-4 text-gray-600">4K</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="py-4 px-6 text-gray-700">Batch processing</td>
                <td className="text-center py-4 px-4"><span className="text-red-400">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-red-400">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-400">✓</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-400">✓</span></td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-gray-700">Priority support</td>
                <td className="text-center py-4 px-4"><span className="text-red-400">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-red-400">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-400">✓</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-400">✓</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="bg-white rounded-xl p-6 shadow-sm group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                How does the daily limit work?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">Free users can process up to 10 images per day. The counter resets at midnight (UTC). Unused quota does not carry over to the next day.</p>
            </details>
            
            <details className="bg-white rounded-xl p-6 shadow-sm group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                What happens when I upgrade?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">Your membership activates immediately after payment. You get instant access to unlimited processing and full-resolution downloads.</p>
            </details>
            
            <details className="bg-white rounded-xl p-6 shadow-sm group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                Can I cancel anytime?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">Yes, you can cancel your subscription at any time. Your access continues until the end of your billing period. No hidden fees.</p>
            </details>
            
            <details className="bg-white rounded-xl p-6 shadow-sm group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                What payment methods do you accept?
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">We accept all major credit cards, debit cards, and PayPal through our secure payment provider, Stripe.</p>
            </details>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-white/80 mb-8">Join thousands of users who trust Image Distortion Remover</p>
          <a href="/" className="inline-flex items-center gap-2 bg-white text-violet-600 font-semibold px-8 py-4 rounded-full hover:bg-violet-50 transition shadow-lg">
            Start for Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
