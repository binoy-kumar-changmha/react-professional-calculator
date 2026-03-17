import { useLayoutEffect, useRef } from 'react'
import styles from './InputDisplay.module.css'

function InputDisplay({ input, handleKeyboard, setInput, inputRef }) {
  const nextCaret = useRef(null)

  // Runs after every render, before browser paint — restores caret reliably
  useLayoutEffect(() => {
    if (nextCaret.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(nextCaret.current, nextCaret.current)
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
      type="text"
      className={styles.inputDisplay}
      value={input}
      onChange={(e) => {
        const pos = e.target.selectionStart
        const raw = e.target.value
        const sanitized = sanitize(raw)
        nextCaret.current = pos - (raw.length - sanitized.length)
        setInput(sanitized)
      }}
      onKeyDown={(e) => {
        // Read caret NOW from the ref — before any re-render touches it
        const pos = inputRef.current.selectionStart

        if (e.key === 'Backspace') {
          e.preventDefault()
          if (pos === 0) return
          setInput(input.slice(0, pos - 1) + input.slice(pos))
          nextCaret.current = pos - 1
          return
        }

        if (['Enter', '=', 'Escape'].includes(e.key)) {
          e.preventDefault()
        }

        handleKeyboard(e)
      }}
    />
  )
}

export default InputDisplay