/**
 * Small inline-SVG badge marking a topic as a "read" (text explanation) or a
 * "viz" (interactive visualizer). Replaces the old text tags so the dropdown
 * stays compact and language-neutral. currentColor is inherited from the
 * surrounding .tag.viz / .tag.read rule so each icon picks up its accent colour.
 */
export function KindIcon({ kind, size = 14 }) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round',
    strokeLinejoin: 'round', 'aria-hidden': true,
  }
  if (kind === 'viz') {
    // play triangle = run the animation
    return (
      <svg {...common}>
        <polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  // document with text lines = read
  return (
    <svg {...common}>
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M15 2v5h5" />
      <line x1="9" y1="12" x2="16" y2="12" />
      <line x1="9" y1="16" x2="16" y2="16" />
    </svg>
  )
}

export default KindIcon
