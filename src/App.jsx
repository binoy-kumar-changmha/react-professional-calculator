import { useState, useRef } from 'react'
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
    // Read directly from DOM — always accurate, no stale ref
    const pos = inputRef.current?.selectionStart ?? input.length

    if (item === "AC") {
      setOutput("o_o")
      setInput("")
      nextCaret.current = 0
    }
    else if (item === "⌫") {
      if (pos === 0) return
      setInput(prev => prev.slice(0, pos - 1) + prev.slice(pos))
      nextCaret.current = pos - 1
    }
    else if (item === "*") {
      setInput(prev => prev.slice(0, pos) + '×' + prev.slice(pos))
      nextCaret.current = pos + 1
    }
    else if (item === "/") {
      setInput(prev => prev.slice(0, pos) + '÷' + prev.slice(pos))
      nextCaret.current = pos + 1
    }
    else if (item === "=") {
      if (!input.trim()) {
        setOutput("o_o")  // ← reset to o_o instead of just returning
        return
      }
      try {
        const expression = input.replace(/×/g, "*").replace(/÷/g, "/")
        const result = eval(expression)

        let formatted = Number.isInteger(result)
          ? result
          : parseFloat(result.toPrecision(13))  // trim long decimals

        // if still too long for the display, force exponential
        if (String(formatted).length > 14) {
          formatted = result.toExponential(8)   // e.g. 1.6667e+9
        }

        setOutput(formatted)
      } catch {
        setOutput("error")
      }
    }
    else {
      setInput(prev => prev.slice(0, pos) + item + prev.slice(pos))
      nextCaret.current = pos + 1
    }
  }

  function handleKeyboard(e) {
    const key = e.key
    if (key === 'Enter' || key === '=') handlingClick(null, '=')
    else if (key === 'Escape') handlingClick(null, 'AC')
  }

  return <Calculator>
    <InputDisplay nextCaret={nextCaret} input={input} handleKeyboard={handleKeyboard} setInput={setInput} inputRef={inputRef} />
    <OutputDisplay output={output} />
    <Buttons buttonArr={buttonArr} handlingClick={handlingClick} />
  </Calculator>
}

export default App