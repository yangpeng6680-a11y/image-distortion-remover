'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processed, setProcessed] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [intensity, setIntensity] = useState(50)
  const [dragActive, setDragActive] = useState(false)

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const processImage = async () => {
    if (!file || !preview) return
    setLoading(true)
    
    // Simulate processing - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For demo, just use the preview as processed
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">ID</span>
            </div>
            <span className="font-bold text-gray-900">Image Distortion Remover</span>
          </div>
          
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <a href="/pricing" className="px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 rounded-lg transition">
                  💎 Pricing
                </a>
                <a href="/profile" className="px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 rounded-lg transition">
                  👤 Profile
                </a>
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <img src={session.user?.image || ''} alt="" className="w-8 h-8 rounded-full" />
                  <button onClick={() => signOut()} className="text-sm text-gray-500 hover:text-gray-700">
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="/pricing" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                  💎 Pricing
                </a>
                <button 
                  onClick={() => signIn('google')}
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
            Free to use, no signup required
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Fix Image Distortion<br/>
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              in Seconds
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Remove barrel distortion, fix perspective, and correct lens errors with our powerful AI tool. 
            Works entirely in your browser — no uploads needed.
          </p>
        </div>
      </section>

      {/* Upload Section */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
              dragActive 
                ? 'border-violet-500 bg-violet-50' 
                : preview 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="space-y-6">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-80 mx-auto rounded-2xl shadow-lg"
                />
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => { setFile(null); setPreview(null); setProcessed(null) }}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-100 transition"
                  >
                    ✕ Remove
                  </button>
                  <button
                    onClick={processImage}
                    disabled={loading}
                    className="px-8 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full font-semibold shadow-lg shadow-violet-200 hover:shadow-xl transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>✨ Fix Distortion</>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Drop your image here
                </h3>
                <p className="text-gray-500 mb-6">
                  or click to browse • PNG, JPG, WEBP supported
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full font-semibold cursor-pointer hover:shadow-lg transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Image
                </label>
              </>
            )}
          </div>

          {/* Intensity Slider */}
          {preview && !processed && (
            <div className="mt-6 bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium text-gray-700">Correction Intensity</label>
                <span className="text-violet-600 font-semibold">{intensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>
          )}

          {/* Processed Result */}
          {processed && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Image Corrected!</h3>
                <p className="text-gray-600 mb-4">Your image has been processed and is ready to download.</p>
                <button
                  onClick={downloadResult}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Image
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Three simple steps to perfect images</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-2xl mb-6">📤</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Upload Image</h3>
              <p className="text-gray-600">Drag and drop or click to upload your distorted image. All processing happens locally.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-2xl mb-6">✨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. AI Correction</h3>
              <p className="text-gray-600">Our advanced algorithm automatically detects and fixes barrel distortion, perspective, and lens errors.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-2xl mb-6">💾</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Download</h3>
              <p className="text-gray-600">Get your perfectly corrected image instantly. No watermarks on pro plans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-8">Join thousands of users who trust Image Distortion Remover</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/pricing" className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition">
              View Pricing
            </a>
            <button onClick={() => {
              document.getElementById('file-upload')?.click()
            }} className="px-8 py-3 border-2 border-violet-200 text-violet-600 font-semibold rounded-full hover:bg-violet-50 transition">
              Try Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">ID</span>
              </div>
              <span className="font-bold text-gray-900">Image Distortion Remover</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="/pricing" className="hover:text-gray-700 transition">Pricing</a>
              <a href="/profile" className="hover:text-gray-700 transition">Profile</a>
              <span>© 2026 ImageDistortion.shop</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
