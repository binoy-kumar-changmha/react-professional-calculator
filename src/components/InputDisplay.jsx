import { useLayoutEffect, useRef, useState } from 'react'
import styles from './InputDisplay.module.css'

function InputDisplay({ input, handleKeyboard, setInput, inputRef, nextCaret }) {
  // CHANGED: also treat standalone PWA as mobile (no keyboard)
  const isMobile = 'ontouchstart' in window || window.matchMedia('(display-mode: standalone)').matches
  const ignoreScroll = useRef(false)
  const [, forceUpdate] = useState(0)

  useLayoutEffect(() => {
    if (nextCaret.current !== null && inputRef.current) {
      const el = inputRef.current
      const prevScroll = el.scrollLeft

      el.setSelectionRange(nextCaret.current, nextCaret.current)

      if (nextCaret.current >= input.length) {
        ignoreScroll.current = true
        el.scrollLeft = el.scrollWidth
      } else {
        ignoreScroll.current = true
        el.scrollLeft = prevScroll
      }

      nextCaret.current = null
      forceUpdate(n => n + 1)
    }
  })

  function handleScroll() {
    if (ignoreScroll.current) {
      ignoreScroll.current = false
      return
    }
    forceUpdate(n => n + 1)
  }

  function getMask() {
    const el = inputRef.current
    if (!el) return 'none'
    const overflows = el.scrollWidth > el.clientWidth
    if (!overflows) return 'none'
    const sl = el.scrollLeft
    const maxScroll = el.scrollWidth - el.clientWidth
    const atRight = sl >= maxScroll - 1
    const atLeft = sl <= 1
    if (!atRight && !atLeft) return 'linear-gradient(to right, transparent, black 1rem, black 90%, transparent 100%)'
    if (atLeft) return 'linear-gradient(to left, transparent, black 1rem)'
    return 'linear-gradient(to right, transparent, black 1rem)'
  }

  function getFont(length) {
    if (length <= 8) return '5rem'
    const size = Math.max(3, 5 - (length - 8) * 0.2)
    return `${size}rem`
  }

  function sanitize(value) {
    return value
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/[^0-9+\-×÷().]/g, '')
  }

  return (
    <input
      ref={inputRef}
      autoFocus
      inputMode={isMobile ? "none" : "text"}
      type="text"
      className={styles.inputDisplay}
      value={input}
      style={{
        fontSize: getFont(input.length),
        maskImage: getMask()
      }}
      onScroll={handleScroll}
      onChange={(e) => {
        if (isMobile) return
        const pos = e.target.selectionStart
        const raw = e.target.value
        const sanitized = sanitize(raw)
        nextCaret.current = pos - (raw.length - sanitized.length)
        setInput(sanitized)
      }}
      onKeyDown={(e) => {
        if (isMobile) return
        const start = inputRef.current.selectionStart
        const end = inputRef.current.selectionEnd              // ADDED: track selection end

        if (e.key === 'Backspace') {
          e.preventDefault()
          if (start === end) {
            // no selection — normal backspace
            if (start === 0) return
            setInput(input.slice(0, start - 1) + input.slice(start))
            nextCaret.current = start - 1
          } else {
            // ADDED: delete selected range
            setInput(input.slice(0, start) + input.slice(end))
            nextCaret.current = start
          }
          return
        }
        if (['Enter', '=', 'Escape'].includes(e.key)) e.preventDefault()
        handleKeyboard(e)
      }}
    />
  )
}

export default InputDisplay