import { useLayoutEffect } from 'react'
import styles from './InputDisplay.module.css'

function InputDisplay({ input, handleKeyboard, setInput, inputRef, nextCaret }) {
  const isMobile = 'ontouchstart' in window

  useLayoutEffect(() => {
    if (nextCaret.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(nextCaret.current, nextCaret.current)
      inputRef.current.scrollLeft = inputRef.current.scrollWidth
      nextCaret.current = null
    }
  })

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