'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

// 四角透视变换函数
function drawPerspectiveImage(
  ctx: CanvasRenderingContext2D, img: HTMLImageElement,
  sx0: number, sy0: number, sx1: number, sy1: number,
  sx2: number, sy2: number, sx3: number, sy3: number,
  dx0: number, dy0: number, dx1: number, dy1: number,
  dx2: number, dy2: number, dx3: number, dy3: number
) {
  const srcW = img.width, srcH = img.height
  const dstW = Math.max(Math.hypot(dx1-dx0, dy1-dy0), Math.hypot(dx3-dx2, dy3-dy2))
  const dstH = Math.max(Math.hypot(dx2-dx1, dy2-dy1), Math.hypot(dx3-dx0, dy3-dy0))
  const cv = document.createElement('canvas'); cv.width = srcW; cv.height = srcH
  const cx = cv.getContext('2d')!; cx.drawImage(img, 0, 0)
  const dst = document.createElement('canvas'); dst.width = dstW; dst.height = dstH
  const dctx = dst.getContext('2d')!
  const scale = 3
  const tmp = document.createElement('canvas'); tmp.width = dstW*scale; tmp.height = dstH*scale
  const tc = tmp.getContext('2d')!
  tc.fillStyle = 'rgba(0,0,0,0)'; tc.fillRect(0,0,tmp.width,tmp.height)
  const tmpW = tmp.width, tmpH = tmp.height
  const srcData = cx.getImageData(0,0,srcW,srcH).data
  const getPixel = (x:number,y:number) => {
    x=Math.round(x); y=Math.round(y)
    if(x<0||x>=srcW||y<0||y>=srcH) return [0,0,0,0]
    const i=(y*srcW+x)*4
    return [srcData[i],srcData[i+1],srcData[i+2],srcData[i+3]]
  }
  const bilerp = (tl:number[], br:number[], tx:number, ty:number) =>
    tl.map((v,i) => Math.round(v+(br[i]-v)*tx))
  for(let ty=0;ty<tmpH;ty++){
    for(let tx=0;tx<tmpW;tx++){
      const sx=(tx/tmpW)*srcW; const sy=(ty/tmpH)*srcH
      const x0=Math.floor(sx), y0=Math.floor(sy)
      const x1=Math.min(x0+1,srcW-1), y1=Math.min(y0+1,srcH-1)
      const fx=sx-x0, fy=sy-y0
      const top=bilerp(getPixel(x0,y0),getPixel(x1,y0),fx,0)
      const bot=bilerp(getPixel(x0,y1),getPixel(x1,y1),fx,0)
      const col=bilerp(top,bot,0,fy)
      tc.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},${col[3]/255})`
      tc.fillRect(tx,ty,1,1)
    }
  }
  dctx.drawImage(tmp,0,0,dstW,dstH)
  ctx.drawImage(dst,dx0,dy0)
}

type Corner = { x: number; y: number }

interface HistoryRecord {
  id: string
  createdAt: number
  corners: Corner[]
  useBackground: boolean
  imageCount: number
}

export default function Home() {
  const { data: session } = useSession()

  // 状态
  const [uploadStatus, setUploadStatus] = useState('当前未选择图片')
  const [useBackground, setUseBackground] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<Array<{ file: File; name: string; originalSrc: string }>>([])
  const [corners, setCorners] = useState<Corner[]>([
    { x: 0.05, y: 0.05 },
    { x: 0.95, y: 0.05 },
    { x: 0.95, y: 0.95 },
    { x: 0.05, y: 0.95 },
  ])
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<HistoryRecord[]>([])

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgInputRef = useRef<HTMLInputElement>(null)
  const fgInputRef = useRef<HTMLInputElement>(null)
  const bgImageRef = useRef<HTMLImageElement | null>(null)
  const currentImageRef = useRef<HTMLImageElement | null>(null)
  const draggingRef = useRef<number | null>(null)
  const dragStartRef = useRef<{ x: number; y: number; cornerX: number; cornerY: number } | null>(null)

  const canvasWidth = 400
  const canvasHeight = 300

  // 加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem('iw_history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  // 保存历史记录
  const saveHistory = useCallback((newCorners: Corner[]) => {
    const record: HistoryRecord = {
      id: Date.now().toString(),
      createdAt: Date.now(),
      corners: newCorners,
      useBackground,
      imageCount: uploadedImages.length
    }
    setHistory(prev => {
      const updated = [record, ...prev].slice(0, 10)
      localStorage.setItem('iw_history', JSON.stringify(updated))
      return updated
    })
  }, [useBackground, uploadedImages.length])

  // 绘制画布
  const drawCanvas = useCallback((pts: Corner[]) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // 棋盘格背景
    const tileSize = 20
    for (let y = 0; y < canvasHeight; y += tileSize) {
      for (let x = 0; x < canvasWidth; x += tileSize) {
        ctx.fillStyle = ((x + y) / tileSize) % 2 === 0 ? '#eee' : '#fff'
        ctx.fillRect(x, y, tileSize, tileSize)
      }
    }

    // 控制框
    ctx.strokeStyle = '#ec4899'
    ctx.lineWidth = 2
    ctx.beginPath()
    pts.forEach((p, i) => {
      const x = p.x * canvasWidth; const y = p.y * canvasHeight
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.stroke()

    // 控制点
    pts.forEach(p => {
      const x = p.x * canvasWidth; const y = p.y * canvasHeight
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fillStyle = '#ec4899'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // 当前图片
    if (currentImageRef.current) {
      const img = currentImageRef.current
      const ptsRatio = pts.flatMap(p => [p.x, p.y])
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(ptsRatio[0]*canvasWidth, ptsRatio[1]*canvasHeight)
      for (let i = 2; i < ptsRatio.length; i += 2)
        ctx.lineTo(ptsRatio[i]*canvasWidth, ptsRatio[i+1]*canvasHeight)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)
      ctx.restore()
    }
  }, [])

  useEffect(() => { drawCanvas(corners) }, [corners, drawCanvas])

  // 鼠标拖拽
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY
    for (let i = 0; i < corners.length; i++) {
      const dist = Math.hypot(mx - corners[i].x * canvasWidth, my - corners[i].y * canvasHeight)
      if (dist < 15) {
        draggingRef.current = i
        dragStartRef.current = { x: mx, y: my, cornerX: corners[i].x, cornerY: corners[i].y }
        return
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingRef.current === null || !dragStartRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY
    const dx = mx - dragStartRef.current.x
    const dy = my - dragStartRef.current.y
    const newCorners = [...corners]
    newCorners[draggingRef.current] = {
      x: Math.max(0, Math.min(1, dragStartRef.current.cornerX + dx / canvasWidth)),
      y: Math.max(0, Math.min(1, dragStartRef.current.cornerY + dy / canvasHeight)),
    }
    setCorners(newCorners)
    drawCanvas(newCorners)
  }

  const handleMouseUp = () => {
    if (draggingRef.current !== null) {
      saveHistory(corners)
    }
    draggingRef.current = null
    dragStartRef.current = null
  }

  // 上传前景
  const handleFgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => ({
      file,
      name: file.name,
      originalSrc: URL.createObjectURL(file)
    }))
    setUploadedImages(prev => [...prev, ...newImages])
    setUploadStatus(`已上传 ${uploadedImages.length + newImages.length} 张图片`)
    if (newImages.length > 0) {
      const img = new Image()
      img.onload = () => { currentImageRef.current = img; drawCanvas(corners) }
      img.src = newImages[0].originalSrc
    }
  }

  // 上传背景
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    img.onload = () => { bgImageRef.current = img }
    img.src = URL.createObjectURL(file)
  }

  // 下载
  const handleDownload = () => {
    if (uploadedImages.length === 0) { alert('请先上传图片'); return }
    const ptsRatio = corners.flatMap(p => [p.x, p.y])
    uploadedImages.forEach((imgData) => {
      const img = new Image()
      img.onload = () => {
        const outCanvas = document.createElement('canvas')
        outCanvas.width = canvasWidth; outCanvas.height = canvasHeight
        const outCtx = outCanvas.getContext('2d')!
        if (useBackground && bgImageRef.current) {
          outCtx.drawImage(bgImageRef.current, 0, 0, canvasWidth, canvasHeight)
        }
        drawPerspectiveImage(outCtx, img,
          0,0,canvasWidth,0,0,canvasHeight,canvasWidth,canvasHeight,
          ptsRatio[0]*canvasWidth,ptsRatio[1]*canvasHeight,
          ptsRatio[2]*canvasWidth,ptsRatio[3]*canvasHeight,
          ptsRatio[4]*canvasWidth,ptsRatio[5]*canvasHeight,
          ptsRatio[6]*canvasWidth,ptsRatio[7]*canvasHeight
        )
        const link = document.createElement('a')
        link.href = outCanvas.toDataURL('image/png', 1.0)
        link.download = `合成_${imgData.name.replace(/\.[^/.]+$/, "")}.png`
        link.click()
      }
      img.src = imgData.originalSrc
    })
    setTimeout(() => alert(`✅ ${uploadedImages.length} 张图片已处理并下载！`), 300)
  }

  // 重置
  const handleReset = () => {
    const reset = [
      { x: 0.05, y: 0.05 }, { x: 0.95, y: 0.05 },
      { x: 0.95, y: 0.95 }, { x: 0.05, y: 0.95 },
    ]
    setCorners(reset)
    setUseBackground(false)
    setUploadedImages([])
    setUploadStatus('当前未选择图片')
    bgImageRef.current = null; currentImageRef.current = null
    drawCanvas(reset)
  }

  // 加载历史
  const loadHistory = (record: HistoryRecord) => {
    setCorners(record.corners)
    setUseBackground(record.useBackground)
    drawCanvas(record.corners)
    setShowHistory(false)
  }

  // 删除历史
  const deleteHistory = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(r => r.id !== id)
      localStorage.setItem('iw_history', JSON.stringify(updated))
      return updated
    })
  }

  const cornerLabels = ['左上', '右上', '右下', '左下']

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 p-5 font-sans">
      {/* 头部 */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end items-center gap-3 mb-3">
          {session ? (
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow">
              <span className="text-pink-600 font-bold text-sm">👋 {session.user?.name}</span>
              <button onClick={() => signOut()} className="px-4 py-1.5 bg-pink-500 text-white rounded-full text-sm font-bold hover:bg-pink-600 transition">登出</button>
            </div>
          ) : (
            <button onClick={() => signIn('google')} className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              用 Google 登录
            </button>
          )}
        </div>

        {/* 标题 */}
        <h1 className="text-center text-4xl font-bold text-pink-600 mb-8 drop-shadow-sm">🌸 Image Distortion Remover 🌸</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：上传区域 */}
          <div className="bg-white/90 rounded-3xl shadow-xl p-6 backdrop-blur">
            <h3 className="text-xl font-bold text-pink-600 mb-5 flex items-center gap-2">📁 准备素材</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-pink-500 font-semibold bg-pink-50 px-4 py-1.5 rounded-full">{uploadStatus}</span>
              {session && (
                <button onClick={() => setShowHistory(true)} className="text-sm text-pink-500 hover:text-pink-700 font-semibold underline">📋 历史记录</button>
              )}
            </div>
            <div className="space-y-4">
              {/* 背景开关 */}
              <div className="bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={useBackground} onChange={e => setUseBackground(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-pink-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                  <span className="text-pink-600 font-bold text-sm cursor-pointer" onClick={() => setUseBackground(!useBackground)}>启用背景图底板</span>
                </div>
                {useBackground && (
                  <label className="block border-2 border-dashed border-pink-300 rounded-xl p-6 text-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition">
                    <input type="file" ref={bgInputRef} accept="image/jpeg,image/png" onChange={handleBgUpload} className="hidden" />
                    <div className="text-4xl mb-2">🖼️</div>
                    <div className="text-pink-600 font-semibold text-sm">上传背景底图</div>
                    <div className="text-pink-300 text-xs mt-1">合成时以背景尺寸为画布</div>
                  </label>
                )}
                {!useBackground && <div className="text-pink-300 text-xs">开启后可上传底图</div>}
              </div>

              {/* 前景上传 */}
              <label className="block border-2 border-dashed border-pink-300 rounded-xl p-6 text-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition bg-gradient-to-br from-pink-50 to-white">
                <input type="file" ref={fgInputRef} accept="image/jpeg,image/png" multiple onChange={handleFgUpload} className="hidden" />
                <div className="text-4xl mb-2">🎀</div>
                <div className="text-pink-600 font-semibold text-sm">上传需要拉伸的图片</div>
                <div className="text-pink-300 text-xs mt-1">支持多选，批量应用相同形变</div>
              </label>

              {/* 缩略图 */}
              {uploadedImages.length > 0 && (
                <div className="bg-pink-50 rounded-xl p-3 border border-pink-100">
                  <div className="text-xs text-pink-400 font-semibold mb-2">已上传图片队列：</div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {uploadedImages.map((img, i) => (
                      <img key={i} src={img.originalSrc} alt={img.name} className="w-14 h-14 object-cover rounded-lg border-2 border-pink-200" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 中间：画布 */}
          <div className="bg-white/90 rounded-3xl shadow-xl p-6 backdrop-blur">
            <h3 className="text-xl font-bold text-pink-600 mb-5 flex items-center gap-2">✨ 四角拉伸调节 ✨</h3>
            <div className="flex flex-col items-center">
              <div className="relative inline-block shadow-lg rounded-xl overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="max-w-full cursor-crosshair"
                  style={{ display: 'block', backgroundImage: 'repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%)', backgroundSize: '20px 20px' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>

              {/* 数值控制 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full mt-5">
                {cornerLabels.map((label, i) => (
                  <div key={i} className="bg-pink-50 p-3 rounded-xl border border-pink-100">
                    <div className="text-center text-pink-500 font-bold text-xs mb-2">{label}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-pink-300 block mb-0.5">X</label>
                        <input type="number" min={0} max={1} step={0.01} value={corners[i].x} onChange={e => {
                          const v = parseFloat(e.target.value)
                          if (isNaN(v)) return
                          const nc = [...corners]; nc[i] = { ...nc[i], x: Math.max(0, Math.min(1, v)) }
                          setCorners(nc); drawCanvas(nc)
                        }} className="w-full px-2 py-1 text-xs border border-pink-200 rounded-lg text-pink-600 font-medium bg-white" />
                      </div>
                      <div>
                        <label className="text-xs text-pink-300 block mb-0.5">Y</label>
                        <input type="number" min={0} max={1} step={0.01} value={corners[i].y} onChange={e => {
                          const v = parseFloat(e.target.value)
                          if (isNaN(v)) return
                          const nc = [...corners]; nc[i] = { ...nc[i], y: Math.max(0, Math.min(1, v)) }
                          setCorners(nc); drawCanvas(nc)
                        }} className="w-full px-2 py-1 text-xs border border-pink-200 rounded-lg text-pink-600 font-medium bg-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 mt-5 flex-wrap justify-center">
                <button onClick={handleDownload} className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition hover:-translate-y-0.5">📥 下载全部</button>
                <button onClick={handleReset} className="px-8 py-3 bg-white text-pink-500 border-2 border-pink-300 rounded-2xl font-bold text-base shadow hover:bg-pink-50 transition hover:-translate-y-0.5">🔄 重置</button>
              </div>
            </div>
          </div>

          {/* 右侧：功能说明 */}
          <div className="bg-white/90 rounded-3xl shadow-xl p-6 backdrop-blur">
            <h3 className="text-xl font-bold text-pink-600 mb-5 flex items-center gap-2">💡 使用说明</h3>
            <div className="space-y-4 text-sm text-pink-700">
              <div className="flex gap-3">
                <span className="text-2xl">1️⃣</span>
                <div><strong>上传图片</strong><br/><span className="text-pink-400">上传前景图，可多选批量处理</span></div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">2️⃣</span>
                <div><strong>拖拽控制点</strong><br/><span className="text-pink-400">四角控制点或输入精确坐标</span></div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">3️⃣</span>
                <div><strong>合成背景</strong><br/><span className="text-pink-400">开启背景底板并上传背景图</span></div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">4️⃣</span>
                <div><strong>下载结果</strong><br/><span className="text-pink-400">一键下载 PNG 透明背景</span></div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-pink-100">
              <div className="text-xs text-pink-400 text-center">Powered by Next.js + Tailwind CSS</div>
            </div>
          </div>
        </div>
      </div>

      {/* 历史记录弹窗 */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowHistory(false)}>
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-pink-600">📋 历史记录</h3>
              <button onClick={() => setShowHistory(false)} className="text-pink-400 hover:text-pink-600 text-2xl">&times;</button>
            </div>
            {history.length === 0 ? (
              <div className="text-center text-pink-400 py-8">暂无历史记录</div>
            ) : (
              <div className="space-y-3">
                {history.map(record => (
                  <div key={record.id} className="bg-pink-50 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold text-pink-600">{new Date(record.createdAt).toLocaleString('zh-CN')}</div>
                      <div className="text-xs text-pink-400">{record.imageCount} 张图片 {record.useBackground ? '✓ 含背景' : ''}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => loadHistory(record)} className="px-3 py-1 bg-pink-500 text-white rounded-full text-xs font-bold">加载</button>
                      <button onClick={() => deleteHistory(record.id)} className="px-3 py-1 bg-pink-200 text-pink-600 rounded-full text-xs font-bold hover:bg-pink-300">删除</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {history.length > 0 && (
              <button onClick={() => { setHistory([]); localStorage.removeItem('iw_history') }} className="mt-4 w-full text-center text-xs text-pink-400 hover:text-pink-600 underline">清空全部历史</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
