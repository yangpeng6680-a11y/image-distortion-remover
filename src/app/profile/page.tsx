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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {user?.image ? (
                <img src={user.image} alt={user.name || ''} className="w-16 h-16 rounded-full" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                  {(user?.name || 'U')[0].toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Membership Status */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Membership Status</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white">
              <div className="text-sm font-medium opacity-80 mb-1">Current Plan</div>
              <div className="text-3xl font-bold mb-2">
                {membership === 'free' && 'Free'}
                {membership === 'day' && 'Day Pass'}
                {membership === 'monthly' && 'Monthly'}
                {membership === 'yearly' && 'Yearly'}
              </div>
              {membership === 'free' && (
                <a
                  href="/pricing"
                  className="inline-block mt-4 px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition"
                >
                  Upgrade Now
                </a>
              )}
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-sm font-medium text-gray-500 mb-1">Daily Usage</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {dailyUsage} / {dailyLimit}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${Math.min((dailyUsage / (dailyLimit === '∞' ? dailyUsage || 1 : dailyLimit)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">Email</div>
                <div className="text-gray-500 text-sm">{user?.email}</div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Verified</span>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">Google Account</div>
                <div className="text-gray-500 text-sm">Connected</div>
              </div>
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <div className="font-medium text-gray-900">Member Since</div>
                <div className="text-gray-500 text-sm">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
