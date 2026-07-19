// minifig-style, pseudo-3d shaded figures for the weather scene.
// two characters in the lower right: "ready" is always equipped for the weather,
// "caught" always gets the short end. vanilla canvas, gradient shading fakes the
// volume (cylindrical heads, block torsos, cast shadows). no libraries.

const WET = new Set(['rain', 'drizzle', 'thunder'])
const INK = 'rgba(20,18,26,0.42)'

const hx = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const rgb = (a) => `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})`
const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k)
const light = (h, k) => rgb(mix(hx(h), [255, 255, 255], k))
const dark = (h, k) => rgb(mix(hx(h), [12, 12, 20], k))

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// a block lit from the upper left, with a thin dark edge for the toy look
function block(ctx, x, y, w, h, r, base) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h)
  g.addColorStop(0, light(base, 0.34))
  g.addColorStop(0.5, base)
  g.addColorStop(1, dark(base, 0.3))
  rr(ctx, x, y, w, h, r)
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = Math.max(1, w * 0.045)
  ctx.stroke()
}

// a cylinder seen from the front: horizontal gradient fakes the curve, the top
// cap is a lighter ellipse. used for the head and the top stud.
function cylinder(ctx, cx, topY, w, h, base, stud) {
  const x = cx - w / 2
  const g = ctx.createLinearGradient(x, 0, x + w, 0)
  g.addColorStop(0, dark(base, 0.2))
  g.addColorStop(0.26, light(base, 0.32))
  g.addColorStop(0.55, base)
  g.addColorStop(1, dark(base, 0.32))
  rr(ctx, x, topY, w, h, w * 0.2)
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = w * 0.05
  ctx.stroke()
  if (stud) {
    const sw = w * 0.42
    const sg = ctx.createLinearGradient(cx - sw / 2, 0, cx + sw / 2, 0)
    sg.addColorStop(0, dark(base, 0.16))
    sg.addColorStop(0.3, light(base, 0.36))
    sg.addColorStop(1, dark(base, 0.24))
    ctx.fillStyle = sg
    ctx.beginPath()
    ctx.ellipse(cx, topY - h * 0.02, sw / 2, sw * 0.24, 0, 0, 6.28)
    ctx.fill()
    ctx.strokeStyle = INK
    ctx.lineWidth = 1
    ctx.stroke()
  }
}

// a bent arm from a shoulder to a hand point, with a C-shaped grip hand
function arm(ctx, sx, sy, ex, ey, w, base, hand) {
  ctx.lineCap = 'round'
  ctx.strokeStyle = INK
  ctx.lineWidth = w + w * 0.5
  ctx.beginPath()
  ctx.moveTo(sx, sy)
  ctx.lineTo(ex, ey)
  ctx.stroke()
  const g = ctx.createLinearGradient(sx, sy, ex, ey)
  g.addColorStop(0, light(base, 0.26))
  g.addColorStop(1, dark(base, 0.22))
  ctx.strokeStyle = g
  ctx.lineWidth = w
  ctx.beginPath()
  ctx.moveTo(sx, sy)
  ctx.lineTo(ex, ey)
  ctx.stroke()
  if (hand !== false) {
    const hg = ctx.createRadialGradient(ex - w * 0.2, ey - w * 0.2, 1, ex, ey, w * 0.7)
    hg.addColorStop(0, light('#f5c33f', 0.36))
    hg.addColorStop(1, dark('#f5c33f', 0.24))
    ctx.fillStyle = hg
    ctx.beginPath()
    ctx.arc(ex, ey, w * 0.6, 0, 6.28)
    ctx.fill()
    ctx.strokeStyle = INK
    ctx.lineWidth = w * 0.16
    ctx.stroke()
  }
}

// ---- accessories ----

function umbrella(ctx, x, y, s, col) {
  ctx.strokeStyle = '#3a3f4b'
  ctx.lineWidth = 2.4 * s
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x, y + 52 * s)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x - 5 * s, y + 52 * s, 5 * s, Math.PI, 0.15 * Math.PI, true)
  ctx.stroke()
  const g = ctx.createLinearGradient(x - 30 * s, y - 30 * s, x + 30 * s, y)
  g.addColorStop(0, light(col, 0.3))
  g.addColorStop(1, dark(col, 0.24))
  // a clean scalloped dome: smooth top, three little scallops along the rim
  ctx.beginPath()
  ctx.moveTo(x - 34 * s, y)
  ctx.quadraticCurveTo(x, y - 36 * s, x + 34 * s, y)
  ctx.quadraticCurveTo(x + 22 * s, y - 7 * s, x + 11 * s, y)
  ctx.quadraticCurveTo(x, y - 9 * s, x - 11 * s, y)
  ctx.quadraticCurveTo(x - 22 * s, y - 7 * s, x - 34 * s, y)
  ctx.closePath()
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 1.4 * s
  ctx.stroke()
  // top nub
  ctx.beginPath()
  ctx.moveTo(x, y - 34 * s)
  ctx.lineTo(x, y - 30 * s)
  ctx.stroke()
}

function rainCloudOver(ctx, cx, cy, s, t, zap) {
  const cw = 15 * s
  ;[[0, 0, 1], [-0.78, 0.18, 0.72], [0.78, 0.18, 0.72], [-0.34, -0.32, 0.6], [0.42, -0.26, 0.6]].forEach(([dx, dy, q]) => {
    const g = ctx.createRadialGradient(cx + dx * cw - q * cw * 0.3, cy + dy * cw - q * cw * 0.3, 1, cx + dx * cw, cy + dy * cw, q * cw)
    g.addColorStop(0, '#5b6472')
    g.addColorStop(1, '#333a45')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cx + dx * cw, cy + dy * cw, q * cw, 0, 6.28)
    ctx.fill()
  })
  ctx.strokeStyle = 'rgba(150,205,255,0.85)'
  ctx.lineWidth = 2 * s
  ctx.lineCap = 'round'
  for (let i = 0; i < 6; i++) {
    const ph = (t * 1.4 + i * 0.3) % 1
    const dx = (i - 2.5) * 6 * s
    const yy = cy + cw * 0.7 + ph * 26 * s
    ctx.beginPath()
    ctx.moveTo(cx + dx, yy)
    ctx.lineTo(cx + dx, yy + 6 * s)
    ctx.stroke()
  }
  if (zap && Math.sin(t * 8) > 0.8) {
    ctx.strokeStyle = '#ffd21a'
    ctx.lineWidth = 3 * s
    ctx.shadowBlur = 12
    ctx.shadowColor = '#ffd21a'
    ctx.beginPath()
    ctx.moveTo(cx, cy + cw * 0.6)
    ctx.lineTo(cx - 5 * s, cy + cw * 0.6 + 10 * s)
    ctx.lineTo(cx + 3 * s, cy + cw * 0.6 + 14 * s)
    ctx.lineTo(cx - 3 * s, cy + cw * 0.6 + 24 * s)
    ctx.stroke()
    ctx.shadowBlur = 0
  }
}

function sunHat(ctx, cx, cy, s) {
  block(ctx, cx - 15 * s, cy - 4 * s, 30 * s, 6 * s, 3 * s, '#e8b45a')
  const g = ctx.createLinearGradient(cx - 12 * s, cy - 16 * s, cx + 12 * s, cy)
  g.addColorStop(0, light('#f0c46a', 0.3))
  g.addColorStop(1, dark('#f0c46a', 0.2))
  rr(ctx, cx - 11 * s, cy - 15 * s, 22 * s, 12 * s, 5 * s)
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 1.3 * s
  ctx.stroke()
  ctx.strokeStyle = '#c9762e'
  ctx.lineWidth = 3 * s
  ctx.beginPath()
  ctx.moveTo(cx - 11 * s, cy - 4 * s)
  ctx.lineTo(cx + 11 * s, cy - 4 * s)
  ctx.stroke()
}

function shades(ctx, cx, ey, s) {
  ctx.fillStyle = '#14181f'
  rr(ctx, cx - 11 * s, ey - 3 * s, 9 * s, 6 * s, 2 * s)
  ctx.fill()
  rr(ctx, cx + 2 * s, ey - 3 * s, 9 * s, 6 * s, 2 * s)
  ctx.fill()
  ctx.strokeStyle = '#14181f'
  ctx.lineWidth = 1.6 * s
  ctx.beginPath()
  ctx.moveTo(cx - 2 * s, ey)
  ctx.lineTo(cx + 2 * s, ey)
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.beginPath()
  ctx.arc(cx - 8 * s, ey - 1 * s, 1.4 * s, 0, 6.28)
  ctx.arc(cx + 5 * s, ey - 1 * s, 1.4 * s, 0, 6.28)
  ctx.fill()
}

function iceCream(ctx, x, y, s, melted) {
  if (melted) {
    ctx.fillStyle = 'rgba(247,178,201,0.75)'
    ctx.beginPath()
    ctx.ellipse(x, y, 9 * s, 3.5 * s, 0, 0, 6.28)
    ctx.fill()
    ctx.strokeStyle = INK
    ctx.lineWidth = 1 * s
    ctx.stroke()
    return
  }
  const cg = ctx.createLinearGradient(x - 5 * s, y, x + 5 * s, y + 13 * s)
  cg.addColorStop(0, '#eab86a')
  cg.addColorStop(1, '#b9863f')
  ctx.fillStyle = cg
  ctx.beginPath()
  ctx.moveTo(x - 5 * s, y)
  ctx.lineTo(x + 5 * s, y)
  ctx.lineTo(x, y + 13 * s)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 1.1 * s
  ctx.stroke()
  const s1 = ctx.createRadialGradient(x - 3 * s, y - 5 * s, 1, x, y - 3 * s, 5.5 * s)
  s1.addColorStop(0, '#ffe1ec')
  s1.addColorStop(1, '#f28fb2')
  ctx.fillStyle = s1
  ctx.beginPath()
  ctx.arc(x - 1.5 * s, y - 3 * s, 5 * s, 0, 6.28)
  ctx.fill()
  ctx.fillStyle = '#fff4d8'
  ctx.beginPath()
  ctx.arc(x + 2.5 * s, y - 6 * s, 4 * s, 0, 6.28)
  ctx.fill()
}

function hotDrink(ctx, x, y, s, t) {
  block(ctx, x - 6 * s, y - 8 * s, 12 * s, 11 * s, 2.5 * s, '#d94f46')
  ctx.strokeStyle = INK
  ctx.lineWidth = 1.4 * s
  ctx.beginPath()
  ctx.arc(x + 8 * s, y - 2 * s, 3.5 * s, -0.5 * Math.PI, 0.5 * Math.PI)
  ctx.stroke()
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'
  ctx.lineWidth = 1.6 * s
  for (let i = 0; i < 2; i++) {
    ctx.beginPath()
    for (let k = 0; k <= 8; k++) {
      const yy = y - 10 * s - k * 3 * s
      const xx = x + i * 5 * s - 2.5 * s + Math.sin(k * 0.7 + t * 2 + i) * 2.4 * s
      k === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy)
    }
    ctx.stroke()
  }
}

function beanie(ctx, cx, cy, s, col) {
  const g = ctx.createLinearGradient(cx - 12 * s, cy - 12 * s, cx + 12 * s, cy)
  g.addColorStop(0, light(col, 0.28))
  g.addColorStop(1, dark(col, 0.22))
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(cx, cy, 12 * s, Math.PI, 0)
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 1.3 * s
  ctx.stroke()
  block(ctx, cx - 13 * s, cy - 3 * s, 26 * s, 5 * s, 2.5 * s, light(col, 0.12))
  const pg = ctx.createRadialGradient(cx - 1 * s, cy - 14 * s, 1, cx, cy - 13 * s, 4 * s)
  pg.addColorStop(0, '#ffffff')
  pg.addColorStop(1, '#d7dde6')
  ctx.fillStyle = pg
  ctx.beginPath()
  ctx.arc(cx, cy - 13 * s, 4 * s, 0, 6.28)
  ctx.fill()
}

function scarf(ctx, cx, y, s, col) {
  block(ctx, cx - 12 * s, y, 24 * s, 6 * s, 3 * s, col)
  block(ctx, cx + 4 * s, y + 3 * s, 6 * s, 14 * s, 2 * s, dark(col, 0.1))
}

function lantern(ctx, x, y, s, t) {
  const gl = ctx.createRadialGradient(x, y, 1, x, y, 34 * s)
  gl.addColorStop(0, 'rgba(255,224,130,0.8)')
  gl.addColorStop(1, 'rgba(255,224,130,0)')
  ctx.fillStyle = gl
  ctx.beginPath()
  ctx.arc(x, y, 34 * s, 0, 6.28)
  ctx.fill()
  ctx.strokeStyle = '#3a3f4b'
  ctx.lineWidth = 1.8 * s
  ctx.beginPath()
  ctx.arc(x, y - 9 * s, 4 * s, Math.PI, 0)
  ctx.stroke()
  block(ctx, x - 5 * s, y - 6 * s, 10 * s, 13 * s, 2 * s, '#7a5326')
  const fg = ctx.createRadialGradient(x, y, 1, x, y, 5 * s)
  fg.addColorStop(0, '#fff3c0')
  fg.addColorStop(1, '#f2b74a')
  ctx.fillStyle = fg
  ctx.beginPath()
  ctx.ellipse(x, y, 3 * s, 4.5 * s, 0, 0, 6.28)
  ctx.fill()
}

function sweat(ctx, x, y, s, t) {
  ctx.fillStyle = 'rgba(150,205,255,0.85)'
  for (let i = 0; i < 2; i++) {
    const ph = (t * 1.2 + i * 0.5) % 1
    const yy = y + ph * 12 * s
    ctx.beginPath()
    ctx.moveTo(x + i * 6 * s, yy)
    ctx.quadraticCurveTo(x + i * 6 * s + 2.4 * s, yy + 3 * s, x + i * 6 * s, yy + 5 * s)
    ctx.quadraticCurveTo(x + i * 6 * s - 2.4 * s, yy + 3 * s, x + i * 6 * s, yy)
    ctx.fill()
  }
}

function shiver(ctx, x, y, s, t) {
  ctx.strokeStyle = 'rgba(180,210,240,0.8)'
  ctx.lineWidth = 1.6 * s
  ctx.lineCap = 'round'
  for (let i = 0; i < 2; i++) {
    const bx = x + (i ? 8 : -8) * s
    ctx.beginPath()
    for (let k = 0; k <= 3; k++) {
      const yy = y - k * 4 * s
      const xx = bx + (k % 2 ? 2.4 : -2.4) * s
      k === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy)
    }
    ctx.stroke()
  }
}

function question(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = `bold ${18 * s}px sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText('?', x, y)
  ctx.textAlign = 'start'
}

// ---- the minifig body ----
// opts: shirt, legs, skin, leftArm[dx,dy], rightArm[dx,dy], face, night
function minifig(ctx, x, groundY, s, opts) {
  const skin = opts.skin || '#f5c33f'
  const legsCol = opts.legs || '#2f5fae'
  const shirt = opts.shirt || '#3aa76d'
  const hipY = groundY - 30 * s
  const torsoTop = groundY - 62 * s
  const headTop = groundY - 84 * s
  const headW = 21 * s
  const headCx = x
  const headCy = headTop + 11 * s

  // legs
  block(ctx, x - 15 * s, hipY, 14 * s, 30 * s, 3 * s, legsCol)
  block(ctx, x + 1 * s, hipY, 14 * s, 30 * s, 3 * s, dark(legsCol, 0.08))
  block(ctx, x - 16 * s, hipY - 4 * s, 32 * s, 7 * s, 3 * s, dark(legsCol, 0.16))

  // torso, trapezoid, wider at the bottom
  const g = ctx.createLinearGradient(x - 16 * s, torsoTop, x + 16 * s, hipY)
  g.addColorStop(0, light(shirt, 0.32))
  g.addColorStop(0.5, shirt)
  g.addColorStop(1, dark(shirt, 0.28))
  ctx.beginPath()
  ctx.moveTo(x - 12 * s, torsoTop)
  ctx.lineTo(x + 12 * s, torsoTop)
  ctx.lineTo(x + 16 * s, hipY + 1 * s)
  ctx.lineTo(x - 16 * s, hipY + 1 * s)
  ctx.closePath()
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 1.3 * s
  ctx.stroke()

  // arms
  const la = opts.leftArm || [-9, 22]
  const ra = opts.rightArm || [9, 22]
  arm(ctx, x - 11 * s, torsoTop + 5 * s, x + la[0] * s, torsoTop + 5 * s + la[1] * s, 6.5 * s, shirt, opts.leftHand)
  arm(ctx, x + 11 * s, torsoTop + 5 * s, x + ra[0] * s, torsoTop + 5 * s + ra[1] * s, 6.5 * s, shirt, opts.rightHand)

  // neck
  block(ctx, x - 4 * s, headTop + 20 * s, 8 * s, 5 * s, 2 * s, dark(skin, 0.14))

  // head cylinder + stud
  cylinder(ctx, headCx, headTop, headW, 22 * s, skin, true)

  // face
  const ey = headCy - 1 * s
  if (opts.face === 'cool') {
    // eyes hidden by shades, drawn by caller after; mouth is a calm smile
    ctx.strokeStyle = '#2a2320'
    ctx.lineWidth = 2 * s
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(headCx, ey + 4 * s, 4 * s, 0.12 * Math.PI, 0.88 * Math.PI)
    ctx.stroke()
  } else {
    ctx.fillStyle = '#2a2320'
    ctx.beginPath()
    ctx.arc(headCx - 5 * s, ey, 1.7 * s, 0, 6.28)
    ctx.arc(headCx + 5 * s, ey, 1.7 * s, 0, 6.28)
    ctx.fill()
    ctx.strokeStyle = '#2a2320'
    ctx.lineWidth = 2 * s
    ctx.lineCap = 'round'
    ctx.beginPath()
    if (opts.face === 'smile') ctx.arc(headCx, ey + 3 * s, 4.2 * s, 0.12 * Math.PI, 0.88 * Math.PI)
    else if (opts.face === 'worry') ctx.arc(headCx, ey + 9 * s, 4 * s, 1.15 * Math.PI, 1.85 * Math.PI)
    else if (opts.face === 'ugh') { ctx.moveTo(headCx - 4 * s, ey + 6 * s); ctx.lineTo(headCx + 4 * s, ey + 6 * s) }
    else if (opts.face === 'cold') {
      // chattering: small zigzag mouth
      ctx.moveTo(headCx - 4 * s, ey + 6 * s)
      ctx.lineTo(headCx - 1.5 * s, ey + 4 * s)
      ctx.lineTo(headCx + 1.5 * s, ey + 6 * s)
      ctx.lineTo(headCx + 4 * s, ey + 4 * s)
    } else ctx.arc(headCx, ey + 4 * s, 4 * s, 0.15 * Math.PI, 0.85 * Math.PI)
    ctx.stroke()
    if (opts.face === 'worry') {
      // raised worried brows
      ctx.beginPath()
      ctx.moveTo(headCx - 8 * s, ey - 5 * s)
      ctx.lineTo(headCx - 3 * s, ey - 3 * s)
      ctx.moveTo(headCx + 8 * s, ey - 5 * s)
      ctx.lineTo(headCx + 3 * s, ey - 3 * s)
      ctx.stroke()
    }
  }
  // cheek blush for the hot/cold tints
  if (opts.blush) {
    ctx.fillStyle = opts.blush
    ctx.beginPath()
    ctx.arc(headCx - 7 * s, ey + 3 * s, 2.2 * s, 0, 6.28)
    ctx.arc(headCx + 7 * s, ey + 3 * s, 2.2 * s, 0, 6.28)
    ctx.fill()
  }
  return { headCx, headCy, ey, headTop, headW, torsoTop }
}

function shadow(ctx, x, y, w, h) {
  const g = ctx.createRadialGradient(x, y, 1, x, y, w)
  g.addColorStop(0, 'rgba(0,0,0,0.28)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.ellipse(x, y, w, h, 0, 0, 6.28)
  ctx.fill()
}

export function drawMinifigs(ctx, W, H, p, t, flash, reduce) {
  const s = Math.max(0.6, Math.min(1.05, Math.min(W, H) / 560))
  const groundY = H - 18 * s
  const cx = W - 116 * s
  const tt = reduce ? 0 : t
  const night = !p.day

  let scene = 'cloud'
  if (p.cat === 'thunder') scene = 'thunder'
  else if (WET.has(p.cat)) scene = 'rain'
  else if (p.cat === 'clear' && p.day) scene = 'sun'
  else if (p.cat === 'snow') scene = 'snow'
  else if (p.cat === 'fog') scene = 'fog'

  ctx.save()

  shadow(ctx, cx - 30 * s, groundY + 4 * s, 30 * s, 7 * s)
  shadow(ctx, cx + 34 * s, groundY + 4 * s, 30 * s, 7 * s)

  // ---------- READY (left): always equipped ----------
  const rx = cx - 30 * s
  if (scene === 'rain' || scene === 'thunder') {
    const h = minifig(ctx, rx, groundY, s, { shirt: '#f2b134', legs: '#2f5fae', leftArm: [-13, 20], rightArm: [12, -18], face: 'smile' })
    umbrella(ctx, rx + 12 * s + 12 * s, h.torsoTop - 13 * s - 26 * s, s, scene === 'thunder' ? '#c94a4a' : '#3aa0d8')
  } else if (scene === 'sun') {
    const h = minifig(ctx, rx, groundY, s, { shirt: '#31b0a6', legs: '#e0a13a', leftArm: [-12, 20], rightArm: [13, 16], face: 'cool' })
    sunHat(ctx, h.headCx, h.headTop - 1 * s, s)
    shades(ctx, h.headCx, h.ey, s)
    iceCream(ctx, rx + 13 * s + 4 * s, h.torsoTop + 21 * s - 6 * s, s, false)
  } else if (scene === 'snow') {
    const h = minifig(ctx, rx, groundY, s, { shirt: '#c0504d', legs: '#3a4763', leftArm: [-11, 20], rightArm: [12, 16], face: 'smile' })
    scarf(ctx, h.headCx, h.headTop + 20 * s, s, '#e0dccf')
    beanie(ctx, h.headCx, h.headTop + 4 * s, s, '#d94f46')
    hotDrink(ctx, rx + 13 * s + 4 * s, h.torsoTop + 21 * s, s, tt)
  } else if (scene === 'fog') {
    const h = minifig(ctx, rx, groundY, s, { shirt: '#5b6b8c', legs: '#3a4152', leftArm: [-12, 20], rightArm: [13, -14], face: 'smile' })
    lantern(ctx, rx + 13 * s + 6 * s, h.torsoTop - 14 * s, s, tt)
  } else {
    minifig(ctx, rx, groundY, s, { shirt: '#3aa76d', legs: '#2f5fae', leftArm: [-9, 22], rightArm: [9, 22], face: 'smile' })
  }

  // ---------- CAUGHT (right): always the short end ----------
  const cxr = cx + 34 * s
  if (scene === 'rain' || scene === 'thunder') {
    const startled = scene === 'thunder' && flash > 0.5
    const h = minifig(ctx, cxr, groundY, s, { shirt: '#2f6fae', legs: '#39435a', skin: '#e7b64a', leftArm: [-11, 18], rightArm: [11, 18], face: startled ? 'worry' : 'ugh' })
    rainCloudOver(ctx, h.headCx, h.headTop - 16 * s, s, tt, scene === 'thunder')
    // little wet drip off the arms
    ctx.fillStyle = 'rgba(150,205,255,0.7)'
    for (let i = 0; i < 2; i++) {
      const ph = (tt * 1.3 + i * 0.5) % 1
      ctx.beginPath()
      ctx.arc(cxr + (i ? 12 : -12) * s, h.torsoTop + 24 * s + ph * 14 * s, 1.6 * s, 0, 6.28)
      ctx.fill()
    }
  } else if (scene === 'sun') {
    const h = minifig(ctx, cxr, groundY, s, { shirt: '#e0663a', legs: '#b04a2a', skin: '#f0a24a', leftArm: [-13, -16], rightArm: [11, 18], face: 'ugh', blush: 'rgba(230,80,50,0.4)' })
    sweat(ctx, h.headCx + 9 * s, h.ey - 2 * s, s, tt)
    iceCream(ctx, cxr - 20 * s, groundY - 2 * s, s, true) // melted at the feet
  } else if (scene === 'snow') {
    const h = minifig(ctx, cxr, groundY, s, { shirt: '#4a6b9c', legs: '#3a4763', skin: '#bcd3e2', leftArm: [-8, 14], rightArm: [8, 14], face: 'cold', blush: 'rgba(120,170,220,0.5)' })
    shiver(ctx, h.headCx, h.headTop - 4 * s, s, tt)
  } else if (scene === 'fog') {
    const h = minifig(ctx, cxr, groundY, s, { shirt: '#6a7280', legs: '#454c5c', leftArm: [-14, 6], rightArm: [14, 6], face: 'ugh' })
    question(ctx, h.headCx + 15 * s, h.headTop - 4 * s, s)
  } else {
    const h = minifig(ctx, cxr, groundY, s, { shirt: '#c98a3a', legs: '#7a5a2e', leftArm: [-9, 22], rightArm: [13, -10], face: 'worry' })
    // glancing up warily
    void h
  }

  // night: soft radial darkening over the figures, no hard edge
  if (night) {
    const ny = groundY - 44 * s
    const g = ctx.createRadialGradient(cx, ny, 10 * s, cx, ny, 92 * s)
    g.addColorStop(0, 'rgba(10,14,26,0.34)')
    g.addColorStop(1, 'rgba(10,14,26,0)')
    ctx.fillStyle = g
    ctx.fillRect(cx - 96 * s, ny - 96 * s, 192 * s, 192 * s)
  }

  ctx.restore()
}
