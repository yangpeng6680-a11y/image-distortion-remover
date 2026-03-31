'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const user = session.user as any
  const membership = user?.membership || 'free'
  const dailyUsage = user?.dailyUsage || 0
  const dailyLimit = membership === 'free' ? 10 : '∞'

  const memberSince = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 pt-12 pb-24">
        <div className="max-w-3xl mx-auto px-4">
          <a href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-6">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-16">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user?.image ? (
                <img 
                  src={user.image} 
                  alt={user.name || ''} 
                  className="w-20 h-20 rounded-full ring-4 ring-white shadow-lg" 
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-3xl text-white font-bold shadow-lg">
                  {(user?.name || 'U')[0].toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-sm text-gray-400 mt-1">Member since {memberSince}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Membership Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Current Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Current Plan</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                {membership === 'free' && '🆓'}
                {membership === 'day' && '☀️'}
                {membership === 'monthly' && '⭐'}
                {membership === 'yearly' && '🎯'}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {membership === 'free' && 'Free'}
                  {membership === 'day' && 'Day Pass'}
                  {membership === 'monthly' && 'Monthly'}
                  {membership === 'yearly' && 'Yearly'}
                </div>
                <div className="text-gray-500 text-sm">
                  {membership === 'free' && '10 images/day'}
                  {membership === 'day' && 'Unlimited for 24h'}
                  {membership === 'monthly' && '$9.9/month'}
                  {membership === 'yearly' && '$99/year'}
                </div>
              </div>
            </div>
            {membership === 'free' && (
              <a
                href="/pricing"
                className="mt-6 block w-full py-3 text-center bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-200 transition"
              >
                Upgrade Now
              </a>
            )}
          </div>

          {/* Daily Usage */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Today's Usage</h2>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold text-gray-900">{dailyUsage}</span>
              <span className="text-gray-400 mb-1">/ {dailyLimit}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${Math.min((dailyUsage / (dailyLimit === '∞' ? 100 : dailyLimit)) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              {dailyLimit === '∞' 
                ? 'You have unlimited processing today' 
                : `${dailyLimit - dailyUsage} images remaining today`}
            </p>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Email</div>
                  <div className="text-gray-500 text-sm">{user?.email}</div>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Verified</span>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Google Account</div>
                  <div className="text-gray-500 text-sm">Connected</div>
                </div>
              </div>
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.482-.502-5.502m-5.421-7.5h6m-6 2h4m-4 0v3m0-3v3" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Account Status</div>
                  <div className="text-gray-500 text-sm">Active</div>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Active</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 text-center">
          <a href="/pricing" className="inline-flex items-center gap-2 text-violet-600 font-medium hover:text-violet-700 transition">
            View all plans
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
