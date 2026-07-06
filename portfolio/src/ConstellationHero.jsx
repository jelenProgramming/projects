import { useEffect, useRef } from 'react'
import styles from './App.module.css'

// each node is a shipped project, ringed ones are the featured work
const NODES = [
  { name: 'SQL Playground', featured: true },
  { name: 'CS Courses', featured: true },
  { name: 'Link Shortener', featured: true },
  { name: 'Job Tracker', featured: true },
  { name: 'Invoicer', featured: false },
  { name: 'Konjugationstrainer', featured: false },
  { name: 'Dev Card', featured: false },
  { name: 'Weather', featured: false },
  { name: 'Portfolio', featured: false },
]

// vanilla canvas constellation, no libs. real 3d points projected to 2d
export default function ConstellationHero() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(devicePixelRatio || 1, 2)

    let w = 0, h = 0, cx = 0, cy = 0, spread = 0
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = w / 2; cy = h / 2; spread = Math.min(w, h) * 0.46
    }

    // fibonacci sphere spreads the nodes evenly
    const n = NODES.length
    const nodes = NODES.map((meta, i) => {
      const y = 1 - (i / (n - 1)) * 2
      const rad = Math.sqrt(1 - y * y)
      const th = i * 2.399963
      return { ...meta, x: Math.cos(th) * rad, y, z: Math.sin(th) * rad, r: meta.featured ? 3.6 : 2.5 }
    })
    const dust = Array.from({ length: 120 }, () => {
      const th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1)
      const rr = 0.55 + Math.random() * 0.9
      return { x: rr * Math.sin(ph) * Math.cos(th), y: rr * Math.sin(ph) * Math.sin(th), z: rr * Math.cos(ph), tw: Math.random() * 6.28 }
    })
    // stable node pairs so the web doesn't flicker
    const pairs = []
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)
        if (d < 1.35) pairs.push([i, j, d])
      }

    let ryAuto = 0, yaw = 0, pitch = 0, tYaw = 0, tPitch = 0, t = 0, raf = 0
    const host = canvas.parentElement
    const onMove = e => {
      const r = host.getBoundingClientRect()
      tYaw = ((e.clientX - r.left) / r.width - 0.5) * 0.9
      tPitch = ((e.clientY - r.top) / r.height - 0.5) * 0.7
    }
    const onLeave = () => { tYaw = 0; tPitch = 0 }
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)

    const rot = (p, ry, rx) => {
      const cY = Math.cos(ry), sY = Math.sin(ry)
      const x = p.x * cY - p.z * sY, z = p.x * sY + p.z * cY
      const cX = Math.cos(rx), sX = Math.sin(rx)
      const y2 = p.y * cX - z * sX, z2 = p.y * sX + z * cX
      const s = 3.4 / (3.4 + z2) // perspective
      return { X: cx + x * s * spread, Y: cy + y2 * s * spread, s, z: z2 }
    }
    const alpha = s => Math.max(0, Math.min(1, (s - 0.62) / 0.78)) // depth to opacity

    const draw = () => {
      t += 0.016
      if (!reduce) ryAuto += 0.0016
      yaw += (tYaw - yaw) * 0.06
      pitch += (tPitch - pitch) * 0.06
      const ry = ryAuto + yaw, rx = pitch
      ctx.clearRect(0, 0, w, h)
      const P = nodes.map(p => rot(p, ry, rx))
      for (const [i, j, d] of pairs) {
        const a = P[i], b = P[j]
        const op = (1 - d / 1.35) * 0.5 * Math.min(alpha(a.s), alpha(b.s))
        if (op <= 0.01) continue
        ctx.strokeStyle = `rgba(15,15,14,${op})`
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(a.X, a.Y); ctx.lineTo(b.X, b.Y); ctx.stroke()
      }
      for (const p of dust) {
        const q = rot(p, ry, rx)
        const a = alpha(q.s) * 0.5 * (0.6 + 0.4 * Math.sin(t + p.tw)) // twinkle
        if (a <= 0.01) continue
        ctx.fillStyle = `rgba(15,15,14,${a})`
        ctx.beginPath(); ctx.arc(q.X, q.Y, 1.1 * q.s, 0, 6.2832); ctx.fill()
      }
      const order = P.map((q, i) => [q, i]).sort((A, B) => A[0].z - B[0].z) // draw back to front
      for (const [q, i] of order) {
        const a = alpha(q.s)
        const rad = nodes[i].r * q.s
        ctx.fillStyle = `rgba(15,15,14,${0.85 * a})`
        ctx.beginPath(); ctx.arc(q.X, q.Y, rad, 0, 6.2832); ctx.fill()
        if (nodes[i].featured) {
          ctx.strokeStyle = `rgba(15,15,14,${0.3 * a})`
          ctx.lineWidth = 1
          ctx.beginPath(); ctx.arc(q.X, q.Y, rad + 5, 0, 6.2832); ctx.stroke()
        }
      }
      raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    if (reduce) {
      // one static frame, no motion
      const P = nodes.map(p => rot(p, 0.3, 0.15))
      for (const [i, j] of pairs) {
        const a = P[i], b = P[j]
        ctx.strokeStyle = 'rgba(15,15,14,0.16)'; ctx.beginPath(); ctx.moveTo(a.X, a.Y); ctx.lineTo(b.X, b.Y); ctx.stroke()
      }
      for (const q of P) { ctx.fillStyle = 'rgba(15,15,14,0.7)'; ctx.beginPath(); ctx.arc(q.X, q.Y, 3, 0, 6.28); ctx.fill() }
    } else {
      raf = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} className={styles.heroCanvas} aria-hidden="true" />
}
