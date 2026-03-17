import { useLayoutEffect } from 'react'
import styles from './InputDisplay.module.css'

function InputDisplay({ input, handleKeyboard, setInput, inputRef, caretRef, nextCaret }) {

  // Detect touch device
  const isMobile = 'ontouchstart' in window

  useLayoutEffect(() => {
    if (nextCaret.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(nextCaret.current, nextCaret.current)
      nextCaret.current = null
    }
  })

  function updateCaret(e) {
    caretRef.current = e.target.selectionStart
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
      autoFocus={!isMobile}       // don't auto-open keyboard on mobile
      readOnly={isMobile}         // buttons only on mobile
      type="text"
      className={styles.inputDisplay}
      value={input}
      onKeyUp={updateCaret}
      onClick={updateCaret}
      onSelect={updateCaret}
      onChange={(e) => {
        if (isMobile) return       // ignore on mobile
        const pos = e.target.selectionStart
        const raw = e.target.value
        const sanitized = sanitize(raw)
        nextCaret.current = pos - (raw.length - sanitized.length)
        setInput(sanitized)
      }}
      onKeyDown={(e) => {
        if (isMobile) return       // ignore on mobile
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