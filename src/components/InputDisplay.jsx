import { useLayoutEffect, useRef, useState } from 'react'
import styles from './InputDisplay.module.css'

function InputDisplay({ input, handleKeyboard, setInput, inputRef, nextCaret }) {
  const isMobile = 'ontouchstart' in window
  const ignoreScroll = useRef(false)
  const [, forceUpdate] = useState(0)      // triggers re-render so getMask reads fresh DOM

  // REMOVED: scrollLeftVal ref — no longer tracking manually, reading DOM directly instead

  useLayoutEffect(() => {
    if (nextCaret.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(nextCaret.current, nextCaret.current)
      ignoreScroll.current = true
      inputRef.current.scrollLeft = inputRef.current.scrollWidth
      nextCaret.current = null
      forceUpdate(n => n + 1)  // CHANGED: re-render so getMask reads fresh scrollLeft from DOM
    }
  })

  function handleScroll() {
    // CHANGED: removed e parameter, no longer storing scrollLeft manually
    if (ignoreScroll.current) {
      ignoreScroll.current = false
      return
    }
    forceUpdate(n => n + 1)  // re-render so getMask reads fresh DOM
  }

  function getMask() {
    const el = inputRef.current
    if (!el) return 'none'
    const overflows = el.scrollWidth > el.clientWidth
    if (!overflows) return 'none'

    const sl = el.scrollLeft                          // CHANGED: read directly from DOM, always fresh
    const maxScroll = el.scrollWidth - el.clientWidth

    const atRight = sl >= maxScroll - 1   // at right end (default with text-align: right)
    const atLeft = sl <= 1                // CHANGED: <= 1 instead of === 0, tolerance for subpixel

    if (!atRight && !atLeft) return 'linear-gradient(to right, transparent, black 1rem, black 90%, transparent 100%)'  // middle — both sides
    if (atLeft)              return 'linear-gradient(to left, transparent, black 1rem)'                                 // left end — right fade only
    return                          'linear-gradient(to right, transparent, black 1rem)'                                // right end — left fade only
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
      autoFocus={!isMobile}
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
        const pos = inputRef.current.selectionStart
        if (e.key === 'Backspace') {
          e.preventDefault()
          if (pos === 0) return
          setInput(input.slice(0, pos - 1) + input.slice(pos))
          nextCaret.current = pos - 1
          return
        }
        if (['Enter', '=', 'Escape'].includes(e.key)) e.preventDefault()
        handleKeyboard(e)
      }}
    />
  )
}

export default InputDisplay