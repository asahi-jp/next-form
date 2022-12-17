import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

// components
import { Modal } from '../components/Modal'
import { Loading } from '../components/Loading'
import { Toast } from '../components/Toast'

// libs
import validate from '../libs/validate'
import getDateList from '../libs/getDateList'
import isStaff from '../libs/isStaff'
import shapingData from '../libs/shapingData'
import checkIsVaild from '../libs/checkIsVaild'

export default function Home() {
  const router = useRouter()
  const [isModal, setIsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false) 
  const [response, setResponse] = useState({}) // トースト
  const [isDisabled, setIsDisabled] = useState(true)
  const [dateList, setDateList] = useState([]) // 日付選択のoptions
  const [staff, setStaff] = useState(null)

  // フォームの各要素を配列で定義
  // 必須項目以外はデフォルト値をtrueにする
  const [formElements, setFormElements] = useState([
    {
      name: '勤務形態',
      value: "",
      isValid: false,
      errorMessage: "",
    },
    {
      name: '作業日',
      value: "",
      isValid: false,
      errorMessage: "",
    },
    {
      name: 'レッスン',
      value: "",
      isValid: true,
      errorMessage: "",
    },
  ])

  useEffect(() => {
    // 日付フォームの初期化
    setDateList(getDateList())

    // スタッフの初期化
    const result = isStaff()
    if(result) {
      setStaff({
        staffId: result.staffId,
        staffName: result.staffName
      })
    } else {
      router.push("/login")
    }
  }, [])

  // データをGASに送信
  const pushData = async() => {
    let data = {
      type: "addData",
      data: {
        id: "1",
        ...shapingData(formElements)
      }
    }

    const url = process.env.NEXT_PUBLIC_GAS_URL
    const params = {
      method: "POST",
      body: JSON.stringify(data),
    }

    const res = await fetch(url, params)
    const json = await res.json();

    setIsLoading(false)
    setIsModal(false)
    setResponse(json)
    setTimeout(() => setResponse({}), 3000);
  };

  // ログアウト
  const handleLogout = () => {
    sessionStorage.removeItem("staffId"),
    sessionStorage.removeItem("staffName"),
    setStaff(null)
    router.push("/login")
  }

  // 確認ボタン
  const handleConfirm = () => {
    setIsModal(true)
  }

  // 戻るボタン
  const handleReturn = () => {
    setIsModal(false)
  }

  // 送信ボタン
  const handleSubmit = () => {
    setIsLoading(true)
    pushData()
  }

  const searchFormElement = (name) => {
    return formElements.find(e => e.name === name)
  }

  // フォーム変更時の処理
  const handleChange = (e, name) => {
    // stateを展開して新しい変数へ
    // ターゲット要素のvalueを更新

    // 単体バリデーションを実行
      // 通らない場合
        // ターゲット要素のisValidをfalseにする
        // ターゲット要素のエラーメッセージをセット
        // 送信ボタンを非活性化
        // formElementsを更新してreturn

      // 通った場合
        // 状態をtrueにする
        // ターゲット要素のエラーメッセージを消去

        // 全体のisValidを確認
          // 通らない場合：　他の要素はエラーメッセージがあり、ボタンは非活性
            // formElementsを更新してreturn
          
          // 通った場合：　他の要素はエラーメッセージ無し、ボタンは分からない
            // ボタンを活性化
            // formElementsを更新してreturn

    // ターゲット要素のステートとなるオブジェクトを初期化
    const targetElement = {
      name: name,
      value: e.target.value,
      isValid: false,
      errorMessage: "",
    }

    // ターゲット要素以外のformElements
    const filteredFormElements = formElements.filter((el) => {
      return el.name !== name
    })

    const validateResult = validate(targetElement, name)

    // 通らなかった場合
    if(validateResult !== true) {
      targetElement.isValid = false
      targetElement.errorMessage = validateResult
      setIsDisabled(true)
      setFormElements([...filteredFormElements, targetElement])
      return
    }

    targetElement.isValid = true
    targetElement.errorMessage = ""

    const checkIsVaildResult = checkIsVaild([...filteredFormElements, targetElement])

    // 通らなかった場合
    if(!checkIsVaildResult) {
      setFormElements([...filteredFormElements, targetElement])
      return
    }

    // 通った場合
    setIsDisabled(false)
    setFormElements([...filteredFormElements, targetElement])
    return
  }

  const modalProps = { formElements, searchFormElement, handleSubmit, handleReturn }

  return (
    <>
      {isModal && (
        <>
          <div onClick={() => setIsModal(false)} className={styles.overray}></div>
          <Modal {...modalProps} />
        </>
      )}
      {isLoading && <div className={styles.overray}></div>} {/* オーバーレイ */}
      <Loading isLoading={isLoading} />
      <Toast response={response} />

      <div className='max-w-sm mx-auto p-5'>
        <h1 className='text-2xl font-bold text-center'>勤怠入力</h1>
        <p>ようこそ {staff && staff.staffName}さん</p>
        <button onClick={handleLogout}>ログアウト</button>
        <div className='mt-5 text-right'>
          <Link href="/log">
            <a>勤怠履歴を確認する →</a>
          </Link>
        </div>
        <div className="mt-5">
          <div>
            <label htmlFor="workStyle">
              勤務形態<span className='text-red-500 text-sm'> 必須</span>
            </label>
            <select 
              id="workStyle"
              onChange={(e) => handleChange(e, '勤務形態')}
              className="mt-1 py-3 w-full border-b border-black focus-within:outline-none focus-within:border-blue-400"
            >
              <option value="">-</option>
              <option value="常勤">常勤</option>
              <option value="非常勤">非常勤</option>
              <option value="学生">学生</option>
              <option value="団体">団体</option>
              <option value="山荘">山荘</option>
            </select>
            <p className='text-red-600'>{searchFormElement("勤務形態").errorMessage}</p>
          </div>

          <div className='mt-5'>
            <label htmlFor="date">
              作業日<span className='text-red-500 text-sm'> 必須</span>
            </label>
            <select 
              id="date"
              onChange={(e) => handleChange(e, '作業日')}
              className="mt-1 py-3 w-full border-b border-black focus-within:outline-none focus-within:border-blue-400"
            >
              <option value="">-</option>
              {dateList.length && dateList.map((date) => <option value={date} key={date}>{date}</option>)}
            </select>
            <p className='text-red-600'>{searchFormElement("作業日").errorMessage}</p>
          </div>

          <div className='mt-5'>
            <label htmlFor="lesson">レッスン</label>
            <input
              type="number"
              id="lesson"
              value={searchFormElement("レッスン").value}
              placeholder="例：0.5、1"
              onChange={(e) => handleChange(e, 'レッスン')}
              className="mt-1 py-3 w-full border-b border-black focus-within:outline-none focus-within:border-blue-400"
            />
            <p className='text-red-600'>{searchFormElement("レッスン").errorMessage}</p>
          </div>

          <div className="mt-10 text-center">
            <input 
              type="submit"
              value="確認"
              onClick={handleConfirm}
              disabled={isDisabled}
              className={`${isDisabled ? "bg-gray-300" : "bg-indigo-500"} py-3 px-10 text-white font-bold border rounded-3xl cursor-pointer`}
            />
          </div>
        </div>
      </div>
    </>
  )
}