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

      couple(ctx, W, H, p, t, flash, reduce)
      // fog drifts in FRONT of the couple too
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

// ---- side couple: she is always prepared, he gets the short end ----
function couple(ctx, W, H, p, t, flash, reduce) {
  const s = Math.max(0.6, Math.min(1.0, Math.min(W, H) / 540)), by = H - 22 * s, cx = W - 112 * s, toon = p.mode === 'toon'
  let scene = 'clouds'
  if (p.cat === 'thunder') scene = 'thunder'
  else if (WET.has(p.cat)) scene = 'rain'
  else if (p.cat === 'clear' && p.day) scene = 'clear'
  else if (p.cat === 'snow') scene = 'snow'
  else if (p.cat === 'fog') scene = 'fog'
  const bl = ph => reduce ? false : ((t + ph) % 3.2) < 0.14
  ctx.fillStyle = 'rgba(0,0,0,0.16)'
  ctx.beginPath(); ctx.ellipse(cx - 32 * s, by + 4, 24 * s, 5 * s, 0, 0, 6.28); ctx.ellipse(cx + 32 * s, by + 4, 24 * s, 5 * s, 0, 0, 6.28); ctx.fill()
  woman(ctx, cx - 32 * s, by, s, scene, bl(0), toon, t)
  man(ctx, cx + 32 * s, by, s, scene, bl(1.1), flash, toon, t)
}
function ball(ctx, x, y, r, base, toon) { const g = ctx.createRadialGradient(x - r * 0.36, y - r * 0.42, r * 0.1, x, y, r); g.addColorStop(0, light(base, toon ? 0.3 : 0.5)); g.addColorStop(0.62, base); g.addColorStop(1, dark(base, 0.3)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.28); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = r * (toon ? 0.16 : 0.1); ctx.stroke() }
function limb(ctx, x1, y1, x2, y2, w, base, toon) { ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = w + w * (toon ? 0.9 : 0.6); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.strokeStyle = base; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke() }
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath() }
function blob(ctx, x, y, w, h, r, base, toon) { const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, light(base, 0.28)); g.addColorStop(1, dark(base, 0.26)); rr(ctx, x, y, w, h, r); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = Math.min(w, h) * (toon ? 0.12 : 0.08); ctx.stroke() }
function eye(ctx, x, y, s, bl, wide, look) { ctx.lineCap = 'round'; if (bl) { ctx.strokeStyle = INK; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(x - 3 * s, y); ctx.lineTo(x + 3 * s, y); ctx.stroke(); return } const r = (wide || 3) * s; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.28); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.4 * s; ctx.stroke(); const lx = look === 'up' ? 0 : 0.5 * s, ly = look === 'up' ? -r * 0.45 : 0.5 * s; ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x + lx, y + ly, r * 0.5, 0, 6.28); ctx.fill() }
function mouth(ctx, x, y, s, type) { ctx.strokeStyle = INK; ctx.lineWidth = 2.2 * s; ctx.lineCap = 'round'; ctx.beginPath(); if (type === 'smile') ctx.arc(x, y - 2 * s, 5 * s, 0.12 * Math.PI, 0.88 * Math.PI); else if (type === 'o') { ctx.fillStyle = '#7a2a2a'; ctx.beginPath(); ctx.ellipse(x, y, 3 * s, 4 * s, 0, 0, 6.28); ctx.fill(); ctx.strokeStyle = INK; ctx.beginPath(); ctx.ellipse(x, y, 3 * s, 4 * s, 0, 0, 6.28); ctx.stroke(); return } else if (type === 'shock') { ctx.arc(x, y + 1 * s, 3 * s, 0, 6.28) } else if (type === 'flat') { ctx.moveTo(x - 4 * s, y + 3 * s); ctx.lineTo(x + 4 * s, y + 3 * s) } else ctx.arc(x, y + 5 * s, 5 * s, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke() }
function hairW(ctx, x, y, r, toon) { ctx.fillStyle = '#6b3f26'; ctx.beginPath(); ctx.arc(x, y - 2, r + 3, Math.PI, 0); ctx.fill(); rr(ctx, x - r - 3, y - 4, 7, 20, 3); ctx.fill(); rr(ctx, x + r - 4, y - 4, 7, 20, 3); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = r * (toon ? 0.14 : 0.09); ctx.beginPath(); ctx.arc(x, y - 2, r + 3, Math.PI, 0); ctx.stroke() }
function hairM(ctx, x, y, r, toon) { ctx.fillStyle = '#2c2622'; ctx.beginPath(); ctx.arc(x, y, r + 1, Math.PI, 0); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = r * (toon ? 0.14 : 0.09); ctx.stroke() }
function staticHair(ctx, x, y, r, t) { ctx.strokeStyle = '#2c2622'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; for (let i = 0; i < 7; i++) { const a = Math.PI + (i / 6) * Math.PI, j = Math.sin(t * 9 + i) * 2; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r - 1); ctx.lineTo(x + Math.cos(a) * (r + 9 + j), y + Math.sin(a) * (r + 9 + j) - 2); ctx.stroke() } }
function rainCloud(ctx, cx, cy, s, t, zap) { const cw = 15 * s;[[0, 0, 1], [-0.75, 0.2, 0.72], [0.75, 0.2, 0.72], [-0.32, -0.32, 0.6], [0.4, -0.26, 0.6]].forEach(([dx, dy, q]) => ball(ctx, cx + dx * cw, cy + dy * cw, q * cw, '#3c4552', true)); ctx.strokeStyle = '#8fd0ff'; ctx.lineWidth = 2.2 * s; ctx.lineCap = 'round'; for (let i = 0; i < 6; i++) { const ph = ((t * 1.3 + i * 0.31) % 1); const dx = (i - 2.5) * 6 * s; const y = cy + cw * 0.7 + ph * 28 * s; ctx.beginPath(); ctx.moveTo(cx + dx, y); ctx.lineTo(cx + dx, y + 6 * s); ctx.stroke() } if (zap && Math.sin(t * 7) > 0.86) { ctx.strokeStyle = '#ffd21a'; ctx.lineWidth = 3 * s; ctx.shadowBlur = 12; ctx.shadowColor = '#ffd21a'; ctx.beginPath(); ctx.moveTo(cx, cy + cw * 0.6); ctx.lineTo(cx - 5 * s, cy + cw * 0.6 + 11 * s); ctx.lineTo(cx + 3 * s, cy + cw * 0.6 + 15 * s); ctx.lineTo(cx - 3 * s, cy + cw * 0.6 + 25 * s); ctx.stroke(); ctx.shadowBlur = 0 } }
function heat(ctx, x, y, s, t) { const gl = ctx.createRadialGradient(x, y, 2, x, y, 44 * s); gl.addColorStop(0, 'rgba(255,80,40,0.26)'); gl.addColorStop(1, 'rgba(255,80,40,0)'); ctx.fillStyle = gl; ctx.fillRect(x - 44 * s, y - 44 * s, 88 * s, 88 * s); ctx.strokeStyle = 'rgba(255,140,70,0.6)'; ctx.lineWidth = 2 * s; for (let i = 0; i < 4; i++) { const bx = x + (i - 1.5) * 10 * s; ctx.beginPath(); for (let k = 0; k <= 10; k++) { const yy = y - 6 * s - k * 4 * s - ((t * 22 * s) % (40 * s)); const xx = bx + Math.sin(k * 0.6 + t * 3 + i) * 4.5 * s; k === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy) } ctx.stroke() } }
function coldPuff(ctx, x, y, s, t) { ctx.fillStyle = 'rgba(225,242,255,0.55)'; for (let i = 0; i < 3; i++) { const ph = ((t * 0.7 + i * 0.4) % 1); ctx.globalAlpha = 0.55 * (1 - ph); ctx.beginPath(); ctx.arc(x + ph * 13 * s, y - ph * 8 * s, 3 * s + ph * 4 * s, 0, 6.28); ctx.fill() } ctx.globalAlpha = 1 }
function steam(ctx, x, y, s, t) { ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.7 * s; for (let i = 0; i < 2; i++) { ctx.beginPath(); for (let k = 0; k <= 8; k++) { const yy = y - k * 3 * s; const xx = x + i * 5 * s - 2 * s + Math.sin(k * 0.7 + t * 2 + i) * 2.5 * s; k === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy) } ctx.stroke() } }
function umbrella(ctx, x, y, s, col, toon) { ctx.strokeStyle = INK; ctx.lineWidth = 2.2 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 12 * s, y + 44 * s); ctx.stroke(); const g = ctx.createLinearGradient(x - 24 * s, y - 8 * s, x + 24 * s, y); g.addColorStop(0, light(col, 0.25)); g.addColorStop(1, dark(col, 0.2)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 24 * s, Math.PI, 0); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 24 * s * (toon ? 0.1 : 0.07); ctx.stroke() }
function puddle(ctx, x, y, w, s) { ctx.fillStyle = 'rgba(140,180,215,0.4)'; ctx.beginPath(); ctx.ellipse(x, y, w, 4.5 * s, 0, 0, 6.28); ctx.fill() }
function boots(ctx, x, by, s, col) { ctx.fillStyle = col;[-9, 3].forEach(dx => { rr(ctx, x + dx * s, by - 9 * s, 8 * s, 9 * s, 2.5 * s); ctx.fill() }); ctx.strokeStyle = INK; ctx.lineWidth = 1.4 * s;[-9, 3].forEach(dx => { rr(ctx, x + dx * s, by - 9 * s, 8 * s, 9 * s, 2.5 * s); ctx.stroke() }) }
function icecream(ctx, x, y, s, dropped) { if (dropped) { ctx.fillStyle = '#f7b2c9'; ctx.beginPath(); ctx.ellipse(x, y, 8 * s, 3.5 * s, 0, 0, 6.28); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.3 * s; ctx.stroke(); ctx.fillStyle = '#e8b06a'; ctx.beginPath(); ctx.moveTo(x + 4 * s, y - 1 * s); ctx.lineTo(x + 15 * s, y - 8 * s); ctx.lineTo(x + 12 * s, y + 2 * s); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.stroke(); return } ctx.fillStyle = '#e8b06a'; ctx.beginPath(); ctx.moveTo(x - 4.5 * s, y); ctx.lineTo(x + 4.5 * s, y); ctx.lineTo(x, y + 12 * s); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.3 * s; ctx.stroke(); ball(ctx, x - 2.5 * s, y - 4 * s, 4.5 * s, '#f7b2c9', true); ball(ctx, x + 3 * s, y - 5 * s, 4 * s, '#fdf3d8', true) }
function soggyPaper(ctx, x, y, s, t) { const sag = 3 * s + Math.sin(t * 2) * 0.8 * s; ctx.fillStyle = '#d9d4c8'; ctx.beginPath(); ctx.moveTo(x - 16 * s, y + sag); ctx.quadraticCurveTo(x, y - 4 * s, x + 16 * s, y + sag); ctx.lineTo(x + 13 * s, y + sag + 5 * s); ctx.quadraticCurveTo(x, y + 2 * s, x - 13 * s, y + sag + 5 * s); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.4 * s; ctx.stroke(); ctx.strokeStyle = 'rgba(90,90,90,0.5)'; ctx.lineWidth = 0.9 * s; ctx.beginPath(); ctx.moveTo(x - 9 * s, y + sag + 1.5 * s); ctx.lineTo(x + 9 * s, y + sag + 1.5 * s); ctx.stroke() }
function iceCube(ctx, x, by, w, h, s, t) { ctx.fillStyle = 'rgba(170,215,245,0.42)'; rr(ctx, x - w / 2, by - h, w, h, 5 * s); ctx.fill(); ctx.strokeStyle = 'rgba(220,240,255,0.9)'; ctx.lineWidth = 2 * s; rr(ctx, x - w / 2, by - h, w, h, 5 * s); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 1.6 * s; ctx.beginPath(); ctx.moveTo(x - w * 0.32, by - h * 0.86); ctx.lineTo(x - w * 0.12, by - h * 0.66); ctx.moveTo(x - w * 0.36, by - h * 0.68); ctx.lineTo(x - w * 0.26, by - h * 0.58); ctx.stroke(); ctx.fillStyle = 'rgba(220,240,255,0.9)';[[-w * 0.3, 7], [0, 11], [w * 0.28, 6]].forEach(([dx, len]) => { ctx.beginPath(); ctx.moveTo(x + dx - 2.4 * s, by); ctx.lineTo(x + dx + 2.4 * s, by); ctx.lineTo(x + dx, by + len * s); ctx.closePath(); ctx.fill() }) }
function lantern(ctx, x, y, s, t) { const gl = ctx.createRadialGradient(x, y, 1, x, y, 30 * s); gl.addColorStop(0, 'rgba(255,224,130,0.85)'); gl.addColorStop(1, 'rgba(255,224,130,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x, y, 30 * s, 0, 6.28); ctx.fill(); ctx.fillStyle = 'rgba(255,232,150,0.35)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 42 * s, y - 12 * s); ctx.lineTo(x + 42 * s, y + 14 * s); ctx.closePath(); ctx.fill(); blob(ctx, x - 4 * s, y - 5 * s, 8 * s, 10 * s, 2.5 * s, '#f2c94c', true); ctx.strokeStyle = INK; ctx.lineWidth = 1.6 * s; ctx.beginPath(); ctx.arc(x, y - 6 * s, 3.5 * s, Math.PI, 0); ctx.stroke() }
function lampPost(ctx, x, by, s, t) { ctx.strokeStyle = INK; ctx.lineWidth = 4 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x, by - 74 * s); ctx.stroke(); ctx.fillStyle = '#39424f'; rr(ctx, x - 6 * s, by - 84 * s, 12 * s, 11 * s, 3 * s); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.6 * s; rr(ctx, x - 6 * s, by - 84 * s, 12 * s, 11 * s, 3 * s); ctx.stroke(); const gl = ctx.createRadialGradient(x, by - 78 * s, 2, x, by - 78 * s, 22 * s); gl.addColorStop(0, 'rgba(255,228,140,0.55)'); gl.addColorStop(1, 'rgba(255,228,140,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x, by - 78 * s, 22 * s, 0, 6.28); ctx.fill() }
function dizzyStars(ctx, x, y, s, t) { ctx.fillStyle = '#ffd76e'; for (let i = 0; i < 3; i++) { const a = t * 2.4 + i * 2.09, rx = x + Math.cos(a) * 13 * s, ry = y + Math.sin(a) * 5 * s - 2 * s; ctx.beginPath(); for (let k = 0; k < 5; k++) { const sa = -Math.PI / 2 + k * 1.256, r1 = 3.2 * s, r2 = 1.3 * s; ctx.lineTo(rx + Math.cos(sa) * r1, ry + Math.sin(sa) * r1); ctx.lineTo(rx + Math.cos(sa + 0.628) * r2, ry + Math.sin(sa + 0.628) * r2) } ctx.closePath(); ctx.fill() } }
function pigeon(ctx, x, y, s, t) { const bob = Math.sin(t * 3) * 0.8 * s; ctx.fillStyle = '#8b93a2'; ctx.beginPath(); ctx.ellipse(x, y + bob, 7 * s, 5 * s, -0.2, 0, 6.28); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.3 * s; ctx.stroke(); ball(ctx, x + 5.5 * s, y - 4 * s + bob, 3.4 * s, '#9aa3b2', true); ctx.fillStyle = '#e8a13c'; ctx.beginPath(); ctx.moveTo(x + 8.5 * s, y - 4.5 * s + bob); ctx.lineTo(x + 12 * s, y - 3.5 * s + bob); ctx.lineTo(x + 8.5 * s, y - 2.5 * s + bob); ctx.closePath(); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x + 6 * s, y - 5 * s + bob, 0.8 * s, 0, 6.28); ctx.fill() }
function phone(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.35); ctx.fillStyle = '#1c1f26'; rr(ctx, -4.5 * s, -8 * s, 9 * s, 16 * s, 2 * s); ctx.fill(); ctx.fillStyle = '#9fd2ff'; rr(ctx, -3.3 * s, -6.6 * s, 6.6 * s, 12 * s, 1.4 * s); ctx.fill(); ctx.fillStyle = '#ffd76e'; ctx.beginPath(); ctx.arc(-0.8 * s, -3.4 * s, 1.5 * s, 0, 6.28); ctx.fill(); ctx.restore() }

function woman(ctx, x, by, s, scene, bl, toon, t) {
  const wet = scene === 'rain' || scene === 'thunder', sunny = scene === 'clear', snowy = scene === 'snow'
  const foggy = scene === 'fog', meh = scene === 'clouds'
  const dressCol = wet ? '#f2c94c' : '#e0699a'
  if (wet) boots(ctx, x, by, s, '#2f4a86')
  limb(ctx, x - 8 * s, by - 38 * s, x - 13 * s, by - 13 * s, 6 * s, '#f2c49a', toon)
  const armUp = wet || snowy || foggy || meh || sunny
  if (armUp) limb(ctx, x + 8 * s, by - 38 * s, x + 15 * s, by - 52 * s, 6 * s, '#f2c49a', toon)
  else limb(ctx, x + 8 * s, by - 38 * s, x + 13 * s, by - 13 * s, 6 * s, '#f2c49a', toon)
  const g = ctx.createLinearGradient(x, by - 44 * s, x, by - 4 * s); g.addColorStop(0, light(dressCol, 0.28)); g.addColorStop(1, dark(dressCol, 0.24))
  ctx.beginPath(); ctx.moveTo(x - 10 * s, by - 44 * s); ctx.lineTo(x + 10 * s, by - 44 * s); ctx.lineTo(x + 18 * s, by - 4 * s); ctx.lineTo(x - 18 * s, by - 4 * s); ctx.closePath(); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 20 * s * (toon ? 0.09 : 0.06); ctx.stroke()
  const hy = by - 60 * s, hr = 18 * s; ball(ctx, x, hy, hr, '#f2c49a', toon); hairW(ctx, x, hy, hr, toon)
  if (wet) umbrella(ctx, x + 15 * s, hy - 28 * s, s, scene === 'thunder' ? '#c94a4a' : '#f2c94c', toon)
  if (sunny) { ctx.fillStyle = '#f2c94c'; ctx.beginPath(); ctx.ellipse(x, hy - hr + 3 * s, hr + 6 * s, 4 * s, 0, 0, 6.28); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.6 * s; ctx.stroke(); ctx.fillStyle = '#1c1f26'; rr(ctx, x - 12 * s, hy - 2 * s, 9 * s, 6 * s, 2 * s); ctx.fill(); rr(ctx, x + 3 * s, hy - 2 * s, 9 * s, 6 * s, 2 * s); ctx.fill(); ctx.fillRect(x - 3 * s, hy + 1 * s, 6 * s, 2 * s); icecream(ctx, x + 15 * s, by - 58 * s, s, false) }
  if (snowy) { ctx.fillStyle = '#c94a4a'; ctx.beginPath(); ctx.arc(x, hy - 3 * s, hr + 2 * s, Math.PI, 0); ctx.fill(); rr(ctx, x - hr - 2 * s, hy - 5 * s, (hr + 2 * s) * 2, 5 * s, 2 * s); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.6 * s; ctx.stroke(); ctx.fillStyle = '#c94a4a'; rr(ctx, x - 9 * s, by - 46 * s, 18 * s, 6 * s, 3 * s); ctx.fill(); blob(ctx, x + 12 * s, by - 54 * s, 9 * s, 8 * s, 2 * s, '#e8e2d8', toon); steam(ctx, x + 16 * s, by - 54 * s, s, t) }
  if (foggy) lantern(ctx, x + 16 * s, by - 54 * s, s, t)
  if (meh) phone(ctx, x + 16 * s, by - 53 * s, s)
  if (!sunny) { eye(ctx, x - 7 * s, hy - 2 * s, s, bl, 0); eye(ctx, x + 7 * s, hy - 2 * s, s, bl, 0) }
  mouth(ctx, x, hy + 8 * s, s, 'smile')
}

function man(ctx, x, by, s, scene, bl, flash, toon, t) {
  const skin = scene === 'clear' ? '#e2683f' : scene === 'snow' ? '#a9c2d4' : '#f0b483'
  if (scene === 'clear') {
    const gy = by - 8 * s
    heat(ctx, x, gy - 6 * s, s, t)
    puddle(ctx, x - 4 * s, gy + 6 * s, 30 * s, s)
    blob(ctx, x - 22 * s, gy - 8 * s, 42 * s, 12 * s, 6 * s, '#4b83c9', toon)
    limb(ctx, x + 16 * s, gy - 2 * s, x + 28 * s, gy - 12 * s, 6 * s, skin, toon)
    icecream(ctx, x + 30 * s, gy + 2 * s, s, true)
    ball(ctx, x - 24 * s, gy - 6 * s, 15 * s, skin, toon); hairM(ctx, x - 24 * s, gy - 8 * s, 15 * s, toon)
    eye(ctx, x - 28 * s, gy - 7 * s, s, bl, 0); eye(ctx, x - 20 * s, gy - 7 * s, s, bl, 0); mouth(ctx, x - 24 * s, gy + 2 * s, s, 'o')
    return
  }
  if (scene === 'snow') {
    coldPuff(ctx, x + 13 * s, by - 40 * s, s, t)
    limb(ctx, x - 6 * s, by - 26 * s, x - 8 * s, by - 5 * s, 7 * s, '#39424f', toon); limb(ctx, x + 6 * s, by - 26 * s, x + 8 * s, by - 5 * s, 7 * s, '#39424f', toon)
    blob(ctx, x - 12 * s, by - 46 * s, 24 * s, 22 * s, 6 * s, '#4b83c9', toon)
    const hy = by - 56 * s, hr = 15 * s
    ball(ctx, x, hy, hr, skin, toon); hairM(ctx, x, hy, hr, toon)
    eye(ctx, x - 6 * s, hy - 2 * s, s, bl, 0); eye(ctx, x + 6 * s, hy - 2 * s, s, bl, 0); mouth(ctx, x, hy + 6 * s, s, 'frown')
    iceCube(ctx, x, by, 52 * s, 82 * s, s, t)
    return
  }
  if (scene === 'thunder') {
    rainCloud(ctx, x, by - 96 * s, s, t, true)
    ctx.strokeStyle = 'rgba(70,70,70,0.55)'; ctx.lineWidth = 2 * s; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(x - 8 * s, by - 30 * s); ctx.lineTo(x - 3 * s, by - 34 * s); ctx.moveTo(x + 4 * s, by - 24 * s); ctx.lineTo(x + 9 * s, by - 28 * s); ctx.stroke()
    ball(ctx, x, by - 18 * s, 17 * s, '#4b83c9', toon)
    const hy = by - 40 * s, hr = 16 * s
    limb(ctx, x - 11 * s, by - 28 * s, x - 4 * s, by - 54 * s, 6 * s, skin, toon); limb(ctx, x + 11 * s, by - 28 * s, x + 4 * s, by - 54 * s, 6 * s, skin, toon)
    ball(ctx, x, hy, hr, skin, toon); staticHair(ctx, x, hy, hr, t)
    const wide = flash > 0.5 ? 5 : 4
    eye(ctx, x - 6 * s, hy - 2 * s, s, false, wide); eye(ctx, x + 6 * s, hy - 2 * s, s, false, wide); mouth(ctx, x, hy + 6 * s, s, 'shock')
    return
  }
  if (scene === 'fog') {
    lampPost(ctx, x + 24 * s, by, s, t)
    limb(ctx, x - 6 * s, by - 28 * s, x - 8 * s, by - 6 * s, 7 * s, '#39424f', toon); limb(ctx, x + 6 * s, by - 28 * s, x + 8 * s, by - 6 * s, 7 * s, '#39424f', toon)
    blob(ctx, x - 12 * s, by - 48 * s, 24 * s, 24 * s, 6 * s, '#4b83c9', toon)
    const hy = by - 60 * s, hr = 17 * s
    limb(ctx, x - 10 * s, by - 42 * s, x - 16 * s, by - 24 * s, 6 * s, skin, toon); limb(ctx, x + 10 * s, by - 42 * s, x + 20 * s, by - 46 * s, 6 * s, skin, toon)
    ball(ctx, x, hy, hr, skin, toon); hairM(ctx, x, hy, hr, toon)
    dizzyStars(ctx, x, hy - hr - 6 * s, s, t)
    eye(ctx, x - 6 * s, hy - 2 * s, s, true, 0); eye(ctx, x + 6 * s, hy - 2 * s, s, true, 0); mouth(ctx, x, hy + 4 * s, s, 'flat')
    return
  }
  // rain (hunched, soggy paper) or clouds (pigeon on his head)
  const wet = scene === 'rain', hunch = wet ? 9 * s : 0
  if (wet) puddle(ctx, x, by + 2 * s, 26 * s, s)
  limb(ctx, x - 6 * s, by - 28 * s, x - 8 * s, by - 6 * s, 7 * s, '#39424f', toon); limb(ctx, x + 6 * s, by - 28 * s, x + 8 * s, by - 6 * s, 7 * s, '#39424f', toon)
  blob(ctx, x - 12 * s, by - 48 * s + hunch, 24 * s, 24 * s, 6 * s, '#4b83c9', toon)
  const hy = by - 60 * s + hunch, hr = 17 * s
  if (wet) limb(ctx, x - 10 * s, by - 42 * s + hunch, x - 15 * s, by - 22 * s, 6 * s, skin, toon)
  else limb(ctx, x - 10 * s, by - 42 * s, x - 15 * s, by - 22 * s, 6 * s, skin, toon)
  if (wet) limb(ctx, x + 10 * s, by - 42 * s + hunch, x + 6 * s, hy - hr - 4 * s, 6 * s, skin, toon)
  else limb(ctx, x + 10 * s, by - 42 * s, x + 15 * s, by - 22 * s, 6 * s, skin, toon)
  ball(ctx, x, hy, hr, skin, toon); hairM(ctx, x, hy, hr, toon)
  if (wet) { rainCloud(ctx, x, hy - 42 * s, s, t, false); soggyPaper(ctx, x + 4 * s, hy - hr - 8 * s, s, t) }
  if (!wet) pigeon(ctx, x + 2 * s, hy - hr - 4 * s, s, t)
  eye(ctx, x - 6 * s, hy - 2 * s, s, bl, 0, wet ? undefined : 'up'); eye(ctx, x + 6 * s, hy - 2 * s, s, bl, 0, wet ? undefined : 'up')
  mouth(ctx, x, hy + 7 * s, s, wet ? 'frown' : 'flat')
}
