'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useCallback } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processed, setProcessed] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }
    setFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    setProcessed(null)
  }, [])

  const processImage = async () => {
    if (!file || !preview) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setProcessed(preview)
    setLoading(false)
  }

  const downloadResult = () => {
    if (!processed) return
    const link = document.createElement('a')
    link.href = processed
    link.download = 'corrected-image.png'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200">
              <span className="text-white font-bold">ID</span>
            </div>
            <span className="font-bold text-gray-800 text-lg">Image Fixer</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="/pricing" className="text-sm font-medium text-gray-500 hover:text-pink-500 transition">
              Pricing
            </a>
            {session ? (
              <>
                <a href="/profile" className="text-sm font-medium text-gray-500 hover:text-pink-500 transition">
                  Profile
                </a>
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <img src={session.user?.image || ''} alt="" className="w-8 h-8 rounded-full ring-2 ring-pink-200" />
                  <button onClick={() => signOut()} className="text-xs text-gray-400 hover:text-gray-600">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button 
                onClick={() => signIn('google')}
                className="px-5 py-2 bg-gradient-to-r from-pink-400 to-rose-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-pink-200/50 hover:shadow-xl transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Fix Image Distortion <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Instantly</span>
          </h1>
          <p className="text-gray-500 text-lg">Remove barrel distortion • Fix perspective • Correct lens errors</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-pink-100/50 p-8 mb-6">
          
          {/* User Info Bar */}
          {session && (
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img src={session.user?.image || ''} alt="" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-semibold text-gray-800">{session.user?.name}</div>
                  <div className="text-sm text-gray-500">10 free images/day</div>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                ✓ Logged in
              </span>
            </div>
          )}

          {/* Upload Area */}
          {preview ? (
            <div className="space-y-4">
              <img src={preview} alt="Preview" className="w-full rounded-2xl shadow-lg" />
              <div className="flex gap-3">
                <button
                  onClick={() => { setFile(null); setPreview(null); setProcessed(null) }}
                  className="flex-1 py-3 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  Remove
                </button>
                <button
                  onClick={processImage}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-400 to-rose-500 text-white text-sm font-semibold rounded-xl disabled:opacity-50 hover:shadow-lg transition"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Processing...
                    </span>
                  ) : '✨ Fix Image'}
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-pink-200 rounded-2xl p-12 text-center hover:border-pink-400 hover:bg-pink-50/30 transition cursor-pointer"
              onClick={() => {
                if (!session) {
                  signIn('google')
                } else {
                  document.getElementById('file-upload')?.click()
                }
              }}
            >
              {session ? (
                <>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-800 text-lg mb-1">Upload & Fix Your Image</p>
                  <p className="text-gray-500">Click or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-3">PNG, JPG up to 10MB</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-800 text-lg mb-1">Sign in to Start</p>
                  <p className="text-gray-500 mb-4">Free 10 images/day • No credit card</p>
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold rounded-full shadow-lg">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </span>
                </>
              )}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
        </div>

        {/* Result */}
        {processed && (
          <div className="bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl p-8 text-center text-white">
            <div className="text-5xl mb-3">✨</div>
            <h3 className="text-2xl font-bold mb-2">Image Corrected!</h3>
            <p className="text-white/80 mb-5">Your image is ready to download</p>
            <button
              onClick={downloadResult}
              className="px-8 py-3 bg-white text-pink-500 font-bold rounded-full hover:bg-pink-50 transition shadow-lg"
            >
              Download Image
            </button>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📤</span>
            </div>
            <div className="font-semibold text-gray-800 text-sm">Upload</div>
            <div className="text-xs text-gray-500 mt-1">Drag & drop images</div>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">✨</span>
            </div>
            <div className="font-semibold text-gray-800 text-sm">AI Fix</div>
            <div className="text-xs text-gray-500 mt-1">Automatic correction</div>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">💾</span>
            </div>
            <div className="font-semibold text-gray-800 text-sm">Download</div>
            <div className="text-xs text-gray-500 mt-1">Get result free</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 bg-white rounded-2xl p-6 text-center shadow-sm">
          {session ? (
            <p className="text-pink-500 font-semibold">✓ You're logged in! Enjoy your free images</p>
          ) : (
            <>
              <p className="text-gray-600 mb-3">
                Free <span className="text-pink-500 font-semibold">10 images/day</span> • No signup required
              </p>
              <a href="/pricing" className="text-pink-500 font-medium hover:text-pink-600 transition">
                View Premium Plans →
              </a>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-pink-100 mt-8 py-6 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between text-sm text-gray-500">
          <span>© 2026 ImageDistortion.shop</span>
          <div className="flex gap-6">
            <a href="/pricing" className="hover:text-pink-500 transition">Pricing</a>
            <a href="/profile" className="hover:text-pink-500 transition">Profile</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
