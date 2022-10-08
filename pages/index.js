import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'

// fetchメモ
// const data = {
//   method: "GET",
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/x-www-form-urlencoded',
//   },
//   "mode": "no-cors",
//   "redirect": 'follow'
// }

export default function Home() {
  const [userList, setUserList] = useState([])
  const [input, setInput] = useState("")

  const fetchGet = async() => {
    const url = process.env.NEXT_PUBLIC_GAS_URL
    const data = {
      method: "GET",
    }

    const res = await fetch(url, data)
    const json = await res.json();
    console.log(json);
    setUserList(json.users)
  };

  const fetchPost = async(SendDATA) => {
  //   var SendDATA = {
  //     "勤務形態" : "1",
  //     "param2" : "2",
  //     "param3" : {
  //        "subparam1" : "3",
  //        "subparam2" : "4",
  //     }
  //  };

    const url = process.env.NEXT_PUBLIC_GAS_URL
    const data = {
      method: "POST",
      body: JSON.stringify(SendDATA),
    }

    const res = await fetch(url, data)
    const json = await res.json();
    console.log(json);
  };

  useEffect(() => {
    fetchGet()
  }, [])

  const handleHoge = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = () => {
    const data = {
      test: input,
    }
    fetchPost(data)
  }

  return (
    <div className={styles.container}>
      <h1>ユーザー一覧</h1>
      {userList.length ? userList.map((user) => {
        return (
          <p key={user.name}>{ user.name }</p>
        )
      })
      : null}
      <h1>入力フォーム</h1>
      <input 
        value={input}
        onChange={handleHoge}
        type="text" 
        name="" 
        id=""
      />
      <div>
        <input
          onClick={handleSubmit}
          type="submit"
          value="送信"
         />
      </div>
    </div>
  )
}

