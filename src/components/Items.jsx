import styles from './Items.module.css'

function Items({ buttonArr, handlingClick }) {

  const orangeBtns = ['*', '/', '+', '-', '=']
  const lightBtns = ['AC', '(', ')']

  // Pop up sounds
  function playPop() {
    const ctx = new window.AudioContext()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(300, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05)

    gain.gain.setValueAtTime(0.01, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.08)
  }

  // function playPop() {
  //   const ctx = new window.AudioContext()

  //   // white noise buffer — the raw "pop" material
  //   const bufferSize = ctx.sampleRate * 0.1
  //   const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  //   const data = buffer.getChannelData(0)
  //   for (let i = 0; i < bufferSize; i++) {
  //     data[i] = (Math.random() * 2 - 1)  // random noise
  //   }

  //   const source = ctx.createBufferSource()
  //   source.buffer = buffer

  //   // lowpass filter — sweeps down fast, shapes noise into a "pop"
  //   const filter = ctx.createBiquadFilter()
  //   filter.type = 'lowpass'
  //   filter.frequency.setValueAtTime(300, ctx.currentTime)
  //   filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.04)

  //   // volume — fast attack, fast decay
  //   const gain = ctx.createGain()
  //   gain.gain.setValueAtTime(0.3, ctx.currentTime)
  //   gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)

  //   source.connect(filter)
  //   filter.connect(gain)
  //   gain.connect(ctx.destination)

  //   source.start(ctx.currentTime)
  //   source.stop(ctx.currentTime + 0.06)
  // }

  // function playPop() {
  //   const ctx = new window.AudioContext()

  //   // soft sine tone — the main body of the pop
  //   const oscillator = ctx.createOscillator()
  //   oscillator.type = 'sine'
  //   oscillator.frequency.setValueAtTime(180, ctx.currentTime)
  //   oscillator.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08)

  //   const oscGain = ctx.createGain()
  //   oscGain.gain.setValueAtTime(0.15, ctx.currentTime)
  //   oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

  //   oscillator.connect(oscGain)
  //   oscGain.connect(ctx.destination)
  //   oscillator.start(ctx.currentTime)
  //   oscillator.stop(ctx.currentTime + 0.1)

  //   // tiny bit of noise underneath — just for texture, very quiet
  //   const bufferSize = ctx.sampleRate * 0.05
  //   const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  //   const data = buffer.getChannelData(0)
  //   for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1)

  //   const source = ctx.createBufferSource()
  //   source.buffer = buffer

  //   const filter = ctx.createBiquadFilter()
  //   filter.type = 'lowpass'
  //   filter.frequency.setValueAtTime(200, ctx.currentTime)

  //   const noiseGain = ctx.createGain()
  //   noiseGain.gain.setValueAtTime(0.05, ctx.currentTime)  // very quiet noise
  //   noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

  //   source.connect(filter)
  //   filter.connect(noiseGain)
  //   noiseGain.connect(ctx.destination)
  //   source.start(ctx.currentTime)
  //   source.stop(ctx.currentTime + 0.05)
  // }


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
            if (navigator.vibrate) navigator.vibrate(15)  // vibrate on press — Android only, iOS blocks this
          }}
          onPointerUp={() => {
            playPop()  // pop sound on release — works on both desktop and mobile
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