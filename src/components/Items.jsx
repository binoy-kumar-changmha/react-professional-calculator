import styles from './Items.module.css'

function Items({ buttonArr, handlingClick }) {

  const orangeBtns = ['*', '/', '+', '-', '=']
  const lightBtns = ['AC', '(', ')']


  // Ripple effect
  function createRipple(e) {
    const button = e.currentTarget

    const circle = document.createElement("span")
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter / 2

    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`
    circle.classList.add(styles.ripple)

    const ripple = button.getElementsByClassName(styles.ripple)[0]
    if (ripple) {
      ripple.remove()
    }

    button.appendChild(circle)
  }


  return (
    <>
      {buttonArr.map(item => (
        <button
          key={item}
          className={`${styles.item}
          ${orangeBtns.includes(item) ? styles.orange : ''}
          ${lightBtns.includes(item) ? styles.lightGrey : ''}`}
          onPointerDown={(e) => {
            e.preventDefault()
            // Only vibrate on touch devices (exclude desktop) and if the API is supported (prevent iOS errors)
            const isTouchDevice = window.matchMedia("(pointer: coarse)").matches
            if (window.userInteracted && isTouchDevice && 'vibrate' in navigator) {
              navigator.vibrate(15)
            }
            // Execute the action instantly on touch-down, just like native iOS calculators
            createRipple(e)
            handlingClick(e, item)
          }}>

          {item === '*' ? '×' : item === '-' ? '−' : item === '/' ? '÷' : item}
        </button>
      ))}
    </>
  )
}

export default Items