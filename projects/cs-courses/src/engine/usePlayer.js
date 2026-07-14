import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

/**
 * usePlayer - the shared animation engine.
 *
 * Every visual algorithm is written as a pure function that takes its input and
 * returns an ARRAY OF STEPS. A step is just a snapshot: { ...state, message }.
 * This hook walks through that array with play / pause / step / speed / reset.
 *
 * Keeping algorithms as "produce all steps up front" (instead of live mutation)
 * means each algorithm file is tiny, testable, and has zero animation code in it.
 */
export function usePlayer(steps, { speed: initialSpeed = 1 } = {}) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(initialSpeed) // multiplier
  const timer = useRef(null)

  const total = steps.length
  const atEnd = index >= total - 1
  const atStart = index <= 0

  // base delay 600ms, divided by speed
  const delay = useMemo(() => Math.max(40, 600 / speed), [speed])

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  useEffect(() => {
    if (!playing) return
    if (atEnd) {
      setPlaying(false)
      return
    }
    timer.current = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, total - 1))
    }, delay)
    return clear
  }, [playing, index, delay, atEnd, total])

  // when the steps array changes (new input / new run), reset to start
  useEffect(() => {
    clear()
    setIndex(0)
    setPlaying(false)
  }, [steps])

  const play = useCallback(() => {
    if (atEnd) setIndex(0)
    setPlaying(true)
  }, [atEnd])

  const pause = useCallback(() => {
    setPlaying(false)
    clear()
  }, [])

  const toggle = useCallback(() => {
    setPlaying((p) => !p)
  }, [])

  const next = useCallback(() => {
    pause()
    setIndex((i) => Math.min(i + 1, total - 1))
  }, [pause, total])

  const prev = useCallback(() => {
    pause()
    setIndex((i) => Math.max(i - 1, 0))
  }, [pause])

  const reset = useCallback(() => {
    pause()
    setIndex(0)
  }, [pause])

  const seek = useCallback((i) => {
    pause()
    setIndex(Math.max(0, Math.min(i, total - 1)))
  }, [pause, total])

  const step = steps[index] || {}

  return {
    step, index, total, playing, speed, atEnd, atStart,
    setSpeed, play, pause, toggle, next, prev, reset, seek,
  }
}
