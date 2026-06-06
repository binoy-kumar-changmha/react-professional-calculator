import { useState, useRef, useEffect } from 'react'
import './App.css'
import Calculator from './components/Calculator'
import InputDisplay from './components/InputDisplay'
import OutputDisplay from './components/OutputDisplay'
import Buttons from './components/Buttons'

const App = () => {
  const buttonArr = [
    'AC', '(', ')', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '⌫', '='
  ]

  const [output, setOutput] = useState("o_o")
  const [input, setInput] = useState("")
  const inputRef = useRef(null)
  const nextCaret = useRef(null)

  function handlingClick(event, item) {
    // FIX: Read from nextCaret.current if there's a pending unrendered update
    const isPending = nextCaret.current !== null
    const start = isPending ? nextCaret.current : (inputRef.current?.selectionStart ?? input.length)
    const end = isPending ? nextCaret.current : (inputRef.current?.selectionEnd ?? input.length)

    if (item === "AC") {
      setOutput("o_o")
      setInput("")
      nextCaret.current = 0
    }
    else if (item === "⌫") {
      if (start === end) {
        // no selection — normal backspace
        if (start === 0) return
        setInput(prev => prev.slice(0, start - 1) + prev.slice(start))
        nextCaret.current = start - 1
      } else {
        // ADDED: delete selected range
        setInput(prev => prev.slice(0, start) + prev.slice(end))
        nextCaret.current = start
      }
    }
    else if (item === "*") {
      setInput(prev => prev.slice(0, start) + '×' + prev.slice(end))   // CHANGED: end not start
      nextCaret.current = start + 1
    }
    else if (item === "/") {
      setInput(prev => prev.slice(0, start) + '÷' + prev.slice(end))   // CHANGED: end not start
      nextCaret.current = start + 1
    }
    else if (item === "=") {
      if (!input.trim()) { setOutput("o_o"); return }
      try {
        const expression = input.replace(/×/g, "*").replace(/÷/g, "/").replace(/\b0+(\d)/g, '$1')
        const result = eval(expression)
        let formatted = Number.isInteger(result) ? result : parseFloat(result.toPrecision(13))
        if (String(formatted).length > 14) formatted = result.toExponential(8)
        setOutput(formatted)
      } catch {
        setOutput("error")
      }
    }
    else {
      setInput(prev => prev.slice(0, start) + item + prev.slice(end))  // CHANGED: end not start
      nextCaret.current = start + 1
    }
  }

  function handleKeyboard(e) {
    const key = e.key
    if (key === 'Enter' || key === '=') handlingClick(null, '=')
    else if (key === 'Escape') handlingClick(null, 'AC')
  }

  useEffect(() => {
    const unlock = () => { window.userInteracted = true }
    window.addEventListener('pointerdown', unlock, { once: true })
  }, [])

  return <Calculator>
    <div className="display">
      <InputDisplay nextCaret={nextCaret} input={input} handleKeyboard={handleKeyboard} setInput={setInput} inputRef={inputRef} />
      <OutputDisplay output={output} />
    </div>
    <Buttons buttonArr={buttonArr} handlingClick={handlingClick} />
  </Calculator>
}

export default App