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
            if (window.userInteracted) navigator.vibrate(15)  // only after first interaction
          }}
          onClick={(event) => {
            createRipple(event)
            handlingClick(event, item)
          }}>

          {item === '*' ? '×' : item === '-' ? '−' : item === '/' ? '÷' : item}
        </button>
      ))}
    </>
  )
}

export default Items