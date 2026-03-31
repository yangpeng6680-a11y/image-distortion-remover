'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useCallback } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processed, setProcessed] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [intensity, setIntensity] = useState(50)

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
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">ID</span>
            </div>
            <span className="font-bold text-gray-900">Image Distortion Remover</span>
          </div>
          
          <div className="flex items-center gap-3">
            <a href="/pricing" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition">
              💎 Pricing
            </a>
            {session ? (
              <>
                <a href="/profile" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition">
                  👤 Profile
                </a>
                <img src={session.user?.image || ''} alt="" className="w-8 h-8 rounded-full" />
                <button onClick={() => signOut()} className="text-sm text-gray-500 hover:text-gray-700">
                  Sign out
                </button>
              </>
            ) : (
              <button 
                onClick={() => signIn('google')}
                className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fix Image Distortion <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">in Seconds</span>
          </h1>
          <p className="text-gray-600">Remove barrel distortion, fix perspective, correct lens errors</p>
        </div>

        {/* Upload Area */}
        <div 
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="space-y-4">
              <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl" />
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => { setFile(null); setPreview(null); setProcessed(null) }}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Remove
                </button>
                <button
                  onClick={processImage}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Processing...' : '✨ Fix Distortion'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Drag & drop image here, or click to upload</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold rounded-lg cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Image
              </label>
              <p className="text-sm text-gray-400 mt-2">PNG, JPG, WEBP supported</p>
            </div>
          )}
        </div>

        {/* Intensity Slider */}
        {preview && !processed && (
          <div className="bg-white rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Correction Intensity</span>
              <span className="text-sm text-violet-600 font-semibold">{intensity}%</span>
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
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-semibold text-gray-900 mb-3">Image Corrected!</h3>
            <button
              onClick={downloadResult}
              className="px-6 py-2.5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              Download Image
            </button>
          </div>
        )}

        {/* Features Grid - Compact */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <div className="text-2xl mb-2">📤</div>
            <div className="font-medium text-gray-900 text-sm">Upload Image</div>
            <div className="text-xs text-gray-500 mt-1">Drag & drop or click</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <div className="text-2xl mb-2">✨</div>
            <div className="font-medium text-gray-900 text-sm">AI Correction</div>
            <div className="text-xs text-gray-500 mt-1">Automatic fixing</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <div className="text-2xl mb-2">💾</div>
            <div className="font-medium text-gray-900 text-sm">Download</div>
            <div className="text-xs text-gray-500 mt-1">Get your result</div>
          </div>
        </div>

        {/* Pricing CTA */}
        <div className="mt-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-6 text-center text-white">
          <p className="font-medium mb-2">10 images/day free • Upgrade for unlimited</p>
          <a href="/pricing" className="inline-block px-6 py-2 bg-white text-violet-600 font-semibold rounded-lg hover:bg-violet-50 transition">
            View Pricing →
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-gray-500">
          <span>© 2026 ImageDistortion.shop</span>
          <div className="flex gap-4">
            <a href="/pricing" className="hover:text-gray-700">Pricing</a>
            <a href="/profile" className="hover:text-gray-700">Profile</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
