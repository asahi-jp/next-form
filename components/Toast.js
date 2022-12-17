import styles from '../styles/Home.module.css'

export const Toast = ({ response }) => {
  return (
    <>
      {Object.keys(response).length ?
        (
          <div className={styles.toast}>
            {response.message}
          </div>
        )
      : null }
    </>
  )
}
