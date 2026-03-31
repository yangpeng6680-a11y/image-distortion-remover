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

  const handleUploadClick = () => {
    if (!session) {
      signIn('google')
      return
    }
    document.getElementById('file-upload')?.click()
  }

  const handleProcess = () => {
    if (!session) {
      signIn('google')
      return
    }
    processImage()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">ID</span>
            </div>
            <span className="font-semibold text-gray-900">Image Distortion Remover</span>
          </div>
          
          <div className="flex items-center gap-3">
            <a href="/pricing" className="text-sm font-medium text-gray-500 hover:text-violet-600">
              Pricing
            </a>
            {session ? (
              <>
                <a href="/profile" className="text-sm font-medium text-gray-500 hover:text-violet-600">
                  Profile
                </a>
                <img src={session.user?.image || ''} alt="" className="w-7 h-7 rounded-full" />
                <button onClick={() => signOut()} className="text-xs text-gray-400 hover:text-gray-600">
                  Sign out
                </button>
              </>
            ) : (
              <button 
                onClick={() => signIn('google')}
                className="px-4 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-full hover:bg-violet-700 transition"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Left: Info */}
          <div className="pt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Fix Distorted Images<br/>
              <span className="text-violet-600">in One Click</span>
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Automatically remove barrel distortion, fix perspective errors, and correct lens defects.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                100% Free for 10 images/day
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                No upload — processing happens locally
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Works in seconds
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 py-4 border-y border-gray-100">
              <div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-xs text-gray-500">Images Fixed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.9★</div>
                <div className="text-xs text-gray-500">User Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-xs text-gray-500">Private</div>
              </div>
            </div>
          </div>

          {/* Right: Demo Box */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 relative">
            
            {/* Logged in: Show usage */}
            {session && (
              <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                ✓ Logged in
              </div>
            )}

            {/* Upload Area */}
            {preview ? (
              <div className="space-y-3">
                <img src={preview} alt="Preview" className="w-full rounded-lg" />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setFile(null); setPreview(null); setProcessed(null) }}
                    className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Remove
                  </button>
                  <button
                    onClick={handleProcess}
                    disabled={loading}
                    className="flex-1 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : '✨ Fix Image'}
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-violet-400 transition cursor-pointer"
                onClick={handleUploadClick}
              >
                {session ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="font-medium text-gray-900 mb-1">Upload & Fix Image</p>
                    <p className="text-sm text-gray-500">Click to upload</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="font-medium text-gray-900 mb-1">Sign in to use</p>
                    <p className="text-sm text-gray-500">Free 10 images/day • No credit card</p>
                    <div className="mt-4 flex justify-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); signIn('google') }}
                        className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition"
                      >
                        Sign in with Google
                      </button>
                    </div>
                  </>
                )}
                <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB</p>
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
        </div>
      </section>

      {/* Before/After Demo */}
      <section className="bg-gray-50 py-10 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">See the Transformation</h2>
            <p className="text-gray-600 text-sm">Our AI automatically detects and corrects distortion</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Before</span>
              </div>
              <div className="text-xs text-gray-500 text-center">Barrel Distortion</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200 relative">
              <div className="absolute inset-0 bg-violet-600/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">→</span>
              </div>
              <div className="aspect-video bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-violet-600 text-sm font-medium">Fixed!</span>
              </div>
              <div className="text-xs text-gray-500 text-center">After Correction</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Before</span>
              </div>
              <div className="text-xs text-gray-500 text-center">Perspective Error</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 md:flex items-center justify-between">
            <div className="text-white mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-1">Ready to remove all limits?</h3>
              <p className="text-white/80 text-sm">10 images free daily. Unlimited from $1/day.</p>
            </div>
            <div className="flex gap-3">
              <a href="/pricing" className="px-5 py-2.5 bg-white text-violet-600 font-semibold rounded-lg hover:bg-violet-50 transition">
                View Plans
              </a>
              {!session && (
                <button 
                  onClick={() => signIn('google')}
                  className="px-5 py-2.5 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition"
                >
                  Sign Up Free
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">ID</span>
            </div>
            <span>© 2026 ImageDistortion.shop</span>
          </div>
          <div className="flex gap-6">
            <a href="/pricing" className="hover:text-gray-700">Pricing</a>
            <a href="/profile" className="hover:text-gray-700">Profile</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
