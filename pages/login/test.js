import { useEffect } from "react"

// モック
const postData = {
  id: "1",
  password: "1020",
}

export default function Test() {

  const pushData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_URL}?postType=authentication`, {
      method: 'POST',
      body: JSON.stringify(postData),
    })
    const data = await res.json()
    console.log(data)
  }

  useEffect(() => {
    pushData()
  }, [])

  return (
    <h1>hoge</h1>
  )
}