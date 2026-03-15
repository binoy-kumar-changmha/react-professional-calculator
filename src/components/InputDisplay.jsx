import styles from './InputDisplay.module.css'

function InputDisplay({ input, handleKeyboard, setInput, inputRef }) {

  function sanitize(value) {
    return value
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/[^0-9+\-×÷().]/g, '')
  }

  return (
    <input ref={inputRef} autoFocus type="text" className={styles.inputDisplay} value={input}
      onChange={(e) => {
        const caret = e.target.selectionStart
        const sanitized = sanitize(e.target.value)

        setInput(sanitized)

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(caret, caret)
          }
        }, 0)
      }}
      onKeyDown={handleKeyboard} />
  )
}

export default InputDisplay