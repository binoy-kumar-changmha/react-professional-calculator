import styles from './Items.module.css'

function Items({ buttonArr, handlingClick }) {

  const orangeBtns = ['*', '/', '+', '-', '=']
  const lightBtns = ['AC', '(', ')']

  return (
    <>
      {buttonArr.map(item => (
        <button
          key={item}
          className={`${styles.item}
          ${orangeBtns.includes(item) ? styles.orange : ''}
          ${lightBtns.includes(item) ? styles.lightGrey : ''}`}
          onClick={(event) => handlingClick(event, item)}>

          {item === '*' ? '×' : item === '-' ? '−' : item === '/' ? '÷' : item}
        </button>
      ))}
    </>
  )
}

export default Items