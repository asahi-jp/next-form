import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

export const  Modal = ({ formElements, searchFormElement, handleSubmit, handleReturn }) => {

  return (
    <>
      <div className={styles.modal}>
        <h1 className='text-2xl font-bold text-center'>内容確認</h1>
        <table className={styles.table}>
          <tbody>
            <tr>
              <th>勤務形態</th>
              <td>{searchFormElement('勤務形態').value}</td>
            </tr>
            <tr>
              <th>作業日</th>
              <td>{searchFormElement('作業日').value}</td>
            </tr>
            <tr>
              <th>レッスン</th>
              <td>{searchFormElement('レッスン').value}</td>
            </tr>
          </tbody>
        </table>
        <div className='mt-10 flex justify-center gap-5'>
          <input
            onClick={handleReturn}
            type="submit"
            value="戻る"
            className={`bg-gray-300 py-3 px-10 text-white font-bold border rounded-3xl cursor-pointer`}
          />
          <input
            onClick={handleSubmit}
            type="submit"
            value="送信"
            className={`bg-indigo-500 py-3 px-10 text-white font-bold border rounded-3xl cursor-pointer`}
          />
        </div>
      </div>
    </>
  )
}