import { useEffect } from 'react'

// page-level wow layer: cursor spotlight, scroll progress hairline,
// tilt + sheen on the featured card, stat count-up. vanilla, rAF only.
export default function Enhance() {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = matchMedia('(pointer: fine)').matches
    const cleanups = []

    // scroll progress hairline
    const bar = document.querySelector('.fx-progress span')
    if (bar) {
      let raf = 0
      const onScroll = () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - innerHeight
          bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`
        })
      }
      addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      cleanups.push(() => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) })
    }

    // cursor spotlight, warm paper light following the pointer
    const spot = document.querySelector('.fx-spotlight')
    if (spot && fine && !reduce) {
      let raf = 0, px = innerWidth / 2, py = innerHeight / 3
      const onMove = e => {
        px = e.clientX; py = e.clientY
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          spot.style.setProperty('--spot-x', `${px}px`)
          spot.style.setProperty('--spot-y', `${py}px`)
        })
      }
      addEventListener('pointermove', onMove, { passive: true })
      cleanups.push(() => { removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) })
    }

    // tilt + sheen on the featured project card
    if (fine && !reduce) {
      let raf = 0
      const onMove = e => {
        const el = e.currentTarget
        const r = el.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width - 0.5
        const ny = (e.clientY - r.top) / r.height - 0.5
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          el.style.transform = `perspective(900px) rotateX(${(-ny * 4).toFixed(2)}deg) rotateY(${(nx * 5).toFixed(2)}deg)`
          el.style.setProperty('--sheen-x', `${(nx + 0.5) * 100}%`)
          el.style.setProperty('--sheen-y', `${(ny + 0.5) * 100}%`)
        })
      }
      const onLeave = e => { e.currentTarget.style.transform = '' }
      const wire = () => {
        document.querySelectorAll('[data-tilt]').forEach(el => {
          if (el.dataset.tiltWired) return
          el.dataset.tiltWired = '1'
          el.addEventListener('pointermove', onMove)
          el.addEventListener('pointerleave', onLeave)
        })
      }
      wire()
      const mo = new MutationObserver(wire)
      mo.observe(document.body, { childList: true, subtree: true })
      cleanups.push(() => mo.disconnect())
    }

    // stats count up when they scroll into view
    const nums = [...document.querySelectorAll('[data-count]')]
    if (nums.length) {
      const io = new IntersectionObserver(entries => {
        for (const en of entries) {
          if (!en.isIntersecting) continue
          io.unobserve(en.target)
          const el = en.target
          const target = parseInt(el.dataset.count, 10)
          if (Number.isNaN(target) || reduce) { el.textContent = el.dataset.count; continue }
          const t0 = performance.now(), dur = 900
          const tick = now => {
            const k = Math.min(1, (now - t0) / dur)
            el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))))
            if (k < 1) requestAnimationFrame(tick)
            else el.textContent = el.dataset.count
          }
          requestAnimationFrame(tick)
        }
      }, { threshold: 0.6 })
      nums.forEach(el => io.observe(el))
      cleanups.push(() => io.disconnect())
    }

    return () => cleanups.forEach(fn => fn())
  }, [])

  return (
    <>
      <div className="fx-progress" aria-hidden="true"><span /></div>
      <div className="fx-spotlight" aria-hidden="true" />
    </>
  )
}
