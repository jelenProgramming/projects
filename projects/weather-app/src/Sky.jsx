import { useEffect, useRef } from 'react'

// always-animated canvas sky driven by the calculated (averaged) condition.
// vanilla canvas, no libs. real + toon palettes, intensity precip, lightning,
// toon faces on sun/moon/clouds, and a 3d-shaded side couple who react per scene

const REAL = {
  clear: { day: ['#3f97e6', '#84c2ef', '#d3ebfb'], night: ['#0a1531', '#141f47', '#243a6b'] },
  partly: { day: ['#5199d4', '#98c1e5', '#dae8f4'], night: ['#101a38', '#1b2a52', '#2d4070'] },
  clouds: { day: ['#79899b', '#98a6b6', '#c6cfd8'], night: ['#12161f', '#1d2530', '#333c49'] },
  fog: { day: ['#9aa1a6', '#b8bec2', '#dadde0'], night: ['#161a1f', '#242a30', '#3a4048'] },
  drizzle: { day: ['#6b7885', '#8994a1', '#b1bbc4'], night: ['#10151c', '#1a2029', '#2b333d'] },
  rain: { day: ['#525d6a', '#6f7c89', '#97a2af'], night: ['#0b0f15', '#151a22', '#262d37'] },
  snow: { day: ['#8ba1b3', '#b6c6d3', '#e6eef5'], night: ['#141c28', '#22303f', '#3b4d60'] },
  thunder: { day: ['#3c4048', '#4f545c', '#6a7078'], night: ['#07090d', '#111419', '#20242c'] },
}
const TOON = {
  clear: { day: ['#1f8bff', '#5cb3ff', '#bfe0ff'], night: ['#0a1747', '#152a6b', '#24408a'] },
  partly: { day: ['#3f97ee', '#7fbdf0', '#cfe6fb'], night: ['#0e1a45', '#1c2f68', '#2f4a86'] },
  clouds: { day: ['#7f9bb2', '#a6bccf', '#cad9e6'], night: ['#232b38', '#333f4f', '#48586b'] },
  fog: { day: ['#a6adb2', '#c2c8cc', '#dee1e4'], night: ['#1c2127', '#2b323a', '#414a54'] },
  drizzle: { day: ['#5f6f7d', '#7f8f9d', '#a7b4c0'], night: ['#12181f', '#1e2630', '#303a46'] },
  rain: { day: ['#454f5b', '#5c6874', '#7d8a97'], night: ['#0a0e14', '#141a22', '#232c37'] },
  snow: { day: ['#8fb1c9', '#bcd4e4', '#e9f3fb'], night: ['#1a2634', '#2e4256', '#48627d'] },
  thunder: { day: ['#1c1f26', '#2a2f38', '#3c434e'], night: ['#05070a', '#0f1218', '#1b1f27'] },
}
const hx = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const palOf = (c, d, m) => ((m === 'toon' ? TOON : REAL)[c] || REAL.clouds)[d ? 'day' : 'night'].map(hx)
const WET = new Set(['rain', 'drizzle', 'thunder'])
const INK = '#1b1712'
const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k))
const rgbS = a => `rgb(${a[0]},${a[1]},${a[2]})`
const light = (h, k) => rgbS(mix(hx(h), [255, 255, 255], k))
const dark = (h, k) => rgbS(mix(hx(h), [0, 0, 0], k))

export default function Sky({ weather, mode = 'real' }) {
  const ref = useRef(null)
  const params = useRef({ cat: 'clouds', day: true, wind: 6, precip: 0, cloud: 60, mode })

  useEffect(() => {
    const base = weather
      ? { cat: weather.category, day: weather.isDay, wind: weather.windKph ?? 6, precip: weather.precip ?? 0, cloud: weather.cloud ?? 60 }
      : params.current
    params.current = { ...base, mode }
  }, [weather, mode])

  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext('2d')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(devicePixelRatio || 1, 2)
    let W = 0, H = 0
    const resize = () => { W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    new ResizeObserver(resize).observe(canvas); resize()

    let disp = palOf('clouds', true, mode)
    const clouds = Array.from({ length: 9 }, (_, i) => ({ x: Math.random(), y: 0.06 + Math.random() * 0.34, s: 0.6 + Math.random() * 0.9, o: 0 }))
    const rain = Array.from({ length: 340 }, () => ({ x: Math.random(), y: Math.random(), len: 0.02 + Math.random() * 0.03, v: 0.9 + Math.random() * 0.7 }))
    const snow = Array.from({ length: 160 }, () => ({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.4, v: 0.15 + Math.random() * 0.3, ph: Math.random() * 6.28 }))
    const stars = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random() * 0.6, r: Math.random() * 1.3, tw: Math.random() * 6.28 }))
    let flash = 0, bolt = null, nextBolt = 2 + Math.random() * 4, t = 0, raf = 0

    const draw = () => {
      t += 0.016
      const p = params.current, toon = p.mode === 'toon'
      const target = palOf(p.cat, p.day, p.mode)
      disp = disp.map((c, i) => c.map((v, j) => v + (target[i][j] - v) * (reduce ? 1 : 0.05)))
      const rgb = disp.map(c => `rgb(${c.map(Math.round).join(',')})`)
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, rgb[0]); g.addColorStop(0.55, rgb[1]); g.addColorStop(1, rgb[2]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

      const wet = WET.has(p.cat), heavy = Math.min(1, p.precip / 5)
      const dark2 = (wet ? 0.08 + heavy * 0.34 : 0) + (p.cat === 'thunder' ? 0.16 : 0)
      if (dark2 > 0) { ctx.fillStyle = `rgba(0,0,0,${dark2})`; ctx.fillRect(0, 0, W, H) }

      const clearish = p.cat === 'clear' || p.cat === 'partly'
      if (!p.day && clearish) for (const s of stars) { const a = 0.5 + 0.5 * Math.sin(t * 1.4 + s.tw); ctx.fillStyle = `rgba(255,255,255,${0.7 * a})`; ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, 6.28); ctx.fill() }
      if (clearish) sunMoon(ctx, W, H, p, toon, reduce ? 0 : t, rgb)

      const nC = p.cat === 'clear' ? 0 : p.cat === 'partly' ? 3 : p.cat === 'fog' ? 4 : 8
      const cRGB = toon ? (wet ? '18,20,28' : p.day ? '40,46,58' : '30,34,44') : (wet ? (p.day ? '92,100,112' : '38,44,52') : (p.day ? '245,247,250' : '150,160,175'))
      const drift = (reduce ? 0 : 1) * (0.0005 + p.wind * 0.00006)
      const face = toon ? (wet ? 'angry' : (p.cat === 'clouds' || p.cat === 'fog' || p.cat === 'partly') ? 'meh' : null) : null
      clouds.forEach((c, i) => { c.o += (((i < nC) ? (toon ? 0.96 : p.day ? 0.9 : 0.6) : 0) - c.o) * 0.02; if (c.o < 0.01) return; c.x += drift * c.s; if (c.x > 1.28) c.x = -0.28; cloud(ctx, c.x * W, c.y * H, 66 * c.s, `rgba(${cRGB},${c.o})`, toon, i === 0 ? face : null) })

      if (p.cat === 'fog') for (let i = 0; i < 5; i++) { const y = H * (0.4 + i * 0.12), off = (reduce ? 0 : t * (8 + i * 4)) % (W + 240) - 120; ctx.fillStyle = `rgba(${p.day ? '220,224,228' : '60,66,74'},0.1)`; ctx.fillRect(off - 160, y, 320, 46); ctx.fillRect(off + W * 0.5 - 160, y, 320, 46) }
      if (!toon && p.cat === 'clear' && p.day) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const rx = W * 0.78, ry = H * 0.2; for (let i = 0; i < 7; i++) { const a = Math.PI * 0.5 + (-0.5 + i * 0.16); ctx.fillStyle = 'rgba(255,244,214,0.05)'; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + Math.cos(a) * W * 1.3 - 40, ry + Math.sin(a) * W * 1.3); ctx.lineTo(rx + Math.cos(a) * W * 1.3 + 40, ry + Math.sin(a) * W * 1.3); ctx.fill() } ctx.restore() }

      if (p.cat === 'fog') for (let i = 0; i < 3; i++) { const y = H - 34 - i * 20, off = (reduce ? 0 : t * (12 + i * 6)) % (W + 200) - 100; ctx.fillStyle = `rgba(${p.day ? '224,228,232' : '74,80,88'},0.16)`; ctx.beginPath(); ctx.ellipse(off + W * 0.7, y, 150, 22, 0, 0, 6.28); ctx.fill() }

      if (wet) {
        const n = Math.round((p.cat === 'drizzle' ? 70 : 150) + heavy * 180), slant = Math.min(0.55, p.wind * 0.012)
        ctx.strokeStyle = toon ? 'rgba(150,205,255,0.7)' : 'rgba(200,214,230,0.4)'; ctx.lineWidth = toon ? 1.8 : 1.1
        for (let i = 0; i < n; i++) { const d = rain[i]; if (!reduce) { d.y += d.v * (0.02 + heavy * 0.016); d.x += slant * 0.01 } if (d.y > 1) { d.y = -0.05; d.x = Math.random() } const x = d.x * W, y = d.y * H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + slant * 42, y + d.len * H); ctx.stroke(); if (!toon && !reduce && Math.random() < 0.003) { ctx.beginPath(); ctx.arc(x, H - 5, 3, Math.PI, 0); ctx.stroke() } }
      }
      if (p.cat === 'snow') for (const f of snow) { if (!reduce) { f.y += f.v * 0.012; f.x += Math.sin(t + f.ph) * 0.0006 } if (f.y > 1) { f.y = -0.02; f.x = Math.random() } ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(f.x * W, f.y * H, f.r, 0, 6.28); ctx.fill() }

      if (p.cat === 'thunder' && !reduce) {
        nextBolt -= 0.016
        if (nextBolt <= 0) { flash = 1; bolt = mkBolt(W, H); nextBolt = 2.5 + Math.random() * 5 }
        if (flash > 0) { ctx.fillStyle = toon ? `rgba(255,214,40,${flash * 0.4})` : `rgba(255,255,255,${flash * 0.5})`; ctx.fillRect(0, 0, W, H); if (bolt && flash > 0.5) { ctx.strokeStyle = toon ? '#ffd21a' : 'rgba(220,232,255,0.95)'; ctx.lineWidth = toon ? 5 : 2.4; ctx.shadowBlur = toon ? 18 : 10; ctx.shadowColor = toon ? '#ffd21a' : '#dfeaff'; ctx.beginPath(); ctx.moveTo(bolt[0][0], bolt[0][1]); for (const pt of bolt) ctx.lineTo(pt[0], pt[1]); ctx.stroke(); ctx.shadowBlur = 0 } flash -= 0.05 }
      } else flash = 0

      if (!toon) { const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.95); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.26)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H) }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={ref} className="sky" aria-hidden="true" />
}

function mkBolt(W, H) { let x = W * (0.15 + Math.random() * 0.45), y = 0; const p = [[x, 0]]; while (y < H * 0.62) { y += H * (0.07 + Math.random() * 0.06); x += (Math.random() - 0.5) * W * 0.08; p.push([x, y]) } return p }

function sunMoon(ctx, W, H, p, toon, t, rgb) {
  const sx = W * 0.78, sy = H * 0.2
  if (p.day) {
    if (!toon) { const ry = ctx.createRadialGradient(sx, sy, 0, sx, sy, W * 0.32); ry.addColorStop(0, 'rgba(255,247,224,0.9)'); ry.addColorStop(0.2, 'rgba(255,240,205,0.45)'); ry.addColorStop(1, 'rgba(255,240,205,0)'); ctx.fillStyle = ry; ctx.fillRect(0, 0, W, H) }
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(t * 0.05); ctx.strokeStyle = toon ? '#ffd21a' : 'rgba(255,246,220,0.35)'; ctx.lineWidth = toon ? 4 : 2; for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); ctx.beginPath(); ctx.moveTo(toon ? 42 : 40, 0); ctx.lineTo(toon ? 70 : 64, 0); ctx.stroke() } ctx.restore()
    ctx.fillStyle = toon ? '#ffd21a' : 'rgba(255,250,235,0.98)'; ctx.beginPath(); ctx.arc(sx, sy, toon ? 32 : 30, 0, 6.28); ctx.fill()
    if (toon) { ctx.fillStyle = '#1a1d24'; ctx.beginPath(); ctx.arc(sx - 10, sy - 3, 3.2, 0, 6.28); ctx.arc(sx + 10, sy - 3, 3.2, 0, 6.28); ctx.fill(); ctx.strokeStyle = '#1a1d24'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(sx, sy + 3, 10, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); ctx.fillStyle = 'rgba(255,120,120,0.5)'; ctx.beginPath(); ctx.arc(sx - 15, sy + 4, 4, 0, 6.28); ctx.arc(sx + 15, sy + 4, 4, 0, 6.28); ctx.fill() }
  } else {
    const gl = ctx.createRadialGradient(sx, sy, 0, sx, sy, W * 0.24); gl.addColorStop(0, 'rgba(226,232,245,0.45)'); gl.addColorStop(1, 'rgba(226,232,245,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = 'rgba(233,238,247,0.96)'; ctx.beginPath(); ctx.arc(sx, sy, 26, 0, 6.28); ctx.fill()
    if (toon) { ctx.fillStyle = '#2a3350'; ctx.beginPath(); ctx.arc(sx - 8, sy - 2, 2.6, 0, 6.28); ctx.arc(sx + 8, sy - 2, 2.6, 0, 6.28); ctx.fill(); ctx.strokeStyle = '#2a3350'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy + 2, 7, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke() }
    else { ctx.fillStyle = rgb[0]; ctx.beginPath(); ctx.arc(sx + 9, sy - 6, 23, 0, 6.28); ctx.fill() }
  }
}
function cloud(ctx, x, y, r, fill, toon, face) {
  ctx.fillStyle = fill
  for (const [dx, dy, q] of [[0, 0, 1], [-0.7, 0.15, 0.72], [0.7, 0.15, 0.72], [-0.35, -0.25, 0.62], [0.4, -0.2, 0.6]]) { ctx.beginPath(); ctx.ellipse(x + dx * r, y + dy * r, q * r, q * r * 0.7, 0, 0, 6.28); ctx.fill() }
  if (!toon) return
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y + 0.05 * r, r * 1.05, r * 0.72, 0, 0, 6.28); ctx.stroke()
  if (face === 'angry') { ctx.fillStyle = '#1a1d24'; ctx.beginPath(); ctx.arc(x - 0.28 * r, y, 0.09 * r, 0, 6.28); ctx.arc(x + 0.28 * r, y, 0.09 * r, 0, 6.28); ctx.fill(); ctx.strokeStyle = '#1a1d24'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x - 0.42 * r, y - 0.22 * r); ctx.lineTo(x - 0.14 * r, y - 0.08 * r); ctx.moveTo(x + 0.42 * r, y - 0.22 * r); ctx.lineTo(x + 0.14 * r, y - 0.08 * r); ctx.moveTo(x - 0.2 * r, y + 0.34 * r); ctx.quadraticCurveTo(x, y + 0.2 * r, x + 0.2 * r, y + 0.34 * r); ctx.stroke() }
  else if (face === 'meh') { ctx.fillStyle = '#3a4048'; ctx.beginPath(); ctx.arc(x - 0.26 * r, y, 0.08 * r, 0, 6.28); ctx.arc(x + 0.26 * r, y, 0.08 * r, 0, 6.28); ctx.fill(); ctx.strokeStyle = '#3a4048'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x - 0.16 * r, y + 0.28 * r); ctx.lineTo(x + 0.16 * r, y + 0.28 * r); ctx.stroke() }
}
