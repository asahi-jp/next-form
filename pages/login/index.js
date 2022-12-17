import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// libs
import validate from '../../libs/validate'
import checkIsVaild from '../../libs/checkIsVaild'

export default function Home() {
  const router = useRouter()
  // const [id, setId] = useState("")
  // const [password, setPassword] = useState("")
  const [isDisabled, setIsDisabled] = useState(true)
  const [formElements, setFormElements] = useState([
    {
      name: 'ID',
      value: "",
      isValid: false,
      errorMessage: "",
    },
    {
      name: 'パスワード',
      value: "",
      isValid: false,
      errorMessage: "",
    },
  ])

  // ログインしていればフォームにリダイレクト
  useEffect(() => {
    if(sessionStorage.getItem("staffId")) {
      router.push("/")
    }
  }, [])

  // データをGASに送信
  const authenticateUser = async(data) => {
    const url = process.env.NEXT_PUBLIC_GAS_URL
    const params = {
      method: "POST",
      body: JSON.stringify(data),
    }
    const res = await fetch(url, params)
    const json = await res.json();
    return json
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 認証
    const result = await authenticateUser({
      type: "authentication",
      data: {
        id: searchFormElement("ID").value,
        password: searchFormElement("パスワード").value,
      }
    })
   
    // レスポンスの処理
    if(result.status === "ok") {
      // sessionStorageにスタッフ情報を保存
      sessionStorage.setItem("staffId", result.data.id);
      sessionStorage.setItem("staffName", result.data.name);
      router.push("/")
    }
  }

  const searchFormElement = (name) => {
    return formElements.find(e => e.name === name)
  }

  // フォーム変更時の処理
  const handleChange = (e, name) => {
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

  return (
    <>
      {/* ログイン */}
      <div className='max-w-sm mx-auto p-5 h-screen flex flex-col justify-center'>
        <h1 className='text-2xl font-bold text-center'>ログイン</h1>
        <form className='mt-5'>
          <div>
            <label htmlFor="id">ID</label>
            <br />
            <input 
              type="text"
              id="id"
              value={searchFormElement("ID").value}
              onChange={(e) => handleChange(e, 'ID')}
              placeholder="IDを入力して下さい"
              className={"mt-1 py-3 w-full border-b border-black focus-within:outline-none focus-within:border-blue-400"}
            />
            <p className='text-red-600'>{searchFormElement("ID").errorMessage}</p>
          </div>
          <div className='mt-5'>
            <label htmlFor="password">パスワード</label>
            <br />
            <input 
              type="password" 
              id="password" 
              value={searchFormElement("パスワード").value}
              onChange={(e) => handleChange(e, 'パスワード')}
              placeholder="パスワードを入力してください"
              className={"mt-1 py-3 w-full border-b border-black focus-within:outline-none focus-within:border-blue-400"}
            />
            <p className='text-red-600'>{searchFormElement("パスワード").errorMessage}</p>
          </div>
          <div className="mt-10 text-center">
            <button 
              onClick={handleSubmit}
              disabled={isDisabled}
              className={`${isDisabled ? "bg-gray-300" : "bg-indigo-500"} py-3 px-10 bg-indigo-500 hover:bg-indigo-300 text-white font-bold border rounded-3xl`}
            >ログイン</button>
          </div>
        </form>
      </div>
    </>
  )
}
