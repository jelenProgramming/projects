import { useState, useCallback } from 'react'

/**
 * Per-section "expand in cram mode" memory. Keyed by section type (intro, how,
 * cpp, pseudocode, when). When a user expands a section type it is remembered in
 * localStorage and stays expanded across topics and visits, until reset.
 *
 * This makes cram mode adaptive: the bits you always need more on stay open.
 */
const KEY = 'algoviz-expanded'

function read() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')) } catch { return new Set() }
}
function write(set) {
  try { localStorage.setItem(KEY, JSON.stringify([...set])) } catch {}
}

export function useExpanded() {
  const [set, setSet] = useState(read)
  const isOpen = useCallback((type) => set.has(type), [set])
  const toggle = useCallback((type) => {
    setSet((prev) => {
      const next = new Set(prev)
      next.has(type) ? next.delete(type) : next.add(type)
      write(next)
      return next
    })
  }, [])
  const resetAll = useCallback(() => { setSet(new Set()); write(new Set()) }, [])
  return { isOpen, toggle, resetAll, anyOpen: set.size > 0 }
}
