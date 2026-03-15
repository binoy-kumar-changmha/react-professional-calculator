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



  function handlingClick(event, item) {
    if (item === "AC") {
      setOutput("o_o")
      setInput("")
    }
    else if (item === "⌫") {
      setInput(prev => prev.slice(0, -1)) // -1 means count from backward
    }
    else if (item === "*") {
      setInput(prev => prev + '×')
    }
    else if (item === "=") {
      try {
        const expression = input
          .replace(/×/g, "*")
          .replace(/÷/g, "/")

        setOutput(eval(expression))
      }
      catch {
        setOutput("error")
      }
    }
    else {
      setInput(prev => prev + item)
    }
  }



  const handleKeyboard = (e) => {
    const key = e.key;

    if (key === "Enter" || key === "=") {
      handlingClick(null, "=");
    }

    else if (key === "Backspace") {
      e.preventDefault()
      handlingClick(null, "⌫");
    }

    else if (key === "Escape") {
      handlingClick(null, "AC");
    }
  };



  return <Calculator>
    <InputDisplay input={input} handleKeyboard={handleKeyboard} setInput={setInput} inputRef={inputRef}></InputDisplay>
    <OutputDisplay output={output}></OutputDisplay>
    <Buttons buttonArr={buttonArr} handlingClick={handlingClick}></Buttons>
  </Calculator>
}

export default App